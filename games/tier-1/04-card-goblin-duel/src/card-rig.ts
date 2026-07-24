import type { Card, Phase } from './simulation';

export type CardRigMode = 'full' | 'reduced';
export type CardRigCancelReason = 'reset' | 'resize' | 'superseded';

export type CardRigCueType =
  | 'deal'
  | 'settle'
  | 'focus'
  | 'hover'
  | 'commit'
  | 'effect-hold'
  | 'discard'
  | 'refill'
  | 'vacancy'
  | 'spark-choice'
  | 'replace-discard'
  | 'enemy-hold'
  | 'terminal-lock';

export type CardRigCue = {
  type: CardRigCueType;
  card?: Card;
  slot?: number;
};

export type CardRigFinalState = {
  phase: Phase;
  hand: Card[];
  vacantSlots?: number[];
  lockedCards?: Card[];
  actionableCards?: Card[];
  resetAvailable?: boolean;
};

export type CardRigFixture = {
  id: string;
  label: string;
  initialHand: Card[];
  cues: CardRigCue[];
  finalState: CardRigFinalState;
  measurementRequired: boolean;
};

export type CardRigMotionTiming = {
  cueMs: number;
  holdMs: number;
  allowTravel: boolean;
  allowRotation: boolean;
};

export const FULL_MOTION_TIMING: CardRigMotionTiming = {
  cueMs: 260,
  holdMs: 420,
  allowTravel: true,
  allowRotation: true,
};

export const REDUCED_MOTION_TIMING: CardRigMotionTiming = {
  cueMs: 90,
  holdMs: 120,
  allowTravel: false,
  allowRotation: false,
};

const LAB_HAND: Card[] = [
  'Strike',
  'Guard',
  'Mend',
  'Spark',
  'Stun',
  'Heavy Bonk',
];
const OPENING_HAND: Card[] = ['Strike', 'Guard', 'Mend'];

const cue = (
  type: CardRigCueType,
  card?: Card,
  slot?: number,
): CardRigCue => ({ type, card, slot });

const finalState = (
  hand: Card[],
  phase: Phase = 'PlayerAction',
): CardRigFinalState => ({
  phase,
  hand,
  actionableCards: phase === 'Terminal' ? [] : [...hand],
  resetAvailable: true,
});

const fixture = (
  id: string,
  label: string,
  cues: CardRigCue[],
  state: CardRigFinalState,
  measurementRequired = false,
  initialHand: Card[] = state.hand,
): CardRigFixture => ({
  id,
  label,
  initialHand: [...initialHand],
  cues,
  finalState: state,
  measurementRequired,
});

const standardCommitment = (
  id: string,
  card: Card,
  refill: Card,
): CardRigFixture => {
  const handSlot = OPENING_HAND.indexOf(card);
  const remaining = OPENING_HAND.filter((candidate) => candidate !== card);
  const resolvedHand = [...remaining, refill];
  return fixture(
    id,
    `${card} commitment and refill`,
    [
      cue('commit', card, handSlot),
      cue('effect-hold', card),
      cue('discard', card),
      cue('refill', refill, 2),
      cue('settle'),
      cue('focus', resolvedHand[0]),
    ],
    finalState(resolvedHand),
    false,
    OPENING_HAND,
  );
};

