'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const LOCAL_CONFIG_RELATIVE = 'tools/evidence/evidence.local.json';
const TRACKED_PROOF_MAX_BYTES = 2 * 1024 * 1024;
const ROOT_TAXONOMY = Object.freeze([
  'shared',
  'level-01-button-goblin-clicker',
  'level-02-potion-sorter',
  'level-03-dice-duel-tavern',
  'level-04-card-goblin-duel',
  'future',
  'system/manifests',
  'system/smoke-tests',
]);
const CURRENT_GAME_ROOTS = new Set([
  'level-01-button-goblin-clicker',
  'level-02-potion-sorter',
  'level-03-dice-duel-tavern',
  'level-04-card-goblin-duel',
]);
const FUTURE_GAME_ID = /^level-\d{2}-[a-z0-9][a-z0-9-]*$/;
const HEAVY_VIDEO_EXTENSIONS = new Set(['.webm', '.mp4', '.mov', '.avi', '.mkv']);
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
const LIGHTWEIGHT_EXTENSIONS = new Set(['.json', '.md', '.csv', '.txt', '.yml', '.yaml']);
const SAFE_IDENTIFIER = /^[a-z0-9][a-z0-9-]*$/;
const SAFE_FILENAME = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/;
function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function normalizePath(value) {
  return path.resolve(value);
}

