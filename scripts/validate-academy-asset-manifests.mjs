#!/usr/bin/env node
import path from 'path';
import { validateAssetManifest } from './asset-pipeline/lib/manifest-utils.mjs';

const repoRoot = process.cwd();

const manifestSpecs = [
  { path: 'manifests/academy.shared-core.regions.json', domain: 'shared-core' },
  { path: 'manifests/academy.shared-fx.regions.json', domain: 'shared-fx' },
  { path: 'manifests/academy.ui-hud.regions.json', domain: 'ui-hud' },
  { path: 'manifests/academy.goblin-expression-action.regions.json', domain: 'goblin-expression-action' },
  { path: 'manifests/academy.pet-campfire.static-props-icons.regions.json', domain: 'pet-campfire-static-props-icons' }
];

let hasErrors = false;

console.log('Validating academy asset manifests...');

for (const spec of manifestSpecs) {
  const result = validateAssetManifest({
    repoRoot,
    manifestPath: spec.path,
    expectedDomain: spec.domain
  });

  if (result.errors.length > 0) {
    hasErrors = true;
    console.error(`❌ ${spec.path}`);
    for (const error of result.errors) {
      console.error(`   - ${error}`);
    }
    continue;
  }

  const dims = result.sourceMetadata?.width && result.sourceMetadata?.height
    ? `${result.sourceMetadata.width}x${result.sourceMetadata.height}`
    : 'dimensions unknown';
  console.log(`✅ ${spec.path}`);
  console.log(`   - Domain: ${result.manifest.domain}`);
  console.log(`   - Status: ${result.manifest.status}`);
  console.log(`   - Source: ${result.manifest.sourceSheet} (${dims})`);
  console.log(`   - Regions: ${result.manifest.regions.length}`);
}

if (hasErrors) {
  process.exit(1);
}

console.log('✅ Academy asset manifest validation passed');
