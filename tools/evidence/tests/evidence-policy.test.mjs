import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  TRACKED_PROOF_MAX_BYTES,
  classifyRepositoryPath,
  validateEvidenceCandidates,
} from '../evidence.mjs';

const grandfathered = new Set([
  'games/tier-1/02-potion-sorter/evidence/h6-old/motion/old.webm',
  'games/tier-1/03-dice-duel-tavern/evidence/h6-old/captures/old-large.png',
]);

function validate(candidates, allowlist = []) {
  return validateEvidenceCandidates(candidates, {
    grandfatheredPaths: grandfathered,
    compactProofAllowlist: new Set(allowlist),
  });
}

test('grandfathered tracked video evidence remains accepted', () => {
  const result = validate([{
    path: 'games/tier-1/02-potion-sorter/evidence/h6-old/motion/old.webm',
    bytes: 5_101_322,
    tracked: true,
    added: false,
  }]);
  assert.equal(result.violations.length, 0);
});
test('new tracked video evidence is rejected', () => {
  const result = validate([{
    path: 'games/tier-1/04-card-goblin-duel/evidence/new-run/recordings/new.webm',
    bytes: 100,
    tracked: true,
    added: true,
  }]);
  assert.match(result.violations[0].reason, /video|external-heavy/i);
});

test('new generated evidence still above 2 MiB is rejected', () => {
  const result = validate([{
    path: 'games/tier-1/05-dungeon-key-run/evidence/new-run/stills/full.png',
    bytes: TRACKED_PROOF_MAX_BYTES + 1,
    tracked: true,
    added: true,
  }]);
  assert.match(result.violations[0].reason, /2 MiB|ceiling/i);
});

test('approved compact proof at or below 2 MiB is accepted', () => {
  const proof = 'docs/evidence/review/approved-proof.png';
  const result = validate([{
    path: proof,
    bytes: TRACKED_PROOF_MAX_BYTES,
    tracked: true,
    added: true,
  }], [proof]);
  assert.equal(result.violations.length, 0);
});

test('unallowlisted new evidence binary is rejected even when small', () => {
  const result = validate([{
    path: 'docs/evidence/review/unapproved-proof.png',
    bytes: 512,
    tracked: true,
    added: true,
  }]);
  assert.match(result.violations[0].reason, /allowlist|approved compact proof/i);
});
test('production source assets are not misclassified as evidence', () => {
  const sourcePath = 'assets/academy/materials/source/h5-100/kenney/archives/large-source.png';
  assert.equal(classifyRepositoryPath(sourcePath), 'production-or-source-asset');
  const result = validate([{
    path: sourcePath,
    bytes: 12_000_000,
    tracked: true,
    added: true,
  }]);
  assert.equal(result.violations.length, 0);
});

test('portable external-heavy JSON manifests remain lightweight authority', () => {
  const result = validate([{
    path: 'docs/evidence/external-runs/level-01/run.json',
    bytes: 900,
    tracked: true,
    added: true,
    storageClass: 'external-heavy',
    extension: '.json',
  }]);
  assert.equal(result.violations.length, 0);
});

test('new binaries in originals or full-resolution sequences are rejected', () => {
  const result = validate([
    {
      path: 'games/tier-1/06-tiny-farm-day/evidence/new/originals/raw.png',
      bytes: 100,
      tracked: true,
      added: true,
    },
    {
      path: 'games/tier-1/06-tiny-farm-day/evidence/full-resolution-sequence/frame-001.jpg',
      bytes: 100,
      tracked: true,
      added: true,
    },
  ]);
  assert.equal(result.violations.length, 2);
});

test('evidence tooling source is not classified as generated evidence', () => {
  const toolPath = 'tools/evidence/evidence-core.cjs';
  assert.equal(classifyRepositoryPath(toolPath), 'evidence-tooling');
  const result = validate([{
    path: toolPath,
    bytes: 25_000,
    tracked: true,
    added: true,
  }]);
  assert.equal(result.violations.length, 0);
});
