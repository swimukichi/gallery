#!/usr/bin/env node
// 文字ベースの縦動画（1080x1920）を台本JSONから作る
//
// 使い方:
//   node scripts/text-video.js content/text-videos/zukan-persephone.json
//   npm run text-video -- content/text-videos/zukan-persephone.json
//
// 台本JSONの形式は content/text-videos/_sample-zukan.json を参照
// 出力: _out/text-videos/<台本ファイル名>.mp4

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const sharp = require('sharp');
const ffmpegPath = require('ffmpeg-static');

const W = 1080;
const H = 1920;
const FPS = 30;
const FADE = 0.4;
const ROOT = path.resolve(__dirname, '..');

// シリーズごとの見た目
const STYLES = {
  zukan: {
    bg: '#0d1110',
    ink: '#e6ece8',
    sub: '#8fa39a',
    accent: '#5fbfae',
    font: "'Noto Sans JP', 'IPAGothic', 'Yu Gothic', 'Meiryo', sans-serif",
    size: 68,
    lineHeight: 1.55,
    maxUnits: 12,
    label: '神話キャラクタ侵食図鑑',
    dim: 0.62,
    secPerChar: 0.16,
  },
  novel: {
    bg: '#14110e',
    ink: '#efe6da',
    sub: '#a8998a',
    accent: '#c98a5a',
    font: "'Noto Serif JP', 'IPAMincho', 'Yu Mincho', 'IPAGothic', serif",
    size: 56,
    lineHeight: 1.8,
    maxUnits: 15,
    label: '',
    dim: 0.72,
    secPerChar: 0.2,
  },
};

const NO_LINE_START = '、。，．・：；？！ー）」』】〉》”’…ぁぃぅぇぉっゃゅょァィゥェォッャュョ';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// 全角=1、半角=0.55 として行を折り返す。\n は強制改行
function wrap(text, maxUnits) {
  const lines = [];
  for (const para of String(text).split('\n')) {
    let line = '';
    let units = 0;
    for (const ch of para) {
      const u = /[\x20-\x7e]/.test(ch) ? 0.55 : 1;
      if (units + u > maxUnits && line && !NO_LINE_START.includes(ch)) {
        lines.push(line);
        line = '';
        units = 0;
      }
      line += ch;
      units += u;
    }
    lines.push(line);
  }
  return lines;
}

function slideSvg(slide, style, meta, index, total) {
  const size = slide.size || style.size;
  const lines = wrap(slide.text || '', style.maxUnits * (style.size / size));
  const lh = size * style.lineHeight;
  const blockH = lines.length * lh;
  const startY = H / 2 - blockH / 2 + size * 0.8;
  const anchor = slide.align === 'left' ? 'start' : 'middle';
  const x = anchor === 'start' ? 110 : W / 2;

  const body = lines
    .map((l, i) => `<text x="${x}" y="${startY + i * lh}" text-anchor="${anchor}" font-size="${size}" fill="${style.ink}" font-weight="${slide.bold ? 700 : 500}">${esc(l)}</text>`)
    .join('');

  const sub = slide.sub
    ? `<text x="${W / 2}" y="${startY + blockH + 60}" text-anchor="middle" font-size="36" fill="${style.sub}">${esc(slide.sub)}</text>`
    : '';

  const label = style.label || meta.label
    ? `<text x="${W / 2}" y="250" text-anchor="middle" font-size="32" letter-spacing="6" fill="${style.accent}">${esc(meta.label || style.label)}</text>
       <line x1="${W / 2 - 60}" y1="285" x2="${W / 2 + 60}" y2="285" stroke="${style.accent}" stroke-width="3"/>`
    : '';

  // 下部はTikTok/ReelsのUIに隠れるので、フッターは下から420pxより上に置く
  const footer = `<text x="${W / 2}" y="${H - 420}" text-anchor="middle" font-size="30" fill="${style.sub}">${esc(meta.footer || '')}</text>
    <text x="${W - 90}" y="200" text-anchor="end" font-size="26" fill="${style.sub}">${index + 1}/${total}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="${style.font}">${label}${body}${sub}${footer}</svg>`;
}

