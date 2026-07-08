#!/usr/bin/env node
import path from 'path';
import { fileURLToPath } from 'url';
import {
  allowedCommands,
  allowedMethodStatuses,
  findJsonFiles,
  loadJson,
  manifestClaimsCanonicalPipelineUse,
  provenanceContractVersion,
  requiredManifestPipelineRunFields,
  requiredRunLogFields,
  validateManifestPipelineRun,
  validateRunLogShape
} from './lib/provenance-contract.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const hard = args.includes('--hard');
const legacyOk = args.includes('--legacy-ok') || !hard;
const json = args.includes('--json');

const manifestFiles = findJsonFiles(path.join(repoRoot, 'manifests'), {
  includeManifests: true,
  includeRunLogs: false
});
const runLogFiles = findJsonFiles(repoRoot, {
  includeManifests: false,
  includeRunLogs: true
});

const results = {
  contractVersion: provenanceContractVersion,
  mode: hard ? 'hard' : 'legacy-ok',
  manifestCount: manifestFiles.length,
  runLogCount: runLogFiles.length,
  legacyPreProvenanceCount: 0,
  checkedPipelineRunCount: 0,
  checkedRunLogCount: 0,
  warnings: [],
  errors: []
};

for (const filePath of manifestFiles) {
  const rel = path.relative(repoRoot, filePath).replaceAll(path.sep, '/');
  let manifest;
  try {
    manifest = loadJson(filePath);
  } catch (error) {
    results.errors.push(`${rel}: JSON parse failed: ${error.message}`);
    continue;
  }

  const requirePipelineRun = hard || (manifest.pipelineRun ? true : false);
  const validation = validateManifestPipelineRun(manifest, { requirePipelineRun });
  if (manifest.pipelineRun) {
    results.checkedPipelineRunCount += 1;
  } else {
    results.legacyPreProvenanceCount += 1;
    if (!legacyOk && manifestClaimsCanonicalPipelineUse(manifest)) {
      results.errors.push(`${rel}: missing pipelineRun provenance in hard mode`);
    }
  }
  for (const warning of validation.warnings) {
    results.warnings.push(`${rel}: ${warning}`);
  }
  for (const error of validation.errors) {
    results.errors.push(`${rel}: ${error}`);
  }
}

for (const filePath of runLogFiles) {
  const rel = path.relative(repoRoot, filePath).replaceAll(path.sep, '/');
  let runLog;
  try {
    runLog = loadJson(filePath);
  } catch (error) {
    results.errors.push(`${rel}: JSON parse failed: ${error.message}`);
    continue;
  }
  results.checkedRunLogCount += 1;
  for (const error of validateRunLogShape(runLog)) {
    results.errors.push(`${rel}: ${error}`);
  }
}

if (json) {
  console.log(JSON.stringify(results, null, 2));
} else {
  console.log('Asset pipeline provenance validation');
  console.log(` - Contract version: ${results.contractVersion}`);
  console.log(` - Mode: ${results.mode}`);
  console.log(` - Manifests inspected: ${results.manifestCount}`);
  console.log(` - Legacy pre-H5.67 manifests: ${results.legacyPreProvenanceCount}`);
  console.log(` - Manifests with pipelineRun: ${results.checkedPipelineRunCount}`);
  console.log(` - Run logs inspected: ${results.checkedRunLogCount}`);
  console.log(` - Allowed commands: ${allowedCommands.join(', ')}`);
  console.log(` - Allowed method statuses: ${allowedMethodStatuses.join(', ')}`);
  console.log(` - Required run-log fields: ${requiredRunLogFields.length}`);
  console.log(` - Required manifest pipelineRun fields: ${requiredManifestPipelineRunFields.length}`);
  if (results.warnings.length) {
    console.log('Warnings:');
    for (const warning of results.warnings.slice(0, 20)) console.log(`   - ${warning}`);
    if (results.warnings.length > 20) console.log(`   - ... ${results.warnings.length - 20} more`);
  }
}

if (results.errors.length) {
  if (!json) {
    console.error('Errors:');
    for (const error of results.errors) console.error(`   - ${error}`);
  }
  process.exit(1);
}

if (!json) {
  console.log('✅ Asset pipeline provenance validation passed');
}

