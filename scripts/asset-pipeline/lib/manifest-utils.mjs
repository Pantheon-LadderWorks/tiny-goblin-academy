import fs from 'fs';
import path from 'path';
import { usageStates } from './asset-taxonomy.mjs';
import { readImageMetadata } from './image-metadata.mjs';
import { isRectShape, rectWithinBounds } from './rect-utils.mjs';

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export function hasRequiredTopLevelFields(manifest) {
  return ['schemaVersion', 'status', 'sourceSheet', 'domain', 'transparency', 'regions'].every((field) => Object.prototype.hasOwnProperty.call(manifest, field));
}

export function findDuplicateRegionIds(regions) {
  const seen = new Set();
  const duplicates = new Set();
  for (const region of regions) {
    if (!region?.id) continue;
    if (seen.has(region.id)) duplicates.add(region.id);
    seen.add(region.id);
  }
  return [...duplicates];
}

export function validateRegions(regions, sourceMetadata = null) {
  const errors = [];
  const ids = new Set();

  if (!Array.isArray(regions)) {
    return ['regions must be an array'];
  }

  for (const [index, region] of regions.entries()) {
    const label = region?.id ?? `region at index ${index}`;
    if (!region?.id) errors.push(`missing id for region at index ${index}`);
    if (region?.id && ids.has(region.id)) errors.push(`duplicate region id: ${region.id}`);
    if (region?.id) ids.add(region.id);
    if (!isRectShape(region?.sourceRect)) errors.push(`invalid sourceRect for ${label}`);
    if (region?.usage && !usageStates.includes(region.usage)) errors.push(`unknown usage '${region.usage}' for ${label}`);
    if (!region?.usage) errors.push(`missing usage for ${label}`);

    if (sourceMetadata?.width && sourceMetadata?.height && isRectShape(region?.sourceRect)) {
      if (!rectWithinBounds(region.sourceRect, sourceMetadata.width, sourceMetadata.height)) {
        errors.push(`sourceRect out of bounds for ${label}`);
      }
    }
  }

  return errors;
}

export function validateAssetManifest({ repoRoot, manifestPath, expectedDomain }) {
  const errors = [];
  const fullPath = path.join(repoRoot, manifestPath);

  if (!fs.existsSync(fullPath)) {
    return { manifestPath, errors: [`manifest file does not exist: ${manifestPath}`] };
  }

  let manifest;
  try {
    manifest = readJson(fullPath);
  } catch (error) {
    return { manifestPath, errors: [`JSON parse failed: ${error.message}`] };
  }

  if (!hasRequiredTopLevelFields(manifest)) {
    errors.push('missing one or more required top-level fields');
  }

  if (!['draft', 'review', 'reviewed', 'approved', 'deprecated'].includes(manifest.status)) {
    errors.push(`invalid status: ${manifest.status}`);
  }

  if (manifest.domain !== expectedDomain) {
    errors.push(`domain '${manifest.domain}' does not match expected '${expectedDomain}'`);
  }

  const sourcePath = manifest.sourceSheet ? path.join(repoRoot, manifest.sourceSheet) : null;
  const sourceMetadata = sourcePath ? readImageMetadata(sourcePath) : null;
  if (!sourcePath || !sourceMetadata.exists) {
    errors.push(`sourceSheet missing or not found: ${manifest.sourceSheet}`);
  }

  if (manifest.derivedSheet !== null && manifest.derivedSheet !== undefined) {
    const derivedPath = path.join(repoRoot, manifest.derivedSheet);
    if (!fs.existsSync(derivedPath)) {
      errors.push(`derivedSheet not found: ${manifest.derivedSheet}`);
    }
    if (manifest.status === 'approved' && String(manifest.derivedSheet).includes('preview')) {
      errors.push('approved manifests cannot point to preview-only derived sheets');
    }
  }

  if (!manifest.transparency || typeof manifest.transparency !== 'object') {
    errors.push('missing transparency metadata');
  }

  errors.push(...validateRegions(manifest.regions, sourceMetadata));

  return { manifestPath, manifest, sourceMetadata, errors };
}
