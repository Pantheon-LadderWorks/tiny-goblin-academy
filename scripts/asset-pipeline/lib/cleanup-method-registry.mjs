export const cleanupMethods = {
  'alpha-pass-through': {
    id: 'alpha-pass-through',
    status: 'canonical',
    implemented: true,
    description: 'Copies an already true-alpha source into a derived location while recording provenance.',
    safeDefault: true,
    requiresOutput: true,
    requiresPreview: false
  },
  'no-cleanup-reference-only': {
    id: 'no-cleanup-reference-only',
    status: 'canonical',
    implemented: true,
    description: 'Records that no cleanup should be performed and the source remains reference/planning only.',
    safeDefault: true,
    requiresOutput: false,
    requiresPreview: false
  },
  'flood-fill-gray-background': {
    id: 'flood-fill-gray-background',
    status: 'canonical-with-caution',
    implemented: true,
    description: 'Uses the existing border-connected gray/checker flood-fill cleanup script against a derived output.',
    safeDefault: false,
    requiresOutput: true,
    requiresPreview: true
  },
  'edge-connected-checker-cleanup': {
    id: 'edge-connected-checker-cleanup',
    status: 'canonical-with-caution',
    implemented: true,
    description: 'Per-grid-cell edge-connected fake checker cleanup. Removes only checker/background pixels connected to each cell boundary.',
    safeDefault: false,
    requiresOutput: true,
    requiresPreview: false,
    requiresManifest: true,
    requiresCleanupManifest: true,
    requiresEvidenceDir: true
  },
  'color-key-cleanup': {
    id: 'color-key-cleanup',
    status: 'pilot-only',
    implemented: false,
    description: 'Color-key cleanup exists only as old pilot/probe logic and is not a default production cleanup method.',
    safeDefault: false,
    requiresOutput: true,
    requiresPreview: true
  },
  'grid-slice-only': {
    id: 'grid-slice-only',
    status: 'mapping-only',
    implemented: false,
    description: 'Grid slicing is a mapping strategy, not a transparency cleanup method.',
    safeDefault: false,
    requiresOutput: false,
    requiresPreview: false
  },
  'blank-cell-reference-experimental': {
    id: 'blank-cell-reference-experimental',
    status: 'experimental-unsafe-default',
    implemented: false,
    description: 'H5.65-style blank-cell reference cleanup. Registered so it cannot be silently used as a normal cleanup method.',
    safeDefault: false,
    requiresOutput: true,
    requiresPreview: true
  },
  'true-alpha-regenerated-source': {
    id: 'true-alpha-regenerated-source',
    status: 'canonical',
    implemented: true,
    description: 'Copies a regenerated/exported true-alpha source into derived review space with provenance.',
    safeDefault: true,
    requiresOutput: true,
    requiresPreview: false
  }
};

export function listCleanupMethods() {
  return Object.values(cleanupMethods);
}

export function getCleanupMethod(id) {
  return cleanupMethods[id] ?? null;
}
