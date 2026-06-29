export const assetFamilies = [
  'academy-shared',
  'academy-game-specific',
  'academy-creature',
  'academy-topdown',
  'academy-ui',
  'academy-hub',
  'academy-branding',
  'studio',
  'unknown'
];

export const operationalAssetTypes = [
  'background-stage',
  'scene-anchor-background',
  'ui-icon-sheet',
  'hub-icon-sheet',
  'hub-banner-source',
  'branding-icon-source',
  'static-prop-sheet',
  'tile-sheet',
  'terrain-sheet',
  'wall-boundary-sheet',
  'character-animation-sheet',
  'enemy-animation-sheet',
  'pet-animation-sheet',
  'fx-sheet',
  'mixed-sheet',
  'review-candidate',
  'derived-cleaned-sheet',
  'runtime-approved-sheet'
];

export const lifecycleStates = [
  'source',
  'concept',
  'draft',
  'candidate',
  'preview',
  'review',
  'reviewed',
  'approved',
  'runtime',
  'deprecated'
];

export const readinessStates = [
  'needs-intake',
  'needs-metadata',
  'needs-cleanup-pilot',
  'needs-manifest',
  'needs-evidence',
  'needs-human-review',
  'reviewed',
  'runtime-ready',
  'deferred'
];

export const alphaStates = [
  'real-alpha-safe',
  'fake-checkerboard-border-connected',
  'opaque-illustration-background',
  'mixed-uncertain',
  'dangerous-gray-detail-candidate',
  'jpeg-rgb-disguised-as-png',
  'no-alpha-source'
];

export const manifestTypes = [
  'regions manifest',
  'animation manifest',
  'scene anchor manifest',
  'tile/terrain manifest',
  'runtime asset registry',
  'candidate/review manifest'
];

export const evidenceTypes = [
  'metadata sheet',
  'alpha preview',
  'dark preview',
  'bbox overlay',
  'numbered contact sheet',
  'before/after cleanup sheet',
  'anchor overlay',
  'tile-grid overlay',
  'sequence contact sheet'
];

export const humanReviewTypes = [
  'transparency cleanup review',
  'semantic label review',
  'sequence review',
  'anchor review',
  'tile adjacency review',
  'runtime approval review'
];

export const runtimeEligibilityStates = [
  'not-eligible',
  'preview-only',
  'candidate',
  'reviewed-not-runtime',
  'runtime-approved'
];

export const usageStates = [
  'draft-placeholder',
  'draft-review',
  'reserved',
  'candidate',
  'reviewed',
  'approved',
  'runtime',
  'deprecated'
];

export const riskLevels = [
  'low',
  'low-medium',
  'medium',
  'medium-high',
  'high'
];

