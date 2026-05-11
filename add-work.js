#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const noteUrl = args.includes('--note') ? args[args.indexOf('--note') + 1] : null;
const magazineUrl = args.includes('--magazine') ? args[args.indexOf('--magazine') + 1] : null;

if (!noteUrl && !magazineUrl) {
  console.error('Usage:');
  console.error('  node add-work.js --note "https://note.com/xxxx/n/xxxx"');
  console.error('  node add-work.js --magazine "https://note.com/xxxx/m/xxxx"');
  process.exit(1);
}

const worksDataPath = path.join(__dirname, 'works-data.js');
const imagesDir = path.join(__dirname, 'images');

if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

// Fetch helper
const fetch = async (url) => {
  const https = require('https');
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
};

function loadWorks() {
  const content = fs.readFileSync(worksDataPath, 'utf8');
  const match = content.match(/const works = (\[[\s\S]*?\]);/);
  if (!match) throw new Error('Could not parse works-data.js');
  return eval(match[1]);
}

function saveWorks(works) {
  const content = fs.readFileSync(worksDataPath, 'utf8');
  const newContent = content.replace(/const works = (\[[\s\S]*?\]);/, `const works = ${JSON.stringify(works, null, 2)};`);
  fs.writeFileSync(worksDataPath, newContent, 'utf8');
}

function getNextId(works) {
  const ids = works
    .map(w => parseInt(String(w.id || '').replace(/^w/, ''), 10))
    .filter(Number.isFinite);
  const next = ids.length ? Math.max(...ids) + 1 : 1;
  return `w${String(next).padStart(3, '0')}`;
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[\s《》]/g, '-')
    .replace(/[^a-z0-9_-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function computeAspectRatio(width, height) {
  const ratio = height / width;
  if (ratio > 1.2) return '3/4';
  if (ratio < 0.85) return '4/5';
  return '1/1';
}

function extractTitle(html) {
  let match = html.match(/<meta property="og:title" content="([^"]+)"/);
  if (match) return match[1];
  match = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  return match ? match[1] : 'Untitled';
}

function extractImages(html) {
  const urls = new Set();
  const regex = /https?:\/\/assets\.st-note\.com\/[^"\s<>]+\.(jpg|jpeg|png|gif)/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const url = match[0];
    if (!url.includes('avatar') && !url.includes('icon') && !url.includes('profile')) {
      urls.add(url);
    }
  }
  return Array.from(urls);
}

function extractHashtags(html) {
  const hashtags = new Set();
  const regex = /#([a-zA-Z0-9ぁ-ん一-龯々ー\-_]+)/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    hashtags.add(match[1].toLowerCase());
  }
  return Array.from(hashtags);
}

function extractJapaneseName(html) {
  const match = html.match(/《([^》]+)》/);
  return match ? match[1] : null;
}

function detectSeries(title, hashtags) {
  const allText = (title + ' ' + hashtags.join(' ')).toLowerCase();
  if (allText.includes('myth') || allText.includes('北欧神話') || allText.includes('ギリシャ神話')) {
    return 'myth';
  }
  if (allText.includes('plant') || allText.includes('観葉植物')) {
    return 'plants';
  }
  return 'domestic';
}

async function downloadImage(url) {
  const https = require('https');
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function optimizeImage(buffer, outputFilename) {
  const outputPath = path.join(imagesDir, outputFilename);
  if (fs.existsSync(outputPath)) return null;

  try {
    const metadata = await sharp(buffer).metadata();
    const width = metadata.width || 1500;
    const height = metadata.height || width;
    const ratio = computeAspectRatio(width, height);

    await sharp(buffer)
      .rotate()
      .resize({ width: Math.min(width, 1500), withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);

    return { ratio, filename: outputFilename };
  } catch (error) {
    console.error(`  ❌ Optimize failed: ${error.message}`);
    return null;
  }
}

async function processNoteUrl(url) {
  console.log(`\n📝 Processing: ${url}`);

  const works = loadWorks();
  const existingLinks = new Set(works.map(w => w.link).filter(Boolean));
  if (existingLinks.has(url)) {
    console.log('  ⏭️  Already exists in works-data.js');
    return false;
  }

  try {
    const html = await fetch(url);
    const title = extractTitle(html);
    const images = extractImages(html);
    const hashtags = extractHashtags(html);
    const japaneseName = extractJapaneseName(html);
    const series = detectSeries(title, hashtags);
    const seriesMap = { myth: 'myth', plants: 'plants', domestic: 'domestic×mutation' };

    if (images.length === 0) {
      console.log('  ⚠️  No images found');
      return false;
    }

    console.log(`  📸 Found ${images.length} image(s)`);
    const imageUrl = images[0];
    console.log(`  📥 Downloading first image...`);
    const buffer = await downloadImage(imageUrl);

    const filename = `${slugify(japaneseName || title)}.webp`;
    const result = await optimizeImage(buffer, filename);
    if (!result) {
      console.log(`  ⚠️  Could not optimize image`);
      return false;
    }

    const newId = getNextId(works);
    const newWork = {
      id: newId,
      title: japaneseName ? `《${japaneseName}》` : `《${title}》`,
      category: 'illustration',
      aspectRatio: result.ratio,
      thumbnail: `images/${result.filename}`,
      tags: [],
      description: '',
      genre: seriesMap[series],
      description_en: '',
      description_zh: '',
      link: url
    };

    works.push(newWork);
    saveWorks(works);

    console.log(`  ✅ Added ${newId}: ${newWork.title}`);
    return true;
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return false;
  }
}

async function getMagazineArticles(magazineUrl) {
  try {
    const html = await fetch(magazineUrl);
    const urls = new Set();
    // 相対パスで /username/n/xxxx を抽出
    const regex = /href="(\/[^"]*\/n\/[a-z0-9]+)"/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      const relativePath = match[1];
      // https://note.com に結合
      const fullUrl = `https://note.com${relativePath}`;
      urls.add(fullUrl);
    }
    return Array.from(urls);
  } catch (error) {
    console.error(`Failed to fetch magazine: ${error.message}`);
    return [];
  }
}

(async () => {
  try {
    let added = 0;
    let urls = [];

    if (noteUrl) {
      urls = [noteUrl];
    } else if (magazineUrl) {
      console.log(`\n📚 Fetching magazine: ${magazineUrl}`);
      urls = await getMagazineArticles(magazineUrl);
      console.log(`  Found ${urls.length} article(s)`);
    }

    for (const url of urls) {
      const result = await processNoteUrl(url);
      if (result) added++;
    }

    console.log(`\n✨ Completed: added ${added} work(s)`);

    if (added > 0) {
      console.log('\n🔄 Running git commands...');
      execSync('git add .', { stdio: 'inherit' });
      execSync(`git commit -m "Add ${added} work(s) from note"`, { stdio: 'inherit' });
      execSync('git push', { stdio: 'inherit' });
      console.log('✅ Pushed');
    }
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
})();
