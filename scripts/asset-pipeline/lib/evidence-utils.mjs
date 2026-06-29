export const evidenceRoot = 'assets/academy/evidence';

export const evidenceFilenameSuffixes = {
  metadata: 'metadata-inspection.png',
  alphaPreview: 'alpha-preview.png',
  darkPreview: 'cleaned-dark-preview.png',
  beforeAfter: 'before-after-cleanup.png',
  bboxOverlay: 'bbox-overlay.png',
  contactSheet: 'contact-sheet.png',
  anchorOverlay: 'anchor-overlay.png',
  tileGridOverlay: 'tile-grid-overlay.png'
};

export function evidenceFolderForPass(passId) {
  return `${evidenceRoot}/${passId}`;
}

export function evidenceFileName(sheetId, kind) {
  const suffix = evidenceFilenameSuffixes[kind];
  if (!suffix) {
    throw new Error(`Unknown evidence kind: ${kind}`);
  }
  return `${sheetId}-${suffix}`;
}
