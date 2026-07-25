'use strict';

const STILL_FIXTURES = Object.freeze([
  Object.freeze({ id: 'layer-stack', file: '01-complete-layer-stack.png' }),
  Object.freeze({ id: 'slot-vs-frame', file: '02-environmental-slot-vs-true-frame.png' }),
]);

const MOTION_FIXTURES = Object.freeze([
  Object.freeze({ id: 'frame-matrix', frameStyle: 'gold-ornate', file: '03-gold-ornate-frame-lifecycle.webm' }),
  Object.freeze({ id: 'frame-matrix', frameStyle: 'wood', file: '04-wood-frame-lifecycle.webm' }),
  Object.freeze({ id: 'frame-matrix', frameStyle: 'corner-ornate', file: '05-corner-ornate-frame-lifecycle.webm' }),
  Object.freeze({ id: 'card-local-follow', file: '06-card-local-follow.webm' }),
  Object.freeze({ id: 'draw-pile-local', file: '07-draw-pile-local.webm' }),
  Object.freeze({ id: 'discard-pile-local', file: '08-discard-pile-local.webm' }),
  Object.freeze({ id: 'player-target', file: '09-player-target.webm' }),
  Object.freeze({ id: 'enemy-target', file: '10-enemy-target.webm' }),
  Object.freeze({ id: 'travel', file: '11-travel-authority.webm' }),
  Object.freeze({ id: 'tabletop-local', file: '12-tabletop-local.webm' }),
  Object.freeze({ id: 'resize-active', file: '13-resize-active.webm', resize: true }),
  Object.freeze({ id: 'cancel-cleanup', file: '14-cancel-cleanup.webm' }),
  Object.freeze({ id: 'reduced-motion', file: '15-reduced-motion.webm', motion: 'reduced' }),
]);

const verifyEvidenceContracts = () => {
  const fixtures = [...STILL_FIXTURES, ...MOTION_FIXTURES];
  const files = fixtures.map(({ file }) => file);
  if (new Set(files).size !== files.length) throw new Error('H6.22R1 evidence filenames must be unique');
  if (STILL_FIXTURES.length !== 2) throw new Error('H6.22R1 requires exactly two still fixtures');
  if (MOTION_FIXTURES.length !== 13) throw new Error('H6.22R1 requires exactly thirteen motion fixtures');
  const attachments = new Set(MOTION_FIXTURES.map(({ id }) => id));
  for (const id of [
    'card-local-follow',
    'draw-pile-local',
    'discard-pile-local',
    'player-target',
    'enemy-target',
    'travel',
    'tabletop-local',
  ]) {
    if (!attachments.has(id)) throw new Error(`H6.22R1 missing attachment fixture: ${id}`);
  }
  return fixtures.length;
};

module.exports = { STILL_FIXTURES, MOTION_FIXTURES, verifyEvidenceContracts };
