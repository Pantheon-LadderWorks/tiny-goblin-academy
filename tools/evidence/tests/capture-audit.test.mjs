import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(testDir, '..', '..', '..');
const auditPath = path.join(
  repoRoot,
  'docs',
  'evidence',
  'h6-18-external-evidence-output-foundation',
  'capture-script-audit.json',
);

const activeHeavy = [
  'games/tier-1/01-button-goblin-clicker/scripts/capture-evidence.mjs',
  'games/tier-1/04-card-goblin-duel/capture.cjs',
  'games/tier-1/05-dungeon-key-run/capture.cjs',
  'games/tier-1/06-tiny-farm-day/capture.cjs',
  'games/tier-1/07-pet-campfire/capture.cjs',
  'games/tier-1/08-one-room-platformer/capture.cjs',
  'games/tier-1/08-one-room-platformer/debug-capture.cjs',
  'games/tier-1/09-top-down-slime-quest/capture.cjs',
  'games/tier-1/10-mini-settlement-sim/capture.cjs',
];
const productionSource = [
  'scripts/asset-pipeline/cleanup-edge-connected-checker.py',
  'scripts/asset-pipeline/map-grid-batch.py',
  'scripts/clean-hub-icon-checkerboard.py',
];

const historicalCount = 16;

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function readAudit() {
  return JSON.parse(fs.readFileSync(auditPath, 'utf8'));
}

