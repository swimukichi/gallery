const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcDir = path.join(__dirname, '..', '_original', 'images');
const destDir = path.join(__dirname, '..', 'images');
const maxWidth = 1600;
const quality = 80;
const supported = ['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.gif'];

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

async function optimizeImage(filePath) {
  const basename = path.basename(filePath, path.extname(filePath));
  const sanitized = sanitizeName(basename);
  const outputName = `${sanitized}.webp`;
  const outputPath = path.join(destDir, outputName);

  try {
    await sharp(filePath)
      .rotate()
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality })
      .toFile(outputPath);
    console.log(`   ✅ ${path.basename(filePath)}`);
    console.log(`      → ${outputName}`);
    return true;
  } catch (error) {
    console.error(`   ❌ ${path.basename(filePath)}`);
    console.error(`      Error: ${error.message}`);
    return false;
  }
}

async function run() {
  console.log('\n📷 Image Optimization Started');
  console.log(`   Source: ${srcDir}`);
  console.log(`   Output: ${destDir}`);
  console.log(`   Format: WebP | Max Width: ${maxWidth}px | Quality: ${quality}\n`);

  ensureDir(destDir);

  if (!fs.existsSync(srcDir)) {
    console.error(`\n❌ Error: Source folder not found`);
    console.error(`   Expected path: ${srcDir}\n`);
    process.exit(1);
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  const images = entries
    .filter(entry => entry.isFile())
    .filter(entry => supported.includes(path.extname(entry.name).toLowerCase()));

  if (!images.length) {
    console.warn(`⚠️  No image files found in _original/images/`);
    console.log(`   Supported formats: ${supported.join(', ')}\n`);
    return;
  }

  console.log(`📂 Found ${images.length} image(s):`);
  images.forEach(entry => {
    console.log(`   • ${entry.name}`);
  });
  console.log('');

  let success = 0;
  let failed = 0;

  for (const entry of images) {
    const sourcePath = path.join(srcDir, entry.name);
    const result = await optimizeImage(sourcePath);
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
