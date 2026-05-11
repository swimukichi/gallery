#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rootDir = path.join(__dirname, '..');
const worksDataPath = path.join(rootDir, 'works-data.js');
const imagesDir = path.join(rootDir, 'images');

if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

const fetchHtml = async (url) => {
  const https = require('https');
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        Referer: 'https://note.com/'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
};

const loadWorks = () => {
  const content = fs.readFileSync(worksDataPath, 'utf8');
  const match = content.match(/const works = (\[[\s\S]*?\]);/);
  if (!match) throw new Error('Could not parse works-data.js');
  return eval(match[1]);
};

const saveWorks = (works) => {
  const content = fs.readFileSync(worksDataPath, 'utf8');
  const newContent = content.replace(/const works = (\[[\s\S]*?\]);/, `const works = ${JSON.stringify(works, null, 2)};`);
  fs.writeFileSync(worksDataPath, newContent, 'utf8');
};

const slugify = (text) => {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[\s《》]/g, '-')
    .replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9faf\u3400-\u4dbf\u3000-\u303f_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || `image-${Date.now()}`;
};

const computeAspectRatio = (width, height) => {
  const ratio = height / width;
  if (ratio > 1.2) return '3/4';
  if (ratio < 0.85) return '4/5';
  return '1/1';
};

const extractImages = (html) => {
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
};

const downloadImage = async (url) => {
  const https = require('https');
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        Referer: 'https://note.com/'
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} when downloading image ${url}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
};

const optimizeImage = async (buffer, outputFilename) => {
  const outputPath = path.join(imagesDir, outputFilename);
  if (fs.existsSync(outputPath)) {
    return null;
  }

  try {
    const metadata = await sharp(buffer).metadata();
    const width = metadata.width || 1500;
    const height = metadata.height || width;
    await sharp(buffer)
      .rotate()
      .resize({ width: Math.min(width, 1500), withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);
    return { ratio: computeAspectRatio(width, height), filename: outputFilename };
  } catch (error) {
    console.error(`  Optimize failed: ${error.message}`);
    return null;
  }
};

const isInvalidThumbnail = (thumbnail) => {
  if (!thumbnail || !thumbnail.trim()) return true;
  return /^images\/(\.|\s|$)/.test(thumbnail);
};

const extractTitle = (html) => {
  let match = html.match(/<meta property="og:title" content="([^"]+)"/);
  if (match) return match[1];
  match = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  return match ? match[1] : 'untitled';
};

const buildFilename = (pageTitle, url, extension) => {
  const baseName = slugify(pageTitle || url.replace(/[^a-z0-9]+/gi, '-'));
  let filename = `${baseName}${extension}`;
  let suffix = 1;
  while (fs.existsSync(path.join(imagesDir, filename))) {
    filename = `${baseName}-${suffix}${extension}`;
    suffix += 1;
  }
  return filename;
};

(async () => {
  const works = loadWorks();
  const existingThumbnails = new Map();
  const byLink = new Map();

  works.forEach((work) => {
    if (work.link) {
      if (work.thumbnail && !isInvalidThumbnail(work.thumbnail)) {
        existingThumbnails.set(work.link, work.thumbnail);
      }
      if (!byLink.has(work.link)) {
        byLink.set(work.link, []);
      }
      byLink.get(work.link).push(work);
    }
  });

  const targets = works.filter((work) => isInvalidThumbnail(work.thumbnail) && work.link);
  if (targets.length === 0) {
    console.log('No empty or invalid thumbnail entries found.');
    return;
  }

  console.log(`Found ${targets.length} work(s) to repair.`);
  let fixed = 0;

  for (const work of targets) {
    console.log(`\nRepairing ${work.id} (${work.link})`);

    const existing = existingThumbnails.get(work.link);
    if (existing) {
      console.log(`  Using existing thumbnail for same link: ${existing}`);
      work.thumbnail = existing;
      fixed += 1;
      continue;
    }

    try {
      const html = await fetchHtml(work.link);
      const images = extractImages(html);
      if (images.length === 0) {
        console.warn('  No image URLs found in note page. Skipping.');
        continue;
      }

      const imageUrl = images[0];
      console.log(`  Downloading image ${imageUrl}`);
      const buffer = await downloadImage(imageUrl);

      const ext = path.extname(new URL(imageUrl).pathname).toLowerCase() || '.jpg';
      const filename = buildFilename(work.id, work.link, ext);
      const webpFilename = filename.replace(/\.[^.]+$/, '.webp');

      let result = await optimizeImage(buffer, webpFilename);
      if (!result) {
        const fallbackPath = path.join(imagesDir, filename);
        fs.writeFileSync(fallbackPath, buffer);
        work.thumbnail = `images/${filename}`;
        fixed += 1;
      } else {
        work.thumbnail = `images/${result.filename}`;
        fixed += 1;
      }

      existingThumbnails.set(work.link, work.thumbnail);
    } catch (error) {
      console.error(`  Failed to repair ${work.id}: ${error.message}`);
    }
  }

  if (fixed > 0) {
    saveWorks(works);
    console.log(`\nRepaired ${fixed} work(s) and updated works-data.js.`);
  } else {
    console.log('\nNo thumbnails were updated.');
  }
})();
