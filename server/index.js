import express from 'express';
import multer from 'multer';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { db, one, all, run, UPLOAD_DIR, DATA_DIR } from './db.js';
import { probeDuration, probeDimensions, makeThumbnail, fastStart } from './media.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const PORT = Number(process.env.PORT) || 3000;
const MAX_DURATION = 15 * 60; // seconds
const DURATION_TOLERANCE = 1.5; // container rounding
const MAX_VIDEO_MB = Number(process.env.MAX_VIDEO_MB) || 1024;
const MAX_AUDIO_MB = Number(process.env.MAX_AUDIO_MB) || 200;
const MAX_IMAGE_MB = Number(process.env.MAX_IMAGE_MB) || 20;
const MAX_IMAGES = 10;
const PAGE = 10;
const SESSION_DAYS = 60;

const ROLES = ['Artist', 'Singer', 'Rapper', 'Songwriter', 'Producer', 'Beatmaker', 'DJ', 'Band', 'Instrumentalist', 'Engineer', 'Composer', 'Fan'];

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '1mb' }));

// ---------- helpers ----------

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
const fail = (status, message) => { throw new HttpError(status, message); };

const str = (v, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

function parseCookies(header = '') {
  const out = {};
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `scrypt:${salt.toString('hex')}:${hash.toString('hex')}`;
}

function verifyPassword(password, stored) {
  const [, saltHex, hashHex] = stored.split(':');
  const hash = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), 64);
  return crypto.timingSafeEqual(hash, Buffer.from(hashHex, 'hex'));
}

function setSession(res, userId, req) {
  const token = crypto.randomBytes(32).toString('hex');
  run('INSERT INTO sessions (token, user_id) VALUES (?, ?)', token, userId);
  res.cookie('wf_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: req.secure,
    maxAge: SESSION_DAYS * 864e5,
    path: '/',
  });
}

function rmUpload(rel) {
  if (!rel) return;
  const full = path.join(UPLOAD_DIR, rel);
  if (full.startsWith(UPLOAD_DIR)) fs.rm(full, { force: true }, () => {});
}

function mediaUrl(rel) {
  return rel ? `/media/${rel}` : null;
}

function notify(userId, actorId, type, postId = null) {
  if (userId === actorId) return;
  run('INSERT INTO notifications (user_id, actor_id, type, post_id) VALUES (?, ?, ?, ?)', userId, actorId, type, postId);
}

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Tiny in-memory limiter for auth endpoints.
const attempts = new Map();
function rateLimit(key, max, windowMs) {
  const now = Date.now();
  const hits = (attempts.get(key) || []).filter((t) => now - t < windowMs);
  hits.push(now);
  attempts.set(key, hits);
  if (hits.length > max) fail(429, 'Too many attempts, try again in a few minutes.');
}

// ---------- auth middleware ----------

app.use((req, res, next) => {
  const token = parseCookies(req.headers.cookie).wf_session;
  req.user = null;
  if (token) {
    const row = one(
      `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.created_at > unixepoch() - ?`,
      token, SESSION_DAYS * 86400,
    );
    if (row) req.user = row;
  }
  next();
});

const requireUser = (req, res, next) => (req.user ? next() : next(new HttpError(401, 'Please log in first.')));

// ---------- serializers ----------

function publicUser(u, meId = 0) {
  if (!u) return null;
  let links = {};
  try { links = JSON.parse(u.links || '{}'); } catch {}
  return {
    id: u.id,
    username: u.username,
    display_name: u.display_name,
    bio: u.bio,
    role: u.role,
    genres: u.genres ? u.genres.split(',').filter(Boolean) : [],
    location: u.location,
    links,
    avatar: mediaUrl(u.avatar),
    open_to_collab: !!u.open_to_collab,
    created_at: u.created_at,
    ...(u.follower_count !== undefined && {
      follower_count: u.follower_count,
      following_count: u.following_count,
      post_count: u.post_count,
      like_total: u.like_total,
      is_following: !!u.is_following,
      follows_you: !!u.follows_you,
      is_me: u.id === meId,
    }),
  };
}

const POST_SELECT = `
  SELECT p.*, u.username, u.display_name, u.avatar, u.role,
    (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
    (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count,
    (SELECT COUNT(*) FROM saves WHERE post_id = p.id) AS save_count,
    EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = :me) AS liked,
    EXISTS(SELECT 1 FROM saves WHERE post_id = p.id AND user_id = :me) AS saved,
    EXISTS(SELECT 1 FROM follows WHERE follower_id = :me AND followee_id = p.user_id) AS following,
    sp.id AS sound_id, sp.song_title AS sound_title, sp.song_artist AS sound_artist, su.username AS sound_username,
    (SELECT COUNT(*) FROM posts x WHERE x.sound_post_id = COALESCE(p.sound_post_id, p.id)) AS sound_uses
  FROM posts p
  JOIN users u ON u.id = p.user_id
  LEFT JOIN posts sp ON sp.id = p.sound_post_id
  LEFT JOIN users su ON su.id = sp.user_id`;

