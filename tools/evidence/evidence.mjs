import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const core = require('./evidence-core.cjs');

export const {
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
} = core;

export default core;
