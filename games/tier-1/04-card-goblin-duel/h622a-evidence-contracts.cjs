'use strict';

const DEFAULT_VIEWPORT = Object.freeze({ width: 1280, height: 660 });
const MINIMUM_VIEWPORT = Object.freeze({ width: 1024, height: 580 });
const FIXTURE_IDS = Object.freeze([
  'primitive-sampler',
  'strike',
  'guard',
  'mend',
  'spark',
  'stun',
  'heavy-bonk',
  'enemy-attack',
  'victory',
  'defeat',
  'reduced-comparison',
  'cancellation-layered',
  'resize-active',
  'repeat-no-residue',
]);

const CARD_FIXTURES = Object.freeze([
  'strike',
  'guard',
  'mend',
  'spark',
  'stun',
  'heavy-bonk',
]);

const MOTION_CONTRACTS = Object.freeze([
  { fixture: 'primitive-sampler', mode: 'full', recording: '01-primitive-sampler.webm' },
  { fixture: 'strike', mode: 'full', recording: '02-strike.webm' },
  { fixture: 'guard', mode: 'full', recording: '03-guard.webm' },
  { fixture: 'mend', mode: 'full', recording: '04-mend.webm' },
  { fixture: 'spark', mode: 'full', recording: '05-spark.webm' },
  { fixture: 'stun', mode: 'full', recording: '06-stun.webm' },
  { fixture: 'heavy-bonk', mode: 'full', recording: '07-heavy-bonk.webm' },
  { fixture: 'reduced-comparison', mode: 'full', recording: '08-reduced-comparison.webm' },
  { fixture: 'resize-active', mode: 'full', recording: '09-cancellation-cleanup.webm', resize: true },
]);

function verifyEvidenceContracts() {
  if (FIXTURE_IDS.length !== 14 || new Set(FIXTURE_IDS).size !== 14) {
    throw new Error('H6.22A requires exactly fourteen unique fixtures.');
  }
  if (CARD_FIXTURES.length !== 6 || new Set(CARD_FIXTURES).size !== 6) {
    throw new Error('H6.22A requires exactly six unique card recipes.');
  }
  if (MOTION_CONTRACTS.length !== 9) {
    throw new Error('H6.22A requires nine bounded recordings.');
  }
  const recordings = MOTION_CONTRACTS.map(({ recording }) => recording);
  if (new Set(recordings).size !== recordings.length
    || recordings.some((recording) => !recording.endsWith('.webm'))) {
    throw new Error('H6.22A recording names must be unique WebM files.');
  }
  for (const fixture of CARD_FIXTURES) {
    if (!MOTION_CONTRACTS.some((contract) => contract.fixture === fixture)) {
      throw new Error(`Missing card recording contract: ${fixture}`);
    }
  }
  if (!MOTION_CONTRACTS.some(({ fixture }) => fixture === 'primitive-sampler')
    || !MOTION_CONTRACTS.some(({ fixture }) => fixture === 'reduced-comparison')
    || !MOTION_CONTRACTS.some(({ resize }) => resize)) {
    throw new Error('Sampler, reduced comparison, and cancellation evidence are required.');
  }
  return true;
}

module.exports = {
  CARD_FIXTURES,
  DEFAULT_VIEWPORT,
  FIXTURE_IDS,
  MINIMUM_VIEWPORT,
  MOTION_CONTRACTS,
  verifyEvidenceContracts,
};