function serializePost(p) {
  let images = [];
  try { images = JSON.parse(p.images || '[]'); } catch {}
  const hasOwnSound = p.type === 'photo' && p.audio && !p.sound_post_id;
  return {
    id: p.id,
    type: p.type,
    video: mediaUrl(p.video),
    images: images.map(mediaUrl),
    audio: mediaUrl(p.audio),
    thumb: mediaUrl(p.thumb),
    duration: p.duration,
    caption: p.caption,
    song_title: p.song_title,
    song_artist: p.song_artist,
    genre: p.genre,
    bpm: p.bpm,
    music_key: p.music_key,
    credits: p.credits,
    stream_link: p.stream_link,
    plays: p.plays,
    created_at: p.created_at,
    like_count: p.like_count,
    comment_count: p.comment_count,
    save_count: p.save_count,
    liked: !!p.liked,
    saved: !!p.saved,
    sound: p.audio
      ? {
          id: p.sound_id ?? p.id,
          title: (hasOwnSound ? p.song_title : p.sound_title) || 'Original sound',
          artist: (hasOwnSound ? p.song_artist : p.sound_artist) || '',
          username: hasOwnSound ? p.username : p.sound_username,
          uses: p.sound_uses,
        }
      : null,
    author: {
      id: p.user_id,
      username: p.username,
      display_name: p.display_name,
      avatar: mediaUrl(p.avatar),
      role: p.role,
      following: !!p.following,
    },
  };
}

function getPost(id, me) {
  const p = one(`${POST_SELECT} WHERE p.id = :id`, { me, id });
  return p ? serializePost(p) : null;
}

// ---------- uploads ----------

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(UPLOAD_DIR, 'tmp'),
    filename: (req, file, cb) => cb(null, crypto.randomBytes(16).toString('hex') + path.extname(file.originalname).toLowerCase().slice(0, 8)),
  }),
  limits: { fileSize: MAX_VIDEO_MB * 1024 * 1024, files: MAX_IMAGES + 2 },
  fileFilter: (req, file, cb) => {
    const ok =
      (file.fieldname === 'video' && file.mimetype.startsWith('video/')) ||
      ((file.fieldname === 'images' || file.fieldname === 'avatar') && file.mimetype.startsWith('image/')) ||
      (file.fieldname === 'audio' && (file.mimetype.startsWith('audio/') || file.mimetype === 'video/mp4' || file.mimetype === 'application/octet-stream'));
    cb(ok ? null : new HttpError(400, `Unsupported file type for ${file.fieldname}: ${file.mimetype}`), ok);
  },
});

function moveUpload(file, folder) {
  const rel = `${folder}/${file.filename}`;
  fs.renameSync(file.path, path.join(UPLOAD_DIR, rel));
  return rel;
}

function cleanupFiles(req) {
  const files = Object.values(req.files || {}).flat();
  if (req.file) files.push(req.file);
  for (const f of files) fs.rm(f.path, { force: true }, () => {});
}

// ---------- auth routes ----------

app.post('/api/auth/register', wrap(async (req, res) => {
  rateLimit(`reg:${req.ip}`, 10, 60 * 60e3);
  const username = str(req.body.username, 30).toLowerCase();
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  const display_name = str(req.body.display_name, 50) || username;
  const role = ROLES.includes(req.body.role) ? req.body.role : '';
  if (!/^[a-z0-9_.]{3,30}$/.test(username)) fail(400, 'Username must be 3-30 characters: letters, numbers, _ or .');
  if (password.length < 8) fail(400, 'Password must be at least 8 characters.');
  if (one('SELECT 1 FROM users WHERE username = ?', username)) fail(409, 'That username is taken.');
  const { lastInsertRowid } = run(
    'INSERT INTO users (username, display_name, password_hash, role) VALUES (?, ?, ?, ?)',
    username, display_name, hashPassword(password), role,
  );
  setSession(res, Number(lastInsertRowid), req);
  res.json({ user: publicUser(one('SELECT * FROM users WHERE id = ?', lastInsertRowid)) });
}));

app.post('/api/auth/login', wrap(async (req, res) => {
  rateLimit(`login:${req.ip}`, 20, 15 * 60e3);
  const username = str(req.body.username, 30).toLowerCase();
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  const u = one('SELECT * FROM users WHERE username = ?', username);
  if (!u || !verifyPassword(password, u.password_hash)) fail(401, 'Wrong username or password.');
  setSession(res, u.id, req);
  res.json({ user: publicUser(u) });
}));

app.post('/api/auth/logout', (req, res) => {
  const token = parseCookies(req.headers.cookie).wf_session;
  if (token) run('DELETE FROM sessions WHERE token = ?', token);
  res.clearCookie('wf_session', { path: '/' });
  res.json({ ok: true });
});