test('capture audit covers the exact 28-script inventory', () => {
  const audit = readAudit();
  assert.equal(audit.scripts.length, 28);
  assert.deepEqual(audit.totals, { A: 9, B: 0, C: 3, D: historicalCount });
  assert.deepEqual(
    audit.scripts.filter((entry) => entry.classification === 'A').map((entry) => entry.path).sort(),
    [...activeHeavy].sort(),
  );
  assert.deepEqual(
    audit.scripts.filter((entry) => entry.classification === 'C').map((entry) => entry.path).sort(),
    [...productionSource].sort(),
  );
});
test('category-A scripts route through the shared resolver before browser work', () => {
  const audit = readAudit();
  for (const relativePath of activeHeavy) {
    const source = fs.readFileSync(path.join(repoRoot, ...relativePath.split('/')), 'utf8');
    assert.match(source, /prepareCaptureRun/);
    assert.match(source, /finalizeCaptureRun/);
    assert.doesNotMatch(source, /(?:^|['"`])evidence[\\/]screenshots/);
    const prepareIndex = source.indexOf('const captureRun = prepareCaptureRun');
    const browserIndex = source.search(/chromium\.launch|createServer\(|spawn\(/);
    assert.ok(prepareIndex >= 0 && browserIndex >= 0 && prepareIndex < browserIndex, relativePath);
    const entry = audit.scripts.find((candidate) => candidate.path === relativePath);
    assert.equal(entry.modified, true);
    assert.equal(entry.newBehavior, 'external-heavy-run');
  }
});

test('category-C production/source generators remain outside evidence routing', () => {
  const audit = readAudit();
  for (const relativePath of productionSource) {
    const fullPath = path.join(repoRoot, ...relativePath.split('/'));
    const source = fs.readFileSync(fullPath, 'utf8');
    assert.doesNotMatch(source, /prepareCaptureRun|TGA_EVIDENCE_ROOT/);
    const entry = audit.scripts.find((candidate) => candidate.path === relativePath);
    assert.equal(entry.modified, false);
    assert.equal(entry.sourceSha256After, sha256(fullPath));
    assert.equal(entry.sourceSha256Before, entry.sourceSha256After);
  }
});
test('category-D historical scripts remain unchanged and hash-pinned', () => {
  const audit = readAudit();
  const historical = audit.scripts.filter((entry) => entry.classification === 'D');
  assert.equal(historical.length, historicalCount);
  for (const entry of historical) {
    const fullPath = path.join(repoRoot, ...entry.path.split('/'));
    assert.equal(entry.modified, false);
    assert.equal(entry.sourceSha256Before, entry.sourceSha256After);
    assert.equal(entry.sourceSha256After, sha256(fullPath));
  }
});

test('required pnpm commands exist without dependency or lockfile drift', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
  const required = [
    'evidence:init',
    'evidence:doctor',
    'evidence:where',
    'evidence:verify',
    'validate:evidence-storage',
  ];
  for (const name of required) assert.equal(typeof pkg.scripts[name], 'string');
  assert.equal(pkg.packageManager, 'pnpm@10.20.0');
  assert.equal(pkg.dependencies, undefined);
  assert.equal(pkg.devDependencies, undefined);
  assert.equal(pkg.optionalDependencies, undefined);
  assert.equal(
    sha256(path.join(repoRoot, 'pnpm-lock.yaml')),
    'af2e59974669109a578974d3314cbf429510de88fe5eb497ba424b05228acf26',
  );
});

test('local configuration rule is exact, UTF-8, and ignored', () => {
  const ignoreBytes = fs.readFileSync(path.join(repoRoot, '.gitignore'));
  const ignoreText = ignoreBytes.toString('utf8');
  assert.equal(ignoreText.includes('\0'), false);
  const matches = ignoreText.split(/\r?\n/).filter((line) => line === 'tools/evidence/evidence.local.json');
  assert.equal(matches.length, 1);
});

const protectedAssetPipeline = {
  'scripts/asset-pipeline/cli.mjs': '1f0790448fe00a16fea1982a467f6d02ad85685f1bc02c59dc192e66472ffa02',
  'scripts/asset-pipeline/lib/cleanup-method-registry.mjs': '15a46129670bdb8366ac8baccb651e1ec3faedef35b7901c6c5b51ccc3483f90',
  'scripts/asset-pipeline/lib/provenance-contract.mjs': '78b6e2b3f192c1fca3800a3e66adcb1ae2e242ce26854ee916dcd9b938c18a1b',
  'scripts/asset-pipeline/lib/run-log.mjs': 'a2ee3c99a1106a048a247904abf8221178f003416491aee6d0db261e27f72b97',
  'scripts/asset-pipeline/smoke-check.mjs': 'eded2ea5769c4ceeaea24d6082aa244c9a134aef97cff8d3ec5dbaece07cbafe',
  'scripts/asset-pipeline/map-grid-batch.py': '66c6601f3403f6d4a23500cdf6c7241164e5e8ef239d3c72d64a6cbfbabfde47',
  'scripts/asset-pipeline/cleanup-edge-connected-checker.py': '7e85aebc7dfa5eb086c473dc3884beb38fd8b72bb83ae09472e76ea1af22ec30',
  'scripts/asset-pipeline/make-region-evidence.py': '2f2af1ae706e11a1b78886ef2ff3fbac7a992dfefaed58bdaea86d3cc41fa3c1',
  'scripts/asset-pipeline/validate-pipeline-provenance.mjs': '41d60bc911b77bf5f1339d150165924bdcb7fa45178eafad2f97cbfe130f927a',
  'scripts/clean-fake-transparent-sheet.py': '85567e6af187c25dabb36dbfe7390160e9f328374efb8da93979490eab2cf259',
  'scripts/clean-hub-icon-checkerboard.py': 'b42e6049247b0704d43b9a19a51972a74f434c6821d1c0424f1f286fb580f21a',
};

test('canonical asset-pipeline guardrails remain byte-identical', () => {
  for (const [relativePath, expectedHash] of Object.entries(protectedAssetPipeline)) {
    const fullPath = path.join(repoRoot, ...relativePath.split('/'));
    assert.equal(sha256(fullPath), expectedHash, relativePath);
  }
});

test('external evidence tooling does not expose asset operations', () => {
  const cli = fs.readFileSync(path.join(repoRoot, 'tools', 'evidence', 'cli.mjs'), 'utf8');
  const core = fs.readFileSync(path.join(repoRoot, 'tools', 'evidence', 'evidence-core.cjs'), 'utf8');
  const combined = `${cli}\n${core}`;
  for (const forbidden of [
    'cleanup-candidate',
    'list-cleanup-methods',
    'map-grid-batch',
    'make-region-evidence.py',
    'clean-fake-transparent-sheet.py',
    'cleanup-method-registry.mjs',
  ]) {
    assert.equal(combined.includes(forbidden), false, forbidden);
  }
  assert.doesNotMatch(combined, /PIL|ImageMagick|sharp\s*\(|pixel|alpha repair/i);
});

test('all category-A adapter imports resolve to the shared authority', () => {
  for (const relativePath of activeHeavy) {
    const fullPath = path.join(repoRoot, ...relativePath.split('/'));
    const source = fs.readFileSync(fullPath, 'utf8');
    const match = source.match(/(?:from\s+|require\()['"]([^'"]*capture-run\.(?:mjs|cjs))['"]/);
    assert.ok(match, relativePath);
    const resolved = path.resolve(path.dirname(fullPath), match[1]);
    assert.equal(fs.existsSync(resolved), true, `${relativePath} -> ${resolved}`);
  }
});

test('tracked local-config example contains placeholders only', () => {
  const examplePath = path.join(repoRoot, 'tools', 'evidence', 'evidence.local.example.json');
  const text = fs.readFileSync(examplePath, 'utf8');
  const example = JSON.parse(text);
  assert.equal(text.includes('The Void'), false);
  assert.equal(text.includes('F60EFF6E'), false);
  assert.equal(text.includes('D:\\Projects'), false);
  assert.match(example.expectedVolumeLabel, /EXPECTED_/);
  assert.match(example.expectedVolumeSerial, /EXPECTED_/);
  assert.match(example.evidenceRoot, /^X:\\/);
});
