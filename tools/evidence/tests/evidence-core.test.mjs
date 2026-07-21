import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import {
  ROOT_TAXONOMY,
  assertPortableManifest,
  createExternalRun,
  finalizeExternalRun,
  reserveEvidenceFile,
  resolveEvidenceConfig,
  verifyEvidenceStorage,
  verifyManifest,
} from '../evidence.mjs';

const SOURCE_COMMIT = '2e376c22f5c96e2f59c30b2de58cbb08e41203d7';

function makeWorkspace(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'tga-evidence-test-'));
  const repoRoot = path.join(root, 'repo');
  const evidenceRoot = path.join(root, 'external-evidence');
  fs.mkdirSync(path.join(repoRoot, 'tools', 'evidence'), { recursive: true });
  fs.mkdirSync(evidenceRoot, { recursive: true });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, repoRoot, evidenceRoot };
}
function localConfig(evidenceRoot, overrides = {}) {
  return {
    schemaVersion: 1,
    evidenceRoot,
    expectedVolumeLabel: 'The Void',
    expectedVolumeSerial: 'F60EFF6E',
    expectedFilesystem: 'exFAT',
    minimumFreeBytes: 5 * 1024 ** 3,
    ...overrides,
  };
}

function writeLocalConfig(repoRoot, config) {
  const configPath = path.join(repoRoot, 'tools', 'evidence', 'evidence.local.json');
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
  return configPath;
}

function matchingVolume(config, overrides = {}) {
  return () => ({
    drive: path.parse(config.evidenceRoot).root,
    label: config.expectedVolumeLabel,
    serial: config.expectedVolumeSerial,
    filesystem: config.expectedFilesystem,
    freeBytes: config.minimumFreeBytes + 1024,
    ...overrides,
  });
}

const readableWritable = () => ({ readable: true, writable: true });
test('environment root overrides ignored local root', (t) => {
  const { repoRoot, evidenceRoot, root } = makeWorkspace(t);
  const localRoot = path.join(root, 'local-root');
  fs.mkdirSync(localRoot);
  writeLocalConfig(repoRoot, localConfig(localRoot));

  const resolved = resolveEvidenceConfig({
    repoRoot,
    env: { TGA_EVIDENCE_ROOT: evidenceRoot },
  });

  assert.equal(resolved.evidenceRoot, path.resolve(evidenceRoot));
  assert.equal(resolved.configurationSource, 'environment-root+local-identity');
});

test('ignored local configuration resolves when environment is absent', (t) => {
  const { repoRoot, evidenceRoot } = makeWorkspace(t);
  writeLocalConfig(repoRoot, localConfig(evidenceRoot));
  const resolved = resolveEvidenceConfig({ repoRoot, env: {} });
  assert.equal(resolved.evidenceRoot, path.resolve(evidenceRoot));
  assert.equal(resolved.configurationSource, 'local-config');
});

test('missing configuration fails with no repository fallback', (t) => {
  const { repoRoot } = makeWorkspace(t);
  assert.throws(() => resolveEvidenceConfig({ repoRoot, env: {} }), /configuration/i);
  assert.throws(
    () => resolveEvidenceConfig({ repoRoot, env: { TGA_EVIDENCE_ROOT: 'D:\\Evidence' } }),
    /identity|configuration/i,
  );
});
test('wrong volume label fails', (t) => {
  const { repoRoot, evidenceRoot } = makeWorkspace(t);
  const config = localConfig(evidenceRoot);
  assert.throws(
    () => verifyEvidenceStorage(config, {
      repoRoot,
      volumeProvider: matchingVolume(config, { label: 'Wrong Disk' }),
      accessProbe: readableWritable,
    }),
    /label/i,
  );
});

test('wrong volume serial fails', (t) => {
  const { repoRoot, evidenceRoot } = makeWorkspace(t);
  const config = localConfig(evidenceRoot);
  assert.throws(
    () => verifyEvidenceStorage(config, {
      repoRoot,
      volumeProvider: matchingVolume(config, { serial: '00000000' }),
      accessProbe: readableWritable,
    }),
    /serial/i,
  );
});

