#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../..');
const pantryPath = path.join(repoRoot, 'manifests/academy/visual-pantry/academy.visual-asset-pantry-index.json');
const outputPath = path.join(repoRoot, 'tools/glyphforge/registry/glyphforge-visual-registry.v0.1.json');

const knownToolModes = new Set([
  'dashboard-launcher',
  'flipbook-viewer',
  'region-asset-browser',
  'scene-composition-editor',
  'particle-fx-viewer',
  'audio-viewer-placeholder'
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function existsRelative(relativePath) {
  if (!relativePath || typeof relativePath !== 'string') return false;
  if (relativePath.startsWith('C:/') || relativePath.startsWith('C:\\')) return fs.existsSync(relativePath);
  return fs.existsSync(path.join(repoRoot, relativePath));
}

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function slug(value) {
  return String(value || 'unknown')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'unknown';
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function routeToolMode(asset) {
  const manifest = String(asset.manifest || '');
  const assetType = String(asset.assetType || '');
  const target = String(asset.toolingTarget || '');

  if (target.includes('flipbook') || assetType.includes('animation') || manifest.includes('animations')) {
    return 'flipbook-viewer';
  }

  if (assetType.includes('scene-anchor') || assetType.includes('background') || manifest.includes('scene-anchors')) {
    return 'scene-composition-editor';
  }

  if (assetType.includes('fx') || assetType.includes('particle') || target.includes('particle')) {
    return 'particle-fx-viewer';
  }

  if (assetType.includes('audio') || target.includes('audio') || target.includes('sound')) {
    return 'audio-viewer-placeholder';
  }

  return 'region-asset-browser';
}

function deriveCounts(asset, manifestJson) {
  const counts = {};
  const numericFields = [
    'regionsTotal',
    'acceptedRegions',
    'regionsOrAnchors',
    'animationGroups',
    'sheetsTotal'
  ];

  for (const field of numericFields) {
    if (asset[field] !== undefined) counts[field] = asset[field];
  }

  if (Array.isArray(asset.deniedRegions)) counts.deniedRegions = asset.deniedRegions.length;
  if (Array.isArray(asset.deferredRegions)) counts.deferredRegions = asset.deferredRegions.length;
  if (Array.isArray(asset.effectExcludedRegions)) counts.effectExcludedRegions = asset.effectExcludedRegions.length;
  if (Array.isArray(asset.productExcludedRegions)) counts.productExcludedRegions = asset.productExcludedRegions.length;
  if (Array.isArray(asset.blankReferenceCells)) counts.blankReferenceCells = asset.blankReferenceCells.length;
  if (Array.isArray(asset.retainedPartialContentCells)) counts.retainedPartialContentCells = asset.retainedPartialContentCells.length;

  if (manifestJson) {
    if (Array.isArray(manifestJson.regions)) counts.manifestRegions = manifestJson.regions.length;
    if (Array.isArray(manifestJson.animations)) counts.manifestAnimations = manifestJson.animations.length;
    if (Array.isArray(manifestJson.anchors)) counts.manifestAnchors = manifestJson.anchors.length;
    if (Array.isArray(manifestJson.compositions)) counts.manifestCompositions = manifestJson.compositions.length;
  }

  return counts;
}

function extractEvidencePaths(manifestJson) {
  const evidence = manifestJson?.evidence;
  if (!evidence) return [];
  if (Array.isArray(evidence)) return evidence.filter(Boolean);
  if (typeof evidence === 'string') return [evidence];
  if (typeof evidence === 'object') {
    return Object.values(evidence)
      .flatMap((value) => Array.isArray(value) ? value : [value])
      .filter((value) => typeof value === 'string');
  }
  return [];
}

function makeEntry({ sourceGroup, gameSlug, gameTitle, asset, index }) {
  const manifestPath = asset.manifest || asset.manifests?.[0] || null;
  let manifestJson = null;
  const warnings = [];

  if (manifestPath && existsRelative(manifestPath)) {
    try {
      manifestJson = readJson(path.join(repoRoot, manifestPath));
    } catch (error) {
      warnings.push(`Manifest exists but could not be parsed: ${error.message}`);
    }
  } else if (manifestPath) {
    warnings.push(`Manifest path not found: ${manifestPath}`);
  } else if (Array.isArray(asset.manifests)) {
    warnings.push('Entry references multiple manifests; using grouped summary route.');
  } else {
    warnings.push('No manifest path recorded in pantry asset.');
  }

  const toolMode = routeToolMode(asset);
  if (!knownToolModes.has(toolMode)) warnings.push(`Unknown toolMode route: ${toolMode}`);

  const runtimeEligibility = asset.runtimeEligibility || manifestJson?.runtimeEligibility || 'not-runtime-approved';
  const reviewStatus = asset.reviewStatus || manifestJson?.reviewStatus || 'needs-human-review';
  const pipelineUse = asset.pipelineUse || manifestJson?.pipelineUse || 'pantry-index-reference';
  const status = asset.status || manifestJson?.status || 'unknown';
  const evidencePaths = extractEvidencePaths(manifestJson);

  if (asset.cleanupDecision === 'deferred' || status.includes('deferred')) warnings.push('Deferred or reference-only asset; do not treat as runtime-ready.');
  if (runtimeEligibility !== 'not-runtime-approved') warnings.push(`Nonstandard runtimeEligibility from source record: ${runtimeEligibility}`);
  if (asset.futurePantryOnly) warnings.push('Future pantry only.');
  if (asset.historical || asset.assetType?.includes('historical')) warnings.push('Historical/fallback record.');
  if (Array.isArray(asset.deniedRegions) && asset.deniedRegions.length) warnings.push(`${asset.deniedRegions.length} denied regions recorded.`);
  if (Array.isArray(asset.deferredRegions) && asset.deferredRegions.length) warnings.push(`${asset.deferredRegions.length} deferred regions recorded.`);
  if (Array.isArray(asset.effectExcludedRegions) && asset.effectExcludedRegions.length) warnings.push(`${asset.effectExcludedRegions.length} effect/glow/fire regions excluded.`);
  if (Array.isArray(asset.productExcludedRegions) && asset.productExcludedRegions.length) warnings.push(`${asset.productExcludedRegions.length} product-excluded regions recorded.`);

  return {
    entryId: `${slug(gameSlug || sourceGroup)}.${slug(asset.assetType || manifestPath || 'asset')}.${index + 1}`,
    displayName: `${gameTitle || gameSlug || sourceGroup} — ${asset.assetType || 'Asset'}`,
    gameSlug: gameSlug || null,
    domain: gameSlug || sourceGroup,
    assetFamily: asset.assetType || 'unknown',
    toolMode,
    manifestPath,
    manifestPaths: asset.manifests || (manifestPath ? [manifestPath] : []),
    sourcePath: asset.source || manifestJson?.sourceSheet || manifestJson?.sourceBackground || null,
    derivedPath: asset.derived || manifestJson?.derivedSheet || null,
    evidencePaths,
    status,
    reviewStatus,
    pipelineUse,
    runtimeEligibility,
    counts: deriveCounts(asset, manifestJson),
    warnings,
    deniedRegions: asArray(asset.deniedRegions).concat(asArray(asset.productExcludedRegions), asArray(asset.effectExcludedRegions)),
    deferredRegions: asArray(asset.deferredRegions),
    futurePantryOnly: Boolean(asset.futurePantryOnly || asset.status === 'future-pantry-only'),
    historical: Boolean(asset.historical || asset.assetType?.includes('historical')),
    notes: asArray(asset.notes || asset.policy || asset.assetReadinessSummary),
    sourceRecord: {
      sourceGroup,
      gameTitle: gameTitle || null,
      assetType: asset.assetType || null,
      toolingTarget: asset.toolingTarget || null
    }
  };
}

function buildRegistry() {
  const pantry = readJson(pantryPath);
  const entries = [];

  for (const group of pantry.gameAssetGroups || []) {
    for (const [index, asset] of (group.assets || []).entries()) {
      entries.push(makeEntry({
        sourceGroup: 'gameAssetGroups',
        gameSlug: group.gameSlug,
        gameTitle: group.gameTitle,
        asset,
        index
      }));
    }
  }

  for (const [index, asset] of (pantry.sharedAssetGroups || []).entries()) {
    entries.push(makeEntry({
      sourceGroup: 'sharedAssetGroups',
      gameSlug: 'shared',
      gameTitle: 'Shared Assets',
      asset,
      index
    }));
  }

  for (const [index, asset] of (pantry.creatureAssetGroups || []).entries()) {
    entries.push(makeEntry({
      sourceGroup: 'creatureAssetGroups',
      gameSlug: 'creatures',
      gameTitle: 'Creature Assets',
      asset,
      index
    }));
  }

  const registry = {
    schemaVersion: '0.1',
    registryId: 'glyphforge-visual-registry.v0.1',
    generatedAt: new Date().toISOString(),
    generator: 'tools/glyphforge/registry/generate-glyphforge-visual-registry.mjs',
    sourceOfTruth: 'manifests/academy/visual-pantry/academy.visual-asset-pantry-index.json',
    sourceSha256: sha256File(pantryPath),
    status: 'draft',
    reviewStatus: 'needs-human-review',
    pipelineUse: 'glyphforge-static-viewer-registry',
    runtimeEligibility: 'not-runtime-approved',
    runtimeApprovalPolicy: 'never-infer-runtime-approval',
    knownToolModes: [...knownToolModes],
    entryCount: entries.length,
    entries
  };

  fs.writeFileSync(outputPath, `${JSON.stringify(registry, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${path.relative(repoRoot, outputPath)} with ${entries.length} entries`);
}

buildRegistry();
