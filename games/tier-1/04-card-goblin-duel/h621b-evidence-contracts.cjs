'use strict';

const DEFAULT_VIEWPORT = Object.freeze({ width: 1280, height: 660 });
const MINIMUM_VIEWPORT = Object.freeze({ width: 1024, height: 580 });

const fixtureExpectedCards = Object.freeze({
  'optical-default': 6,
  'optical-minimum': 6,
  'initial-deal': 3,
  'pointer-hover': 3,
  'keyboard-focus': 6,
  'strike-commitment': 3,
  'guard-commitment': 3,
  'mend-commitment': 3,
  'heavy-bonk-vacancy': 2,
  'spark-sequence': 3,
  'stun-enemy-hold': 3,
  'terminal-lock': 2,
  'reset-during-deal': 3,
  'reset-during-commitment': 3,
  'resize-active': 3,
});

const fixtureIds = Object.freeze(Object.keys(fixtureExpectedCards));

const routeEvidenceContracts = Object.freeze({
  'initial-deal': Object.freeze([
    Object.freeze({ kind: 'draw', card: 'Strike', from: 'player-draw-origin', to: 'hand-slot-0' }),
    Object.freeze({ kind: 'draw', card: 'Guard', from: 'player-draw-origin', to: 'hand-slot-1' }),
    Object.freeze({ kind: 'draw', card: 'Mend', from: 'player-draw-origin', to: 'hand-slot-2' }),
  ]),
  'strike-commitment': Object.freeze([
    Object.freeze({ kind: 'play', card: 'Strike', from: 'hand-slot-0', to: 'played-card-target' }),
    Object.freeze({ kind: 'played-discard', card: 'Strike', from: 'played-card-target', to: 'player-discard-target' }),
    Object.freeze({ kind: 'draw', card: 'Spark', from: 'player-draw-origin', to: 'hand-slot-2' }),
  ]),
  'spark-sequence': Object.freeze([
    Object.freeze({ kind: 'play', card: 'Spark', from: 'hand-slot-1', to: 'played-card-target' }),
    Object.freeze({ kind: 'played-discard', card: 'Spark', from: 'played-card-target', to: 'player-discard-target' }),
    Object.freeze({ kind: 'replacement-discard', card: 'Mend', from: 'hand-slot-2', to: 'player-discard-target' }),
    Object.freeze({ kind: 'draw', card: 'Guard', from: 'player-draw-origin', to: 'hand-slot-1' }),
    Object.freeze({ kind: 'draw', card: 'Stun', from: 'player-draw-origin', to: 'hand-slot-2' }),
  ]),
});

const staticContracts = Object.freeze([
  Object.freeze({
    fixture: 'optical-default',
    viewport: DEFAULT_VIEWPORT,
    expectedCards: fixtureExpectedCards['optical-default'],
    screenshot: '01-optical-default.png',
  }),
  Object.freeze({
    fixture: 'optical-minimum',
    viewport: MINIMUM_VIEWPORT,
    expectedCards: fixtureExpectedCards['optical-minimum'],
    screenshot: '02-optical-minimum.png',
  }),
]);

const motionContracts = Object.freeze([
  Object.freeze({
    fixture: 'initial-deal',
    mode: 'full',
    recording: '01-initial-deal-full.webm',
    expectedCards: 3,
  }),
  Object.freeze({
    fixture: 'initial-deal',
    mode: 'reduced',
    recording: '02-initial-deal-reduced.webm',
    expectedCards: 3,
  }),
  Object.freeze({
    fixture: Object.freeze(['pointer-hover', 'keyboard-focus']),
    mode: 'full',
    recording: '03-hover-focus.webm',
    expectedCards: 6,
  }),
  Object.freeze({
    fixture: 'strike-commitment',
    mode: 'full',
    recording: '04-normal-commitment-refill.webm',
    expectedCards: 3,
  }),
  Object.freeze({
    fixture: 'heavy-bonk-vacancy',
    mode: 'full',
    recording: '05-heavy-bonk-vacancy.webm',
    expectedCards: 2,
  }),
  Object.freeze({
    fixture: 'spark-sequence',
    mode: 'full',
    recording: '06-spark-full-sequence.webm',
    expectedCards: 3,
  }),
  Object.freeze({
    fixture: 'terminal-lock',
    mode: 'full',
    recording: '07-terminal-lock-reset.webm',
    expectedCards: 2,
  }),
  Object.freeze({
    fixture: 'reset-during-commitment',
    mode: 'full',
    recording: '08-cancellation-reset-during-commitment.webm',
    expectedCards: 3,
  }),
]);

const finalFixtureId = (contract) => Array.isArray(contract.fixture)
  ? contract.fixture.at(-1)
  : contract.fixture;

function verifyEvidenceContracts() {
  if (fixtureIds.length !== 15) {
    throw new Error('H6.21B browser preflight requires exactly 15 fixture contracts.');
  }
  if (staticContracts.length !== 2 || motionContracts.length !== 8) {
    throw new Error('H6.21B requires exactly two stills and eight motion recordings.');
  }

  const files = [
    ...staticContracts.map((contract) => contract.screenshot),
    ...motionContracts.map((contract) => contract.recording),
  ];
  if (new Set(files).size !== files.length) {
    throw new Error('H6.21B evidence filenames must be unique.');
  }

  for (const contract of [...staticContracts, ...motionContracts]) {
    const fixtureId = finalFixtureId(contract);
    if (!(fixtureId in fixtureExpectedCards)) {
      throw new Error('Unknown H6.21B fixture contract: ' + fixtureId);
    }
    if (contract.expectedCards !== fixtureExpectedCards[fixtureId]) {
      throw new Error(
        fixtureId + ' expected card count drifted: '
        + contract.expectedCards + ' !== ' + fixtureExpectedCards[fixtureId],
      );
    }
  }

  const capturedFixtures = new Set(
    motionContracts.flatMap((contract) => Array.isArray(contract.fixture)
      ? contract.fixture
      : [contract.fixture]),
  );
  for (const fixtureId of Object.keys(routeEvidenceContracts)) {
    if (!capturedFixtures.has(fixtureId)) {
      throw new Error('Missing motion evidence for governed route fixture: ' + fixtureId);
    }
  }

  const modes = motionContracts.map((contract) => finalFixtureId(contract) + ':' + contract.mode);
  for (const required of [
    'initial-deal:full',
    'initial-deal:reduced',
    'terminal-lock:full',
    'reset-during-commitment:full',
  ]) {
    if (!modes.includes(required)) {
      throw new Error('Missing required H6.21B contract: ' + required);
    }
  }
}

module.exports = {
  DEFAULT_VIEWPORT,
  MINIMUM_VIEWPORT,
  fixtureExpectedCards,
  fixtureIds,
  routeEvidenceContracts,
  staticContracts,
  motionContracts,
  finalFixtureId,
  verifyEvidenceContracts,
};