function isWithin(parent, candidate) {
  const relative = path.relative(normalizePath(parent), normalizePath(candidate));
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function assertOutsideRepository(repoRoot, evidenceRoot) {
  if (isWithin(repoRoot, evidenceRoot) || isWithin(evidenceRoot, repoRoot)) {
    throw new Error('Evidence root fails source repository containment safety.');
  }
}

function assertIdentifier(value, label) {
  if (typeof value !== 'string' || !SAFE_IDENTIFIER.test(value)) {
    throw new Error(`${label} is an ambiguous or unsafe identifier: ${value}`);
  }
  return value;
}

function resolveRunRelativePath(gameId, laneId, runId) {
  assertIdentifier(gameId, 'gameId');
  assertIdentifier(laneId, 'laneId');
  assertIdentifier(runId, 'runId');
  if (gameId === 'shared') return ['shared', laneId, runId].join('/');
  if (CURRENT_GAME_ROOTS.has(gameId)) return [gameId, laneId, runId].join('/');
  if (FUTURE_GAME_ID.test(gameId)) return ['future', gameId, laneId, runId].join('/');
  throw new Error(`gameId is ambiguous, reserved, or source-like: ${gameId}`);
}

function sanitizeFilename(value) {
  if (typeof value !== 'string' || !SAFE_FILENAME.test(value) || value === '.' || value === '..') {
    throw new Error(`Unsafe evidence filename: ${value}`);
  }
  return value;
}
function validateConfig(config) {
  if (!config || config.schemaVersion !== 1) throw new Error('Unsupported local configuration version.');
  for (const field of [
    'evidenceRoot',
    'expectedVolumeLabel',
    'expectedVolumeSerial',
    'expectedFilesystem',
  ]) {
    if (typeof config[field] !== 'string' || !config[field].trim()) {
      throw new Error(`Missing evidence configuration field: ${field}`);
    }
  }
  if (!Number.isSafeInteger(config.minimumFreeBytes) || config.minimumFreeBytes < 0) {
    throw new Error('minimumFreeBytes must be a non-negative safe integer.');
  }
  return { ...config, evidenceRoot: normalizePath(config.evidenceRoot) };
}

function resolveEvidenceConfig({ repoRoot, env = process.env } = {}) {
  if (!repoRoot) throw new Error('Repository root is required for evidence configuration.');
  const configPath = path.join(repoRoot, ...LOCAL_CONFIG_RELATIVE.split('/'));
  const local = fs.existsSync(configPath) ? readJson(configPath) : null;
  if (!local) {
    throw new Error('Evidence configuration is missing; no repository fallback exists.');
  }
  const configured = validateConfig(local);
  if (env.TGA_EVIDENCE_ROOT) {
    return {
      ...configured,
      evidenceRoot: normalizePath(env.TGA_EVIDENCE_ROOT),
      configurationSource: 'environment-root+local-identity',
      configPath,
    };
  }
  return { ...configured, configurationSource: 'local-config', configPath };
}
function windowsVolumeProvider(config) {
  if (process.platform !== 'win32') {
    throw new Error('Physical-volume verification is implemented for Windows only.');
  }
  const drive = path.parse(config.evidenceRoot).root.replace(/\\$/, '');
  if (!/^[A-Za-z]:$/.test(drive)) throw new Error(`Evidence root has no Windows drive: ${config.evidenceRoot}`);
  const command = [
    "$ErrorActionPreference='Stop'",
    `$disk=Get-CimInstance Win32_LogicalDisk -Filter \"DeviceID='${drive}'\"`,
    "if(-not $disk){throw 'volume missing'}",
    '[pscustomobject]@{drive=$disk.DeviceID;label=$disk.VolumeName;serial=$disk.VolumeSerialNumber;filesystem=$disk.FileSystem;freeBytes=[int64]$disk.FreeSpace}|ConvertTo-Json -Compress',
  ].join(';');
  const result = spawnSync('powershell.exe', ['-NoProfile', '-Command', command], {
    encoding: 'utf8',
    windowsHide: true,
  });
  if (result.status !== 0) throw new Error(`Physical volume lookup failed: ${result.stderr || result.stdout}`);
  return JSON.parse(result.stdout.trim());
}

function defaultAccessProbe(root) {
  try {
    fs.readdirSync(root, { withFileTypes: true });
    fs.accessSync(root, fs.constants.R_OK | fs.constants.W_OK);
    return { readable: true, writable: true };
  } catch (error) {
    return { readable: false, writable: false, error: error.message };
  }
}
function verifyEvidenceStorage(configInput, options = {}) {
  const config = validateConfig(configInput);
  const repoRoot = options.repoRoot && normalizePath(options.repoRoot);
  if (repoRoot) assertOutsideRepository(repoRoot, config.evidenceRoot);
  const volumeProvider = options.volumeProvider || windowsVolumeProvider;
  const accessProbe = options.accessProbe || defaultAccessProbe;
  const volume = volumeProvider(config);
  const actualSerial = String(volume.serial || '').toUpperCase();
  if (String(volume.label) !== config.expectedVolumeLabel) {
    throw new Error(`Physical volume label mismatch: ${volume.label}`);
  }
  if (actualSerial !== config.expectedVolumeSerial.toUpperCase()) {
    throw new Error(`Physical volume serial mismatch: ${volume.serial}`);
  }
  if (String(volume.filesystem).toLowerCase() !== config.expectedFilesystem.toLowerCase()) {
    throw new Error(`Physical volume filesystem mismatch: ${volume.filesystem}`);
  }
  if (Number(volume.freeBytes) < config.minimumFreeBytes) {
    throw new Error(`Physical volume has insufficient free space: ${volume.freeBytes}`);
  }
  if (!fs.existsSync(config.evidenceRoot) && !options.allowMissingRoot) {
    throw new Error(`Evidence root is unavailable: ${config.evidenceRoot}`);
  }
  const probeRoot = fs.existsSync(config.evidenceRoot)
    ? config.evidenceRoot
    : path.parse(config.evidenceRoot).root;
  const access = accessProbe(probeRoot);
  if (!access.readable) throw new Error(`Evidence root is not readable: ${access.error || probeRoot}`);
  if (!access.writable) throw new Error(`Evidence root is not writable: ${access.error || probeRoot}`);
  return { config, volume: { ...volume, serial: actualSerial }, access, ready: true };
}
function createExternalRun(options) {
  const {
    repoRoot,
    config: configInput,
    gameId,
    laneId,
    runId,
    volumeProvider,
    accessProbe,
  } = options;
  const config = validateConfig(configInput);
  verifyEvidenceStorage(config, { repoRoot, volumeProvider, accessProbe });
  const externalRelativePath = resolveRunRelativePath(gameId, laneId, runId);
  const runDir = path.join(config.evidenceRoot, ...externalRelativePath.split('/'));
  if (!isWithin(config.evidenceRoot, runDir)) throw new Error('Run path escapes configured evidence root.');
  if (fs.existsSync(runDir)) throw new Error(`Evidence run already exists; collision refused: ${runDir}`);
  for (const segment of ['stills', 'recordings', 'originals']) {
    fs.mkdirSync(path.join(runDir, segment), { recursive: true });
  }
  return {
    schemaVersion: 1,
    repoRoot: normalizePath(repoRoot),
    root: config.evidenceRoot,
    runDir,
    gameId,
    laneId,
    runId,
    externalRelativePath,
  };
}

function reserveEvidenceFile(run, category, filename) {
  const allowed = new Set(['stills', 'recordings', 'originals', 'root']);
  if (!allowed.has(category)) throw new Error(`Unsupported evidence category: ${category}`);
  const safe = sanitizeFilename(filename);
  const directory = category === 'root' ? run.runDir : path.join(run.runDir, category);
  const candidate = path.join(directory, safe);
  if (!isWithin(run.runDir, candidate)) throw new Error('Evidence file path escapes run directory.');
  if (fs.existsSync(candidate)) throw new Error(`Evidence file collision refused: ${candidate}`);
  return candidate;
}
function sha256File(filePath) {
  const digest = crypto.createHash('sha256');
  digest.update(fs.readFileSync(filePath));
  return digest.digest('hex');
}

function mediaTypeFor(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const map = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.webm': 'video/webm',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.mkv': 'video/x-matroska',
    '.json': 'application/json',
    '.txt': 'text/plain',
  };
  return map[extension] || 'application/octet-stream';
}

