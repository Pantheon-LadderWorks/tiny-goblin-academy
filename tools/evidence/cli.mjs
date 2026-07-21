#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import core from './evidence.mjs';

const toolDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = core.findRepositoryRoot(toolDir);

function parseArgs(argv) {
  const result = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith('--')) {
      result._.push(value);
      continue;
    }
    const key = value.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) result[key] = true;
    else {
      result[key] = next;
      index += 1;
    }
  }
  return result;
}

function required(args, name) {
  if (!args[name] || args[name] === true) throw new Error(`Missing required --${name}.`);
  return args[name];
}
function initCommand(args) {
  const minimumFreeBytes = Number(required(args, 'minimum-free-bytes'));
  if (!Number.isSafeInteger(minimumFreeBytes)) throw new Error('--minimum-free-bytes must be an integer.');
  const result = core.initializeEvidenceStorage({
    repoRoot,
    overwriteReviewed: args['overwrite-reviewed'] === true,
    config: {
      schemaVersion: 1,
      evidenceRoot: required(args, 'root'),
      expectedVolumeLabel: required(args, 'label'),
      expectedVolumeSerial: required(args, 'serial'),
      expectedFilesystem: required(args, 'filesystem'),
      minimumFreeBytes,
    },
  });
  console.log(JSON.stringify(result, null, 2));
}

function doctorCommand() {
  console.log(JSON.stringify(core.evidenceDoctor({ repoRoot }), null, 2));
}

function whereCommand() {
  const config = core.resolveEvidenceConfig({ repoRoot });
  console.log(config.evidenceRoot);
  for (const relativePath of core.ROOT_TAXONOMY) console.log(relativePath);
}

function verifyCommand(args) {
  const manifest = path.resolve(required(args, 'manifest'));
  console.log(JSON.stringify(core.verifyManifest(manifest, { repoRoot }), null, 2));
}

function validateCommand() {
  const doctor = core.evidenceDoctor({ repoRoot });
  const policy = core.validateRepositoryEvidenceStorage({ repoRoot });
  console.log(JSON.stringify({ doctor, policy }, null, 2));
}
function smokeCommand(args) {
  const config = core.resolveEvidenceConfig({ repoRoot });
  core.verifyEvidenceStorage(config, { repoRoot });
  const runId = required(args, 'run-id');
  core.sanitizeFilename(`${runId}.json`);
  const relativeSegments = ['system', 'smoke-tests', 'h6-18-external-output-foundation', runId];
  const runDir = path.join(config.evidenceRoot, ...relativeSegments);
  if (!core.isWithin(config.evidenceRoot, runDir)) throw new Error('Smoke run escapes evidence root.');
  if (fs.existsSync(runDir)) throw new Error(`Smoke run collision refused: ${runDir}`);
  for (const segment of ['stills', 'recordings', 'originals']) {
    fs.mkdirSync(path.join(runDir, segment), { recursive: true });
  }
  const run = {
    schemaVersion: 1,
    repoRoot,
    root: config.evidenceRoot,
    runDir,
    gameId: 'system',
    laneId: 'h6-18-external-output-foundation',
    runId,
    externalRelativePath: relativeSegments.join('/'),
  };
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+Xj+WAAAAAElFTkSuQmCC',
    'base64',
  );
  fs.writeFileSync(core.reserveEvidenceFile(run, 'stills', 'synthetic-proof.png'), png);
  fs.writeFileSync(
    core.reserveEvidenceFile(run, 'root', 'telemetry.json'),
    `${JSON.stringify({ synthetic: true, lane: 'h6.18', purpose: 'external-output-foundation-smoke' }, null, 2)}\n`,
    'utf8',
  );
  const sourceCommit = core.runGit(repoRoot, ['rev-parse', 'HEAD']).trim();
  const portableManifestPath = path.join(
    repoRoot,
    'docs',
    'evidence',
    'h6-18-external-evidence-output-foundation',
    `portable-smoke-manifest-${runId}.json`,
  );
  const result = core.finalizeExternalRun({
    run,
    sourceCommit,
    captureScript: 'tools/evidence/cli.mjs',
    captureScriptVersion: 'h6.18',
    portableManifestPath,
  });
  const pngRecord = result.portableManifest.files.find((file) => file.relativePath.endsWith('.png'));
  if (!pngRecord || pngRecord.bytes >= 64 * 1024) throw new Error('Synthetic PNG exceeds 64 KiB.');
  console.log(JSON.stringify({
    runDirectory: runDir,
    externalRelativePath: run.externalRelativePath,
    portableManifestPath,
    files: result.portableManifest.files,
  }, null, 2));
}

const args = parseArgs(process.argv.slice(2));
const command = args._[0];
const handlers = {
  init: initCommand,
  doctor: doctorCommand,
  where: whereCommand,
  verify: verifyCommand,
  validate: validateCommand,
  smoke: smokeCommand,
};

try {
  if (!handlers[command]) throw new Error(`Unknown evidence command: ${command || '<missing>'}`);
  handlers[command](args);
} catch (error) {
  console.error(`Evidence command failed: ${error.message}`);
  process.exitCode = 1;
}