async function background(style, bgPath) {
  const base = sharp({ create: { width: W, height: H, channels: 4, background: style.bg } });
  if (!bgPath) return base.png().toBuffer();
  const abs = path.resolve(ROOT, bgPath);
  if (!fs.existsSync(abs)) {
    console.warn(`背景画像が見つかりません: ${bgPath}（単色で続行）`);
    return base.png().toBuffer();
  }
  const img = await sharp(abs).resize(W, H, { fit: 'cover' }).blur(6).toBuffer();
  const shade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="${style.bg}" fill-opacity="${style.dim}"/></svg>`);
  return sharp(img).composite([{ input: shade }]).png().toBuffer();
}

function duration(slide, style) {
  if (slide.duration) return slide.duration;
  const chars = [...String(slide.text || '')].length;
  return Math.min(7, Math.max(2.5, chars * style.secPerChar + 1));
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('台本JSONを指定してください: node scripts/text-video.js content/text-videos/xxx.json');
    process.exit(1);
  }
  const script = JSON.parse(fs.readFileSync(file, 'utf8'));
  const style = { ...STYLES[script.style || 'zukan'], ...(script.styleOverrides || {}) };
  const slides = script.slides || [];
  if (!slides.length) throw new Error('slides が空です');

  const name = path.basename(file, '.json');
  const outDir = path.join(ROOT, '_out', 'text-videos');
  const work = path.join(outDir, `.${name}`);
  fs.mkdirSync(work, { recursive: true });

  const bgCache = {};
  const segs = [];
  for (let i = 0; i < slides.length; i++) {
    const s = slides[i];
    const bgKey = s.background !== undefined ? s.background : script.background;
    if (!(bgKey in bgCache)) bgCache[bgKey] = await background(style, bgKey);
    const png = path.join(work, `s${i}.png`);
    await sharp(bgCache[bgKey])
      .composite([{ input: Buffer.from(slideSvg(s, style, script, i, slides.length)) }])
      .png()
      .toFile(png);

    const d = duration(s, style);
    const seg = path.join(work, `s${i}.mp4`);
    execFileSync(ffmpegPath, [
      '-y', '-loglevel', 'error', '-loop', '1', '-t', String(d), '-i', png,
      '-vf', `fps=${FPS},fade=t=in:st=0:d=${FADE},fade=t=out:st=${(d - FADE).toFixed(2)}:d=${FADE},format=yuv420p`,
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', seg,
    ]);
    segs.push(seg);
    console.log(`  スライド ${i + 1}/${slides.length}（${d.toFixed(1)}秒）`);
  }

  const list = path.join(work, 'list.txt');
  fs.writeFileSync(list, segs.map((s) => `file '${s}'`).join('\n'));
  const silent = path.join(work, 'joined.mp4');
  execFileSync(ffmpegPath, ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', silent]);

  const out = path.join(outDir, `${name}.mp4`);
  const bgm = script.bgm && path.resolve(ROOT, script.bgm);
  if (bgm && fs.existsSync(bgm)) {
    execFileSync(ffmpegPath, [
      '-y', '-loglevel', 'error', '-i', silent, '-stream_loop', '-1', '-i', bgm,
      '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k',
      '-af', 'afade=t=in:d=1', '-shortest', '-movflags', '+faststart', out,
    ]);
  } else {
    execFileSync(ffmpegPath, ['-y', '-loglevel', 'error', '-i', silent, '-c', 'copy', '-movflags', '+faststart', out]);
  }
  fs.rmSync(work, { recursive: true, force: true });

  const total = slides.reduce((a, s) => a + duration(s, style), 0);
  console.log(`\n完成: ${path.relative(ROOT, out)}（約${Math.round(total)}秒）`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