function listRunFiles(runDir) {
  const files = [];
  function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      else if (entry.isFile() && entry.name !== 'external-manifest.json') files.push(fullPath);
    }
  }
  walk(runDir);
  return files.sort();
}
function buildFileRecords(run) {
  return listRunFiles(run.runDir).map((fullPath) => ({
    relativePath: path.relative(run.runDir, fullPath).split(path.sep).join('/'),
    mediaType: mediaTypeFor(fullPath),
    bytes: fs.statSync(fullPath).size,
    sha256: sha256File(fullPath),
  }));
}

function assertPortableManifest(manifest) {
  if (!manifest || manifest.schemaVersion !== 1) throw new Error('Portable manifest schemaVersion must be 1.');
  if (manifest.storageClass !== 'external-heavy') throw new Error('Portable manifest storageClass must be external-heavy.');
  if (manifest.rootKey !== 'TGA_EVIDENCE_ROOT') throw new Error('Portable manifest rootKey is invalid.');
  if (manifest.repository !== 'tiny-goblin-academy') throw new Error('Portable manifest repository is invalid.');
  for (const field of ['sourceCommit', 'gameId', 'laneId', 'runId', 'externalRelativePath']) {
    if (typeof manifest[field] !== 'string' || !manifest[field]) throw new Error(`Portable manifest missing ${field}.`);
  }
  const expectedExternalRelativePath = manifest.gameId === 'system'
    ? ['system', 'smoke-tests', manifest.laneId, manifest.runId].join('/')
    : resolveRunRelativePath(manifest.gameId, manifest.laneId, manifest.runId);
  if (manifest.externalRelativePath !== expectedExternalRelativePath) {
    throw new Error(`Portable manifest path identity mismatch: ${manifest.externalRelativePath}`);
  }
  const text = JSON.stringify(manifest);
  if (/[A-Za-z]:[\\/]/.test(text) || text.includes('file://')) {
    throw new Error('Portable manifest contains an absolute local path.');
  }
  for (const file of manifest.files || []) {
    const segments = String(file.relativePath || '').split('/');
    if (
      !file.relativePath
      || path.posix.isAbsolute(file.relativePath)
      || segments.some((segment) => !SAFE_FILENAME.test(segment) || segment === '.' || segment === '..')
    ) {
      throw new Error(`Portable manifest contains unsafe file path: ${file.relativePath}`);
    }
    if (!Number.isSafeInteger(file.bytes) || file.bytes < 0 || !/^[a-f0-9]{64}$/.test(file.sha256)) {
      throw new Error(`Portable manifest has invalid binary identity: ${file.relativePath}`);
    }
  }
  return manifest;
}
function finalizeExternalRun({
  run,
  sourceCommit,
  captureScript,
  captureScriptVersion = '1',
  captureConfiguration = null,
  portableManifestPath,
}) {
  const files = buildFileRecords(run);
  const createdAt = new Date().toISOString();
  const portableManifest = assertPortableManifest({
    schemaVersion: 1,
    storageClass: 'external-heavy',
    rootKey: 'TGA_EVIDENCE_ROOT',
    repository: 'tiny-goblin-academy',
    sourceCommit,
    createdAt,
    gameId: run.gameId,
    laneId: run.laneId,
    runId: run.runId,
    externalRelativePath: run.externalRelativePath,
    files,
    captureScript: captureScript || null,
    captureScriptVersion,
    captureConfiguration,
    externalAvailability: 'local-confirmed',
    agentReviewPassed: false,
    humanReviewPassed: false,
  });
  const externalManifest = {
    ...portableManifest,
    createdAt,
    localEvidenceRoot: run.root,
    localRunDirectory: run.runDir,
  };
  const externalManifestPath = path.join(run.runDir, 'external-manifest.json');
  if (portableManifestPath && fs.existsSync(portableManifestPath)) {
    throw new Error(`Portable manifest already exists: ${portableManifestPath}`);
  }
  writeJson(externalManifestPath, externalManifest);
  if (portableManifestPath) writeJson(portableManifestPath, portableManifest);
  return { portableManifest, externalManifest, externalManifestPath, portableManifestPath };
}
function verifyManifest(manifestPath, options = {}) {
  const manifest = assertPortableManifest(readJson(manifestPath));
  const config = options.config
    ? validateConfig(options.config)
    : resolveEvidenceConfig({ repoRoot: options.repoRoot, env: options.env });
  verifyEvidenceStorage(config, options);
  const runDir = path.join(config.evidenceRoot, ...manifest.externalRelativePath.split('/'));
  if (!isWithin(config.evidenceRoot, runDir)) throw new Error('Manifest path escapes configured evidence root.');
  let filesVerified = 0;
  for (const file of manifest.files) {
    const fullPath = path.join(runDir, ...file.relativePath.split('/'));
    if (!isWithin(runDir, fullPath)) throw new Error(`Manifest file escapes run directory: ${file.relativePath}`);
    if (!fs.existsSync(fullPath)) throw new Error(`Manifest file is missing: ${file.relativePath}`);
    const bytes = fs.statSync(fullPath).size;
    if (bytes !== file.bytes) throw new Error(`Manifest bytes mismatch for ${file.relativePath}: ${bytes} != ${file.bytes}`);
    const sha256 = sha256File(fullPath);
    if (sha256 !== file.sha256) throw new Error(`Manifest SHA-256 mismatch for ${file.relativePath}.`);
    filesVerified += 1;
  }
  return { ok: true, filesVerified, manifestPath, runDir };
}

