#!/usr/bin/env node
import { getLaneProfile } from '../lib/asset-taxonomy.mjs';

const profile = getLaneProfile('hub-icon-sheet');

console.log('Tiny Goblin Academy asset lane: hub-icon-sheet');
console.log('');
console.log('Responsible for: hub-facing game icon sheets rendered through region manifests and SpriteFrame-style source rectangles.');
console.log(`Required manifest type: ${profile.manifestContract}`);
console.log(`Required evidence: ${profile.requiredEvidence.join(', ')}`);
console.log(`Human review: ${profile.humanReviewGate}`);
console.log(`Cleanup policy: ${profile.cleanupPolicy}`);
console.log(`Forbidden actions: ${profile.forbiddenActions.join(', ')}`);
console.log('');
console.log('This H5.1 lane stub is help-only and does not modify files.');
