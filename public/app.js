// Waveform — client app (no framework, no trackers, no ads).

const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.5 3.3-5.5 6.5-5.5s5.9 2 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c2 .7 3.2 2.5 3.5 5.2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4 4-6.5 8-6.5s7.2 2.5 8 6.5"/>',
  heart: '<path d="M12 20.5S3 15 3 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 9 2.8C21 15 12 20.5 12 20.5z"/>',
  comment: '<path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.4A8.5 8.5 0 1 1 21 11.5z"/>',
  bookmark: '<path d="M6 3h12v18l-6-4.5L6 21z"/>',
  share: '<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  play: '<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>',
  pause: '<path d="M7 4h3.5v16H7zM13.5 4H17v16h-3.5z" fill="currentColor"/>',
  volume: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  mute: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="m17 9 5 6M22 9l-5 6"/>',
  more: '<circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  bell: '<path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
  send: '<path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  video: '<rect x="3" y="5" width="13" height="14" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.8"/><path d="m21 15-5-5L5 21"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  pin: '<path d="M12 21s-7-6.3-7-11.5a7 7 0 0 1 14 0C19 14.7 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  logout: '<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3"/>',
};
const icon = (name) => `<span class="i"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg></span>`;

const GENRES = ['Hip-Hop', 'R&B', 'Pop', 'Rock', 'Indie', 'Electronic', 'House', 'Techno', 'Drum & Bass', 'Lo-fi', 'Jazz', 'Soul', 'Funk', 'Country', 'Folk', 'Metal', 'Punk', 'Classical', 'Latin', 'Reggaeton', 'Afrobeats', 'K-Pop', 'Gospel', 'Blues', 'Reggae', 'Ambient', 'Trap', 'Drill', 'Singer-Songwriter', 'Acoustic'];
const KEYS = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B']
  .flatMap((k) => [`${k} maj`, `${k} min`]);
const LINK_LABELS = { spotify: 'Spotify', apple_music: 'Apple Music', soundcloud: 'SoundCloud', bandcamp: 'Bandcamp', youtube: 'YouTube', instagram: 'Instagram', website: 'Website' };
const MAX_DURATION = 15 * 60;

const state = {
  me: null,
  roles: [],
  muted: true,
  watch: null, // { posts, start, fetchPage } handed from grids to the /post/:id viewer
  badges: { notifications: 0, messages: 0 },
  installPrompt: null,
};

// ---------- utils ----------

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function timeAgo(ts) {
  const s = Math.max(1, Math.floor(Date.now() / 1000 - ts));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 604800) return `${Math.floor(s / 86400)}d`;
  return new Date(ts * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: s > 31536000 ? 'numeric' : undefined });
}

function fmtTime(sec) {
  if (!Number.isFinite(sec)) return '0:00';
  sec = Math.max(0, Math.floor(sec));
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const fmtCount = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(1).replace(/\.0$/, '')}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1).replace(/\.0$/, '')}K` : String(n || 0));

function richText(text) {
  return esc(text)
    .replace(/#([\p{L}\p{N}_]{1,40})/gu, (m, t) => `<a href="/tag/${encodeURIComponent(t)}">#${t}</a>`)
    .replace(/(^|[^\w])@([a-z0-9_.]{3,30})/gi, (m, pre, u) => `${pre}<a href="/u/${u.toLowerCase()}">@${u}</a>`);
}

function avatar(u, cls = '') {
  if (u?.avatar) return `<img class="avatar ${cls}" src="${esc(u.avatar)}" alt="" loading="lazy">`;
  const letter = (u?.display_name || u?.username || '?').trim()[0]?.toUpperCase() || '?';
  return `<span class="avatar ph ${cls}">${esc(letter)}</span>`;
}

function toast(msg, ms = 2600) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => (t.hidden = true), ms);
}

