#!/usr/bin/env node
import { getLaneProfile } from '../lib/asset-taxonomy.mjs';

const profile = getLaneProfile('static-prop-sheet');

console.log('Tiny Goblin Academy asset lane: static-prop-sheet');
console.log('');
console.log('Responsible for: shared props, pickups, objects, markers, and other non-animated pantry sprites.');
console.log(`Required manifest type: ${profile.manifestContract}`);
console.log(`Required evidence: ${profile.requiredEvidence.join(', ')}`);
console.log(`Human review: ${profile.humanReviewGate}`);
console.log(`Cleanup policy: ${profile.cleanupPolicy}`);
console.log(`Forbidden actions: ${profile.forbiddenActions.join(', ')}`);
console.log('');
console.log('This H5.1 lane stub is help-only and does not modify files.');
