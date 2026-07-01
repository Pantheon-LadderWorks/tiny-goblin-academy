#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { readImageMetadata } from './asset-pipeline/lib/image-metadata.mjs';

const repoRoot = process.cwd();

const manifestSpecs = [
  {
    path: 'manifests/academy.platformer-goblin-player.animations.json',
    domain: 'platformer-goblin-player',
    operationalType: 'character-animation-sheet'
  }
];

const allowedStatuses = new Set(['draft', 'review', 'approved', 'deprecated']);

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validateSourceRect(rect, frameLabel, sourceMetadata) {
  const errors = [];
  if (!isObject(rect)) {
    return [`${frameLabel} sourceRect must be an object.`];
  }

  for (const key of ['x', 'y', 'w', 'h']) {
    if (typeof rect[key] !== 'number' || !Number.isFinite(rect[key])) {
      errors.push(`${frameLabel} sourceRect.${key} must be a finite number.`);
    }
  }

  if (errors.length > 0) {
    return errors;
  }

  if (rect.w <= 0 || rect.h <= 0) {
    errors.push(`${frameLabel} sourceRect must have positive width/height.`);
  }

  if (
    rect.x < 0 ||
    rect.y < 0 ||
    rect.x + rect.w > sourceMetadata.width ||
    rect.y + rect.h > sourceMetadata.height
  ) {
    errors.push(`${frameLabel} sourceRect is out of source sheet bounds.`);
  }

  return errors;
}

function validateManifest(spec) {
  const errors = [];
  const manifestPath = path.join(repoRoot, spec.path);

  if (!fs.existsSync(manifestPath)) {
    return { errors: [`Manifest not found: ${spec.path}`] };
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    return { errors: [`Manifest JSON parse failed: ${error.message}`] };
  }

  if (!manifest.schemaVersion) {
    errors.push('schemaVersion is required.');
  }

  if (!allowedStatuses.has(manifest.status)) {
    errors.push(`status must be one of: ${Array.from(allowedStatuses).join(', ')}.`);
  }

  if (manifest.status === 'approved' && (!Array.isArray(manifest.animations) || manifest.animations.length === 0)) {
    errors.push('empty animation manifests cannot be approved.');
  }

  if (manifest.domain !== spec.domain) {
    errors.push(`domain must be ${spec.domain}.`);
  }

  if (manifest.operationalType !== spec.operationalType) {
    errors.push(`operationalType must be ${spec.operationalType}.`);
  }

  if (!manifest.sourceSheet || typeof manifest.sourceSheet !== 'string') {
    errors.push('sourceSheet is required.');
  }

  if (!Array.isArray(manifest.animations)) {
    errors.push('animations must be an array.');
  }

  let sourceMetadata = null;
  if (manifest.sourceSheet && typeof manifest.sourceSheet === 'string') {
    const sourcePath = path.join(repoRoot, manifest.sourceSheet);
    if (!fs.existsSync(sourcePath)) {
      errors.push(`sourceSheet does not exist: ${manifest.sourceSheet}`);
    } else {
      sourceMetadata = readImageMetadata(sourcePath);
      if (!sourceMetadata.width || !sourceMetadata.height) {
        errors.push(`sourceSheet metadata unavailable: ${manifest.sourceSheet}`);
      }
    }
  }

  if (Array.isArray(manifest.animations)) {
    const seenAnimationIds = new Set();
    for (const [animationIndex, animation] of manifest.animations.entries()) {
      const animationLabel = `animations[${animationIndex}]`;
      if (!isObject(animation)) {
        errors.push(`${animationLabel} must be an object.`);
        continue;
      }

      if (!animation.id || typeof animation.id !== 'string') {
        errors.push(`${animationLabel}.id is required.`);
      } else if (seenAnimationIds.has(animation.id)) {
        errors.push(`duplicate animation id: ${animation.id}`);
      } else {
        seenAnimationIds.add(animation.id);
      }

      if (!Array.isArray(animation.frames)) {
        errors.push(`${animationLabel}.frames must be an array.`);
        continue;
      }

      for (const [frameIndex, frame] of animation.frames.entries()) {
        const frameLabel = `${animation.id || animationLabel}.frames[${frameIndex}]`;
        if (!isObject(frame)) {
          errors.push(`${frameLabel} must be an object.`);
          continue;
        }

        if (frame.sourceRect && sourceMetadata) {
          errors.push(...validateSourceRect(frame.sourceRect, frameLabel, sourceMetadata));
        }
      }
    }
  }

  return { errors, manifest, sourceMetadata };
}

let hasErrors = false;

console.log('Validating academy animation manifests...');

for (const spec of manifestSpecs) {
  const result = validateManifest(spec);
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
  console.log(`   - Animations: ${result.manifest.animations.length}`);
}

if (hasErrors) {
  process.exit(1);
}

console.log('✅ Academy animation manifest validation passed');
