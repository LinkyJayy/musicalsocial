import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs/promises';

const exec = promisify(execFile);

let ffmpegAvailable = null;

export async function hasFfmpeg() {
  if (ffmpegAvailable === null) {
    try {
      await exec('ffprobe', ['-version']);
      await exec('ffmpeg', ['-version']);
      ffmpegAvailable = true;
    } catch {
      ffmpegAvailable = false;
      console.warn('[waveform] ffmpeg/ffprobe not found: durations come from the client and video thumbnails are skipped.');
    }
  }
  return ffmpegAvailable;
}

/** Duration in seconds, or null when it can't be determined. */
export async function probeDuration(file) {
  if (!(await hasFfmpeg())) return null;
  try {
    const { stdout } = await exec('ffprobe', [
      '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', file,
    ]);
    const d = parseFloat(stdout.trim());
    return Number.isFinite(d) ? d : null;
  } catch {
    return null;
  }
}

/** Probe width/height of the first video stream. */
export async function probeDimensions(file) {
  if (!(await hasFfmpeg())) return null;
  try {
    const { stdout } = await exec('ffprobe', [
      '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:stream_side_data=rotation',
      '-of', 'json', file,
    ]);
    const s = JSON.parse(stdout).streams?.[0];
    if (!s) return null;
    let { width, height } = s;
    const rot = Math.abs(s.side_data_list?.find((x) => x.rotation != null)?.rotation ?? 0);
    if (rot === 90 || rot === 270) [width, height] = [height, width];
    return { width, height };
  } catch {
    return null;
  }
}

/** Grab a frame for the poster image. Returns true on success. */
export async function makeThumbnail(videoFile, outFile, duration) {
  if (!(await hasFfmpeg())) return false;
  const at = duration && duration > 2 ? Math.min(1, duration / 4) : 0;
  try {
    await exec('ffmpeg', [
      '-y', '-ss', String(at), '-i', videoFile, '-frames:v', '1',
      '-vf', 'scale=720:-2', '-q:v', '4', outFile,
    ]);
    await fs.access(outFile);
    return true;
  } catch {
    return false;
  }
}

/**
 * Move the moov atom to the front of MP4/MOV files so playback can start
 * before the whole (up to 15 minute) file has downloaded. Stream copy only,
 * no re-encode. Falls back silently to the original file.
 */
export async function fastStart(file) {
  if (!(await hasFfmpeg())) return;
  if (!/\.(mp4|m4v|mov)$/i.test(file)) return;
  const tmp = file.replace(/(\.\w+)$/, '.faststart$1');
  try {
    await exec('ffmpeg', ['-y', '-i', file, '-c', 'copy', '-map', '0', '-movflags', '+faststart', tmp], {
      maxBuffer: 1024 * 1024 * 16,
    });
    await fs.rename(tmp, file);
  } catch {
    await fs.rm(tmp, { force: true });
  }
}
