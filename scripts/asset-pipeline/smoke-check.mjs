#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getLaneProfile, operationalAssetTypes } from './lib/asset-taxonomy.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const requiredLaneFiles = [
  'ui-icon-sheet.mjs',
  'hub-icon-sheet.mjs',
  'static-prop-sheet.mjs',
  'fx-sheet.mjs',
  'tile-terrain-sheet.mjs',
  'scene-anchor-background.mjs',
  'animation-sheet.mjs'
];

const requiredTypes = [
  'ui-icon-sheet',
  'hub-icon-sheet',
  'static-prop-sheet',
  'fx-sheet',
  'tile-sheet',
  'terrain-sheet',
  'character-animation-sheet'
];

let hasErrors = false;

for (const type of requiredTypes) {
  if (!operationalAssetTypes.includes(type)) {
    console.error(`❌ Missing taxonomy type: ${type}`);
    hasErrors = true;
  }
}

for (const type of ['ui-icon-sheet', 'fx-sheet', 'animation-sheet', 'character-animation-sheet', 'tile-sheet']) {
  if (!getLaneProfile(type)) {
    console.error(`❌ Missing lane profile: ${type}`);
    hasErrors = true;
  }
}

for (const file of requiredLaneFiles) {
  const fullPath = path.join(repoRoot, 'scripts/asset-pipeline/lanes', file);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing lane script: ${file}`);
    hasErrors = true;
  }
}

for (const file of [
  'scripts/asset-pipeline/cli.mjs',
  'scripts/asset-pipeline/pipeline-index.mjs',
  'scripts/asset-pipeline/make-region-evidence.py',
  'scripts/asset-pipeline/lib/cleanup-method-registry.mjs',
  'scripts/asset-pipeline/lib/run-log.mjs',
  'scripts/asset-pipeline/lib/file-hash.mjs',
  'scripts/validate-academy-asset-manifests.mjs',
  'manifests/hub.icon-regions.json',
  'scripts/clean-fake-transparent-sheet.py'
]) {
  if (!fs.existsSync(path.join(repoRoot, file))) {
    console.error(`❌ Missing required script reference: ${file}`);
    hasErrors = true;
  }
}

if (hasErrors) {
  process.exit(1);
}

console.log('✅ Asset pipeline smoke check passed');
console.log(` - Taxonomy operational types: ${operationalAssetTypes.length}`);
console.log(` - Lane scripts: ${requiredLaneFiles.length}`);
console.log(' - Canonical CLI found');
console.log(' - Cleanup method registry found');
console.log(' - Run log helper found');
console.log(' - Cleanup script reference found');
console.log(' - Region evidence generator found');
console.log(' - Hub icon source-region manifest reference found');