function classifyRepositoryPath(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/').replace(/^\.\//, '').toLowerCase();
  if (
    normalized.startsWith('assets/academy/materials/source/')
    || normalized.includes('/source-assets/')
    || normalized.includes('/fonts/')
    || normalized.includes('/derived/')
    || normalized.startsWith('assets/academy/hub/')
  ) return 'production-or-source-asset';
  if (normalized.startsWith('tools/evidence/')) return 'evidence-tooling';
  if (
    normalized.startsWith('docs/evidence/')
    || normalized.startsWith('assets/academy/evidence/')
    || normalized.startsWith('hub/evidence/')
    || /^games\/tier-1\/[^/]+\/evidence\//.test(normalized)
  ) return 'evidence';
  return 'other';
}
function validateEvidenceCandidates(candidates, options = {}) {
  const grandfatheredPaths = options.grandfatheredPaths || new Set();
  const compactProofAllowlist = options.compactProofAllowlist || new Set();
  const violations = [];
  for (const candidate of candidates) {
    const relativePath = candidate.path.replace(/\\/g, '/');
    if (classifyRepositoryPath(relativePath) !== 'evidence') continue;
    if (grandfatheredPaths.has(relativePath)) continue;
    const extension = (candidate.extension || path.extname(relativePath)).toLowerCase();
    if (LIGHTWEIGHT_EXTENSIONS.has(extension)) continue;
    if (!candidate.tracked || !candidate.added) continue;
    const lowered = relativePath.toLowerCase();
    let reason = null;
    if (HEAVY_VIDEO_EXTENSIONS.has(extension)) {
      reason = 'New tracked video evidence must use storageClass external-heavy.';
    } else if (/(^|\/)(originals?|full-resolution(?:-sequence)?|raw-comparisons?)(\/|$)/.test(lowered)) {
      reason = 'New full-resolution sequence or original binary must remain external-heavy.';
    } else if (IMAGE_EXTENSIONS.has(extension) && Number(candidate.bytes) > TRACKED_PROOF_MAX_BYTES) {
      reason = 'New generated evidence still exceeds the 2 MiB tracked-proof ceiling.';
    } else if (!compactProofAllowlist.has(relativePath)) {
      reason = 'New evidence binary is not a grandfathered file or approved compact proof allowlist entry.';
    }
    if (reason) violations.push({ path: relativePath, reason });
  }
  return { ok: violations.length === 0, violations };
}

