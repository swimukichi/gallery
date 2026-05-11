const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

const srcDir = path.join(__dirname, '..', '_original', 'videos');
const destDir = path.join(__dirname, '..', 'Videos');
const supported = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v'];
const maxWidth = 1920;
const maxHeight = 1080;
const mute = process.argv.includes('--mute');

function sanitizeName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function optimizeVideo(filePath) {
  const basename = path.basename(filePath, path.extname(filePath));
  const sanitized = sanitizeName(basename);
  const outputName = `${sanitized}.mp4`;
  const outputPath = path.join(destDir, outputName);

  console.log(`   ⏳ ${path.basename(filePath)}`);

  const args = [
    '-y',
    '-i', filePath,
    '-vf', `scale='min(${maxWidth},iw):min(${maxHeight},ih)':force_original_aspect_ratio=decrease`,
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '24',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
  ];

  if (mute) {
    args.push('-an');
  } else {
    args.push('-c:a', 'aac', '-b:a', '128k');
  }

  args.push(outputPath);

  const result = spawnSync(ffmpegPath, args, { stdio: 'pipe', encoding: 'utf-8' });
  if (result.error) {
    console.error(`   ❌ ${path.basename(filePath)}`);
    console.error(`      Error: ${result.error.message}`);
    return false;
  }
  if (result.status !== 0) {
    console.error(`   ❌ ${path.basename(filePath)}`);
    console.error(`      ffmpeg exit code: ${result.status}`);
    if (result.stderr) {
      console.error(`      Details: ${result.stderr.split('\n').slice(0, 3).join(' ')}`);
    }
    return false;
  }
  console.log(`      → ${outputName}`);
  return true;
}


function run() {
  console.log('\n🎬 Video Optimization Started');
  console.log(`   Source: ${srcDir}`);
  console.log(`   Output: ${destDir}`);
  console.log(`   Format: MP4 | Max: ${maxWidth}x${maxHeight} | Mode: ${mute ? 'No Audio' : 'With Audio'}\n`);

  ensureDir(destDir);

  if (!fs.existsSync(srcDir)) {
    console.error(`\n❌ Error: Source folder not found`);
    console.error(`   Expected path: ${srcDir}\n`);
    process.exit(1);
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  const videos = entries
    .filter(entry => entry.isFile())
    .filter(entry => supported.includes(path.extname(entry.name).toLowerCase()));

  if (!videos.length) {
    console.warn(`⚠️  No video files found in _original/videos/`);
    console.log(`   Supported formats: ${supported.join(', ')}\n`);
    return;
  }

  console.log(`📂 Found ${videos.length} video(s):`);
  videos.forEach(entry => {
    console.log(`   • ${entry.name}`);
  });
  console.log('');

  let success = 0;
  let failed = 0;

  for (const entry of videos) {
    const sourcePath = path.join(srcDir, entry.name);
    const result = optimizeVideo(sourcePath);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  console.log(`\n✨ Optimization Complete`);
  console.log(`   Success: ${success} | Failed: ${failed}\n`);
}


run();