export const CARD_RIG_FIXTURES = {
  'optical-default': fixture(
    'optical-default',
    'Optical alignment at 1280 by 660',
    [],
    finalState(LAB_HAND),
    true,
  ),
  'optical-minimum': fixture(
    'optical-minimum',
    'Optical alignment at 1024 by 580',
    [],
    finalState(LAB_HAND),
    true,
  ),
  'initial-deal': fixture(
    'initial-deal',
    'Opening deal from the deck',
    [
      cue('deal', 'Strike', 0),
      cue('deal', 'Guard', 1),
      cue('deal', 'Mend', 2),
      cue('settle'),
      cue('focus', 'Strike'),
    ],
    finalState(OPENING_HAND),
  ),
  'pointer-hover': fixture(
    'pointer-hover',
    'Pointer hover emphasis',
    [cue('hover', 'Guard', 1)],
    finalState(OPENING_HAND),
  ),
  'keyboard-focus': fixture(
    'keyboard-focus',
    'Keyboard focus emphasis',
    [cue('focus', 'Heavy Bonk', 2)],
    finalState(LAB_HAND),
  ),
  'strike-commitment': standardCommitment(
    'strike-commitment',
    'Strike',
    'Spark',
  ),
  'guard-commitment': standardCommitment(
    'guard-commitment',
    'Guard',
    'Spark',
  ),
  'mend-commitment': standardCommitment(
    'mend-commitment',
    'Mend',
    'Spark',
  ),
  'heavy-bonk-vacancy': fixture(
    'heavy-bonk-vacancy',
    'Heavy Bonk commitment leaves a vacancy',
    [
      cue('commit', 'Heavy Bonk', 2),
      cue('effect-hold', 'Heavy Bonk'),
      cue('discard', 'Heavy Bonk'),
      cue('vacancy', undefined, 2),
      cue('settle'),
      cue('focus', 'Strike'),
    ],
    {
      ...finalState(['Strike', 'Guard']),
      vacantSlots: [2],
    },
    false,
    ['Strike', 'Guard', 'Heavy Bonk'],
  ),
  'spark-sequence': fixture(
    'spark-sequence',
    'Spark commitment and replacement',
    [
      cue('commit', 'Spark', 1),
      cue('effect-hold', 'Spark'),
      cue('discard', 'Spark'),
      cue('spark-choice'),
      cue('replace-discard', 'Mend', 2),
      cue('refill', 'Guard', 1),
      cue('refill', 'Stun', 2),
      cue('settle'),
      cue('focus', 'Strike'),
    ],
    finalState(['Strike', 'Guard', 'Stun']),
    false,
    ['Strike', 'Spark', 'Mend'],
  ),
  'stun-enemy-hold': fixture(
    'stun-enemy-hold',
    'Stun commitment and enemy hold',
    [
      cue('commit', 'Stun', 1),
      cue('effect-hold', 'Stun'),
      cue('discard', 'Stun'),
      cue('enemy-hold'),
      cue('refill', 'Heavy Bonk', 1),
      cue('settle'),
      cue('focus', 'Strike'),
    ],
    finalState(['Strike', 'Heavy Bonk', 'Mend']),
    false,
    ['Strike', 'Stun', 'Mend'],
  ),
  'terminal-lock': fixture(
    'terminal-lock',
    'Terminal two-card lock',
    [cue('terminal-lock')],
    {
      ...finalState(['Strike', 'Mend'], 'Terminal'),
      lockedCards: ['Strike', 'Mend'],
      actionableCards: [],
    },
  ),
  'reset-during-deal': fixture(
    'reset-during-deal',
    'Reset during opening deal',
    [
      cue('deal', 'Strike', 0),
      cue('deal', 'Guard', 1),
      cue('deal', 'Mend', 2),
    ],
    finalState(OPENING_HAND),
  ),
  'reset-during-commitment': fixture(
    'reset-during-commitment',
    'Reset during commitment',
    [
      cue('commit', 'Strike', 0),
      cue('effect-hold', 'Strike'),
      cue('discard', 'Strike'),
    ],
    finalState(OPENING_HAND),
  ),
  'resize-active': fixture(
    'resize-active',
    'Resize during active motion',
    [
      cue('commit', 'Guard', 1),
      cue('effect-hold', 'Guard'),
      cue('discard', 'Guard'),
      cue('refill', 'Spark', 1),
    ],
    finalState(OPENING_HAND),
  ),
} satisfies Record<string, CardRigFixture>;

export type CardRigFixtureId = keyof typeof CARD_RIG_FIXTURES;

export type CardRigRunContext = {
  fixture: CardRigFixture;
  mode: CardRigMode;
  timing: CardRigMotionTiming;
  signal: AbortSignal;
};

export interface CardRigPort {
  prepare(context: CardRigRunContext): void | Promise<void>;
  perform(
    cue: CardRigCue,
    context: CardRigRunContext,
  ): void | Promise<void>;
  finish(context: CardRigRunContext): void | Promise<void>;
  cleanup(reason: string): void | Promise<void>;
}

export type CardRigRunResult =
  | {
      status: 'completed';
      fixtureId: CardRigFixtureId;
      mode: CardRigMode;
      cues: CardRigCueType[];
      finalState: CardRigFinalState;
    }
  | {
      status: 'cancelled';
      fixtureId: CardRigFixtureId;
      mode: CardRigMode;
      reason: CardRigCancelReason;
      cues: CardRigCueType[];
      finalState: CardRigFinalState;
    };

type ActiveRun = {
  controller: AbortController;
  reason?: CardRigCancelReason;
};

const isAbortError = (error: unknown): boolean =>
  error instanceof Error && error.name === 'AbortError';

export class CardRig {
  private active?: ActiveRun;

  constructor(private readonly port: CardRigPort) {}

  cancel(reason: CardRigCancelReason): void {
    if (!this.active) {
      return;
    }

    const run = this.active;
    run.reason = reason;
    run.controller.abort();
    void this.port.cleanup(reason);
    if (this.active === run) {
      this.active = undefined;
    }
  }

  async play(
    fixtureId: CardRigFixtureId,
    mode: CardRigMode,
  ): Promise<CardRigRunResult> {
    this.cancel('superseded');

    const fixture = CARD_RIG_FIXTURES[fixtureId];
    const run: ActiveRun = { controller: new AbortController() };
    this.active = run;
    const context: CardRigRunContext = {
      fixture,
      mode,
      timing: mode === 'reduced'
        ? REDUCED_MOTION_TIMING
        : FULL_MOTION_TIMING,
      signal: run.controller.signal,
    };
    const cues = fixture.cues.map(({ type }) => type);

    try {
      await this.port.prepare(context);
      for (const nextCue of fixture.cues) {
        if (context.signal.aborted) {
          throw new DOMException('CardRig run cancelled', 'AbortError');
        }
        await this.port.perform(nextCue, context);
      }
      if (context.signal.aborted) {
        throw new DOMException('CardRig run cancelled', 'AbortError');
      }
      await this.port.finish(context);
      if (this.active === run) {
        this.active = undefined;
      }
      return {
        status: 'completed',
        fixtureId,
        mode,
        cues,
        finalState: fixture.finalState,
      };
    } catch (error) {
      if (!context.signal.aborted && !isAbortError(error)) {
        throw error;
      }
      return {
        status: 'cancelled',
        fixtureId,
        mode,
        reason: run.reason ?? 'superseded',
        cues,
        finalState: fixture.finalState,
      };
    }
  }
}
