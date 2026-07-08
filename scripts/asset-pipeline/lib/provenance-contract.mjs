import fs from 'fs';
import path from 'path';

export const provenanceContractVersion = '0.1';

export const requiredRunLogFields = [
  'schemaVersion',
  'contractVersion',
  'tool',
  'command',
  'method',
  'methodStatus',
  'laneId',
  'agent',
  'gitBaseline',
  'startedAt',
  'completedAt',
  'sourcePath',
  'sourceSha256',
  'inputManifests',
  'outputFiles',
  'evidenceFiles',
  'validationCommands',
  'warnings',
  'sourcePngModified',
  'runtimeFilesModified',
  'status'
];

export const requiredManifestPipelineRunFields = [
  'tool',
  'command',
  'method',
  'methodStatus',
  'runLog',
  'sourceSha256',
  'generatedAt',
  'gitBaseline',
  'sourcePngModified',
  'runtimeFilesModified'
];

export const allowedMethodStatuses = [
  'canonical',
  'canonical-with-caution',
  'pilot-only',
  'experimental-unsafe-default',
  'mapping-only',
  'deprecated'
];

export const allowedCommands = [
  'inspect-source',
  'map-grid',
  'map-regions',
  'make-evidence',
  'cleanup-candidate',
  'cleanup-review',
  'defer-cleanup',
  'validate',
  'validate-provenance',
  'write-run-log',
  'create-run-log'
];

export function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function missingFields(object, fields) {
  return fields.filter((field) => !Object.prototype.hasOwnProperty.call(object ?? {}, field));
}

export function validateRunLogShape(runLog) {
  const errors = [];
  if (!isObject(runLog)) return ['run log must be an object'];

  const missing = missingFields(runLog, requiredRunLogFields);
  if (missing.length) errors.push(`missing run-log fields: ${missing.join(', ')}`);

  if (runLog.contractVersion && runLog.contractVersion !== provenanceContractVersion) {
    errors.push(`unsupported contractVersion: ${runLog.contractVersion}`);
  }
  if (runLog.command && !allowedCommands.includes(runLog.command)) {
    errors.push(`unknown command: ${runLog.command}`);
  }
  if (runLog.methodStatus && !allowedMethodStatuses.includes(runLog.methodStatus)) {
    errors.push(`unknown methodStatus: ${runLog.methodStatus}`);
  }
  if (runLog.sourcePngModified === true) {
    errors.push('sourcePngModified must not be true');
  }
  if (runLog.runtimeFilesModified === true) {
    errors.push('runtimeFilesModified must not be true for asset-only lanes');
  }
  if (runLog.outputFiles && !Array.isArray(runLog.outputFiles)) {
    errors.push('outputFiles must be an array');
  }
  if (Array.isArray(runLog.outputFiles)) {
    for (const [index, output] of runLog.outputFiles.entries()) {
      if (!isObject(output)) {
        errors.push(`outputFiles[${index}] must be an object`);
      } else {
        if (!output.path) errors.push(`outputFiles[${index}] missing path`);
        if (!Object.prototype.hasOwnProperty.call(output, 'sha256')) errors.push(`outputFiles[${index}] missing sha256`);
      }
    }
  }

  return errors;
}

export function validateManifestPipelineRun(manifest, { requirePipelineRun = false } = {}) {
  const errors = [];
  const warnings = [];
  const pipelineRun = manifest?.pipelineRun;

  if (!pipelineRun) {
    if (requirePipelineRun) {
      errors.push('missing pipelineRun provenance');
    } else {
      warnings.push('legacy-pre-H5.67 manifest without pipelineRun provenance');
    }
    return { errors, warnings };
  }

  const missing = missingFields(pipelineRun, requiredManifestPipelineRunFields);
  if (missing.length) errors.push(`pipelineRun missing fields: ${missing.join(', ')}`);

  if (pipelineRun.command && !allowedCommands.includes(pipelineRun.command)) {
    errors.push(`pipelineRun.command unknown: ${pipelineRun.command}`);
  }
  if (pipelineRun.methodStatus && !allowedMethodStatuses.includes(pipelineRun.methodStatus)) {
    errors.push(`pipelineRun.methodStatus unknown: ${pipelineRun.methodStatus}`);
  }
  if (pipelineRun.sourcePngModified === true) {
    errors.push('pipelineRun.sourcePngModified must not be true');
  }
  if (pipelineRun.runtimeFilesModified === true) {
    errors.push('pipelineRun.runtimeFilesModified must not be true for asset-only lanes');
  }

  const runtimeEligibility = manifest?.runtimeEligibility;
  const reviewStatus = manifest?.reviewStatus;
  const status = manifest?.status;
  if (pipelineRun.methodStatus === 'experimental-unsafe-default') {
    if (status !== 'draft') errors.push('experimental method outputs must remain status=draft');
    if (runtimeEligibility !== 'not-runtime-approved') errors.push('experimental method outputs must remain not-runtime-approved');
    if (reviewStatus && reviewStatus !== 'needs-human-review') errors.push('experimental method outputs must remain needs-human-review');
  }

  return { errors, warnings };
}

export function manifestClaimsCanonicalPipelineUse(manifest) {
  const pipelineUse = String(manifest?.pipelineUse ?? '').toLowerCase();
  const operationalType = String(manifest?.operationalType ?? '').toLowerCase();
  const status = String(manifest?.status ?? '').toLowerCase();
  return pipelineUse.includes('pipeline')
    || operationalType.includes('cleanup-candidate')
    || operationalType.includes('region')
    || status === 'reviewed';
}

export function loadJson(filePath) {
  const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  return JSON.parse(text);
}

export function findJsonFiles(rootDir, { includeManifests = true, includeRunLogs = true } = {}) {
  const results = [];
  if (!fs.existsSync(rootDir)) return results;
  const stack = [rootDir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        const normalized = fullPath.replaceAll(path.sep, '/');
        const isManifest = normalized.includes('/manifests/');
        const isRunLog = entry.name === 'pipeline-run-log.json';
        if ((includeManifests && isManifest) || (includeRunLogs && isRunLog)) {
          results.push(fullPath);
        }
      }
    }
  }
  return results.sort();
}
