#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { getLaneProfile, listLaneTypes } from './lib/asset-taxonomy.mjs';
import { readImageMetadata } from './lib/image-metadata.mjs';
import { getCleanupMethod, listCleanupMethods } from './lib/cleanup-method-registry.mjs';
import { buildRunLog, writeRunLog } from './lib/run-log.mjs';
import { sha256File } from './lib/file-hash.mjs';
import {
  allowedCommands,
  allowedMethodStatuses,
  provenanceContractVersion,
  requiredManifestPipelineRunFields,
  requiredRunLogFields
} from './lib/provenance-contract.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const cliPath = 'scripts/asset-pipeline/cli.mjs';

function usage() {
  console.log(`Tiny Goblin Academy Asset Pipeline CLI

Usage:
  node scripts/asset-pipeline/cli.mjs list-lanes
  node scripts/asset-pipeline/cli.mjs profile --type <lane-type> [--json]
  node scripts/asset-pipeline/cli.mjs list-cleanup-methods [--json]
  node scripts/asset-pipeline/cli.mjs inspect-source --source <path> [--json]
  node scripts/asset-pipeline/cli.mjs make-evidence --manifest <path> --out <folder>
  node scripts/asset-pipeline/cli.mjs map-grid-batch --semantic-manifest <path> --sources-dir <folder> --output-manifest <path> --evidence-dir <folder> --run-log <path> [--agent <name>]
  node scripts/asset-pipeline/cli.mjs cleanup-candidate --method <method> --source <path> [--manifest <path>] [--output <path>] [--cleanup-manifest <path>] [--evidence-dir <path>] [--preview <path>] [--run-log <path>] [--agent <name>] [--evidence-prefix <slug>] [--lane-title <title>] [--domain <domain>] [--operational-type <type>] [--pipeline-use <use>] [--excluded-regions <csv>] [--risk-regex <regex>] [--background-reference-region <index>] [--gray-sat-max <n>] [--gray-min <n>] [--gray-max <n>] [--channel-delta-max <n>] [--reference-distance-max <n>] [--edge-seed-inset <n>] [--edge-expansion-passes <n>] [--edge-alpha <n>]
  node scripts/asset-pipeline/cli.mjs validate
  node scripts/asset-pipeline/cli.mjs validate-provenance [--legacy-ok|--hard]
  node scripts/asset-pipeline/cli.mjs explain-provenance-contract [--json]
  node scripts/asset-pipeline/cli.mjs write-run-log --run-log <path> --command <name> [--method <method>] [--source <path>] [--manifest <path>] [--output <path>]...

Rules:
  Source PNGs remain untouched.
  Cleanup methods must be registered.
  Experimental methods are blocked unless explicitly implemented and allowed in a future lane.
  Runtime approval is out of scope for this CLI.
`);
}

function argValue(args, name, fallback = null) {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

function argValues(args, name) {
  const values = [];
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === name && args[i + 1]) values.push(args[i + 1]);
  }
  return values;
}

function hasArg(args, name) {
  return args.includes(name);
}

function repoPath(inputPath) {
  return path.isAbsolute(inputPath) ? inputPath : path.join(repoRoot, inputPath);
}

function printJson(data) {
  console.log(JSON.stringify(data, null, 2));
}

function currentGitBaseline() {
  const result = spawnSync('git', ['log', '--oneline', '-n', '1'], {
    cwd: repoRoot,
    encoding: 'utf8'
  });
  return result.status === 0 ? result.stdout.trim() : null;
}

function run(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: 'inherit'
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function listFilesRecursive(dirPath, predicate = () => true) {
  const results = [];
  const fullDir = repoPath(dirPath);
  if (!fs.existsSync(fullDir)) return results;
  const stack = [fullDir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile() && predicate(fullPath)) {
        results.push(path.relative(repoRoot, fullPath).replaceAll(path.sep, '/'));
      }
    }
  }
  return results.sort();
}

function listLanes(args) {
  const lanes = listLaneTypes();
  if (hasArg(args, '--json')) return printJson(lanes);
  console.log('Supported asset-pipeline lane profiles:');
  for (const lane of lanes) console.log(`- ${lane}`);
}

