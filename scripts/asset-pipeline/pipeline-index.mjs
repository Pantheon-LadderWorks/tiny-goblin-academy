#!/usr/bin/env node
import { getLaneProfile, listLaneTypes } from './lib/asset-taxonomy.mjs';

function printProfile(type) {
  const profile = getLaneProfile(type);
  if (!profile) {
    console.error(`Unknown operational type: ${type}`);
    console.error(`Known types: ${listLaneTypes().join(', ')}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Operational type: ${profile.operationalType}`);
  console.log(`Manifest contract: ${profile.manifestContract}`);
  console.log(`Required evidence: ${profile.requiredEvidence.join(', ')}`);
  console.log(`Cleanup policy: ${profile.cleanupPolicy}`);
  console.log(`Human review gate: ${profile.humanReviewGate}`);
  console.log(`Forbidden actions: ${profile.forbiddenActions.join(', ')}`);
  console.log(`Next safe actions: ${profile.nextSafeActions.join(', ')}`);
}

const args = process.argv.slice(2);

if (args.includes('--list')) {
  console.log('Supported asset-pipeline lane profiles:');
  for (const type of listLaneTypes()) {
    console.log(`- ${type}`);
  }
  process.exit(0);
}

const typeIndex = args.indexOf('--type');
if (typeIndex !== -1 && args[typeIndex + 1]) {
  printProfile(args[typeIndex + 1]);
  process.exit(process.exitCode ?? 0);
}

console.log('Usage:');
console.log('  node scripts/asset-pipeline/pipeline-index.mjs --list');
console.log('  node scripts/asset-pipeline/pipeline-index.mjs --type ui-icon-sheet');
console.log('  node scripts/asset-pipeline/pipeline-index.mjs --type animation-sheet');