export const laneProfiles = {
  'ui-icon-sheet': {
    operationalType: 'ui-icon-sheet',
    manifestContract: 'regions manifest',
    requiredEvidence: ['metadata sheet', 'alpha preview', 'dark preview', 'bbox overlay', 'numbered contact sheet'],
    cleanupPolicy: 'May use fake-checkerboard cleanup pilot when the background is border-connected and evidence is generated.',
    humanReviewGate: 'Transparency cleanup plus semantic label review.',
    forbiddenActions: ['overwrite source', 'wire into runtime', 'mark preview assets approved'],
    nextSafeActions: ['inspect metadata', 'generate cleanup pilot', 'create draft regions', 'make contact sheet']
  },
  'hub-icon-sheet': {
    operationalType: 'hub-icon-sheet',
    manifestContract: 'regions manifest',
    requiredEvidence: ['metadata sheet', 'alpha preview', 'dark preview', 'bbox overlay', 'numbered contact sheet'],
    cleanupPolicy: 'Follow the existing hub icon manifest plus SpriteFrame pattern; use derived sheets only.',
    humanReviewGate: 'Transparency cleanup, crop accuracy, and semantic label review.',
    forbiddenActions: ['overwrite source', 'change hub runtime without approval', 'use whole sheet as fake background'],
    nextSafeActions: ['validate regions', 'generate evidence', 'confirm derived sheet']
  },
  'static-prop-sheet': {
    operationalType: 'static-prop-sheet',
    manifestContract: 'regions manifest',
    requiredEvidence: ['metadata sheet', 'alpha preview', 'dark preview', 'bbox overlay', 'numbered contact sheet'],
    cleanupPolicy: 'Static props may use a cleanup pilot when gray details and shadows are reviewed.',
    humanReviewGate: 'Transparency cleanup plus semantic label review.',
    forbiddenActions: ['overwrite source', 'batch approve regions', 'wire into games'],
    nextSafeActions: ['inspect metadata', 'pilot cleanup', 'draft obvious regions']
  },
  'fx-sheet': {
    operationalType: 'fx-sheet',
    manifestContract: 'regions manifest or candidate/review manifest',
    requiredEvidence: ['metadata sheet', 'alpha preview', 'dark preview', 'before/after cleanup sheet'],
    cleanupPolicy: 'High caution: smoke, glow, dust, and JPEG artifacts can be damaged by naive keying.',
    humanReviewGate: 'Transparency cleanup review before semantic label review.',
    forbiddenActions: ['force JPEG/RGB cleanup', 'approve particles without visual review', 'wire into games'],
    nextSafeActions: ['inspect metadata', 'classify alpha/compression risk', 'defer or pilot one sample']
  },
  'tile-terrain-sheet': {
    operationalType: 'tile-sheet',
    manifestContract: 'tile/terrain manifest',
    requiredEvidence: ['metadata sheet', 'tile-grid overlay', 'numbered contact sheet'],
    cleanupPolicy: 'Cleanup only after grid and edge/corner semantics are understood.',
    humanReviewGate: 'Tile identity, adjacency, and collision-intent review.',
    forbiddenActions: ['infer top-down/side-view interchangeability', 'wire collision from art alone', 'overwrite source'],
    nextSafeActions: ['inspect grid', 'draft tile manifest', 'create adjacency evidence']
  },
  'scene-anchor-background': {
    operationalType: 'scene-anchor-background',
    manifestContract: 'scene anchor manifest',
    requiredEvidence: ['metadata sheet', 'anchor overlay'],
    cleanupPolicy: 'Do not sprite-detect backgrounds by default.',
    humanReviewGate: 'Gameplay readability and anchor placement review.',
    forbiddenActions: ['run sprite detection as default', 'slice into props without approval', 'wire into runtime'],
    nextSafeActions: ['inspect dimensions', 'create anchor overlay', 'draft scene anchors']
  },
  'animation-sheet': {
    operationalType: 'character-animation-sheet',
    manifestContract: 'animation manifest',
    requiredEvidence: ['metadata sheet', 'alpha preview', 'sequence contact sheet', 'numbered contact sheet'],
    cleanupPolicy: 'No blind checkerboard cleanup. Pilot crops first, then contact sheets and human review.',
    humanReviewGate: 'Sequence labels, pivots/baselines, hitbox intent, and transparency cleanup review.',
    forbiddenActions: ['blind cleanup', 'batch process all rows', 'guess animation sequences', 'wire into games'],
    nextSafeActions: ['inspect metadata', 'make contact sheet', 'label candidate sequences', 'pilot one crop']
  }
};

laneProfiles['character-animation-sheet'] = {
  ...laneProfiles['animation-sheet'],
  operationalType: 'character-animation-sheet'
};

laneProfiles['enemy-animation-sheet'] = {
  ...laneProfiles['animation-sheet'],
  operationalType: 'enemy-animation-sheet'
};

laneProfiles['pet-animation-sheet'] = {
  ...laneProfiles['animation-sheet'],
  operationalType: 'pet-animation-sheet'
};

laneProfiles['tile-sheet'] = {
  ...laneProfiles['tile-terrain-sheet'],
  operationalType: 'tile-sheet'
};

laneProfiles['terrain-sheet'] = {
  ...laneProfiles['tile-terrain-sheet'],
  operationalType: 'terrain-sheet'
};

laneProfiles['wall-boundary-sheet'] = {
  ...laneProfiles['tile-terrain-sheet'],
  operationalType: 'wall-boundary-sheet'
};

export function listLaneTypes() {
  return Object.keys(laneProfiles);
}

export function getLaneProfile(type) {
  return laneProfiles[type] ?? null;
}