function loadGrandfatheredRecords(inventoryPath) {
  const inventory = readJson(inventoryPath);
  return new Map(
    (inventory.files || [])
      .filter((entry) => entry.binaryEvidence && entry.gitRelationship === 'tracked')
      .map((entry) => [entry.path.replace(/\\/g, '/'), {
        bytes: entry.bytes,
        sha256: entry.sha256,
      }]),
  );
}

function loadGrandfatheredPaths(inventoryPath) {
  return new Set(loadGrandfatheredRecords(inventoryPath).keys());
}
function runGit(repoRoot, args) {
  const result = spawnSync('git', args, { cwd: repoRoot, encoding: 'utf8', windowsHide: true });
  if (result.status !== 0) throw new Error(`git ${args.join(' ')} failed: ${result.stderr || result.stdout}`);
  return result.stdout;
}

function collectAddedEvidenceCandidates(repoRoot) {
  const names = new Set();
  for (const args of [
    ['diff', '--name-status'],
    ['diff', '--cached', '--name-status'],
  ]) {
    for (const line of runGit(repoRoot, args).split(/\r?\n/)) {
      const [status, ...parts] = line.split('\t');
      if (status && status.startsWith('A') && parts.length) names.add(parts.at(-1));
    }
  }
  for (const name of runGit(repoRoot, ['ls-files', '--others', '--exclude-standard']).split(/\r?\n/)) {
    if (name) names.add(name);
  }
  return [...names].map((relativePath) => {
    const fullPath = path.join(repoRoot, ...relativePath.split('/'));
    return {
      path: relativePath,
      bytes: fs.existsSync(fullPath) ? fs.statSync(fullPath).size : 0,
      extension: path.extname(relativePath),
      tracked: true,
      added: true,
    };
  });
}