function profile(args) {
  const type = argValue(args, '--type');
  if (!type) {
    console.error('Missing --type');
    process.exit(1);
  }
  const laneProfile = getLaneProfile(type);
  if (!laneProfile) {
    console.error(`Unknown operational type: ${type}`);
    console.error(`Known types: ${listLaneTypes().join(', ')}`);
    process.exit(1);
  }
  if (hasArg(args, '--json')) return printJson(laneProfile);
  console.log(`Operational type: ${laneProfile.operationalType}`);
  console.log(`Manifest contract: ${laneProfile.manifestContract}`);
  console.log(`Required evidence: ${laneProfile.requiredEvidence.join(', ')}`);
  console.log(`Cleanup policy: ${laneProfile.cleanupPolicy}`);
  console.log(`Human review gate: ${laneProfile.humanReviewGate}`);
  console.log(`Forbidden actions: ${laneProfile.forbiddenActions.join(', ')}`);
  console.log(`Next safe actions: ${laneProfile.nextSafeActions.join(', ')}`);
}

function listMethods(args) {
  const methods = listCleanupMethods();
  if (hasArg(args, '--json')) return printJson(methods);
  console.log('Registered cleanup methods:');
  for (const method of methods) {
    console.log(`- ${method.id} [${method.status}] implemented=${method.implemented}`);
    console.log(`  ${method.description}`);
  }
}

function inspectSource(args) {
  const source = argValue(args, '--source');
  if (!source) {
    console.error('Missing --source');
    process.exit(1);
  }
  const fullPath = repoPath(source);
  const metadata = readImageMetadata(fullPath);
  const result = {
    ...metadata,
    repoRelativePath: path.relative(repoRoot, fullPath).replaceAll(path.sep, '/'),
    sha256: sha256File(fullPath)
  };
  if (hasArg(args, '--json')) return printJson(result);
  console.log(`Source: ${result.repoRelativePath}`);
  console.log(`Exists: ${result.exists}`);
  console.log(`Format: ${result.format}`);
  console.log(`Dimensions: ${result.width}x${result.height}`);
  console.log(`Extension: ${result.extension}`);
  console.log(`SHA256: ${result.sha256}`);
}

function makeEvidence(args) {
  const manifest = argValue(args, '--manifest');
  const out = argValue(args, '--out');
  if (!manifest || !out) {
    console.error('Missing --manifest or --out');
    process.exit(1);
  }
  run('python', ['scripts/asset-pipeline/make-region-evidence.py', '--manifest', manifest, '--out', out]);
}