app.get('/api/me', (req, res) => {
  res.json({ user: req.user ? publicUser(req.user) : null, roles: ROLES });
});

app.patch('/api/me', requireUser, (req, res) => {
  const b = req.body;
  const links = {};
  for (const k of ['spotify', 'apple_music', 'soundcloud', 'bandcamp', 'youtube', 'instagram', 'website']) {
    const v = str(b.links?.[k], 300);
    if (v) {
      if (!/^https?:\/\//i.test(v)) fail(400, `Link for ${k} must start with http:// or https://`);
      links[k] = v;
    }
  }
  const genres = (Array.isArray(b.genres) ? b.genres : String(b.genres || '').split(','))
    .map((g) => str(g, 30).replace(/,/g, ''))
    .filter(Boolean)
    .slice(0, 8)
    .join(',');
  run(
    `UPDATE users SET display_name = ?, bio = ?, role = ?, genres = ?, location = ?, links = ?, open_to_collab = ? WHERE id = ?`,
    str(b.display_name, 50) || req.user.username,
    str(b.bio, 300),
    ROLES.includes(b.role) ? b.role : '',
    genres,
    str(b.location, 60),
    JSON.stringify(links),
    b.open_to_collab ? 1 : 0,
    req.user.id,
  );
  res.json({ user: publicUser(one('SELECT * FROM users WHERE id = ?', req.user.id)) });
});

app.post('/api/me/avatar', requireUser, upload.single('avatar'), wrap(async (req, res) => {
  if (!req.file) fail(400, 'No image uploaded.');
  if (req.file.size > MAX_IMAGE_MB * 1024 * 1024) { cleanupFiles(req); fail(400, `Images must be under ${MAX_IMAGE_MB}MB.`); }
  const rel = moveUpload(req.file, 'avatars');
  rmUpload(req.user.avatar);
  run('UPDATE users SET avatar = ? WHERE id = ?', rel, req.user.id);
  res.json({ avatar: mediaUrl(rel) });
}));

app.post('/api/me/password', requireUser, (req, res) => {
  const { current, next: nextPw } = req.body;
  if (!verifyPassword(String(current || ''), req.user.password_hash)) fail(401, 'Current password is wrong.');
  if (typeof nextPw !== 'string' || nextPw.length < 8) fail(400, 'New password must be at least 8 characters.');
  run('UPDATE users SET password_hash = ? WHERE id = ?', hashPassword(nextPw), req.user.id);
  res.json({ ok: true });
});

// ---------- users ----------

function loadProfile(username, me) {
  return one(
    `SELECT u.*,
      (SELECT COUNT(*) FROM follows WHERE followee_id = u.id) AS follower_count,
      (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) AS following_count,
      (SELECT COUNT(*) FROM posts WHERE user_id = u.id) AS post_count,
      (SELECT COUNT(*) FROM likes l JOIN posts p ON p.id = l.post_id WHERE p.user_id = u.id) AS like_total,
      EXISTS(SELECT 1 FROM follows WHERE follower_id = :me AND followee_id = u.id) AS is_following,
      EXISTS(SELECT 1 FROM follows WHERE follower_id = u.id AND followee_id = :me) AS follows_you
    FROM users u WHERE u.username = :username`,
    { me, username },
  );
}

app.get('/api/users/:username', (req, res) => {
  const me = req.user?.id ?? 0;
  const u = loadProfile(req.params.username, me);
  if (!u) fail(404, 'User not found.');
  res.json({ user: publicUser(u, me) });
});

app.get('/api/users/:username/posts', (req, res) => {
  const me = req.user?.id ?? 0;
  const u = one('SELECT id FROM users WHERE username = ?', req.params.username);
  if (!u) fail(404, 'User not found.');
  const offset = Math.max(0, Number(req.query.offset) || 0);
  const tab = req.query.tab;
  let rows;
  if (tab === 'saved') {
    if (me !== u.id) fail(403, 'Saved posts are private.');
    rows = all(`${POST_SELECT} JOIN saves s ON s.post_id = p.id AND s.user_id = :uid ORDER BY s.created_at DESC LIMIT 30 OFFSET :offset`, { me, uid: u.id, offset });
  } else if (tab === 'liked') {
    rows = all(`${POST_SELECT} JOIN likes l ON l.post_id = p.id AND l.user_id = :uid ORDER BY l.created_at DESC LIMIT 30 OFFSET :offset`, { me, uid: u.id, offset });
  } else {
    rows = all(`${POST_SELECT} WHERE p.user_id = :uid ORDER BY p.created_at DESC LIMIT 30 OFFSET :offset`, { me, uid: u.id, offset });
  }
  res.json({ posts: rows.map(serializePost) });
});

app.post('/api/users/:username/follow', requireUser, (req, res) => {
  const u = one('SELECT id FROM users WHERE username = ?', req.params.username);
  if (!u) fail(404, 'User not found.');
  if (u.id === req.user.id) fail(400, "You can't follow yourself.");
  const r = run('INSERT OR IGNORE INTO follows (follower_id, followee_id) VALUES (?, ?)', req.user.id, u.id);
  if (r.changes) notify(u.id, req.user.id, 'follow');
  res.json({ following: true });
});

app.delete('/api/users/:username/follow', requireUser, (req, res) => {
  const u = one('SELECT id FROM users WHERE username = ?', req.params.username);
  if (!u) fail(404, 'User not found.');
  run('DELETE FROM follows WHERE follower_id = ? AND followee_id = ?', req.user.id, u.id);
  res.json({ following: false });
});

for (const list of ['followers', 'following']) {
  app.get(`/api/users/:username/${list}`, (req, res) => {
    const u = one('SELECT id FROM users WHERE username = ?', req.params.username);
    if (!u) fail(404, 'User not found.');
    const rows = list === 'followers'
      ? all('SELECT u.* FROM follows f JOIN users u ON u.id = f.follower_id WHERE f.followee_id = ? ORDER BY f.created_at DESC LIMIT 200', u.id)
      : all('SELECT u.* FROM follows f JOIN users u ON u.id = f.followee_id WHERE f.follower_id = ? ORDER BY f.created_at DESC LIMIT 200', u.id);
    res.json({ users: rows.map((r) => publicUser(r)) });
  });
}

// Artists to follow: people you don't follow yet, most-followed first.
app.get('/api/suggestions', (req, res) => {
  const me = req.user?.id ?? 0;
  const rows = all(
    `SELECT u.*, (SELECT COUNT(*) FROM follows WHERE followee_id = u.id) AS fc FROM users u
     WHERE u.id != :me AND NOT EXISTS(SELECT 1 FROM follows WHERE follower_id = :me AND followee_id = u.id)
     ORDER BY fc DESC, u.created_at DESC LIMIT 12`,
    { me },
  );
  res.json({ users: rows.map((r) => publicUser(r)) });
});

// ---------- feed ----------

app.get('/api/feed', (req, res) => {
  const me = req.user?.id ?? 0;
  const offset = Math.max(0, Number(req.query.offset) || 0);
  const genre = str(req.query.genre, 30);
  const type = ['video', 'photo'].includes(req.query.type) ? req.query.type : '';
  const where = ['1 = 1'];
  const params = { me, offset, limit: PAGE };
  if (genre) { where.push('(p.genre = :genre COLLATE NOCASE OR p.caption LIKE :tag)'); params.genre = genre; params.tag = `%#${genre}%`; }
  if (type) { where.push('p.type = :type'); params.type = type; }

  let order;
  if (req.query.tab === 'following') {
    if (!me) fail(401, 'Log in to see posts from people you follow.');
    where.push('(p.user_id IN (SELECT followee_id FROM follows WHERE follower_id = :me) OR p.user_id = :me)');
    order = 'p.created_at DESC';
  } else {
    // "For You": engagement weighted by freshness. No ads, no paid boosts — ever.
    order = `((SELECT COUNT(*) FROM likes WHERE post_id = p.id) * 2
            + (SELECT COUNT(*) FROM comments WHERE post_id = p.id) * 3
            + (SELECT COUNT(*) FROM saves WHERE post_id = p.id) * 3
            + p.plays * 0.05 + 1)
            / pow((unixepoch() - p.created_at) / 3600.0 + 2, 1.3) DESC, p.id DESC`;
  }
  const rows = all(`${POST_SELECT} WHERE ${where.join(' AND ')} ORDER BY ${order} LIMIT :limit OFFSET :offset`, params);
  res.json({ posts: rows.map(serializePost), next: rows.length === PAGE ? offset + PAGE : null });
});

// ---------- posts ----------

const postUpload = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'images', maxCount: MAX_IMAGES },
  { name: 'audio', maxCount: 1 },
]);

