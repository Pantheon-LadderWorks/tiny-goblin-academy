#!/usr/bin/env node
import { getLaneProfile } from '../lib/asset-taxonomy.mjs';

const profile = getLaneProfile('animation-sheet');

console.log('Tiny Goblin Academy asset lane: animation-sheet');
console.log('');
console.log('Responsible for: character, enemy, pet, and other sequence-based animation sprite sheets.');
console.log(`Required manifest type: ${profile.manifestContract}`);
console.log(`Required evidence: ${profile.requiredEvidence.join(', ')}`);
console.log(`Human review: ${profile.humanReviewGate}`);
console.log(`Cleanup policy: ${profile.cleanupPolicy}`);
console.log(`Forbidden actions: ${profile.forbiddenActions.join(', ')}`);
console.log('');
console.log('Hard warning: no blind checkerboard cleanup. Requires contact sheet, sequence labels, pivots/hitbox review, and human review before bulk processing.');
console.log('This H5.1 lane stub is help-only and does not modify files.');
