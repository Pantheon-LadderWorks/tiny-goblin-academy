import fs from 'fs';
import path from 'path';

const MANIFEST_PATH = path.resolve('manifests/hub.icon-regions.json');
const ACADEMY_MANIFEST_PATH = path.resolve('manifests/academy.games.json');

async function run() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`❌ Manifest not found at ${MANIFEST_PATH}`);
    process.exit(1);
  }

  if (!fs.existsSync(ACADEMY_MANIFEST_PATH)) {
    console.error(`❌ Academy manifest not found at ${ACADEMY_MANIFEST_PATH}`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  const academyGames = JSON.parse(fs.readFileSync(ACADEMY_MANIFEST_PATH, 'utf-8'));

  const imagePath = path.resolve(manifest.sheet.imagePath);
  if (!fs.existsSync(imagePath)) {
    console.error(`❌ Sheet image not found at ${imagePath}`);
    process.exit(1);
  }

  if (manifest.derivedSheet) {
    const derivedImagePath = path.resolve(manifest.derivedSheet.imagePath);
    if (!fs.existsSync(derivedImagePath)) {
      console.error(`❌ Derived sheet image not found at ${derivedImagePath}`);
      process.exit(1);
    }
  }

  // Dimensions
  const width = manifest.sheet.width;
  const height = manifest.sheet.height;
  if (width !== 768 || height !== 1376) {
    console.error(`❌ Unexpected sheet dimensions: ${width}x${height}`);
    process.exit(1);
  }

  const regions = manifest.regions;
  const regionIds = new Set();
  const academyGameIds = new Set(academyGames.games.map(g => g.id));

  for (const region of regions) {
    if (regionIds.has(region.gameId)) {
      console.error(`❌ Duplicate gameId mapped: ${region.gameId}`);
      process.exit(1);
    }
    regionIds.add(region.gameId);

    const { x, y, w, h } = region.sourceRect;
    if (x < 0 || y < 0 || w <= 0 || h <= 0) {
      console.error(`❌ Invalid rect dimensions for ${region.gameId}: ${JSON.stringify(region.sourceRect)}`);
      process.exit(1);
    }

    if (x + w > width || y + h > height) {
      console.error(`❌ Source rect out of bounds for ${region.gameId}`);
      process.exit(1);
    }
  }

  // Check all 10 academy games are mapped
  for (const gameId of academyGameIds) {
    if (!regionIds.has(gameId)) {
      console.error(`❌ Missing region mapping for academy game ${gameId}`);
      process.exit(1);
    }
  }

  console.log(`✅ Hub Icon Regions validation passed`);
  console.log(` - Sheet: ${manifest.sheet.imagePath}`);
  console.log(` - Dimensions: ${width}x${height}`);
  console.log(` - Mapped Regions: ${regions.length}`);
}

run().catch(err => {
  console.error('Validation error:', err);
  process.exit(1);
});
