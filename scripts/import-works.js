const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const importListPath = path.join(__dirname, '..', '_import', 'import-list.json');
const worksDataPath = path.join(__dirname, '..', 'works-data.js');
const importImagesDir = path.join(__dirname, '..', '_import', 'images');
const outputImagesDir = path.join(__dirname, '..', 'images');

const maxWidth = 1600;
const quality = 80;

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

async function optimizeImage(sourcePath, outputName) {
  const outputPath = path.join(outputImagesDir, outputName);

  try {
    await sharp(sourcePath)
      .rotate()
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality })
      .toFile(outputPath);
    return true;
  } catch (error) {
    console.error(`❌ Failed to optimize: ${path.basename(sourcePath)} -> ${error.message}`);
    return false;
  }
}

function getNextId(works) {
  const ids = works.map(w => parseInt(w.id.replace('w', '')));
  const maxId = Math.max(...ids);
  return `w${String(maxId + 1).padStart(3, '0')}`;
}

function loadWorksData() {
  const content = fs.readFileSync(worksDataPath, 'utf8');
  const match = content.match(/const works = (\[[\s\S]*?\]);/);
  if (!match) throw new Error('Could not parse works-data.js');
  return eval(match[1]);
}

function saveWorksData(works) {
  const content = fs.readFileSync(worksDataPath, 'utf8');
  const newContent = content.replace(
    /const works = (\[[\s\S]*?\]);/,
    `const works = ${JSON.stringify(works, null, 1)};`
  );
  fs.writeFileSync(worksDataPath, newContent, 'utf8');
}

async function run() {
  console.log('\n📥 Import Works Started');

  // Check directories
  if (!fs.existsSync(importImagesDir)) {
    console.error(`❌ Import images directory not found: ${importImagesDir}`);
    process.exit(1);
  }
  ensureDir(outputImagesDir);

  // Load import list
  if (!fs.existsSync(importListPath)) {
    console.error(`❌ Import list not found: ${importListPath}`);
    process.exit(1);
  }
  const importList = JSON.parse(fs.readFileSync(importListPath, 'utf8'));
  console.log(`📋 Found ${importList.length} items in import list`);

  // Load existing works
  const works = loadWorksData();
  const existingUrls = new Set(works.map(w => w.link).filter(Boolean));
  console.log(`📚 Found ${works.length} existing works`);

  let skipped = 0;
  let added = 0;
  const addedItems = [];

  for (const item of importList) {
    const { title, series, category, noteUrl, sourceImage, createdAt } = item;

    if (existingUrls.has(noteUrl)) {
      console.log(`⏭️  Skipped (already exists): ${noteUrl}`);
      skipped++;
      continue;
    }

    const sourcePath = path.join(importImagesDir, sourceImage);
    if (!fs.existsSync(sourcePath)) {
      console.error(`❌ Source image not found: ${sourceImage}`);
      continue;
    }

    // Generate output name
    const sanitized = sanitizeName(title.replace(/[《》]/g, ''));
    const outputName = `${sanitized}.webp`;

    // Optimize image
    const success = await optimizeImage(sourcePath, outputName);
    if (!success) continue;

    console.log(`✅ Optimized: ${sourceImage} -> ${outputName}`);

    // Add to works
    const newWork = {
      id: getNextId(works),
      title: `《${title}》`,
      category: category || 'illustration',
      aspectRatio: '3/4', // default
      thumbnail: `images/${outputName}`,
      tags: [],
      description: '',
      genre: series,
      description_en: '',
      description_zh: '',
      link: noteUrl
    };

    works.push(newWork);
    addedItems.push(noteUrl);
    added++;
  }

  // Save updated works
  if (added > 0) {
    saveWorksData(works);
    console.log(`💾 Added ${added} works to works-data.js`);
  }

  console.log('\n📊 Summary:');
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Added: ${added}`);
  if (addedItems.length > 0) {
    console.log('   Added URLs:');
    addedItems.forEach(url => console.log(`     • ${url}`));
  }

  console.log('\n✨ Import Complete');
}

run().catch(console.error);