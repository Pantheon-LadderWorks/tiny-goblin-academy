import fs from 'fs';
import path from 'path';
import { sha256File } from './file-hash.mjs';

export function buildRunLog({
  toolPath,
  command,
  method = null,
  methodStatus = null,
  agent = 'unknown-agent',
  gitBaseline = null,
  sourcePath = null,
  manifestPath = null,
  outputPaths = [],
  evidenceFiles = [],
  validationCommands = [],
  warnings = [],
  sourcePngModified = false,
  runtimeFilesModified = false
}) {
  const outputs = outputPaths.map((outputPath) => ({
    path: outputPath,
    sha256: sha256File(outputPath)
  }));

  return {
    schemaVersion: '0.1',
    toolPath,
    command,
    method,
    methodStatus,
    agent,
    gitBaseline,
    sourcePath,
    sourceSha256: sourcePath ? sha256File(sourcePath) : null,
    manifestPath,
    outputPaths: outputs,
    generatedEvidenceFiles: evidenceFiles,
    validationCommands,
    warnings,
    sourcePngModified,
    runtimeFilesModified,
    createdAtUtc: new Date().toISOString()
  };
}

export function writeRunLog(outPath, runLog) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(runLog, null, 2)}\n`, 'utf8');
  return outPath;
}

