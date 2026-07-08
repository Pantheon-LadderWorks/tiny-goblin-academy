#!/usr/bin/env node
import { spawnSync } from 'child_process';

const args = process.argv.slice(2);

if (args.includes('--list')) {
  const result = spawnSync('node', ['scripts/asset-pipeline/cli.mjs', 'list-lanes'], { stdio: 'inherit' });
  process.exit(result.status ?? 1);
}

const typeIndex = args.indexOf('--type');
if (typeIndex !== -1 && args[typeIndex + 1]) {
  const result = spawnSync('node', ['scripts/asset-pipeline/cli.mjs', 'profile', '--type', args[typeIndex + 1]], { stdio: 'inherit' });
  process.exit(result.status ?? 1);
}

console.log('Usage:');
console.log('  node scripts/asset-pipeline/pipeline-index.mjs --list');
console.log('  node scripts/asset-pipeline/pipeline-index.mjs --type ui-icon-sheet');
console.log('  node scripts/asset-pipeline/pipeline-index.mjs --type animation-sheet');
console.log('');
console.log('Note: pipeline-index is a compatibility wrapper. Canonical command surface:');
console.log('  node scripts/asset-pipeline/cli.mjs --help');
