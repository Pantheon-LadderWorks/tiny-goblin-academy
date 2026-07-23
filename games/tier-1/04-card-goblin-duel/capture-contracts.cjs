'use strict';

const FIXTURE_CONTRACTS = Object.freeze([
  Object.freeze({ id: '01', phase: 'PlayerAction', phaseClass: 'phase-player', cardCount: 6, stateLabelCount: 6, stateLabel: 'Play', screenshotName: '01-strategy-a-clean-interior', measurementRequired: true, strategy: 'clean', query: '?cardLab=clean', viewport: 'default', gameplayAnchorCount: 0, slotDebug: false }),
  Object.freeze({ id: '02', phase: 'PlayerAction', phaseClass: 'phase-player', cardCount: 6, stateLabelCount: 6, stateLabel: 'Play', screenshotName: '02-strategy-b-mapped-tokens', measurementRequired: true, strategy: 'tokens', query: '?cardLab=tokens', viewport: 'default', gameplayAnchorCount: 0, slotDebug: false }),
  Object.freeze({ id: '03', phase: 'PlayerAction', phaseClass: 'phase-player', cardCount: 3, stateLabelCount: 3, stateLabel: 'Play', screenshotName: '03-ordinary-hand-default', measurementRequired: true, strategy: 'tokens', query: '', viewport: 'default', gameplayAnchorCount: 3, slotDebug: false }),
  Object.freeze({ id: '04', phase: 'PlayerAction', phaseClass: 'phase-player', cardCount: 3, stateLabelCount: 3, stateLabel: 'Play', screenshotName: '04-ordinary-hand-minimum', measurementRequired: true, strategy: 'tokens', query: '', viewport: 'minimum', gameplayAnchorCount: 3, slotDebug: false }),
  Object.freeze({ id: '05', phase: 'PlayerAction', phaseClass: 'phase-player', cardCount: 6, stateLabelCount: 6, stateLabel: 'Play', screenshotName: '05-keyboard-focus-heavy-bonk', measurementRequired: true, strategy: 'tokens', query: '?cardLab=tokens', viewport: 'default', gameplayAnchorCount: 0, slotDebug: false }),
  Object.freeze({ id: '06', phase: 'SparkChoice', phaseClass: 'phase-spark', cardCount: 2, stateLabelCount: 2, stateLabel: 'Replace', screenshotName: '06-spark-choice-complete-replace-badges', measurementRequired: true, strategy: 'tokens', query: '', viewport: 'default', gameplayAnchorCount: 2, slotDebug: false }),
  Object.freeze({ id: '07', phase: 'Terminal', phaseClass: 'phase-terminal', cardCount: 2, stateLabelCount: 2, stateLabel: 'Locked', screenshotName: '07-terminal-locked-treatment', measurementRequired: true, strategy: 'tokens', query: '', viewport: 'default', gameplayAnchorCount: 2, slotDebug: false }),
  Object.freeze({ id: '08', phase: 'PlayerAction', phaseClass: 'phase-player', cardCount: 6, stateLabelCount: 6, stateLabel: 'Play', screenshotName: '08-slot-debug-overlay', measurementRequired: true, strategy: 'tokens', query: '?cardLab=tokens&cardSlots=1', viewport: 'default', gameplayAnchorCount: 0, slotDebug: true }),
]);

function validateFixtureContracts() {
  const failures = [];
  const expectedIds = ['01', '02', '03', '04', '05', '06', '07', '08'];
  const screenshotNames = new Set();

  if (FIXTURE_CONTRACTS.length !== expectedIds.length) {
    failures.push('expected exactly eight fixture contracts');
  }
  FIXTURE_CONTRACTS.forEach((fixture, index) => {
    if (fixture.id !== expectedIds[index]) failures.push('fixture ids are not complete and ordered');
    if (!['PlayerAction', 'SparkChoice', 'Terminal'].includes(fixture.phase)) failures.push(`fixture ${fixture.id} has invalid phase`);
    if (!Number.isInteger(fixture.cardCount) || fixture.cardCount < 1) failures.push(`fixture ${fixture.id} has invalid card count`);
    if (!Number.isInteger(fixture.stateLabelCount) || fixture.stateLabelCount !== fixture.cardCount) failures.push(`fixture ${fixture.id} has invalid state-label count`);
    if (!['Play', 'Replace', 'Locked'].includes(fixture.stateLabel)) failures.push(`fixture ${fixture.id} has invalid state label`);
    if (!fixture.screenshotName.startsWith(`${fixture.id}-`)) failures.push(`fixture ${fixture.id} has invalid screenshot name`);
    if (screenshotNames.has(fixture.screenshotName)) failures.push(`fixture ${fixture.id} duplicates a screenshot name`);
    screenshotNames.add(fixture.screenshotName);
    if (fixture.measurementRequired !== true) failures.push(`fixture ${fixture.id} does not require measurements`);
    if (!Number.isInteger(fixture.gameplayAnchorCount) || fixture.gameplayAnchorCount < 0) failures.push(`fixture ${fixture.id} has invalid anchor count`);
    if (fixture.slotDebug !== (fixture.id === '08')) failures.push(`fixture ${fixture.id} has invalid slot-debug authority`);
  });

  if (failures.length > 0) {
    throw new Error(`H6.21A fixture-contract preflight failed: ${failures.join(' | ')}`);
  }
  return FIXTURE_CONTRACTS;
}

module.exports = {
  FIXTURE_CONTRACTS,
  validateFixtureContracts,
};
