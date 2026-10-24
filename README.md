# Waveform

An ad-free social network for musicians and song artists. Installable as a PWA.

## Features

- **Vertical video feed**: swipe through full-screen 9:16 videos up to **15 minutes** long, with a seek bar, tap to pause, and double-tap to like. "For You" and "Following" tabs.
- **Photos + Sound**: post up to 10 photos with an attached song, beat or snippet (up to 15 minutes).
- **Sounds**: each sound has its own page. "Use this sound" lets anyone reuse it, and the original creator is always credited.
- **Song details on every post**: title, artist, genre, BPM, key, credits (producer, features, writers) and a link to the full song.
- **Artist profiles**: role (Producer, Singer, DJ…), genres, location, "Open to collab" badge, and links to Spotify, Apple Music, SoundCloud, Bandcamp, YouTube, Instagram and a website.
- **Collab board**: post what you're looking for (a vocalist, a mix, a guitarist…) and message people directly.
- **Direct messages**, **comments** with @mentions, **likes**, **saves**, **follows**, **shares** and **notifications**.
- **Discover**: search, genres, trending #tags, trending sounds, and artists to follow.
- Lock-screen media controls (Media Session API), installable PWA with an offline app shell.
- **No ads, no sponsored posts, no tracking.**

## Run locally

Requires Node 22.13+ (it uses the built-in `node:sqlite`). `ffmpeg` is optional but recommended.

```bash
npm install
npm start          # http://localhost:3000
```

Data (the SQLite database and uploads) goes to `./data` unless `DATA_DIR` is set.

## Deploy on Railway

1. Create a new project from this GitHub repo. Railway builds from the included `Dockerfile`, which installs ffmpeg.
2. **Attach a Volume to the service with mount path `/data`.**
   This volume holds the SQLite database (`/data/waveform.db`) and every upload (`/data/uploads`). Without it, everything is lost on each deploy.
   Size it for your videos; a 15-minute phone video can be 0.5–2 GB.
3. Generate a public domain under Settings → Networking. HTTPS is required for the PWA install prompt.

Optional environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `DATA_DIR` | `/data` (Docker) | Where the DB and uploads live. Falls back to `RAILWAY_VOLUME_MOUNT_PATH`. |
| `MAX_VIDEO_MB` | `1024` | Max video upload size |
| `MAX_AUDIO_MB` | `200` | Max audio upload size |
| `MAX_IMAGE_MB` | `20` | Max size per photo |

Keep the service at **1 replica**, because SQLite and the volume belong to a single instance.

## Notes

- Videos are stored as uploaded (no re-encoding). MP4 (H.264) plays everywhere. iPhone HEVC `.mov` files play in Safari but may not play in some other browsers.
- Landscape videos are rejected. Waveform is for vertical videos.
