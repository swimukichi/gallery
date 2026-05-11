#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');

const args = require('minimist')(process.argv.slice(2));

// Validate required arguments
if (!args.image || !args.no || !args.title || !args.series || !args.note) {
  console.error('Usage:');
  console.error('  npm run add-work -- --image <path> --no <id> --title <title>');
  console.error('    --series <myth|plants|domestic> --note <url> [--name <name>]');
  console.error('');
  console.error('Example:');
  console.error('  npm run add-work -- --image ~/Downloads/artwork.png --no 050 \\');
  console.error('    --title "作品名" --series domestic --note "https://note.com/..."');
  process.exit(1);
}

const imagePath = path.resolve(args.image);
const workNo = String(args.no).padStart(3, '0');
const title = args.title;
const series = args.series;
const noteUrl = args.note;
const workName = args.name || args.wame || slugify(title);

const genreMap = {
  myth: 'myth',
  plants: 'plants',
  domestic: 'domestic×mutation'
};

const genre = genreMap[series];
if (!genre) {
  console.error(`❌ Invalid series: ${series}. Must be myth, plants, or domestic.`);
  process.exit(1);
}

const worksDataPath = path.join(__dirname, '..', 'works-data.js');
const imagesDir = path.join(__dirname, '..', 'images');

function slugify(text) {
  return text.toLowerCase()
    .replace(/[\s《》]/g, '-')
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
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
    `const works = ${JSON.stringify(works, null, 2)};`
  );
  fs.writeFileSync(worksDataPath, newContent, 'utf8');
}

async function optimizeImage(sourcePath, outputName) {
  const outputPath = path.join(imagesDir, outputName);
  const maxWidth = 1600;
  const quality = 80;

  try {
    const metadata = await sharp(sourcePath).metadata();
    const ratio = metadata.height / metadata.width;

    await sharp(sourcePath)
      .rotate()
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality })
      .toFile(outputPath);

    return { success: true, ratio };
  } catch (error) {
    console.error(`❌ Failed to optimize: ${error.message}`);
    return { success: false, ratio: '3/4' };
  }
}

async function run() {
  console.log('\n📥 Add Work Started');

  // Check source image
  if (!fs.existsSync(imagePath)) {
    console.error(`❌ Source image not found: ${imagePath}`);
    process.exit(1);
  }

  // Ensure output directory
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

  // Generate output filename
  const outputName = `${workName}.webp`;
  const outputPath = path.join(imagesDir, outputName);

  if (fs.existsSync(outputPath)) {
    console.error(`❌ Image already exists: ${outputPath}`);
    process.exit(1);
  }

  console.log(`📦 Optimizing: ${path.basename(imagePath)}`);
  const { success, ratio } = await optimizeImage(imagePath, outputName);
  if (!success) process.exit(1);

  console.log(`✅ Optimized: ${outputName}`);

  // Load existing works
  const works = loadWorksData();
  const nextId = getNextId(works);

  // Calculate aspect ratio
  const aspectRatio = ratio > 1 ? '4/5' : ratio < 0.8 ? '3/4' : '1/1';

  // Add new work
  const newWork = {
    id: nextId,
    title: `《${title}》`,
    category: 'illustration',
    aspectRatio,
    thumbnail: `images/${outputName}`,
    tags: [],
    description: '',
    genre,
    description_en: '',
    description_zh: '',
    link: noteUrl
  };

  works.push(newWork);
  saveWorksData(works);

  console.log(`✅ Added to works-data.js:`);
  console.log(`   ID: ${nextId}`);
  console.log(`   Title: ${newWork.title}`);
  console.log(`   Image: ${newWork.thumbnail}`);
  console.log(`   Genre: ${genre}`);
  console.log(`   Ratio: ${aspectRatio}`);

  // Git operations
  console.log(`\n🔄 Git operations...`);
  try {
    execSync('git add images/ works-data.js', { cwd: path.dirname(worksDataPath) });
    console.log('✅ Files staged');

    execSync(`git commit -m "Add work: ${title} (${nextId})"`, { cwd: path.dirname(worksDataPath) });
    console.log('✅ Committed');

    execSync('git push', { cwd: path.dirname(worksDataPath) });
    console.log('✅ Pushed to remote');
  } catch (error) {
    console.error(`⚠️  Git operation failed: ${error.message}`);
    console.log('Files have been added to works-data.js, but git push failed.');
    process.exit(1);
  }

  console.log('\n✨ Work added successfully!');
}

run().catch(console.error);