async function api(method, url, body) {
  const opts = { method, headers: {}, credentials: 'same-origin' };
  if (body instanceof FormData) opts.body = body;
  else if (body !== undefined) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
  const res = await fetch(url, opts);
  let data = {};
  try { data = await res.json(); } catch {}
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

function requireLogin() {
  if (state.me) return true;
  navigate(`/login?next=${encodeURIComponent(location.pathname + location.search)}`);
  return false;
}

function uploadWithProgress(url, form, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => {
      let data = {};
      try { data = JSON.parse(xhr.responseText); } catch {}
      if (xhr.status >= 200 && xhr.status < 300) resolve(data);
      else reject(new Error(data.error || `Upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error('Network error during upload.'));
    xhr.send(form);
  });
}

async function sharePost(post) {
  const url = `${location.origin}/post/${post.id}`;
  const title = post.song_title ? `${post.song_title} — ${post.author.display_name}` : `${post.author.display_name} on Waveform`;
  try {
    if (navigator.share) await navigator.share({ title, url });
    else { await navigator.clipboard.writeText(url); toast('Link copied'); }
  } catch {}
}

// ---------- sheets ----------

function openSheet({ title = '', body = '', footer = '', onMount, onClose } = {}) {
  const root = $('#sheet-root');
  root.innerHTML = `<div class="sheet-back"></div>
    <div class="sheet" role="dialog" aria-label="${esc(title)}">
      <header><span style="width:40px"></span><div class="grow">${esc(title)}</div><button class="icon-btn" data-close aria-label="Close">${icon('x')}</button></header>
      <div class="body">${body}</div>
      ${footer ? `<footer>${footer}</footer>` : ''}
    </div>`;
  const sheet = $('.sheet', root);
  const close = () => { root.innerHTML = ''; onClose?.(); };
  $('.sheet-back', root).onclick = close;
  $('[data-close]', root).onclick = close;
  onMount?.(sheet, close);
  return close;
}

function closeSheet() { $('#sheet-root').innerHTML = ''; }

// ---------- router ----------

const routes = [];
const route = (pattern, view) => routes.push({ pattern, view });
let cleanup = null;

function navigate(url, { replace = false, keepWatch = false } = {}) {
  if (!keepWatch) state.watch = null;
  history[replace ? 'replaceState' : 'pushState']({}, '', url);
  render();
}

let renderId = 0;

async function render() {
  closeSheet();
  if (cleanup) { try { cleanup(); } catch {} cleanup = null; }
  const id = ++renderId;
  // Each render gets its own root so a slow, superseded view can't paint over the current one.
  const view = document.createElement('div');
  view.className = 'view-root';
  $('#view').replaceChildren(view);
  const path = location.pathname;
  const params = new URLSearchParams(location.search);
  for (const r of routes) {
    const m = path.match(r.pattern);
    if (m) {
      const tab = r.view.tab || '';
      $$('#tabbar a').forEach((a) => a.classList.toggle('active', a.dataset.tab === tab));
      try {
        const c = await r.view(view, m.slice(1).map(decodeURIComponent), params);
        if (typeof c === 'function') {
          if (id === renderId) cleanup = c;
          else c();
        }
      } catch (err) {
        view.innerHTML = `<div class="page"><div class="page-inner"><div class="empty">${esc(err.message || 'Something went wrong')}</div></div></div>`;
      }
      return;
    }
  }
  view.innerHTML = `<div class="page"><div class="page-inner"><div class="empty"><img src="/icons/logo.png" alt=""><p>Page not found.</p><a class="btn" href="/">Go home</a></div></div></div>`;
}

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href]');
  if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
  const href = a.getAttribute('href');
  if (!href.startsWith('/') || href.startsWith('/media/')) return;
  e.preventDefault();
  navigate(href, { keepWatch: a.hasAttribute('data-keep-watch') });
});
window.addEventListener('popstate', () => { state.watch = history.state?.keepWatch ? state.watch : null; render(); });

function topbar(title, { back = true, right = '' } = {}) {
  return `<div class="topbar">
    ${back ? `<button class="icon-btn" data-back aria-label="Back">${icon('back')}</button>` : ''}
    <h1>${title}</h1>${right}</div>`;
}

function wireBack(el) {
  $$('[data-back]', el).forEach((b) => (b.onclick = () => (history.length > 1 ? history.back() : navigate('/'))));
}

// ---------- the scrolling feed ----------

function slideHtml(p) {
  const a = p.author;
  const isMe = state.me && state.me.id === a.id;
  const tags = [p.genre, p.bpm ? `${p.bpm} BPM` : '', p.music_key].filter(Boolean).map(esc).join(' · ');
  const songCard = p.song_title || p.credits || tags || p.stream_link
    ? `<div class="song-card">
        ${p.song_title ? `<div class="t">${icon('music')}<span>${esc(p.song_title)}${p.song_artist ? ` — ${esc(p.song_artist)}` : ''}</span></div>` : ''}
        ${tags ? `<div class="tags">${tags}</div>` : ''}
        ${p.credits ? `<div class="credits">Credits: ${esc(p.credits)}</div>` : ''}
        ${p.stream_link ? `<a class="stream" href="${esc(p.stream_link)}" target="_blank" rel="noopener">Listen to the full song ↗</a>` : ''}
      </div>`
    : '';
  const media = p.type === 'video'
    ? `<video playsinline webkit-playsinline loop preload="none" ${p.thumb ? `poster="${esc(p.thumb)}"` : ''} src="${esc(p.video)}"></video>`
    : `<div class="carousel">${p.images.map((src) => `<div class="cell"><img src="${esc(src)}" alt="" loading="lazy" draggable="false"></div>`).join('')}</div>
       ${p.images.length > 1 ? `<div class="dots">${p.images.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>` : ''}
       <audio preload="none" loop src="${esc(p.audio)}"></audio>`;
  const bg = p.thumb ? `<div class="backdrop" style="background-image:url('${esc(p.thumb)}')"></div>` : '';
  return `${bg}<div class="stage">
    ${media}
    <div class="shade"></div>
    <div class="paused-ind" hidden>${icon('play')}</div>
    <div class="rail">
      <div class="av">
        <a href="/u/${esc(a.username)}" aria-label="${esc(a.display_name)}">${avatar(a)}</a>
        ${!isMe && !a.following ? `<button class="plus" data-act="follow" aria-label="Follow">${icon('plus')}</button>` : ''}
      </div>
      <button data-act="like" class="${p.liked ? 'on-like' : ''}" aria-label="Like">${icon('heart')}<span>${fmtCount(p.like_count)}</span></button>
      <button data-act="comments" aria-label="Comments">${icon('comment')}<span>${fmtCount(p.comment_count)}</span></button>
      <button data-act="save" class="${p.saved ? 'on-save' : ''}" aria-label="Save">${icon('bookmark')}<span>${fmtCount(p.save_count)}</span></button>
      <button data-act="share" aria-label="Share">${icon('share')}<span>Share</span></button>
      <button data-act="more" aria-label="More">${icon('more')}</button>
      ${p.sound ? `<a href="/sound/${p.sound.id}" aria-label="Sound"><div class="disc" style="${p.thumb ? `background-image:url('${esc(p.thumb)}')` : ''}"></div></a>` : ''}
    </div>
    <div class="meta">
      <a class="who" href="/u/${esc(a.username)}">@${esc(a.username)}${a.role ? ` <span class="role">· ${esc(a.role)}</span>` : ''}</a>
      ${p.caption ? `<div class="caption">${richText(p.caption)}</div>` : ''}
      ${songCard}
      ${p.sound ? `<a class="sound-line" href="/sound/${p.sound.id}">${icon('music')}<span>${esc(p.sound.title)}${p.sound.artist ? ` · ${esc(p.sound.artist)}` : ''} — @${esc(p.sound.username || a.username)}</span></a>` : ''}
    </div>
    <div class="scrub" aria-label="Seek"><div class="bar"><div class="fill"></div></div></div>
    <div class="scrub-time"></div>
  </div>`;
}

function mountFeed(root, { fetchPage = null, posts = [], start = 0, top = '', emptyHtml = '' }) {
  root.innerHTML = `<div class="feed-wrap"><div class="feed"></div>${top}
    <button class="mute-pill" hidden>${icon('mute')}<span>Tap for sound</span></button></div>`;
  const feed = $('.feed', root);
  const mutePill = $('.mute-pill', root);
  const slides = [];
  let next = fetchPage ? 0 : null;
  let loading = false;
  let active = -1;
  let destroyed = false;
  const seen = new Set();

  const updateMutePill = () => (mutePill.hidden = !state.muted || active < 0);
  mutePill.onclick = (e) => { e.stopPropagation(); setMuted(false); };

  function setMuted(m) {
    state.muted = m;
    const s = slides[active];
    if (s) { s.media.muted = m; if (!m && s.media.paused && !s.userPaused) s.media.play().catch(() => {}); }
    updateMutePill();
  }

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) activate(Number(e.target.dataset.idx));
  }, { root: feed, threshold: 0.6 });

  function append(list) {
    for (const p of list) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      const el = document.createElement('section');
      el.className = 'slide';
      el.dataset.idx = slides.length;
      el.innerHTML = slideHtml(p);
      const s = { p, el, media: $('video, audio', el), userPaused: false, counted: false };
      slides.push(s);
      wireSlide(s);
      feed.appendChild(el);
      io.observe(el);
    }
  }

  async function loadMore() {
    if (loading || next === null || destroyed) return;
    loading = true;
    try {
      const r = await fetchPage(next);
      if (destroyed) return;
      append(r.posts);
      next = r.next;
      if (!slides.length && emptyHtml) feed.innerHTML = `<div class="feed-msg">${emptyHtml}</div>`;
    } catch (err) {
      if (err.status === 401) feed.innerHTML = `<div class="feed-msg">${emptyHtml || esc(err.message)}</div>`;
      else toast(err.message);
      next = null;
    } finally {
      loading = false;
    }
  }

  function activate(i) {
    if (i === active || !slides[i]) return;
    const prev = slides[active];
    if (prev) { prev.media.pause(); prev.el.classList.remove('playing'); }
    active = i;
    const s = slides[i];
    s.userPaused = false;
    $('.paused-ind', s.el).hidden = true;
    play(s);
    // Warm up the neighbour so swiping feels instant.
    const n = slides[i + 1];
    if (n && n.media.preload === 'none') n.media.preload = 'metadata';
    if (i >= slides.length - 3) loadMore();
    updateMutePill();
    setMediaSession(s.p);
  }

  function play(s) {
    s.media.muted = state.muted;
    if (s.media.preload !== 'auto') s.media.preload = 'auto';
    s.media.play().then(() => s.el.classList.add('playing')).catch(() => {
      // Autoplay with sound blocked: fall back to muted autoplay.
      if (!s.media.muted) {
        state.muted = true;
        s.media.muted = true;
        updateMutePill();
        s.media.play().then(() => s.el.classList.add('playing')).catch(() => {});
      }
    });
  }

  function wireSlide(s) {
    const { el, media, p } = s;
    const fill = $('.fill', el);
    const scrub = $('.scrub', el);
    const timeLabel = $('.scrub-time', el);
    let dragging = false;

    media.addEventListener('timeupdate', () => {
      if (!dragging && media.duration) fill.style.width = `${(media.currentTime / media.duration) * 100}%`;
      if (!s.counted && media.currentTime > 3) { s.counted = true; api('POST', `/api/posts/${p.id}/play`).catch(() => {}); }
    });
    media.addEventListener('pause', () => el.classList.remove('playing'));
    media.addEventListener('play', () => el.classList.add('playing'));

    const seekTo = (clientX) => {
      const r = scrub.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      fill.style.width = `${ratio * 100}%`;
      if (media.duration) {
        media.currentTime = ratio * media.duration;
        timeLabel.textContent = `${fmtTime(media.currentTime)} / ${fmtTime(media.duration)}`;
      }
    };
    scrub.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      dragging = true;
      scrub.setPointerCapture(e.pointerId);
      scrub.classList.add('drag');
      el.classList.add('scrubbing');
      seekTo(e.clientX);
    });
    scrub.addEventListener('pointermove', (e) => dragging && seekTo(e.clientX));
    const end = () => { dragging = false; scrub.classList.remove('drag'); el.classList.remove('scrubbing'); };
    scrub.addEventListener('pointerup', end);
    scrub.addEventListener('pointercancel', end);
    scrub.addEventListener('click', (e) => e.stopPropagation());

    const carousel = $('.carousel', el);
    if (carousel) {
      const dots = $$('.dots i', el);
      carousel.addEventListener('scroll', () => {
        const i = Math.round(carousel.scrollLeft / carousel.clientWidth);
        dots.forEach((d, j) => d.classList.toggle('on', i === j));
      }, { passive: true });
    }

    // Single tap: pause/play (and unmute on first tap). Double tap: like.
    let lastTap = 0, tapTimer = null;
    el.addEventListener('click', (e) => {
      if (e.target.closest('a, button, .scrub, .caption a')) return;
      if (e.target.closest('.caption')) { e.target.closest('.caption').classList.toggle('open'); return; }
      const now = Date.now();
      if (now - lastTap < 280) {
        clearTimeout(tapTimer);
        lastTap = 0;
        heartBurst(el, e.clientX, e.clientY);
        if (!p.liked) toggle('like');
        return;
      }
      lastTap = now;
      tapTimer = setTimeout(() => {
        if (state.muted) { setMuted(false); return; }
        if (media.paused) { s.userPaused = false; media.play().catch(() => {}); $('.paused-ind', el).hidden = true; }
        else { s.userPaused = true; media.pause(); $('.paused-ind', el).hidden = false; }
      }, 280);
    });

    async function toggle(kind) {
      if (!requireLogin()) return;
      const key = kind === 'like' ? 'liked' : 'saved';
      const btn = $(`[data-act="${kind}"]`, el);
      const on = !p[key];
      p[key] = on;
      btn.classList.toggle(kind === 'like' ? 'on-like' : 'on-save', on);
      try {
        const r = await api(on ? 'POST' : 'DELETE', `/api/posts/${p.id}/${kind}`);
        p[`${kind}_count`] = r.count;
        $('span:last-child', btn).textContent = fmtCount(r.count);
        if (kind === 'save') toast(on ? 'Saved to your collection' : 'Removed from saved');
      } catch (err) {
        p[key] = !on;
        btn.classList.toggle(kind === 'like' ? 'on-like' : 'on-save', !on);
        toast(err.message);
      }
    }

    el.addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-act]');
      if (!btn) return;
      e.stopPropagation();
      const act = btn.dataset.act;
      if (act === 'like' || act === 'save') toggle(act);
      else if (act === 'share') sharePost(p);
      else if (act === 'comments') openComments(p, (n) => { p.comment_count = n; $('[data-act="comments"] span:last-child', el).textContent = fmtCount(n); });
      else if (act === 'follow') {
        if (!requireLogin()) return;
        try {
          await api('POST', `/api/users/${p.author.username}/follow`);
          p.author.following = true;
          btn.remove();
          toast(`Following @${p.author.username}`);
        } catch (err) { toast(err.message); }
      } else if (act === 'more') openPostMenu(p, () => { el.remove(); });
    });
  }

  const onVis = () => { if (document.hidden && slides[active]) slides[active].media.pause(); };
  document.addEventListener('visibilitychange', onVis);

  append(posts);
  if (slides[start]) feed.scrollTop = slides[start].el.offsetTop;
  if (fetchPage && slides.length < 4) loadMore();
  else if (!slides.length && emptyHtml) feed.innerHTML = `<div class="feed-msg">${emptyHtml}</div>`;

  return () => {
    destroyed = true;
    io.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    for (const s of slides) { s.media.pause(); s.media.removeAttribute('src'); s.media.load(); }
    if ('mediaSession' in navigator) navigator.mediaSession.metadata = null;
  };
}

function heartBurst(el, x, y) {
  const r = el.getBoundingClientRect();
  const h = document.createElement('div');
  h.className = 'heart-burst';
  h.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="${'M12 20.5S3 15 3 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 9 2.8C21 15 12 20.5 12 20.5z'}"/></svg>`;
  h.style.left = `${x - r.left}px`;
  h.style.top = `${y - r.top}px`;
  el.appendChild(h);
  setTimeout(() => h.remove(), 800);
}

function setMediaSession(p) {
  if (!('mediaSession' in navigator) || !window.MediaMetadata) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: p.song_title || p.sound?.title || p.caption.slice(0, 60) || 'Waveform',
    artist: p.song_artist || p.author.display_name,
    album: 'Waveform',
    artwork: p.thumb ? [{ src: p.thumb, sizes: '512x512' }] : [{ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }],
  });
}

function openComments(post, onCount) {
  let count = post.comment_count;
  openSheet({
    title: `${count} comment${count === 1 ? '' : 's'}`,
    body: '<div class="spinner"></div>',
    footer: state.me
      ? `<form class="row grow" style="width:100%"><input class="input grow" name="body" maxlength="1000" placeholder="Add a comment… use @ to mention" autocomplete="off"><button class="btn" aria-label="Send">${icon('send')}</button></form>`
      : `<a class="btn block" href="/login?next=${encodeURIComponent(location.pathname)}">Log in to comment</a>`,
    onMount: async (sheet) => {
      const body = $('.body', sheet);
      const title = $('header .grow', sheet);
      const setTitle = () => (title.textContent = `${count} comment${count === 1 ? '' : 's'}`);
      const row = (c) => `<div class="comment" data-id="${c.id}">
        <a href="/u/${esc(c.author.username)}">${avatar(c.author, 'sm')}</a>
        <div class="b"><div class="n"><a href="/u/${esc(c.author.username)}">${esc(c.author.display_name)}</a> · ${timeAgo(c.created_at)}</div>
        <div class="t">${richText(c.body)}</div>
        ${state.me && (state.me.id === c.author.id || state.me.id === post.author.id) ? `<button class="x" data-del="${c.id}">Delete</button>` : ''}</div></div>`;
      try {
        const { comments } = await api('GET', `/api/posts/${post.id}/comments`);
        body.innerHTML = comments.length ? comments.map(row).join('') : '<div class="empty small">No comments yet. Start the conversation.</div>';
        body.scrollTop = body.scrollHeight;
      } catch (err) { body.innerHTML = `<div class="error">${esc(err.message)}</div>`; }
      body.addEventListener('click', async (e) => {
        const del = e.target.closest('[data-del]');
        if (!del) return;
        try {
          await api('DELETE', `/api/comments/${del.dataset.del}`);
          del.closest('.comment').remove();
          count--; setTitle(); onCount(count);
        } catch (err) { toast(err.message); }
      });
      const form = $('form', sheet);
      if (form) form.onsubmit = async (e) => {
        e.preventDefault();
        const input = form.body;
        const text = input.value.trim();
        if (!text) return;
        input.disabled = true;
        try {
          const { comment } = await api('POST', `/api/posts/${post.id}/comments`, { body: text });
          if (!$('.comment', body)) body.innerHTML = '';
          body.insertAdjacentHTML('beforeend', row(comment));
          body.scrollTop = body.scrollHeight;
          input.value = '';
          count++; setTitle(); onCount(count);
        } catch (err) { toast(err.message); }
        input.disabled = false;
        input.focus();
      };
    },
  });
}

function openPostMenu(p, onDeleted) {
  const mine = state.me && state.me.id === p.author.id;
  openSheet({
    title: 'Options',
    body: `<div class="menu">
      <button data-m="copy">${icon('link')} Copy link</button>
      ${p.sound ? `<button data-m="use">${icon('music')} Use this sound</button>` : ''}
      ${p.sound ? `<button data-m="sound">${icon('music')} View sound page</button>` : ''}
      <button data-m="profile">${icon('user')} View @${esc(p.author.username)}</button>
      ${state.me && !mine ? `<button data-m="dm">${icon('mail')} Message @${esc(p.author.username)}</button>` : ''}
      ${mine ? `<button data-m="edit">${icon('edit')} Edit details</button>` : ''}
      ${mine ? `<button data-m="delete" style="color:var(--danger)">${icon('trash')} Delete post</button>` : ''}
      ${!mine ? `<button data-m="report">${icon('flag')} Report</button>` : ''}
    </div>`,
    onMount: (sheet, close) => {
      sheet.addEventListener('click', async (e) => {
        const b = e.target.closest('[data-m]');
        if (!b) return;
        const m = b.dataset.m;
        if (m === 'copy') { try { await navigator.clipboard.writeText(`${location.origin}/post/${p.id}`); toast('Link copied'); } catch { toast('Could not copy'); } close(); }
        else if (m === 'use') navigate(`/create?sound=${p.sound.id}`);
        else if (m === 'sound') navigate(`/sound/${p.sound.id}`);
        else if (m === 'profile') navigate(`/u/${p.author.username}`);
        else if (m === 'dm') navigate(`/inbox/${p.author.username}`);
        else if (m === 'edit') { close(); openEditPost(p); }
        else if (m === 'delete') {
          if (!confirm('Delete this post? This cannot be undone.')) return;
          try { await api('DELETE', `/api/posts/${p.id}`); toast('Post deleted'); close(); onDeleted?.(); } catch (err) { toast(err.message); }
        } else if (m === 'report') {
          if (!requireLogin()) return;
          const reason = prompt('Why are you reporting this post?');
          if (reason === null) return;
          try { await api('POST', `/api/posts/${p.id}/report`, { reason }); toast('Thanks — we received your report'); close(); } catch (err) { toast(err.message); }
        }
      });
    },
  });
}

function songFields(p = {}) {
  return `
    <div class="grid-2">
      <label class="field"><span>Song title</span><input class="input" name="song_title" maxlength="120" value="${esc(p.song_title || '')}"></label>
      <label class="field"><span>Artist</span><input class="input" name="song_artist" maxlength="120" value="${esc(p.song_artist || '')}"></label>
    </div>
    <div class="grid-2">
      <label class="field"><span>Genre</span><input class="input" name="genre" list="genre-list" maxlength="30" value="${esc(p.genre || '')}"></label>
      <label class="field"><span>BPM</span><input class="input" name="bpm" type="number" min="1" max="399" inputmode="numeric" value="${esc(p.bpm || '')}"></label>
    </div>
    <datalist id="genre-list">${GENRES.map((g) => `<option value="${esc(g)}">`).join('')}</datalist>
    <label class="field"><span>Key</span><select class="input" name="music_key"><option value="">—</option>${KEYS.map((k) => `<option ${p.music_key === k ? 'selected' : ''}>${k}</option>`).join('')}</select></label>
    <label class="field"><span>Credits (producer, features, writers…)</span><input class="input" name="credits" maxlength="500" placeholder="prod. @someone, feat. @someone" value="${esc(p.credits || '')}"></label>
    <label class="field"><span>Full song link (Spotify, SoundCloud, Bandcamp…)</span><input class="input" name="stream_link" type="url" maxlength="300" placeholder="https://" value="${esc(p.stream_link || '')}"></label>`;
}

function openEditPost(p) {
  openSheet({
    title: 'Edit details',
    body: `<form class="stack" style="padding:8px 0 16px">
      <label class="field"><span>Caption</span><textarea class="input" name="caption" maxlength="2200">${esc(p.caption)}</textarea></label>
      ${songFields(p)}
      <button class="btn block">Save</button></form>`,
    onMount: (sheet, close) => {
      const form = $('form', sheet);
      form.onsubmit = async (e) => {
        e.preventDefault();
        try {
          await api('PATCH', `/api/posts/${p.id}`, Object.fromEntries(new FormData(form)));
          toast('Saved');
          close();
          render();
        } catch (err) { toast(err.message); }
      };
    },
  });
}

// ---------- views ----------

function homeView(view, _, params) {
  const tab = params.get('tab') === 'following' ? 'following' : 'foryou';
  const badgeCount = state.badges.notifications;
  const top = `<div class="feed-top">
    <a href="/" class="brand" aria-label="Waveform"><img src="/icons/logo.png" alt="Waveform"></a>
    <div class="feed-tabs">
      <button data-tab="following" class="${tab === 'following' ? 'on' : ''}">Following</button>
      <button data-tab="foryou" class="${tab === 'foryou' ? 'on' : ''}">For You</button>
    </div>
    <a class="icon-btn" href="/notifications" aria-label="Notifications">${icon('bell')}${badgeCount ? `<b class="badge">${badgeCount}</b>` : ''}</a>
  </div>`;
  const emptyHtml = tab === 'following'
    ? (state.me
        ? `<img src="/icons/logo.png" alt=""><p>Posts from artists you follow show up here.</p><a class="btn" href="/discover">Find artists</a>`
        : `<img src="/icons/logo.png" alt=""><p>Log in to see posts from artists you follow.</p><a class="btn" href="/login">Log in</a>`)
    : `<img src="/icons/logo.png" alt=""><p>No posts yet. Be the first to drop something.</p><a class="btn" href="/create">Create a post</a>`;
  const c = mountFeed(view, {
    fetchPage: (offset) => api('GET', `/api/feed?tab=${tab}&offset=${offset}`),
    top,
    emptyHtml,
  });
  $$('.feed-tabs button', view).forEach((b) => (b.onclick = () => navigate(b.dataset.tab === 'following' ? '/?tab=following' : '/', { replace: true })));
  return c;
}
homeView.tab = 'home';

function backTop(title) {
  return `<div class="feed-top"><button class="icon-btn" data-back aria-label="Back">${icon('back')}</button>
    <div class="feed-tabs"><button class="on" style="box-shadow:none">${title}</button></div><span style="width:40px"></span></div>`;
}

async function postView(view, [id]) {
  const w = state.watch;
  let c;
  if (w && w.posts[w.start]?.id === Number(id)) {
    c = mountFeed(view, { posts: w.posts, start: w.start, top: backTop(w.title || '') });
  } else {
    const { post } = await api('GET', `/api/posts/${id}`);
    c = mountFeed(view, {
      posts: [post],
      // Keep scrolling into the For You feed after a shared post.
      fetchPage: (offset) => api('GET', `/api/feed?offset=${offset}`),
      top: backTop(''),
    });
  }
  wireBack(view);
  return c;
}

function tagView(view, [tag]) {
  const c = mountFeed(view, {
    fetchPage: (offset) => api('GET', `/api/feed?genre=${encodeURIComponent(tag)}&offset=${offset}`),
    top: backTop(`#${esc(tag)}`),
    emptyHtml: `<p>Nothing tagged #${esc(tag)} yet.</p><a class="btn" href="/create">Post the first one</a>`,
  });
  wireBack(view);
  return c;
}

function openWatch(posts, index, title = '') {
  state.watch = { posts, start: index, title };
  history.pushState({ keepWatch: true }, '', `/post/${posts[index].id}`);
  render();
}

function gridHtml(posts) {
  return `<div class="grid">${posts.map((p, i) => `
    <button class="tile" data-i="${i}" aria-label="Open post">
      ${p.thumb ? `<img src="${esc(p.thumb)}" alt="" loading="lazy">` : `<div class="ph">${icon(p.type === 'video' ? 'video' : 'music')}</div>`}
      <span class="kind">${icon(p.type === 'video' ? 'video' : 'music')}</span>
      <span class="ov">${p.type === 'video' ? icon('play') + fmtCount(p.plays) : icon('heart') + fmtCount(p.like_count)}</span>
    </button>`).join('')}</div>`;
}

function wireGrid(el, posts, title) {
  el.querySelectorAll('.tile').forEach((t) => (t.onclick = () => openWatch(posts, Number(t.dataset.i), title)));
}

async function discoverView(view, _, params) {
  const q = params.get('q') || '';
  view.innerHTML = `<div class="page"><div class="page-inner">
    <form class="search" role="search">${icon('search')}<input class="input" name="q" type="search" placeholder="Search artists, songs, genres, #tags" value="${esc(q)}" autocomplete="off"></form>
    <div id="disc-body"><div class="spinner"></div></div></div></div>`;
  const body = $('#disc-body', view);
  const form = $('form', view);
  let timer;
  form.onsubmit = (e) => { e.preventDefault(); navigate(`/discover?q=${encodeURIComponent(form.q.value.trim())}`, { replace: true }); };
  form.q.oninput = () => { clearTimeout(timer); timer = setTimeout(() => runSearch(form.q.value.trim()), 300); };

  async function runSearch(term) {
    history.replaceState({}, '', term ? `/discover?q=${encodeURIComponent(term)}` : '/discover');
    if (!term) return showHome();
    body.innerHTML = '<div class="spinner"></div>';
    try {
      const { users, posts } = await api('GET', `/api/search?q=${encodeURIComponent(term)}`);
      if (form.q.value.trim() !== term) return;
      body.innerHTML = `
        ${users.length ? `<div class="section-title">Artists</div>${users.map(userRow).join('')}` : ''}
        ${posts.length ? `<div class="section-title">Posts</div>${gridHtml(posts)}` : ''}
        ${!users.length && !posts.length ? `<div class="empty">No results for “${esc(term)}”.</div>` : ''}`;
      wireGrid(body, posts, `“${term}”`);
    } catch (err) { body.innerHTML = `<div class="error">${esc(err.message)}</div>`; }
  }

  async function showHome() {
    body.innerHTML = '<div class="spinner"></div>';
    const [trend, sugg] = await Promise.all([api('GET', '/api/trending'), api('GET', '/api/suggestions')]);
    const genreChips = trend.genres.length ? trend.genres.map((g) => g.genre) : GENRES.slice(0, 16);
    body.innerHTML = `
      <div class="section-title">Genres</div>
      <div class="chips">${[...new Set([...genreChips, ...GENRES])].slice(0, 24).map((g) => `<a class="chip" href="/tag/${encodeURIComponent(g)}">${esc(g)}</a>`).join('')}</div>
      ${trend.tags.length ? `<div class="section-title">Trending tags</div><div class="chips">${trend.tags.map((t) => `<a class="chip accent" href="/tag/${encodeURIComponent(t.tag)}">#${esc(t.tag)} <span class="muted">${t.n}</span></a>`).join('')}</div>` : ''}
      ${trend.sounds.length ? `<div class="section-title">Trending sounds</div>${trend.sounds.map((s) => `
        <a class="sound-row" href="/sound/${s.id}"><div class="disc"></div><div class="grow"><div><b>${esc(s.song_title || 'Original sound')}</b></div>
        <div class="muted small">${esc(s.song_artist || '@' + s.username)} · ${s.uses} post${s.uses === 1 ? '' : 's'}</div></div></a>`).join('')}` : ''}
      ${sugg.users.length ? `<div class="section-title">Artists to follow</div><div class="artist-scroller">${sugg.users.map((u) => `
        <a class="artist-card" href="/u/${esc(u.username)}">${avatar(u)}<div class="n">${esc(u.display_name)}</div>
        <div class="role">${esc(u.role || '@' + u.username)}</div>${u.open_to_collab ? '<div class="small muted">Open to collab</div>' : ''}</a>`).join('')}</div>` : ''}
      <div class="section-title">Looking for collaborators?</div>
      <a class="card row" href="/collab">${icon('users')}<div class="grow"><b>Collab board</b><div class="muted small">Find vocalists, producers, players and writers.</div></div>${icon('back').replace('class="i"', 'class="i" style="transform:rotate(180deg)"')}</a>`;
  }

  if (q) runSearch(q); else showHome().catch((err) => (body.innerHTML = `<div class="error">${esc(err.message)}</div>`));
}
discoverView.tab = 'discover';

function userRow(u) {
  return `<a class="user-row" href="/u/${esc(u.username)}">${avatar(u)}<div class="grow">
    <div class="name">${esc(u.display_name)} ${u.open_to_collab ? '<span class="chip accent" style="padding:1px 8px;font-size:11px">Open to collab</span>' : ''}</div>
    <div class="muted small">@${esc(u.username)}${u.role ? ` · <span class="role">${esc(u.role)}</span>` : ''}${u.genres.length ? ` · ${esc(u.genres.slice(0, 3).join(', '))}` : ''}</div></div></a>`;
}

async function profileView(view, [username], params) {
  const tab = params.get('tab') || 'posts';
  const { user: u } = await api('GET', `/api/users/${encodeURIComponent(username)}`);
  const right = u.is_me
    ? `<a class="icon-btn" href="/inbox" aria-label="Messages">${icon('mail')}${state.badges.messages ? `<b class="badge">${state.badges.messages}</b>` : ''}</a>
       <a class="icon-btn" href="/notifications" aria-label="Notifications">${icon('bell')}${state.badges.notifications ? `<b class="badge">${state.badges.notifications}</b>` : ''}</a>
       <a class="icon-btn" href="/settings" aria-label="Settings">${icon('settings')}</a>`
    : `<button class="icon-btn" data-share aria-label="Share profile">${icon('share')}</button>`;
  const links = Object.entries(u.links || {}).map(([k, v]) => `<a href="${esc(v)}" target="_blank" rel="noopener">${icon(k === 'website' ? 'link' : 'music')}${esc(LINK_LABELS[k] || k)}</a>`).join('');
  view.innerHTML = `<div class="page">${topbar(`@${esc(u.username)}`, { back: !u.is_me, right })}<div class="page-inner">
    <div class="profile-head">
      ${avatar(u, 'lg')}
      <h2>${esc(u.display_name)}</h2>
      <div class="handle">@${esc(u.username)}</div>
      <div class="badges">
        ${u.role ? `<span class="chip accent">${esc(u.role)}</span>` : ''}
        ${u.open_to_collab ? '<span class="chip accent">Open to collab</span>' : ''}
        ${u.follows_you ? '<span class="chip">Follows you</span>' : ''}
      </div>
      <div class="stats">
        <a href="/u/${esc(u.username)}/following"><b>${fmtCount(u.following_count)}</b><span>Following</span></a>
        <a href="/u/${esc(u.username)}/followers"><b>${fmtCount(u.follower_count)}</b><span>Followers</span></a>
        <div><b>${fmtCount(u.like_total)}</b><span>Likes</span></div>
      </div>
      ${u.bio ? `<div class="bio">${richText(u.bio)}</div>` : ''}
      ${u.location ? `<div class="muted small row" style="justify-content:center;gap:4px">${icon('pin').replace('class="i"', 'class="i" style="width:14px;height:14px"')}${esc(u.location)}</div>` : ''}
      ${u.genres.length ? `<div class="chips" style="justify-content:center;margin-top:10px">${u.genres.map((g) => `<a class="chip" href="/tag/${encodeURIComponent(g)}">${esc(g)}</a>`).join('')}</div>` : ''}
      ${links ? `<div class="links">${links}</div>` : ''}
      <div class="row" style="justify-content:center;margin-top:12px">
        ${u.is_me
          ? `<a class="btn secondary" href="/settings">Edit profile</a><button class="btn secondary" data-share>Share profile</button>`
          : `<button class="btn ${u.is_following ? 'secondary' : ''}" data-follow>${u.is_following ? 'Following' : 'Follow'}</button>
             <a class="btn secondary" href="/inbox/${esc(u.username)}">Message</a>`}
      </div>
    </div>
    <div class="tabs">
      <button data-t="posts" class="${tab === 'posts' ? 'on' : ''}">Posts ${u.post_count}</button>
      <button data-t="liked" class="${tab === 'liked' ? 'on' : ''}">Liked</button>
      ${u.is_me ? `<button data-t="saved" class="${tab === 'saved' ? 'on' : ''}">Saved</button>` : ''}
    </div>
    <div id="grid-body"><div class="spinner"></div></div>
  </div></div>`;
  wireBack(view);
  $$('[data-share]', view).forEach((b) => (b.onclick = async () => {
    const url = `${location.origin}/u/${u.username}`;
    try { if (navigator.share) await navigator.share({ title: `${u.display_name} on Waveform`, url }); else { await navigator.clipboard.writeText(url); toast('Profile link copied'); } } catch {}
  }));
  $$('[data-t]', view).forEach((b) => (b.onclick = () => navigate(`/u/${u.username}${b.dataset.t === 'posts' ? '' : `?tab=${b.dataset.t}`}`, { replace: true })));
  const fb = $('[data-follow]', view);
  if (fb) fb.onclick = async () => {
    if (!requireLogin()) return;
    const on = !u.is_following;
    try {
      await api(on ? 'POST' : 'DELETE', `/api/users/${u.username}/follow`);
      u.is_following = on;
      fb.textContent = on ? 'Following' : 'Follow';
      fb.classList.toggle('secondary', on);
    } catch (err) { toast(err.message); }
  };

  const gb = $('#grid-body', view);
  const { posts } = await api('GET', `/api/users/${encodeURIComponent(u.username)}/posts?tab=${tab}`);
  if (!posts.length) {
    gb.innerHTML = `<div class="empty">${tab === 'posts'
      ? (u.is_me ? `No posts yet.<br><br><a class="btn" href="/create">Share your first track</a>` : 'No posts yet.')
      : tab === 'saved' ? 'Saved posts show up here — only you can see them.' : 'No liked posts yet.'}</div>`;
  } else {
    gb.innerHTML = gridHtml(posts);
    wireGrid(gb, posts, `@${u.username}`);
  }
}
profileView.tab = 'me';

async function followListView(view, [username, list]) {
  const { users } = await api('GET', `/api/users/${encodeURIComponent(username)}/${list}`);
  view.innerHTML = `<div class="page">${topbar(list === 'followers' ? 'Followers' : 'Following')}<div class="page-inner">
    ${users.length ? users.map(userRow).join('') : '<div class="empty">Nobody here yet.</div>'}</div></div>`;
  wireBack(view);
}

function meView(view) {
  if (!state.me) return navigate('/login?next=/me', { replace: true });
  navigate(`/u/${state.me.username}`, { replace: true });
}
meView.tab = 'me';

async function soundView(view, [id]) {
  const { original, posts } = await api('GET', `/api/sounds/${id}`);
  const s = original.sound;
  const all = [original, ...posts];
  view.innerHTML = `<div class="page">${topbar('Sound')}<div class="page-inner">
    <div class="row" style="gap:16px;margin:8px 0 16px">
      <div class="disc" style="width:88px;height:88px;border-width:14px;${original.thumb ? `background-image:url('${esc(original.thumb)}')` : ''}"></div>
      <div class="grow">
        <h2 style="margin:0;font-size:20px">${esc(s.title)}</h2>
        <div class="muted">${esc(s.artist || '')} ${s.artist ? '·' : ''} <a href="/u/${esc(s.username)}">@${esc(s.username)}</a></div>
        <div class="muted small">${fmtCount(posts.length)} post${posts.length === 1 ? '' : 's'} using this sound</div>
      </div>
    </div>
    <audio class="player" controls preload="none" src="${esc(original.audio)}"></audio>
    <div class="row" style="margin:14px 0">
      <a class="btn grow" href="/create?sound=${original.id}">${icon('music')} Use this sound</a>
    </div>
    ${gridHtml(all)}
  </div></div>`;
  wireBack(view);
  wireGrid(view, all, s.title);
}

async function createView(view, _, params) {
  if (!state.me) return navigate('/login?next=/create', { replace: true });
  const soundId = params.get('sound');
  let sound = null;
  if (soundId) {
    try { sound = (await api('GET', `/api/posts/${soundId}`)).post; } catch { toast('That sound is no longer available.'); }
  }
  let mode = sound ? 'photo' : 'video';
  let video = null, videoMeta = null, images = [], audio = null, audioDuration = null;
  const urls = [];
  const objUrl = (f) => { const u = URL.createObjectURL(f); urls.push(u); return u; };

  view.innerHTML = `<div class="page">${topbar('New post', { back: false })}<div class="page-inner">
    <div class="seg" role="tablist">
      <button data-mode="video">${icon('video')} Video</button>
      <button data-mode="photo">${icon('image')} Photos + Sound</button>
    </div>
    <form class="stack" style="margin-top:16px" novalidate>
      <div id="media-area"></div>
      <label class="field"><span>Caption</span><textarea class="input" name="caption" maxlength="2200" placeholder="Tell the story behind it… #tags and @mentions work"></textarea></label>
      <div class="section-title" style="margin-top:20px">Song details <span class="muted" style="text-transform:none;letter-spacing:0">(optional)</span></div>
      ${songFields()}
      <div id="upload-status" hidden><div class="progress"><div></div></div><div class="muted small center" style="margin-top:6px"></div></div>
      <div class="error" id="form-error" hidden></div>
      <button class="btn block" type="submit">Post</button>
    </form>
  </div></div>`;

  const area = $('#media-area', view);
  const form = $('form', view);
  const errEl = $('#form-error', view);
  const showErr = (m) => { errEl.textContent = m; errEl.hidden = !m; };

  function setMode(m) {
    mode = m;
    $$('[data-mode]', view).forEach((b) => b.classList.toggle('on', b.dataset.mode === m));
    showErr('');
    drawMedia();
  }
  $$('[data-mode]', view).forEach((b) => (b.onclick = () => setMode(b.dataset.mode)));

  function drawMedia() {
    if (mode === 'video') {
      area.innerHTML = video
        ? `<video class="preview-video" src="${objUrl(video)}" controls playsinline></video>
           <div class="row" style="margin-top:8px"><div class="grow muted small">${esc(video.name)} · ${videoMeta ? fmtTime(videoMeta.duration) : ''} · ${(video.size / 1048576).toFixed(1)} MB</div>
           <button type="button" class="btn small secondary" data-clear>Change</button></div>`
        : `<label class="drop">${icon('video')}<b>Choose a vertical video</b><span class="small">Up to 15 minutes · 9:16 looks best</span>
           <input type="file" accept="video/*" data-video></label>`;
      const inp = $('[data-video]', area);
      if (inp) inp.onchange = () => pickVideo(inp.files[0]);
      const c = $('[data-clear]', area);
      if (c) c.onclick = () => { video = null; videoMeta = null; drawMedia(); };
    } else {
      area.innerHTML = `
        ${images.length ? `<div class="thumbs">${images.map((f, i) => `<div class="t"><img src="${objUrl(f)}" alt=""><button type="button" data-rm="${i}" aria-label="Remove">×</button></div>`).join('')}
          ${images.length < 10 ? `<label class="t drop" style="padding:0;border-width:1px">${icon('plus')}<input type="file" accept="image/*" multiple data-images></label>` : ''}</div>`
          : `<label class="drop">${icon('image')}<b>Choose photos</b><span class="small">Up to 10 — cover art, studio shots, lyrics…</span><input type="file" accept="image/*" multiple data-images></label>`}
        <div class="section-title">Sound</div>
        ${sound
          ? `<div class="card row">${icon('music')}<div class="grow"><b>${esc(sound.sound?.title || 'Original sound')}</b><div class="muted small">@${esc(sound.sound?.username || sound.author.username)}</div></div>
             <button type="button" class="btn small secondary" data-unsound>Remove</button></div>
             <audio class="player" controls src="${esc(sound.audio)}" style="margin-top:8px"></audio>`
          : audio
            ? `<audio class="player" controls src="${objUrl(audio)}"></audio>
               <div class="row" style="margin-top:6px"><div class="grow muted small">${esc(audio.name)}${audioDuration ? ` · ${fmtTime(audioDuration)}` : ''}</div><button type="button" class="btn small secondary" data-unaudio>Change</button></div>`
            : `<label class="drop">${icon('music')}<b>Attach a song, beat or snippet</b><span class="small">MP3, WAV, M4A, AAC, OGG, FLAC · up to 15 minutes</span><input type="file" accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac" data-audio></label>
               <p class="muted small center">Or tap “Use this sound” on any post to reuse its sound.</p>`}`;
      $$('[data-images]', area).forEach((inp) => (inp.onchange = () => {
        images = [...images, ...[...inp.files].filter((f) => f.type.startsWith('image/'))].slice(0, 10);
        drawMedia();
      }));
      $$('[data-rm]', area).forEach((b) => (b.onclick = () => { images.splice(Number(b.dataset.rm), 1); drawMedia(); }));
      const a = $('[data-audio]', area);
      if (a) a.onchange = () => pickAudio(a.files[0]);
      const ua = $('[data-unaudio]', area);
      if (ua) ua.onclick = () => { audio = null; audioDuration = null; drawMedia(); };
      const us = $('[data-unsound]', area);
      if (us) us.onclick = () => { sound = null; history.replaceState({}, '', '/create'); drawMedia(); };
    }
  }

  function readMeta(file, tag) {
    return new Promise((resolve) => {
      const el = document.createElement(tag);
      el.preload = 'metadata';
      el.muted = true;
      const url = URL.createObjectURL(file);
      const done = (v) => { URL.revokeObjectURL(url); resolve(v); };
      el.onloadedmetadata = () => done({ duration: el.duration, width: el.videoWidth, height: el.videoHeight });
      el.onerror = () => done(null);
      setTimeout(() => done(null), 8000);
      el.src = url;
    });
  }

  async function pickVideo(file) {
    showErr('');
    if (!file) return;
    const meta = await readMeta(file, 'video');
    if (meta && Number.isFinite(meta.duration) && meta.duration > MAX_DURATION + 1) return showErr(`That video is ${fmtTime(meta.duration)} long. Videos can be up to 15:00.`);
    if (meta && meta.width && meta.height && meta.width > meta.height * 1.05) return showErr('Waveform is for vertical videos — please choose a portrait (9:16) video.');
    video = file;
    videoMeta = meta;
    drawMedia();
  }

  async function pickAudio(file) {
    showErr('');
    if (!file) return;
    const meta = await readMeta(file, 'audio');
    if (meta && Number.isFinite(meta.duration) && meta.duration > MAX_DURATION + 1) return showErr(`That sound is ${fmtTime(meta.duration)} long. Sounds can be up to 15:00.`);
    audio = file;
    audioDuration = meta?.duration ?? null;
    drawMedia();
  }

  form.onsubmit = async (e) => {
    e.preventDefault();
    showErr('');
    const fd = new FormData(form);
    fd.set('type', mode);
    if (mode === 'video') {
      if (!video) return showErr('Choose a video first.');
      fd.append('video', video);
      if (videoMeta?.duration) fd.set('duration', String(videoMeta.duration));
    } else {
      if (!images.length) return showErr('Add at least one photo.');
      if (!audio && !sound) return showErr('Attach a sound to go with your photos.');
      images.forEach((f) => fd.append('images', f));
      if (audio) { fd.append('audio', audio); if (audioDuration) fd.set('duration', String(audioDuration)); }
      else fd.set('sound_post_id', String(sound.id));
    }
    const status = $('#upload-status', view);
    const bar = $('.progress > div', status);
    const label = $('.muted', status);
    const btn = $('button[type=submit]', form);
    btn.disabled = true;
    status.hidden = false;
    try {
      const { post } = await uploadWithProgress('/api/posts', fd, (r) => {
        bar.style.width = `${Math.round(r * 100)}%`;
        label.textContent = r < 1 ? `Uploading… ${Math.round(r * 100)}%` : 'Processing…';
      });
      toast('Posted!');
      navigate(`/post/${post.id}`, { replace: true });
    } catch (err) {
      showErr(err.message);
      btn.disabled = false;
      status.hidden = true;
    }
  };

  setMode(mode);
  return () => urls.forEach((u) => URL.revokeObjectURL(u));
}
createView.tab = 'create';

async function collabView(view, _, params) {
  const q = params.get('q') || '';
  view.innerHTML = `<div class="page">${topbar('Collab board', { back: false, right: state.me ? `<a class="icon-btn" href="/inbox" aria-label="Messages">${icon('mail')}${state.badges.messages ? `<b class="badge">${state.badges.messages}</b>` : ''}</a>` : '' })}<div class="page-inner">
    <p class="muted" style="margin-top:0">Need a vocalist, a beat, a mix, a guitarist? Post what you're looking for and connect directly.</p>
    <div class="row">
      <form class="search grow" role="search">${icon('search')}<input class="input" name="q" type="search" placeholder="Search requests" value="${esc(q)}"></form>
      <button class="btn" data-new>${icon('plus')} Post</button>
    </div>
    <div id="collab-list" style="margin-top:16px"><div class="spinner"></div></div>
  </div></div>`;
  const form = $('form', view);
  form.onsubmit = (e) => { e.preventDefault(); navigate(`/collab${form.q.value.trim() ? `?q=${encodeURIComponent(form.q.value.trim())}` : ''}`, { replace: true }); };
  $('[data-new]', view).onclick = () => {
    if (!requireLogin()) return;
    openSheet({
      title: 'New collab request',
      body: `<form class="stack" style="padding:8px 0 16px">
        <label class="field"><span>Title</span><input class="input" name="title" maxlength="120" required placeholder="Looking for a female vocalist for an R&B hook"></label>
        <div class="grid-2">
          <label class="field"><span>Looking for</span><input class="input" name="looking_for" maxlength="120" placeholder="Vocalist, Producer, Mixing…"></label>
          <label class="field"><span>Genre</span><input class="input" name="genre" list="genre-list2" maxlength="30"></label>
        </div>
        <datalist id="genre-list2">${GENRES.map((g) => `<option value="${esc(g)}">`).join('')}</datalist>
        <label class="field"><span>Details</span><textarea class="input" name="body" maxlength="2000" placeholder="Vibe, references, timeline, split/credit terms…"></textarea></label>
        <button class="btn block">Post request</button></form>`,
      onMount: (sheet, close) => {
        const f = $('form', sheet);
        f.onsubmit = async (e) => {
          e.preventDefault();
          try { await api('POST', '/api/collabs', Object.fromEntries(new FormData(f))); close(); toast('Posted to the board'); render(); } catch (err) { toast(err.message); }
        };
      },
    });
  };
  const list = $('#collab-list', view);
  const { collabs } = await api('GET', `/api/collabs${q ? `?q=${encodeURIComponent(q)}` : ''}`);
  list.innerHTML = collabs.length ? collabs.map((c) => `
    <div class="card collab">
      <a class="row" href="/u/${esc(c.author.username)}">${avatar(c.author, 'sm')}<div class="grow"><b>${esc(c.author.display_name)}</b> <span class="muted small">@${esc(c.author.username)} · ${timeAgo(c.created_at)}</span>
        ${c.author.role ? `<div class="role">${esc(c.author.role)}</div>` : ''}</div></a>
      <h3>${esc(c.title)}</h3>
      <div class="chips">${c.looking_for ? `<span class="chip accent">Looking for: ${esc(c.looking_for)}</span>` : ''}${c.genre ? `<a class="chip" href="/tag/${encodeURIComponent(c.genre)}">${esc(c.genre)}</a>` : ''}</div>
      ${c.body ? `<p>${richText(c.body)}</p>` : ''}
      <div class="row" style="margin-top:10px">
        ${state.me?.id === c.author.id
          ? `<button class="btn small danger" data-del="${c.id}">${icon('trash')} Remove</button>`
          : `<a class="btn small" href="/inbox/${esc(c.author.username)}">${icon('mail')} Message</a>`}
      </div>
    </div>`).join('') : `<div class="empty">${q ? 'No matching requests.' : 'No collab requests yet. Post the first one!'}</div>`;
  $$('[data-del]', list).forEach((b) => (b.onclick = async () => {
    if (!confirm('Remove this request?')) return;
    try { await api('DELETE', `/api/collabs/${b.dataset.del}`); render(); } catch (err) { toast(err.message); }
  }));
}
collabView.tab = 'collab';

const NOTIF_TEXT = {
  like: 'liked your post',
  comment: 'commented on your post',
  follow: 'started following you',
  mention: 'mentioned you in a comment',
  sound: 'used your sound',
  post: 'shared a new post',
};

async function notificationsView(view) {
  if (!state.me) return navigate('/login?next=/notifications', { replace: true });
  view.innerHTML = `<div class="page">${topbar('Notifications')}<div class="page-inner"><div class="spinner"></div></div></div>`;
  wireBack(view);
  const { notifications } = await api('GET', '/api/notifications');
  $('.page-inner', view).innerHTML = notifications.length ? notifications.map((n) => `
    <a class="notif ${n.read ? '' : 'unread'}" href="${n.post_id ? `/post/${n.post_id}` : `/u/${esc(n.actor.username)}`}">
      ${avatar(n.actor)}
      <div class="grow"><b>${esc(n.actor.display_name)}</b> ${NOTIF_TEXT[n.type] || n.type} <span class="muted small">${timeAgo(n.created_at)}</span></div>
      ${n.thumb ? `<img class="thumb" src="${esc(n.thumb)}" alt="">` : ''}
    </a>`).join('') : '<div class="empty">No notifications yet.</div>';
  if (notifications.some((n) => !n.read)) {
    api('POST', '/api/notifications/read').then(() => { state.badges.notifications = 0; paintBadges(); }).catch(() => {});
  }
}
notificationsView.tab = 'me';

async function inboxView(view) {
  if (!state.me) return navigate('/login?next=/inbox', { replace: true });
  view.innerHTML = `<div class="page">${topbar('Messages')}<div class="page-inner"><div class="spinner"></div></div></div>`;
  wireBack(view);
  const { conversations } = await api('GET', '/api/messages');
  $('.page-inner', view).innerHTML = conversations.length ? conversations.map((c) => `
    <a class="convo" href="/inbox/${esc(c.user.username)}">${avatar(c.user)}
      <div class="grow"><b>${esc(c.user.display_name)}</b> <span class="muted small">· ${timeAgo(c.last.created_at)}</span>
      <div class="last">${c.last.mine ? 'You: ' : ''}${esc(c.last.body)}</div></div>
      ${c.unread ? `<span class="unread-dot">${c.unread}</span>` : ''}</a>`).join('')
    : '<div class="empty">No messages yet. Find collaborators on the <a href="/collab" style="color:var(--accent)">Collab board</a>.</div>';
}
inboxView.tab = 'me';

async function chatView(view, [username]) {
  if (!state.me) return navigate(`/login?next=/inbox/${encodeURIComponent(username)}`, { replace: true });
  const data = await api('GET', `/api/messages/${encodeURIComponent(username)}`);
  const u = data.user;
  view.innerHTML = `<div class="chat">
    <div class="topbar"><button class="icon-btn" data-back aria-label="Back">${icon('back')}</button>
      <a class="row grow" href="/u/${esc(u.username)}">${avatar(u, 'sm')}<div><b>${esc(u.display_name)}</b><div class="muted small">@${esc(u.username)}</div></div></a></div>
    <div class="msgs"></div>
    <form><input class="input grow" name="body" maxlength="2000" placeholder="Message…" autocomplete="off"><button class="btn" aria-label="Send">${icon('send')}</button></form>
  </div>`;
  wireBack(view);
  const msgs = $('.msgs', view);
  let lastId = 0;
  const add = (list) => {
    for (const m of list) {
      if (m.id <= lastId) continue;
      lastId = m.id;
      msgs.insertAdjacentHTML('beforeend', `<div class="bubble ${m.mine ? 'mine' : ''}" title="${esc(new Date(m.created_at * 1000).toLocaleString())}">${richText(m.body)}</div>`);
    }
    msgs.scrollTop = msgs.scrollHeight;
  };
  add(data.messages);
  if (!data.messages.length) msgs.innerHTML = `<div class="empty small">Say hi to ${esc(u.display_name)} 👋</div>`;
  const form = $('form', view);
  form.onsubmit = async (e) => {
    e.preventDefault();
    const body = form.body.value.trim();
    if (!body) return;
    form.body.value = '';
    try {
      const { message } = await api('POST', `/api/messages/${encodeURIComponent(u.username)}`, { body });
      $('.empty', msgs)?.remove();
      add([message]);
    } catch (err) { toast(err.message); form.body.value = body; }
  };
  const poll = setInterval(async () => {
    if (document.hidden) return;
    try {
      const r = await api('GET', `/api/messages/${encodeURIComponent(u.username)}?after=${lastId}`);
      if (r.messages.length) { $('.empty', msgs)?.remove(); add(r.messages); }
    } catch {}
  }, 4000);
  refreshBadges();
  return () => clearInterval(poll);
}
chatView.tab = 'me';

async function settingsView(view) {
  if (!state.me) return navigate('/login?next=/settings', { replace: true });
  const u = state.me;
  view.innerHTML = `<div class="page">${topbar('Edit profile')}<div class="page-inner">
    <div class="center" style="margin:8px 0 16px">
      <div id="av">${avatar(u, 'lg')}</div>
      <label class="btn small secondary" style="margin-top:10px;position:relative">Change photo<input type="file" accept="image/*" style="position:absolute;inset:0;opacity:0"></label>
    </div>
    <form class="stack" id="profile-form">
      <label class="field"><span>Display name</span><input class="input" name="display_name" maxlength="50" value="${esc(u.display_name)}"></label>
      <label class="field"><span>What do you do?</span><select class="input" name="role"><option value="">—</option>${state.roles.map((r) => `<option ${u.role === r ? 'selected' : ''}>${r}</option>`).join('')}</select></label>
      <label class="field"><span>Bio</span><textarea class="input" name="bio" maxlength="300">${esc(u.bio)}</textarea></label>
      <label class="field"><span>Location</span><input class="input" name="location" maxlength="60" value="${esc(u.location)}"></label>
      <label class="field"><span>Genres (comma separated, up to 8)</span><input class="input" name="genres" list="genre-list3" value="${esc(u.genres.join(', '))}"></label>
      <datalist id="genre-list3">${GENRES.map((g) => `<option value="${esc(g)}">`).join('')}</datalist>
      <label class="check"><input type="checkbox" name="open_to_collab" ${u.open_to_collab ? 'checked' : ''}> Open to collaborations</label>
      <div class="section-title">Links</div>
      ${Object.entries(LINK_LABELS).map(([k, label]) => `<label class="field"><span>${label}</span><input class="input" type="url" name="link_${k}" placeholder="https://" value="${esc(u.links[k] || '')}"></label>`).join('')}
      <button class="btn block">Save profile</button>
    </form>

    <div class="section-title">Install</div>
    <div class="card small" id="install-card">
      <p style="margin-top:0">Add Waveform to your home screen for a full-screen, app-like experience.</p>
      <button class="btn small" id="install-btn" ${state.installPrompt ? '' : 'hidden'}>${icon('download')} Install app</button>
      <p class="muted" ${state.installPrompt ? 'hidden' : ''}>On iPhone: tap Share → “Add to Home Screen”. On Android: browser menu → “Install app”.</p>
    </div>

    <div class="section-title">Password</div>
    <form class="stack" id="pw-form">
      <input class="input" type="password" name="current" placeholder="Current password" autocomplete="current-password">
      <input class="input" type="password" name="next" placeholder="New password (8+ characters)" autocomplete="new-password">
      <button class="btn secondary block">Change password</button>
    </form>

    <div class="section-title">Account</div>
    <button class="btn danger block" id="logout">${icon('logout')} Log out</button>
    <p class="muted small center" style="margin-top:24px">Waveform is ad-free. No ads, no sponsored posts, no tracking.</p>
  </div></div>`;
  wireBack(view);

  $('input[type=file]', view).onchange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const fd = new FormData();
    fd.append('avatar', f);
    try {
      const r = await api('POST', '/api/me/avatar', fd);
      state.me.avatar = r.avatar;
      $('#av', view).innerHTML = avatar(state.me, 'lg');
      toast('Photo updated');
    } catch (err) { toast(err.message); }
  };

  $('#profile-form', view).onsubmit = async (e) => {
    e.preventDefault();
    const f = e.target;
    const links = {};
    for (const k of Object.keys(LINK_LABELS)) links[k] = f[`link_${k}`].value.trim();
    try {
      const { user } = await api('PATCH', '/api/me', {
        display_name: f.display_name.value, role: f.role.value, bio: f.bio.value, location: f.location.value,
        genres: f.genres.value, open_to_collab: f.open_to_collab.checked, links,
      });
      state.me = user;
      toast('Profile saved');
      navigate(`/u/${user.username}`);
    } catch (err) { toast(err.message); }
  };

  $('#pw-form', view).onsubmit = async (e) => {
    e.preventDefault();
    const f = e.target;
    try { await api('POST', '/api/me/password', { current: f.current.value, next: f.next.value }); f.reset(); toast('Password changed'); } catch (err) { toast(err.message); }
  };

  const ib = $('#install-btn', view);
  ib.onclick = async () => {
    if (!state.installPrompt) return;
    state.installPrompt.prompt();
    await state.installPrompt.userChoice.catch(() => {});
    state.installPrompt = null;
    ib.hidden = true;
  };

  $('#logout', view).onclick = async () => {
    await api('POST', '/api/auth/logout').catch(() => {});
    state.me = null;
    state.badges = { notifications: 0, messages: 0 };
    paintBadges();
    navigate('/');
  };
}
settingsView.tab = 'me';

function loginView(view, _, params) {
  const next = params.get('next') || '/';
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/';
  if (state.me) return navigate(safeNext, { replace: true });
  let mode = params.get('mode') === 'register' ? 'register' : 'login';
  const draw = () => {
    view.innerHTML = `<div class="page"><div class="auth">
      <img class="logo" src="/icons/logo.png" alt="">
      <h1>Waveform</h1>
      <p class="tag">Where musicians share the music. No ads. Ever.</p>
      <div class="seg" style="margin-bottom:16px">
        <button data-m="login" class="${mode === 'login' ? 'on' : ''}">Log in</button>
        <button data-m="register" class="${mode === 'register' ? 'on' : ''}">Sign up</button>
      </div>
      <form class="stack">
        <input class="input" name="username" placeholder="Username" autocomplete="username" autocapitalize="none" required>
        ${mode === 'register' ? `<input class="input" name="display_name" placeholder="Artist / display name" maxlength="50">
          <select class="input" name="role"><option value="">What do you do?</option>${state.roles.map((r) => `<option>${r}</option>`).join('')}</select>` : ''}
        <input class="input" name="password" type="password" placeholder="Password${mode === 'register' ? ' (8+ characters)' : ''}" autocomplete="${mode === 'register' ? 'new-password' : 'current-password'}" required>
        <div class="error" hidden></div>
        <button class="btn block">${mode === 'register' ? 'Create account' : 'Log in'}</button>
      </form>
      <a class="muted small center" href="/" style="margin-top:20px">Just browsing? Back to the feed</a>
    </div></div>`;
    $$('[data-m]', view).forEach((b) => (b.onclick = () => { mode = b.dataset.m; draw(); }));
    const form = $('form', view);
    form.onsubmit = async (e) => {
      e.preventDefault();
      const err = $('.error', form);
      err.hidden = true;
      try {
        const { user } = await api('POST', `/api/auth/${mode}`, Object.fromEntries(new FormData(form)));
        state.me = user;
        refreshBadges();
        navigate(mode === 'register' ? '/settings' : safeNext, { replace: true });
        if (mode === 'register') toast('Welcome to Waveform! Set up your profile.');
      } catch (e2) { err.textContent = e2.message; err.hidden = false; }
    };
  };
  draw();
}
loginView.tab = 'me';

route(/^\/$/, homeView);
route(/^\/discover$/, discoverView);
route(/^\/create$/, createView);
route(/^\/collab$/, collabView);
route(/^\/me$/, meView);
route(/^\/login$/, loginView);
route(/^\/settings$/, settingsView);
route(/^\/notifications$/, notificationsView);
route(/^\/inbox$/, inboxView);
route(/^\/inbox\/([^/]+)$/, chatView);
route(/^\/post\/(\d+)$/, postView);
route(/^\/sound\/(\d+)$/, soundView);
route(/^\/tag\/([^/]+)$/, tagView);
route(/^\/u\/([^/]+)\/(followers|following)$/, followListView);
route(/^\/u\/([^/]+)$/, profileView);

// ---------- badges ----------

function paintBadges() {
  const n = state.badges.notifications + state.badges.messages;
  const b = $('#me-badge');
  b.textContent = n > 99 ? '99+' : n;
  b.hidden = !n;
}

async function refreshBadges() {
  if (!state.me) return;
  try { state.badges = await api('GET', '/api/badges'); paintBadges(); } catch {}
}

// ---------- boot ----------

$$('[data-icon]').forEach((el) => (el.outerHTML = icon(el.dataset.icon)));

window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); state.installPrompt = e; });

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}

(async () => {
  try {
    const { user, roles } = await api('GET', '/api/me');
    state.me = user;
    state.roles = roles;
  } catch {}
  await refreshBadges();
  setInterval(() => !document.hidden && refreshBadges(), 30000);
  render();
})();
