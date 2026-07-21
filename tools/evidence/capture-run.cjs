'use strict';

const core = require('./evidence-core.cjs');

function prepareCaptureRun({ scriptDirectory, gameId, laneId, runId }) {
  const repoRoot = core.findRepositoryRoot(scriptDirectory);
  const config = core.resolveEvidenceConfig({ repoRoot });
  const resolvedRunId = runId || process.env.TGA_EVIDENCE_RUN_ID || core.makeRunId('capture');
  const run = core.createExternalRun({
    repoRoot,
    config,
    gameId,
    laneId,
    runId: resolvedRunId,
  });
  return {
    ...run,
    file(category, filename) {
      return core.reserveEvidenceFile(run, category, filename);
    },
  };
}

function finalizeCaptureRun(run, options = {}) {
  const sourceCommit = options.sourceCommit
    || core.runGit?.(run.repoRoot, ['rev-parse', 'HEAD']).trim()
    || process.env.TGA_SOURCE_COMMIT;
  if (!sourceCommit) throw new Error('Capture source commit is required.');
  return core.finalizeExternalRun({
    run,
    sourceCommit,
    captureScript: options.captureScript,
    captureScriptVersion: options.captureScriptVersion || 'h6.18',
    captureConfiguration: options.captureConfiguration || null,
    portableManifestPath: options.portableManifestPath || core.portableManifestPathFor(run),
  });
}

module.exports = { finalizeCaptureRun, prepareCaptureRun };