app.post('/api/posts', requireUser, postUpload, wrap(async (req, res) => {
  const b = req.body;
  const type = b.type === 'photo' ? 'photo' : 'video';
  const files = req.files || {};
  const created = [];
  try {
    const meta = {
      caption: str(b.caption, 2200),
      song_title: str(b.song_title, 120),
      song_artist: str(b.song_artist, 120),
      genre: str(b.genre, 30),
      bpm: Number.isInteger(Number(b.bpm)) && Number(b.bpm) > 0 && Number(b.bpm) < 400 ? Number(b.bpm) : null,
      music_key: str(b.music_key, 12),
      credits: str(b.credits, 500),
      stream_link: str(b.stream_link, 300),
    };
    if (meta.stream_link && !/^https?:\/\//i.test(meta.stream_link)) fail(400, 'Stream link must start with http:// or https://');

    let video = null, images = [], audio = null, thumb = null, duration = null, soundPostId = null;

    if (type === 'video') {
      const vf = files.video?.[0];
      if (!vf) fail(400, 'Please attach a video.');
      duration = await probeDuration(vf.path);
      if (duration == null) duration = Number(b.duration) || null;
      if (duration != null && duration > MAX_DURATION + DURATION_TOLERANCE) fail(400, 'Videos can be up to 15 minutes long.');
      const dims = await probeDimensions(vf.path);
      if (dims && dims.width > dims.height * 1.05) fail(400, 'Waveform is for vertical videos — please upload a portrait (9:16) video.');
      await fastStart(vf.path);
      video = moveUpload(vf, 'videos');
      created.push(video);
      const thumbRel = `thumbs/${path.basename(video, path.extname(video))}.jpg`;
      if (await makeThumbnail(path.join(UPLOAD_DIR, video), path.join(UPLOAD_DIR, thumbRel), duration)) {
        thumb = thumbRel;
        created.push(thumb);
      }
    } else {
      const imgs = files.images || [];
      if (!imgs.length) fail(400, 'Please attach at least one photo.');
      for (const f of imgs) if (f.size > MAX_IMAGE_MB * 1024 * 1024) fail(400, `Each photo must be under ${MAX_IMAGE_MB}MB.`);
      const af = files.audio?.[0];
      if (af) {
        if (af.size > MAX_AUDIO_MB * 1024 * 1024) fail(400, `Audio must be under ${MAX_AUDIO_MB}MB.`);
        duration = (await probeDuration(af.path)) ?? (Number(b.duration) || null);
        if (duration != null && duration > MAX_DURATION + DURATION_TOLERANCE) fail(400, 'Sounds can be up to 15 minutes long.');
        audio = moveUpload(af, 'audio');
        created.push(audio);
      } else if (b.sound_post_id) {
        const src = one('SELECT id, audio, duration, sound_post_id FROM posts WHERE id = ? AND audio IS NOT NULL', Number(b.sound_post_id));
        if (!src) fail(400, 'That sound is no longer available.');
        soundPostId = src.sound_post_id || src.id; // always credit the original
        audio = src.audio;
        duration = src.duration;
      } else {
        fail(400, 'Attach a sound (song, beat or snippet) to your photos.');
      }
      for (const f of imgs) { const rel = moveUpload(f, 'images'); images.push(rel); created.push(rel); }
      thumb = images[0];
    }

    const { lastInsertRowid } = run(
      `INSERT INTO posts (user_id, type, video, images, audio, sound_post_id, thumb, duration, caption, song_title, song_artist, genre, bpm, music_key, credits, stream_link)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      req.user.id, type, video, JSON.stringify(images), audio, soundPostId, thumb, duration,
      meta.caption, meta.song_title, meta.song_artist, meta.genre, meta.bpm, meta.music_key, meta.credits, meta.stream_link,
    );
    const postId = Number(lastInsertRowid);
    if (soundPostId) {
      const owner = one('SELECT user_id FROM posts WHERE id = ?', soundPostId);
      if (owner) notify(owner.user_id, req.user.id, 'sound', postId);
    }
    // Let followers know about new drops.
    const followers = all('SELECT follower_id FROM follows WHERE followee_id = ?', req.user.id);
    for (const f of followers) notify(f.follower_id, req.user.id, 'post', postId);

    res.json({ post: getPost(postId, req.user.id) });
  } catch (err) {
    cleanupFiles(req);
    created.forEach(rmUpload);
    throw err;
  }
}));

app.get('/api/posts/:id', (req, res) => {
  const p = getPost(Number(req.params.id), req.user?.id ?? 0);
  if (!p) fail(404, 'Post not found.');
  res.json({ post: p });
});

app.patch('/api/posts/:id', requireUser, (req, res) => {
  const p = one('SELECT * FROM posts WHERE id = ?', Number(req.params.id));
  if (!p) fail(404, 'Post not found.');
  if (p.user_id !== req.user.id) fail(403, 'Not your post.');
  const b = req.body;
  run(
    `UPDATE posts SET caption = ?, song_title = ?, song_artist = ?, genre = ?, bpm = ?, music_key = ?, credits = ?, stream_link = ? WHERE id = ?`,
    str(b.caption, 2200), str(b.song_title, 120), str(b.song_artist, 120), str(b.genre, 30),
    Number(b.bpm) > 0 && Number(b.bpm) < 400 ? Math.round(Number(b.bpm)) : null,
    str(b.music_key, 12), str(b.credits, 500),
    /^https?:\/\//i.test(str(b.stream_link, 300)) ? str(b.stream_link, 300) : '',
    p.id,
  );
  res.json({ post: getPost(p.id, req.user.id) });
});

app.delete('/api/posts/:id', requireUser, (req, res) => {
  const p = one('SELECT * FROM posts WHERE id = ?', Number(req.params.id));
  if (!p) fail(404, 'Post not found.');
  if (p.user_id !== req.user.id) fail(403, 'Not your post.');
  // Posts that reused this sound keep playing it: hand them the original audio file.
  run('UPDATE posts SET sound_post_id = NULL WHERE sound_post_id = ?', p.id);
  run('DELETE FROM posts WHERE id = ?', p.id);
  rmUpload(p.video);
  if (p.thumb && p.thumb !== JSON.parse(p.images || '[]')[0]) rmUpload(p.thumb);
  for (const img of JSON.parse(p.images || '[]')) rmUpload(img);
  if (p.audio && !one('SELECT 1 FROM posts WHERE audio = ?', p.audio)) rmUpload(p.audio);
  res.json({ ok: true });
});

for (const [route, table, notifType] of [['like', 'likes', 'like'], ['save', 'saves', null]]) {
  app.post(`/api/posts/:id/${route}`, requireUser, (req, res) => {
    const p = one('SELECT id, user_id FROM posts WHERE id = ?', Number(req.params.id));
    if (!p) fail(404, 'Post not found.');
    const r = run(`INSERT OR IGNORE INTO ${table} (user_id, post_id) VALUES (?, ?)`, req.user.id, p.id);
    if (r.changes && notifType) notify(p.user_id, req.user.id, notifType, p.id);
    res.json({ ok: true, count: one(`SELECT COUNT(*) c FROM ${table} WHERE post_id = ?`, p.id).c });
  });
  app.delete(`/api/posts/:id/${route}`, requireUser, (req, res) => {
    const id = Number(req.params.id);
    run(`DELETE FROM ${table} WHERE user_id = ? AND post_id = ?`, req.user.id, id);
    res.json({ ok: true, count: one(`SELECT COUNT(*) c FROM ${table} WHERE post_id = ?`, id).c });
  });
}

app.post('/api/posts/:id/play', (req, res) => {
  run('UPDATE posts SET plays = plays + 1 WHERE id = ?', Number(req.params.id));
  res.json({ ok: true });
});

app.post('/api/posts/:id/report', requireUser, (req, res) => {
  const id = Number(req.params.id);
  if (!one('SELECT 1 FROM posts WHERE id = ?', id)) fail(404, 'Post not found.');
  run('INSERT INTO reports (user_id, post_id, reason) VALUES (?, ?, ?)', req.user.id, id, str(req.body.reason, 500));
  res.json({ ok: true });
});

app.get('/api/posts/:id/comments', (req, res) => {
  const rows = all(
    `SELECT c.*, u.username, u.display_name, u.avatar FROM comments c JOIN users u ON u.id = c.user_id
     WHERE c.post_id = ? ORDER BY c.created_at ASC LIMIT 500`,
    Number(req.params.id),
  );
  res.json({
    comments: rows.map((c) => ({
      id: c.id, body: c.body, created_at: c.created_at,
      author: { id: c.user_id, username: c.username, display_name: c.display_name, avatar: mediaUrl(c.avatar) },
    })),
  });
});

app.post('/api/posts/:id/comments', requireUser, (req, res) => {
  const p = one('SELECT id, user_id FROM posts WHERE id = ?', Number(req.params.id));
  if (!p) fail(404, 'Post not found.');
  const body = str(req.body.body, 1000);
  if (!body) fail(400, 'Comment is empty.');
  const { lastInsertRowid } = run('INSERT INTO comments (post_id, user_id, body) VALUES (?, ?, ?)', p.id, req.user.id, body);
  notify(p.user_id, req.user.id, 'comment', p.id);
  // Notify @mentioned users.
  for (const [, name] of body.matchAll(/@([a-z0-9_.]{3,30})/gi)) {
    const m = one('SELECT id FROM users WHERE username = ?', name.toLowerCase());
    if (m && m.id !== p.user_id) notify(m.id, req.user.id, 'mention', p.id);
  }
  res.json({
    comment: {
      id: Number(lastInsertRowid), body, created_at: Math.floor(Date.now() / 1000),
      author: { id: req.user.id, username: req.user.username, display_name: req.user.display_name, avatar: mediaUrl(req.user.avatar) },
    },
  });
});

app.delete('/api/comments/:id', requireUser, (req, res) => {
  const c = one('SELECT c.*, p.user_id AS post_owner FROM comments c JOIN posts p ON p.id = c.post_id WHERE c.id = ?', Number(req.params.id));
  if (!c) fail(404, 'Comment not found.');
  if (c.user_id !== req.user.id && c.post_owner !== req.user.id) fail(403, 'Not allowed.');
  run('DELETE FROM comments WHERE id = ?', c.id);
  res.json({ ok: true });
});

// ---------- sounds ----------

app.get('/api/sounds/:id', (req, res) => {
  const me = req.user?.id ?? 0;
  const id = Number(req.params.id);
  const original = getPost(id, me);
  if (!original || !original.audio) fail(404, 'Sound not found.');
  const rows = all(`${POST_SELECT} WHERE p.sound_post_id = :id ORDER BY p.created_at DESC LIMIT 60`, { me, id });
  res.json({ original, posts: rows.map(serializePost) });
});

// ---------- discovery ----------

app.get('/api/search', (req, res) => {
  const me = req.user?.id ?? 0;
  const q = str(req.query.q, 60);
  if (!q) return res.json({ users: [], posts: [] });
  const like = `%${q.replace(/^[#@]/, '').replace(/[%_]/g, (c) => `\\${c}`)}%`;
  const users = all(
    `SELECT * FROM users WHERE username LIKE :like ESCAPE '\\' OR display_name LIKE :like ESCAPE '\\'
       OR genres LIKE :like ESCAPE '\\' OR role LIKE :like ESCAPE '\\' LIMIT 20`,
    { like },
  );
  const posts = all(
    `${POST_SELECT} WHERE p.caption LIKE :like ESCAPE '\\' OR p.song_title LIKE :like ESCAPE '\\'
       OR p.song_artist LIKE :like ESCAPE '\\' OR p.genre LIKE :like ESCAPE '\\' OR p.credits LIKE :like ESCAPE '\\'
     ORDER BY p.created_at DESC LIMIT 30`,
    { me, like },
  );
  res.json({ users: users.map((u) => publicUser(u)), posts: posts.map(serializePost) });
});

app.get('/api/trending', (req, res) => {
  const genres = all(
    `SELECT genre, COUNT(*) n FROM posts WHERE genre != '' AND created_at > unixepoch() - 30 * 86400
     GROUP BY genre COLLATE NOCASE ORDER BY n DESC LIMIT 15`,
  );
  const tagCounts = new Map();
  for (const { caption } of all(`SELECT caption FROM posts WHERE created_at > unixepoch() - 14 * 86400 AND caption LIKE '%#%' LIMIT 2000`)) {
    for (const [, t] of caption.matchAll(/#([\p{L}\p{N}_]{2,30})/gu)) {
      const k = t.toLowerCase();
      tagCounts.set(k, (tagCounts.get(k) || 0) + 1);
    }
  }
  const tags = [...tagCounts].sort((a, b) => b[1] - a[1]).slice(0, 15).map(([tag, n]) => ({ tag, n }));
  const sounds = all(
    `SELECT sp.id, sp.song_title, sp.song_artist, u.username, COUNT(*) uses FROM posts p
     JOIN posts sp ON sp.id = p.sound_post_id JOIN users u ON u.id = sp.user_id
     GROUP BY sp.id ORDER BY uses DESC LIMIT 10`,
  );
  res.json({ genres, tags, sounds });
});

// ---------- collab board ----------

app.get('/api/collabs', (req, res) => {
  const q = str(req.query.q, 60);
  const rows = all(
    `SELECT c.*, u.username, u.display_name, u.avatar, u.role FROM collabs c JOIN users u ON u.id = c.user_id
     ${q ? "WHERE c.title LIKE :like OR c.body LIKE :like OR c.looking_for LIKE :like OR c.genre LIKE :like" : ''}
     ORDER BY c.created_at DESC LIMIT 100`,
    q ? { like: `%${q}%` } : {},
  );
  res.json({
    collabs: rows.map((c) => ({
      id: c.id, title: c.title, body: c.body, looking_for: c.looking_for, genre: c.genre, created_at: c.created_at,
      author: { id: c.user_id, username: c.username, display_name: c.display_name, avatar: mediaUrl(c.avatar), role: c.role },
    })),
  });
});

app.post('/api/collabs', requireUser, (req, res) => {
  const title = str(req.body.title, 120);
  if (!title) fail(400, 'Give your collab request a title.');
  const { lastInsertRowid } = run(
    'INSERT INTO collabs (user_id, title, body, looking_for, genre) VALUES (?, ?, ?, ?, ?)',
    req.user.id, title, str(req.body.body, 2000), str(req.body.looking_for, 120), str(req.body.genre, 30),
  );
  res.json({ id: Number(lastInsertRowid) });
});

app.delete('/api/collabs/:id', requireUser, (req, res) => {
  const r = run('DELETE FROM collabs WHERE id = ? AND user_id = ?', Number(req.params.id), req.user.id);
  if (!r.changes) fail(404, 'Not found.');
  res.json({ ok: true });
});

// ---------- notifications ----------

app.get('/api/notifications', requireUser, (req, res) => {
  const rows = all(
    `SELECT n.*, u.username, u.display_name, u.avatar, p.thumb, p.type AS post_type FROM notifications n
     JOIN users u ON u.id = n.actor_id LEFT JOIN posts p ON p.id = n.post_id
     WHERE n.user_id = ? ORDER BY n.created_at DESC, n.id DESC LIMIT 100`,
    req.user.id,
  );
  res.json({
    notifications: rows.map((n) => ({
      id: n.id, type: n.type, post_id: n.post_id, read: !!n.read, created_at: n.created_at,
      thumb: mediaUrl(n.thumb),
      actor: { username: n.username, display_name: n.display_name, avatar: mediaUrl(n.avatar) },
    })),
  });
});

app.post('/api/notifications/read', requireUser, (req, res) => {
  run('UPDATE notifications SET read = 1 WHERE user_id = ? AND read = 0', req.user.id);
  res.json({ ok: true });
});

app.get('/api/badges', (req, res) => {
  if (!req.user) return res.json({ notifications: 0, messages: 0 });
  res.json({
    notifications: one('SELECT COUNT(*) c FROM notifications WHERE user_id = ? AND read = 0', req.user.id).c,
    messages: one('SELECT COUNT(*) c FROM messages WHERE recipient_id = ? AND read = 0', req.user.id).c,
  });
});

// ---------- direct messages ----------

app.get('/api/messages', requireUser, (req, res) => {
  const me = req.user.id;
  const rows = all(
    `SELECT m.*, CASE WHEN m.sender_id = :me THEN m.recipient_id ELSE m.sender_id END AS other_id
     FROM messages m
     WHERE m.id IN (
       SELECT MAX(id) FROM messages WHERE sender_id = :me OR recipient_id = :me
       GROUP BY CASE WHEN sender_id = :me THEN recipient_id ELSE sender_id END
     ) ORDER BY m.id DESC`,
    { me },
  );
  res.json({
    conversations: rows.map((m) => {
      const u = one('SELECT * FROM users WHERE id = ?', m.other_id);
      return {
        user: publicUser(u),
        last: { body: m.body, created_at: m.created_at, mine: m.sender_id === me },
        unread: one('SELECT COUNT(*) c FROM messages WHERE sender_id = ? AND recipient_id = ? AND read = 0', m.other_id, me).c,
      };
    }),
  });
});

app.get('/api/messages/:username', requireUser, (req, res) => {
  const other = one('SELECT * FROM users WHERE username = ?', req.params.username);
  if (!other) fail(404, 'User not found.');
  const after = Number(req.query.after) || 0;
  const rows = all(
    `SELECT * FROM messages WHERE id > :after AND ((sender_id = :me AND recipient_id = :o) OR (sender_id = :o AND recipient_id = :me))
     ORDER BY id DESC LIMIT 200`,
    { me: req.user.id, o: other.id, after },
  ).reverse();
  run('UPDATE messages SET read = 1 WHERE sender_id = ? AND recipient_id = ? AND read = 0', other.id, req.user.id);
  res.json({
    user: publicUser(other),
    messages: rows.map((m) => ({ id: m.id, body: m.body, created_at: m.created_at, mine: m.sender_id === req.user.id })),
  });
});

app.post('/api/messages/:username', requireUser, (req, res) => {
  const other = one('SELECT id FROM users WHERE username = ?', req.params.username);
  if (!other) fail(404, 'User not found.');
  if (other.id === req.user.id) fail(400, "You can't message yourself.");
  const body = str(req.body.body, 2000);
  if (!body) fail(400, 'Message is empty.');
  const { lastInsertRowid } = run('INSERT INTO messages (sender_id, recipient_id, body) VALUES (?, ?, ?)', req.user.id, other.id, body);
  res.json({ message: { id: Number(lastInsertRowid), body, created_at: Math.floor(Date.now() / 1000), mine: true } });
});

// ---------- health & static ----------

app.get('/healthz', (req, res) => res.json({ ok: true }));

app.use('/media', express.static(UPLOAD_DIR, {
  maxAge: '365d',
  immutable: true,
  index: false,
  setHeaders: (res) => res.setHeader('Accept-Ranges', 'bytes'),
}));

app.use('/media', (req, res) => res.status(404).end());

app.use(express.static(PUBLIC_DIR, {
  index: false,
  setHeaders: (res, file) => {
    if (file.endsWith('sw.js') || file.endsWith('.html') || file.endsWith('manifest.webmanifest')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  },
}));

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }));

// SPA fallback
app.get('/{*path}', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.use((err, req, res, next) => {
  cleanupFiles(req);
  if (err instanceof multer.MulterError) {
    const msg = err.code === 'LIMIT_FILE_SIZE' ? `File too large (max ${MAX_VIDEO_MB}MB).` : err.message;
    return res.status(400).json({ error: msg });
  }
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? 'Something went wrong.' : err.message });
});

// Clear stale temp uploads and expired sessions at boot.
for (const f of fs.readdirSync(path.join(UPLOAD_DIR, 'tmp'))) fs.rm(path.join(UPLOAD_DIR, 'tmp', f), { force: true }, () => {});
run('DELETE FROM sessions WHERE created_at < unixepoch() - ?', SESSION_DAYS * 86400);

const server = app.listen(PORT, () => {
  console.log(`Waveform listening on :${PORT} (data: ${DATA_DIR})`);
});
// Long uploads (15-minute videos on mobile) need generous timeouts.
server.requestTimeout = 0;
server.headersTimeout = 120e3;

for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => { server.close(); db.close(); process.exit(0); });
}