test('unreadable root fails', (t) => {
  const { repoRoot, evidenceRoot } = makeWorkspace(t);
  const config = localConfig(evidenceRoot);
  assert.throws(
    () => verifyEvidenceStorage(config, {
      repoRoot,
      volumeProvider: matchingVolume(config),
      accessProbe: () => ({ readable: false, writable: true }),
    }),
    /readable/i,
  );
});
test('insufficient free space fails', (t) => {
  const { repoRoot, evidenceRoot } = makeWorkspace(t);
  const config = localConfig(evidenceRoot);
  assert.throws(
    () => verifyEvidenceStorage(config, {
      repoRoot,
      volumeProvider: matchingVolume(config, { freeBytes: config.minimumFreeBytes - 1 }),
      accessProbe: readableWritable,
    }),
    /free space/i,
  );
});

test('path traversal in lane identifiers fails', (t) => {
  const { repoRoot, evidenceRoot } = makeWorkspace(t);
  const config = localConfig(evidenceRoot);
  assert.throws(
    () => createExternalRun({
      repoRoot,
      config,
      gameId: 'level-01-button-goblin-clicker',
      laneId: '../escape',
      runId: 'run-001',
      volumeProvider: matchingVolume(config),
      accessProbe: readableWritable,
    }),
    /lane|identifier|path/i,
  );
});

test('existing run directory collision fails', (t) => {
  const { repoRoot, evidenceRoot } = makeWorkspace(t);
  const config = localConfig(evidenceRoot);
  const args = {
    repoRoot,
    config,
    gameId: 'level-01-button-goblin-clicker',
    laneId: 'mechanical-capture',
    runId: 'run-001',
    volumeProvider: matchingVolume(config),
    accessProbe: readableWritable,
  };
  createExternalRun(args);
  assert.throws(() => createExternalRun(args), /already exists|collision/i);
});
test('evidence root inside source repository fails', (t) => {
  const { repoRoot } = makeWorkspace(t);
  const evidenceRoot = path.join(repoRoot, 'evidence-external');
  fs.mkdirSync(evidenceRoot, { recursive: true });
  const config = localConfig(evidenceRoot);
  assert.throws(
    () => verifyEvidenceStorage(config, {
      repoRoot,
      volumeProvider: matchingVolume(config),
      accessProbe: readableWritable,
    }),
    /source repository|containment/i,
  );
});

test('manifest hashes and sizes verify and altered files fail', (t) => {
  const { repoRoot, evidenceRoot } = makeWorkspace(t);
  const config = localConfig(evidenceRoot);
  const run = createExternalRun({
    repoRoot,
    config,
    gameId: 'level-01-button-goblin-clicker',
    laneId: 'mechanical-capture',
    runId: 'run-001',
    volumeProvider: matchingVolume(config),
    accessProbe: readableWritable,
  });
  const still = reserveEvidenceFile(run, 'stills', 'example.png');
  fs.writeFileSync(still, Buffer.from('synthetic-png-bytes'));
  const portablePath = path.join(repoRoot, 'portable-manifest.json');
  const result = finalizeExternalRun({
    run,
    sourceCommit: SOURCE_COMMIT,
    captureScript: 'tools/evidence/tests/evidence-core.test.mjs',
    captureScriptVersion: 'test-1',
    portableManifestPath: portablePath,
  });
  assert.equal(result.portableManifest.files.length, 1);
  assertPortableManifest(result.portableManifest);
  assert.equal(JSON.stringify(result.portableManifest).includes(path.resolve(evidenceRoot)), false);

  const verified = verifyManifest(portablePath, {
    repoRoot,
    config,
    volumeProvider: matchingVolume(config),
    accessProbe: readableWritable,
  });
  assert.equal(verified.ok, true);
  assert.equal(verified.filesVerified, 1);

  fs.appendFileSync(still, 'changed');
  assert.throws(
    () => verifyManifest(portablePath, {
      repoRoot,
      config,
      volumeProvider: matchingVolume(config),
      accessProbe: readableWritable,
    }),
    /bytes|sha-256|hash/i,
  );
});

