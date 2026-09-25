#!/usr/bin/env node
// 文字ベースの縦動画（1080x1920）を台本JSONから作る
//
// 使い方:
//   node scripts/text-video.js content/text-videos/zukan-persephone.json
//   npm run text-video -- content/text-videos/zukan-persephone.json
//
// 台本JSONの形式は content/text-videos/_sample-zukan.json を参照
// background には画像（Higgsfield の 9:16 背景画など）か動画（Higgsfield の動くカット）を指定できる
//   画像: motion "zoom"（既定）でゆっくり寄る / "none" で静止
//   動画: 尺が足りなければループし、スライドをまたいで続きから再生する
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

const VIDEO_EXT = /\.(mp4|mov|webm|m4v)$/i;

function run(args) {
  execFileSync(ffmpegPath, ['-y', '-loglevel', 'error', ...args]);
}

// ffmpeg -i の出力から動画の長さ（秒）を読む
function videoLength(file) {
  let out = '';
  try {
    execFileSync(ffmpegPath, ['-i', file], { stdio: 'pipe' });
  } catch (e) {
    out = String(e.stderr || '');
  }
  const m = out.match(/Duration: (\d+):(\d+):([\d.]+)/);
  return m ? Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) : 0;
}

// 背景を用意する。戻り値 { type: 'image' | 'video', file, length }
async function prepareBackground(style, bgPath, work, key, blur) {
  const shade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="${style.bg}" fill-opacity="${style.dim}"/></svg>`);
  const file = path.join(work, `bg${key}.png`);
  const abs = bgPath && path.resolve(ROOT, bgPath);

  if (abs && fs.existsSync(abs) && VIDEO_EXT.test(abs)) {
    return { type: 'video', file: abs, length: videoLength(abs) };
  }
  if (abs && fs.existsSync(abs)) {
    let img = sharp(abs).resize(W, H, { fit: 'cover' });
    if (blur > 0) img = img.blur(blur);
    await sharp(await img.toBuffer()).composite([{ input: shade }]).png().toFile(file);
    return { type: 'image', file };
  }
  if (bgPath) console.warn(`背景が見つかりません: ${bgPath}（単色で続行）`);
  await sharp({ create: { width: W, height: H, channels: 4, background: style.bg } }).png().toFile(file);
  return { type: 'solid', file };
}

function duration(slide, style) {
  if (slide.duration) return slide.duration;
  const chars = [...String(slide.text || '')].length;
  return Math.min(7, Math.max(2.5, chars * style.secPerChar + 1));
}

function hex(c) {
  return '0x' + c.replace('#', '');
}

// 1枚分の動画を作る：背景（画像のズーム or 動画）＋文字の重ね＋フェード
function renderSegment({ bg, textPng, d, offset, motion, style, blur, out }) {
  const frames = Math.round(d * FPS);
  const fades = `fade=t=in:st=0:d=${FADE},fade=t=out:st=${(d - FADE).toFixed(2)}:d=${FADE}`;
  let inputs;
  let bgChain;

  if (bg.type === 'video') {
    const start = bg.length > 0 ? offset % bg.length : 0;
    inputs = ['-stream_loop', '-1', '-ss', start.toFixed(2), '-i', bg.file];
    bgChain = `[0:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},fps=${FPS}` +
      (blur > 0 ? `,boxblur=${Math.max(1, Math.round(blur / 2))}` : '') +
      `,drawbox=x=0:y=0:w=iw:h=ih:color=${hex(style.bg)}@${style.dim}:t=fill,setsar=1[bg]`;
  } else if (bg.type === 'image' && motion !== 'none') {
    inputs = ['-i', bg.file];
    // 2倍に拡大してから寄ると、ズームのガタつきが出にくい
    bgChain = `[0:v]scale=${W * 2}:${H * 2},zoompan=z='1+0.08*on/${frames}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=${W}x${H}:fps=${FPS},setsar=1[bg]`;
  } else {
    inputs = ['-loop', '1', '-i', bg.file];
    bgChain = `[0:v]fps=${FPS},setsar=1[bg]`;
  }

  run([
    ...inputs, '-loop', '1', '-i', textPng,
    '-filter_complex', `${bgChain};[bg][1:v]overlay=0:0:shortest=0,${fades},format=yuv420p[v]`,
    '-map', '[v]', '-t', String(d), '-an',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', out,
  ]);
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
  let clock = 0;
  for (let i = 0; i < slides.length; i++) {
    const s = slides[i];
    const bgKey = s.background !== undefined ? s.background : script.background;
    const blur = s.bgBlur ?? script.bgBlur ?? 4;
    const cacheKey = `${bgKey}|${blur}`;
    if (!(cacheKey in bgCache)) {
      bgCache[cacheKey] = await prepareBackground(style, bgKey, work, Object.keys(bgCache).length, blur);
    }
    const bg = bgCache[cacheKey];

    const textPng = path.join(work, `t${i}.png`);
    await sharp(Buffer.from(slideSvg(s, style, script, i, slides.length))).png().toFile(textPng);

    const d = duration(s, style);
    const seg = path.join(work, `s${i}.mp4`);
    renderSegment({ bg, textPng, d, offset: clock, motion: s.motion || script.motion || 'zoom', style, blur, out: seg });
    segs.push(seg);
    clock += d;
    console.log(`  スライド ${i + 1}/${slides.length}（${d.toFixed(1)}秒・背景: ${bg.type}）`);
  }

  const list = path.join(work, 'list.txt');
  fs.writeFileSync(list, segs.map((s) => `file '${s.replace(/\\/g, '/')}'`).join('\n'));
  const silent = path.join(work, 'joined.mp4');
  run(['-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', silent]);

  const out = path.join(outDir, `${name}.mp4`);
  const bgm = script.bgm && path.resolve(ROOT, script.bgm);
  if (bgm && fs.existsSync(bgm)) {
    run([
      '-i', silent, '-stream_loop', '-1', '-i', bgm,
      '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k',
      '-af', 'afade=t=in:d=1', '-shortest', '-movflags', '+faststart', out,
    ]);
  } else {
    run(['-i', silent, '-c', 'copy', '-movflags', '+faststart', out]);
  }
  fs.rmSync(work, { recursive: true, force: true });

  console.log(`\n完成: ${path.relative(ROOT, out)}（約${Math.round(clock)}秒）`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