function mapGridBatch(args) {
  const semanticManifest = argValue(args, '--semantic-manifest');
  const sourcesDir = argValue(args, '--sources-dir');
  const outputManifest = argValue(args, '--output-manifest');
  const evidenceDir = argValue(args, '--evidence-dir');
  const runLogPath = argValue(args, '--run-log');
  const agent = argValue(args, '--agent', 'unknown-agent');
  if (!semanticManifest || !sourcesDir || !outputManifest || !evidenceDir || !runLogPath) {
    console.error('Missing --semantic-manifest, --sources-dir, --output-manifest, --evidence-dir, or --run-log');
    process.exit(1);
  }

  run('python', [
    'scripts/asset-pipeline/map-grid-batch.py',
    '--semantic-manifest', semanticManifest,
    '--sources-dir', sourcesDir,
    '--output-manifest', outputManifest,
    '--evidence-dir', evidenceDir,
    '--repo-root', repoRoot
  ]);

  const evidenceFiles = listFilesRecursive(evidenceDir, (filePath) => filePath.endsWith('.png'));
  const outputPaths = [outputManifest, ...evidenceFiles];
  const runLog = buildRunLog({
    toolPath: cliPath,
    command: 'map-grid-batch',
    method: 'proportional-8x8-grid-source-rects',
    methodStatus: 'mapping-only',
    methodParameters: {
      grid: '8x8',
      sourceRectStrategy: 'proportional-actual-dimensions',
      semanticRectPolicy: 'preserve-semantic-128-grid'
    },
    laneId: argValue(args, '--lane', 'h5-83-topdown-future-floor-tilesheets-batch-region-mapping'),
    repoRoot,
    agent,
    gitBaseline: currentGitBaseline(),
    sourcePath: semanticManifest,
    manifestPath: semanticManifest,
    inputManifests: [],
    outputPaths,
    evidenceFiles,
    validationCommands: [
      'node scripts/asset-pipeline/cli.mjs validate-provenance',
      'node scripts/asset-pipeline/smoke-check.mjs'
    ],
    warnings: [
      'Future pantry mapping only; no cleanup, runtime tilemap approval, collision approval, pathfinding approval, walkability approval, hazard/water/slime/portal/trigger behavior, or autotiling approval.'
    ],
    sourcePngModified: false,
    runtimeFilesModified: false
  });

  const manifestPath = repoPath(outputManifest);
  const manifestData = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifestData.sourceSha256 = runLog.sourceSha256;
  manifestData.pipelineRun = {
    tool: cliPath,
    command: 'map-grid-batch',
    method: 'proportional-8x8-grid-source-rects',
    methodStatus: 'mapping-only',
    runLog: runLogPath.replaceAll('\\', '/'),
    sourceSha256: runLog.sourceSha256,
    generatedAt: runLog.completedAt,
    gitBaseline: runLog.gitBaseline,
    sourcePngModified: false,
    runtimeFilesModified: false
  };
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifestData, null, 2)}\n`, 'utf8');

  runLog.outputFiles = outputPaths.map((outputPath) => ({
    path: outputPath,
    sha256: sha256File(repoPath(outputPath))
  }));
  runLog.outputPaths = runLog.outputFiles;
  writeRunLog(repoPath(runLogPath), runLog);
  console.log(`Run log written: ${runLogPath}`);
}

function validate() {
  const commands = [
    ['node', ['scripts/validate-academy-manifest.mjs']],
    ['node', ['scripts/validate-hub-icon-regions.mjs']],
    ['node', ['scripts/validate-hub-icons.mjs']],
    ['node', ['scripts/validate-academy-asset-manifests.mjs']],
    ['node', ['scripts/validate-academy-animation-manifests.mjs']],
    ['node', ['scripts/asset-pipeline/smoke-check.mjs']]
  ];
  for (const [command, commandArgs] of commands) run(command, commandArgs);
}

function validateProvenance(args) {
  const modeArgs = args.includes('--hard') ? ['--hard'] : ['--legacy-ok'];
  run('node', ['scripts/asset-pipeline/validate-pipeline-provenance.mjs', ...modeArgs]);
}

function explainProvenanceContract(args) {
  const data = {
    contractVersion: provenanceContractVersion,
    canonicalTool: cliPath,
    requiredRunLogFields,
    requiredManifestPipelineRunFields,
    allowedMethodStatuses,
    allowedCommands,
    legacyPolicy: 'Pre-H5.67 manifests are allowed in legacy-ok mode. H5.67+ generated asset outputs must include pipelineRun provenance and run logs.',
    hardModePolicy: 'Hard mode fails manifests missing pipelineRun provenance.',
    sourceMutationPolicy: 'sourcePngModified must not be true.',
    runtimeMutationPolicy: 'runtimeFilesModified must not be true for asset-only lanes.'
  };
  if (hasArg(args, '--json')) return printJson(data);
  console.log('Asset Pipeline Provenance Contract');
  console.log(` - Contract version: ${data.contractVersion}`);
  console.log(` - Canonical tool: ${data.canonicalTool}`);
  console.log(` - Required run-log fields: ${requiredRunLogFields.join(', ')}`);
  console.log(` - Required manifest pipelineRun fields: ${requiredManifestPipelineRunFields.join(', ')}`);
  console.log(` - Allowed method statuses: ${allowedMethodStatuses.join(', ')}`);
  console.log(` - Allowed commands: ${allowedCommands.join(', ')}`);
  console.log(` - Legacy policy: ${data.legacyPolicy}`);
  console.log(` - Hard mode policy: ${data.hardModePolicy}`);
  console.log(` - Source mutation policy: ${data.sourceMutationPolicy}`);
  console.log(` - Runtime mutation policy: ${data.runtimeMutationPolicy}`);
}

function cleanupCandidate(args) {
  const methodId = argValue(args, '--method');
  const source = argValue(args, '--source');
  const manifest = argValue(args, '--manifest');
  const output = argValue(args, '--output');
  const cleanupManifest = argValue(args, '--cleanup-manifest');
  const evidenceDir = argValue(args, '--evidence-dir');
  const preview = argValue(args, '--preview');
  const runLogPath = argValue(args, '--run-log');
  const agent = argValue(args, '--agent', 'unknown-agent');
  if (!methodId || !source) {
    console.error('Missing --method or --source');
    process.exit(1);
  }
  const method = getCleanupMethod(methodId);
  if (!method) {
    console.error(`Unregistered cleanup method: ${methodId}`);
    process.exit(1);
  }
  if (!method.implemented) {
    console.error(`Cleanup method '${methodId}' is registered as ${method.status} but is not implemented for canonical CLI use.`);
    process.exit(1);
  }
  if (method.requiresOutput && !output) {
    console.error(`Cleanup method '${methodId}' requires --output`);
    process.exit(1);
  }
  if (method.requiresPreview && !preview) {
    console.error(`Cleanup method '${methodId}' requires --preview`);
    process.exit(1);
  }
  if (method.requiresManifest && !manifest) {
    console.error(`Cleanup method '${methodId}' requires --manifest`);
    process.exit(1);
  }
  if (method.requiresCleanupManifest && !cleanupManifest) {
    console.error(`Cleanup method '${methodId}' requires --cleanup-manifest`);
    process.exit(1);
  }
  if (method.requiresEvidenceDir && !evidenceDir) {
    console.error(`Cleanup method '${methodId}' requires --evidence-dir`);
    process.exit(1);
  }

  const sourceFull = repoPath(source);
  const outputFull = output ? repoPath(output) : null;
  const previewFull = preview ? repoPath(preview) : null;
  const effectiveMethod = method.aliasOf ? getCleanupMethod(method.aliasOf) : method;
  const generated = [];
  const warnings = [];
  const methodParameters = {};

  if (effectiveMethod.id === 'no-cleanup-reference-only') {
    warnings.push('No cleanup performed; source remains reference/planning only.');
  } else if (effectiveMethod.id === 'alpha-pass-through' || effectiveMethod.id === 'true-alpha-regenerated-source') {
    fs.mkdirSync(path.dirname(outputFull), { recursive: true });
    fs.copyFileSync(sourceFull, outputFull);
    generated.push(output);
  } else if (effectiveMethod.id === 'edge-connected-checker-cleanup') {
    if (!runLogPath) {
      console.error(`Cleanup method '${methodId}' requires --run-log for H5.67 provenance`);
      process.exit(1);
    }
    const cleanupArgs = [
      'scripts/asset-pipeline/cleanup-edge-connected-checker.py',
      '--input', source,
      '--manifest', manifest,
      '--output', output,
      '--cleanup-manifest', cleanupManifest,
      '--evidence-dir', evidenceDir,
      '--excluded-regions', argValue(args, '--excluded-regions', ''),
      '--evidence-prefix', argValue(args, '--evidence-prefix', 'edge-connected-checker'),
      '--lane-title', argValue(args, '--lane-title', 'Edge-Connected Checker Cleanup'),
      '--domain', argValue(args, '--domain', 'asset-cleanup'),
      '--operational-type', argValue(args, '--operational-type', 'edge-connected-checker-cleanup-candidate'),
      '--pipeline-use', argValue(args, '--pipeline-use', 'draft-cleanup-candidate'),
      '--risk-regex', argValue(args, '--risk-regex', ''),
      '--method', method.id,
      '--method-status', method.status,
      '--run-log', runLogPath,
      '--repo-root', repoRoot
    ];
    const backgroundReferenceRegion = argValue(args, '--background-reference-region', null);
    if (backgroundReferenceRegion !== null) {
      cleanupArgs.push('--background-reference-region', backgroundReferenceRegion);
    }
    for (const optionName of [
      '--gray-sat-max',
      '--gray-min',
      '--gray-max',
      '--channel-delta-max',
      '--reference-distance-max',
      '--edge-seed-inset',
      '--edge-expansion-passes',
      '--edge-alpha'
    ]) {
      const optionValue = argValue(args, optionName, null);
      if (optionValue !== null) {
        cleanupArgs.push(optionName, optionValue);
        methodParameters[optionName.replace(/^--/, '').replaceAll('-', '_')] = Number.isNaN(Number(optionValue)) ? optionValue : Number(optionValue);
      }
    }
    if (backgroundReferenceRegion !== null) methodParameters.background_reference_region = Number(backgroundReferenceRegion);
    run('python', cleanupArgs);
    generated.push(output, cleanupManifest);
  } else if (effectiveMethod.id === 'flood-fill-gray-background') {
    run('python', [
      'scripts/clean-fake-transparent-sheet.py',
      '--input', source,
      '--output', output,
      '--preview', preview
    ]);
    generated.push(output, preview);
  } else {
    console.error(`No canonical implementation for cleanup method: ${methodId}`);
    process.exit(1);
  }

  if (runLogPath) {
    const generatedEvidence = evidenceDir && fs.existsSync(repoPath(evidenceDir))
      ? fs.readdirSync(repoPath(evidenceDir))
        .filter((entry) => entry.endsWith('.png'))
        .map((entry) => `${evidenceDir.replaceAll('\\', '/')}/${entry}`)
      : (preview ? [preview] : []);
    const runLog = buildRunLog({
      toolPath: cliPath,
      command: 'cleanup-candidate',
      method: method.id,
      methodStatus: method.status,
      methodParameters: typeof methodParameters === 'object' ? methodParameters : {},
      laneId: argValue(args, '--lane', null),
      repoRoot,
      agent,
      gitBaseline: currentGitBaseline(),
      sourcePath: source,
      manifestPath: manifest,
      inputManifests: [],
      outputPaths: generated,
      evidenceFiles: generatedEvidence,
      validationCommands: [
        'node scripts/asset-pipeline/cli.mjs validate-provenance',
        'node scripts/asset-pipeline/smoke-check.mjs'
      ],
      warnings: [
        ...warnings,
        ...(method.id === 'edge-connected-checker-cleanup' ? [
          'Source may be degraded/fake-transparent; edge-connected-checker-cleanup removes only edge-connected background-like masks and requires human review.'
        ] : [])
      ],
      sourcePngModified: false,
      runtimeFilesModified: false
    });
    if (cleanupManifest && fs.existsSync(repoPath(cleanupManifest))) {
      const manifestPath = repoPath(cleanupManifest);
      const cleanupData = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      cleanupData.sourceSha256 = runLog.sourceSha256;
      cleanupData.outputSha256 = runLog.outputFiles.find((file) => file.path === output)?.sha256 ?? null;
      cleanupData.pipelineRun = {
        tool: cliPath,
        command: 'cleanup-candidate',
        method: method.id,
        methodStatus: method.status,
        runLog: runLogPath.replaceAll('\\', '/'),
        sourceSha256: runLog.sourceSha256,
        generatedAt: runLog.completedAt,
        gitBaseline: runLog.gitBaseline,
        sourcePngModified: false,
        runtimeFilesModified: false
      };
      fs.writeFileSync(manifestPath, `${JSON.stringify(cleanupData, null, 2)}\n`, 'utf8');
      const refreshedOutputs = runLog.outputFiles.map((file) => ({
        ...file,
        sha256: sha256File(repoPath(file.path))
      }));
      runLog.outputFiles = refreshedOutputs;
      runLog.outputPaths = refreshedOutputs;
    }
    writeRunLog(repoPath(runLogPath), runLog);
    console.log(`Run log written: ${runLogPath}`);
  }
}

function writeLog(args) {
  const runLogPath = argValue(args, '--run-log');
  const command = argValue(args, '--command');
  if (!runLogPath || !command) {
    console.error('Missing --run-log or --command');
    process.exit(1);
  }
  const methodId = argValue(args, '--method');
  const method = methodId ? getCleanupMethod(methodId) : null;
  const outputs = argValues(args, '--output');
  const runLog = buildRunLog({
    toolPath: cliPath,
    command,
    method: methodId,
    methodStatus: method?.status ?? null,
    laneId: argValue(args, '--lane', null),
    repoRoot,
    agent: argValue(args, '--agent', 'unknown-agent'),
    gitBaseline: currentGitBaseline(),
    sourcePath: argValue(args, '--source'),
    manifestPath: argValue(args, '--manifest'),
    inputManifests: argValues(args, '--input-manifest'),
    outputPaths: outputs,
    evidenceFiles: argValues(args, '--evidence'),
    validationCommands: argValues(args, '--validation'),
    warnings: argValues(args, '--warning'),
    sourcePngModified: false,
    runtimeFilesModified: false
  });
  writeRunLog(repoPath(runLogPath), runLog);
  console.log(`Run log written: ${runLogPath}`);
}

const args = process.argv.slice(2);
const command = args[0];
const rest = args.slice(1);

switch (command) {
  case 'list-lanes':
    listLanes(rest);
    break;
  case 'profile':
    profile(rest);
    break;
  case 'list-cleanup-methods':
    listMethods(rest);
    break;
  case 'inspect-source':
    inspectSource(rest);
    break;
  case 'make-evidence':
    makeEvidence(rest);
    break;
  case 'map-grid-batch':
    mapGridBatch(rest);
    break;
  case 'cleanup-candidate':
    cleanupCandidate(rest);
    break;
  case 'validate':
    validate();
    break;
  case 'validate-provenance':
    validateProvenance(rest);
    break;
  case 'explain-provenance-contract':
    explainProvenanceContract(rest);
    break;
  case 'write-run-log':
    writeLog(rest);
    break;
  case '--help':
  case '-h':
  case undefined:
    usage();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    usage();
    process.exit(1);
}