test('root taxonomy contains only the approved initial structure', () => {
  assert.deepEqual(ROOT_TAXONOMY, [
    'shared',
    'level-01-button-goblin-clicker',
    'level-02-potion-sorter',
    'level-03-dice-duel-tavern',
    'level-04-card-goblin-duel',
    'future',
    'system/manifests',
    'system/smoke-tests',
  ]);
});

test('future levels remain beneath the approved future root', (t) => {
  const { repoRoot, evidenceRoot } = makeWorkspace(t);
  const config = localConfig(evidenceRoot);
  const run = createExternalRun({
    repoRoot,
    config,
    gameId: 'level-05-dungeon-key-run',
    laneId: 'mechanical-capture',
    runId: 'run-001',
    volumeProvider: matchingVolume(config),
    accessProbe: readableWritable,
  });
  assert.equal(
    run.externalRelativePath,
    'future/level-05-dungeon-key-run/mechanical-capture/run-001',
  );
  assert.equal(run.runDir, path.join(
    evidenceRoot,
    'future',
    'level-05-dungeon-key-run',
    'mechanical-capture',
    'run-001',
  ));
});

test('source-like and reserved game identifiers fail', (t) => {
  const { repoRoot, evidenceRoot } = makeWorkspace(t);
  const config = localConfig(evidenceRoot);
  for (const gameId of ['assets', 'scripts', 'manifests', 'system', 'future']) {
    assert.throws(() => createExternalRun({
      repoRoot,
      config,
      gameId,
      laneId: 'capture',
      runId: 'run-001',
      volumeProvider: matchingVolume(config),
      accessProbe: readableWritable,
    }), /gameId|reserved|source-like/i);
  }
});

test('portable manifest collision fails before external finalization', (t) => {
  const { repoRoot, evidenceRoot } = makeWorkspace(t);
  const config = localConfig(evidenceRoot);
  const run = createExternalRun({
    repoRoot,
    config,
    gameId: 'level-01-button-goblin-clicker',
    laneId: 'mechanical-capture',
    runId: 'run-002',
    volumeProvider: matchingVolume(config),
    accessProbe: readableWritable,
  });
  fs.writeFileSync(reserveEvidenceFile(run, 'stills', 'proof.png'), 'proof');
  const portablePath = path.join(repoRoot, 'existing-portable.json');
  fs.writeFileSync(portablePath, '{}\n', 'utf8');
  assert.throws(() => finalizeExternalRun({
    run,
    sourceCommit: SOURCE_COMMIT,
    captureScript: 'test',
    portableManifestPath: portablePath,
  }), /already exists/i);
  assert.equal(fs.existsSync(path.join(run.runDir, 'external-manifest.json')), false);
});

test('wrong filesystem fails', (t) => {
  const { repoRoot, evidenceRoot } = makeWorkspace(t);
  const config = localConfig(evidenceRoot);
  assert.throws(
    () => verifyEvidenceStorage(config, {
      repoRoot,
      volumeProvider: matchingVolume(config, { filesystem: 'NTFS' }),
      accessProbe: readableWritable,
    }),
    /filesystem/i,
  );
});

test('unwritable root fails', (t) => {
  const { repoRoot, evidenceRoot } = makeWorkspace(t);
  const config = localConfig(evidenceRoot);
  assert.throws(
    () => verifyEvidenceStorage(config, {
      repoRoot,
      volumeProvider: matchingVolume(config),
      accessProbe: () => ({ readable: true, writable: false }),
    }),
    /writable/i,
  );
});

test('unsafe filenames fail before file creation', (t) => {
  const { repoRoot, evidenceRoot } = makeWorkspace(t);
  const config = localConfig(evidenceRoot);
  const run = createExternalRun({
    repoRoot,
    config,
    gameId: 'level-01-button-goblin-clicker',
    laneId: 'mechanical-capture',
    runId: 'run-003',
    volumeProvider: matchingVolume(config),
    accessProbe: readableWritable,
  });
  for (const filename of ['../escape.png', 'nested/file.png', '..']) {
    assert.throws(() => reserveEvidenceFile(run, 'stills', filename), /filename|unsafe/i);
  }
});
