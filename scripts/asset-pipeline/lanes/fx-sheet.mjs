#!/usr/bin/env node
import { getLaneProfile } from '../lib/asset-taxonomy.mjs';

const profile = getLaneProfile('fx-sheet');

console.log('Tiny Goblin Academy asset lane: fx-sheet');
console.log('');
console.log('Responsible for: feedback sprites, particles, flashes, smoke, dust, status effects, and event visuals.');
console.log(`Required manifest type: ${profile.manifestContract}`);
console.log(`Required evidence: ${profile.requiredEvidence.join(', ')}`);
console.log(`Human review: ${profile.humanReviewGate}`);
console.log(`Cleanup policy: ${profile.cleanupPolicy}`);
console.log(`Forbidden actions: ${profile.forbiddenActions.join(', ')}`);
console.log('');
console.log('Warning: RGB/JPEG-like FX sheets need separate strategy before cleanup.');
console.log('This H5.1 lane stub is help-only and does not modify files.');
