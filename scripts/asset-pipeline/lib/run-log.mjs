import fs from 'fs';
import path from 'path';
import { sha256File } from './file-hash.mjs';
import { provenanceContractVersion } from './provenance-contract.mjs';

export function buildRunLog({
  repoRoot = process.cwd(),
  toolPath,
  command,
  method = null,
  methodStatus = null,
  laneId = null,
  agent = 'unknown-agent',
  gitBaseline = null,
  sourcePath = null,
  manifestPath = null,
  inputManifests = [],
  outputPaths = [],
  evidenceFiles = [],
  validationCommands = [],
  warnings = [],
  sourcePngModified = false,
  runtimeFilesModified = false,
  status = 'completed',
  startedAt = null,
  completedAt = null
}) {
  const resolveForHash = (filePath) => {
    if (!filePath) return null;
    return path.isAbsolute(filePath) ? filePath : path.join(repoRoot, filePath);
  };

  const outputs = outputPaths.map((outputPath) => ({
    path: outputPath,
    sha256: sha256File(resolveForHash(outputPath))
  }));

  return {
    schemaVersion: '0.1',
    contractVersion: provenanceContractVersion,
    tool: toolPath,
    toolPath,
    command,
    method,
    methodStatus,
    laneId,
    agent,
    gitBaseline,
    startedAt: startedAt ?? new Date().toISOString(),
    completedAt: completedAt ?? new Date().toISOString(),
    sourcePath,
    sourceSha256: sourcePath ? sha256File(resolveForHash(sourcePath)) : null,
    manifestPath,
    inputManifests: manifestPath ? [manifestPath, ...inputManifests] : inputManifests,
    outputFiles: outputs,
    outputPaths: outputs,
    evidenceFiles,
    generatedEvidenceFiles: evidenceFiles,
    validationCommands,
    warnings,
    sourcePngModified,
    runtimeFilesModified,
    status,
    createdAtUtc: new Date().toISOString()
  };
}

export function writeRunLog(outPath, runLog) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(runLog, null, 2)}\n`, 'utf8');
  return outPath;
}
