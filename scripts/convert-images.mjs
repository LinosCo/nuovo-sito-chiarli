import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import path from 'path';

const FOTO_DIR = path.resolve('public/foto');

const JPG_EXTS = new Set(['.jpg', '.jpeg']);
const PNG_EXTS = new Set(['.png']);

let converted = 0;
let skipped = 0;
let totalSavedBytes = 0;

async function walkDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkDir(fullPath)));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function convertFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const webpPath = filePath.replace(/\.(jpe?g|png)$/i, '.webp');

  if (!JPG_EXTS.has(ext) && !PNG_EXTS.has(ext)) {
    return;
  }

  try {
    const originalStat = await stat(filePath);
    const originalSize = originalStat.size;

    if (PNG_EXTS.has(ext)) {
      // Lossless WebP for PNG (preserves transparency)
      await sharp(filePath)
        .webp({ lossless: true })
        .toFile(webpPath);
    } else {
      // High-quality WebP for JPG/JPEG (82 is the sweet spot: visually indistinguishable, actual size savings)
      await sharp(filePath)
        .webp({ quality: 82 })
        .toFile(webpPath);
    }

    const newStat = await stat(webpPath);
    const saved = originalSize - newStat.size;
    totalSavedBytes += saved;
    const pct = ((saved / originalSize) * 100).toFixed(1);

    console.log(
      `✓ ${path.relative(FOTO_DIR, filePath)} → .webp (${formatBytes(originalSize)} → ${formatBytes(newStat.size)}, -${pct}%)`
    );
    converted++;
  } catch (err) {
    console.error(`✗ ${path.relative(FOTO_DIR, filePath)}: ${err.message}`);
    skipped++;
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
  return (bytes / (1024 * 1024)).toFixed(2) + 'MB';
}

async function main() {
  console.log(`\nScanning ${FOTO_DIR}...\n`);

  const allFiles = await walkDir(FOTO_DIR);
  const imagesToConvert = allFiles.filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return JPG_EXTS.has(ext) || PNG_EXTS.has(ext);
  });

  console.log(`Found ${imagesToConvert.length} images to convert.\n`);

  for (const file of imagesToConvert) {
    await convertFile(file);
  }

  console.log(`\n--- Summary ---`);
  console.log(`Converted: ${converted}`);
  console.log(`Skipped:   ${skipped}`);
  console.log(`Total saved: ${formatBytes(totalSavedBytes)}`);
}

main();