function validateRepositoryEvidenceStorage({ repoRoot, inventoryPath, allowlistPath }) {
  const inventoryFile = inventoryPath || path.join(repoRoot, 'docs', 'evidence', 'TINY_GOBLIN_ACADEMY_EVIDENCE_SIZE_INVENTORY.json');
  const allowlistFile = allowlistPath || path.join(repoRoot, 'tools', 'evidence', 'approved-compact-proofs.json');
  const grandfatheredRecords = loadGrandfatheredRecords(inventoryFile);
  const grandfatheredPaths = new Set(grandfatheredRecords.keys());
  const allowlist = fs.existsSync(allowlistFile) ? readJson(allowlistFile).paths || [] : [];
  const result = validateEvidenceCandidates(collectAddedEvidenceCandidates(repoRoot), {
    grandfatheredPaths,
    compactProofAllowlist: new Set(allowlist),
  });
  const grandfatheredViolations = [];
  for (const [relativePath, expected] of grandfatheredRecords) {
    const fullPath = path.join(repoRoot, ...relativePath.split('/'));
    if (!fs.existsSync(fullPath)) {
      grandfatheredViolations.push(`${relativePath}: missing`);
      continue;
    }
    const actualBytes = fs.statSync(fullPath).size;
    if (actualBytes !== expected.bytes) {
      grandfatheredViolations.push(`${relativePath}: byte mismatch ${actualBytes} != ${expected.bytes}`);
      continue;
    }
    const actualSha256 = sha256File(fullPath);
    if (actualSha256 !== expected.sha256) {
      grandfatheredViolations.push(`${relativePath}: SHA-256 mismatch`);
    }
  }
  if (grandfatheredViolations.length) {
    throw new Error(`Grandfathered evidence integrity failed:\n${grandfatheredViolations.slice(0, 10).join('\n')}`);
  }
  if (!result.ok) throw new Error(result.violations.map((entry) => `${entry.path}: ${entry.reason}`).join('\n'));
  return { ok: true, grandfatheredFiles: grandfatheredPaths.size, addedCandidatesChecked: collectAddedEvidenceCandidates(repoRoot).length };
}
function initializeEvidenceStorage({ repoRoot, config, overwriteReviewed = false }) {
  const normalized = validateConfig(config);
  const configPath = path.join(repoRoot, ...LOCAL_CONFIG_RELATIVE.split('/'));
  if (fs.existsSync(configPath) && !overwriteReviewed) {
    throw new Error(`Local evidence configuration already exists: ${configPath}`);
  }
  verifyEvidenceStorage(normalized, { repoRoot, allowMissingRoot: true });
  fs.mkdirSync(normalized.evidenceRoot, { recursive: true });
  for (const relativePath of ROOT_TAXONOMY) {
    fs.mkdirSync(path.join(normalized.evidenceRoot, ...relativePath.split('/')), { recursive: true });
  }
  writeJson(configPath, {
    schemaVersion: 1,
    evidenceRoot: normalized.evidenceRoot,
    expectedVolumeLabel: normalized.expectedVolumeLabel,
    expectedVolumeSerial: normalized.expectedVolumeSerial.toUpperCase(),
    expectedFilesystem: normalized.expectedFilesystem,
    minimumFreeBytes: normalized.minimumFreeBytes,
  });
  return { configPath, evidenceRoot: normalized.evidenceRoot, taxonomy: ROOT_TAXONOMY };
}

function evidenceDoctor({ repoRoot, env = process.env }) {
  const config = resolveEvidenceConfig({ repoRoot, env });
  const verified = verifyEvidenceStorage(config, { repoRoot });
  return {
    configurationSource: config.configurationSource,
    evidenceRoot: config.evidenceRoot,
    physicalVolume: verified.volume,
    readable: verified.access.readable,
    writable: verified.access.writable,
    freeBytes: Number(verified.volume.freeBytes),
    sourceRepositoryContainmentSafe: true,
    readyForHeavyCapture: true,
  };
}
function findRepositoryRoot(startPath) {
  let current = normalizePath(startPath);
  while (true) {
    if (fs.existsSync(path.join(current, '.git'))) return current;
    const parent = path.dirname(current);
    if (parent === current) throw new Error(`Unable to locate repository root from ${startPath}`);
    current = parent;
  }
}

function makeRunId(prefix = 'run') {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z').toLowerCase();
  return `${prefix}-${stamp}-p${process.pid}`;
}

function portableManifestPathFor(run) {
  return path.join(
    run.repoRoot,
    'docs',
    'evidence',
    'external-runs',
    run.gameId,
    run.laneId,
    `${run.runId}.json`,
  );
}

module.exports = {
  LOCAL_CONFIG_RELATIVE,
  ROOT_TAXONOMY,
  TRACKED_PROOF_MAX_BYTES,
  assertPortableManifest,
  classifyRepositoryPath,
  collectAddedEvidenceCandidates,
  createExternalRun,
  evidenceDoctor,
  finalizeExternalRun,
  findRepositoryRoot,
  initializeEvidenceStorage,
  isWithin,
  loadGrandfatheredPaths,
  loadGrandfatheredRecords,
  makeRunId,
  mediaTypeFor,
  portableManifestPathFor,
  reserveEvidenceFile,
  resolveRunRelativePath,
  runGit,
  resolveEvidenceConfig,
  sanitizeFilename,
  sha256File,
  validateConfig,
  validateEvidenceCandidates,
  validateRepositoryEvidenceStorage,
  verifyEvidenceStorage,
  verifyManifest,
  windowsVolumeProvider,
  writeJson,
};
