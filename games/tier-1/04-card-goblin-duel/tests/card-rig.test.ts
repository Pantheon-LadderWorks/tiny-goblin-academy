import { describe, expect, it } from 'vitest';
import {
  CARD_RIG_FIXTURES,
  FULL_MOTION_TIMING,
  REDUCED_MOTION_TIMING,
  CardRig,
  type CardRigCue,
  type CardRigPort,
  type CardRigRunContext,
} from '../src/card-rig';

class RecordingPort implements CardRigPort {
  readonly cues: CardRigCue[] = [];
  readonly cleanups: string[] = [];
  readonly preparations: string[] = [];
  readonly finishes: string[] = [];
  private blockType?: CardRigCue['type'];
  private startedResolve?: () => void;
  readonly started = new Promise<void>((resolve) => {
    this.startedResolve = resolve;
  });

  constructor(blockType?: CardRigCue['type']) {
    this.blockType = blockType;
  }

  prepare(context: CardRigRunContext): void {
    this.preparations.push(`${context.fixture.id}:${context.mode}`);
  }

  async perform(cue: CardRigCue, context: CardRigRunContext): Promise<void> {    this.cues.push(cue);
    if (cue.type !== this.blockType) {
      return;
    }

    this.startedResolve?.();
    await new Promise<void>((resolve, reject) => {
      const abort = () => {
        const error = new Error('CardRig run cancelled');
        error.name = 'AbortError';
        reject(error);
      };

      if (context.signal.aborted) {
        abort();
        return;
      }

      context.signal.addEventListener('abort', abort, { once: true });
    });
  }

  finish(context: CardRigRunContext): void {
    this.finishes.push(`${context.fixture.id}:${context.mode}`);
  }

  cleanup(reason: string): void {
    this.cleanups.push(reason);
  }
}

const fixtureIds = [
  'optical-default',
  'optical-minimum',
  'initial-deal',
  'pointer-hover',
  'keyboard-focus',
  'strike-commitment',
  'guard-commitment',
  'mend-commitment',
  'heavy-bonk-vacancy',
  'spark-sequence',
  'stun-enemy-hold',
  'terminal-lock',
  'reset-during-deal',
  'reset-during-commitment',
  'resize-active',
  'r1-frame-gold',
  'r1-frame-wood',
  'r1-frame-corner',
] as const;

const frameLifecycleFixtureIds = [
  'r1-frame-gold',
  'r1-frame-wood',
  'r1-frame-corner',
] as const;

function cueTypes(fixtureId: (typeof fixtureIds)[number]): string[] {
  return CARD_RIG_FIXTURES[fixtureId].cues.map((cue) => cue.type);
}

describe('CardRig fixture contracts', () => {
  it('registers every authorized deterministic fixture', () => {
    expect(Object.keys(CARD_RIG_FIXTURES)).toEqual(fixtureIds);
  });

  it('deals the ordinary opening hand from the deck in order', () => {
    const fixture = CARD_RIG_FIXTURES['initial-deal'];
    expect(fixture.cues).toMatchObject([
      { type: 'deal', card: 'Strike', slot: 0 },
      { type: 'deal', card: 'Guard', slot: 1 },
      { type: 'deal', card: 'Mend', slot: 2 },
      { type: 'settle' },
      { type: 'focus', card: 'Strike' },
    ]);
    expect(fixture.finalState.hand).toEqual(['Strike', 'Guard', 'Mend']);
  });

  it.each(frameLifecycleFixtureIds)('%s proves draw, focus, play, and discard', (fixtureId) => {
    expect(cueTypes(fixtureId)).toEqual([
      'deal',
      'deal',
      'deal',
      'settle',
      'focus',
      'commit',
      'effect-hold',
      'discard',
    ]);
  });

  it.each(['strike-commitment', 'guard-commitment', 'mend-commitment'] as const)(
    '%s commits, exits, refills, settles, and restores focus',
    (fixtureId) => {
      expect(cueTypes(fixtureId)).toEqual([
        'commit',
        'effect-hold',
        'discard',
        'refill',
        'settle',
        'focus',
      ]);
      expect(CARD_RIG_FIXTURES[fixtureId].finalState.hand).toHaveLength(3);
    },
  );

  it('leaves the Heavy Bonk slot vacant without a refill', () => {
    const fixture = CARD_RIG_FIXTURES['heavy-bonk-vacancy'];
    expect(cueTypes('heavy-bonk-vacancy')).toEqual([
      'commit',
      'effect-hold',
      'discard',
      'vacancy',
      'settle',
      'focus',
    ]);
    expect(fixture.finalState.hand).toEqual(['Strike', 'Guard']);
    expect(fixture.finalState.vacantSlots).toEqual([2]);
  });

  it('runs Spark in one governed ordered sequence', () => {
    expect(cueTypes('spark-sequence')).toEqual([
      'commit',
      'effect-hold',
      'discard',
      'spark-choice',
      'replace-discard',
      'refill',
      'refill',
      'settle',
      'focus',
    ]);
    expect(CARD_RIG_FIXTURES['spark-sequence'].initialHand).toEqual([
      'Strike', 'Spark', 'Mend',
    ]);
    expect(CARD_RIG_FIXTURES['spark-sequence'].finalState.phase).toBe(
      'PlayerAction',
    );
  });

  it('holds the enemy response before Stun hands focus back', () => {
    expect(cueTypes('stun-enemy-hold')).toEqual([
      'commit',
      'effect-hold',
      'discard',
      'enemy-hold',
      'refill',
      'settle',
      'focus',
    ]);
  });

  it('locks the terminal hand and leaves Reset Duel available', () => {
    const fixture = CARD_RIG_FIXTURES['terminal-lock'];
    expect(cueTypes('terminal-lock')).toEqual(['terminal-lock']);
    expect(fixture.finalState).toMatchObject({
      phase: 'Terminal',
      hand: ['Strike', 'Mend'],
      lockedCards: ['Strike', 'Mend'],
      actionableCards: [],
      resetAvailable: true,
    });
  });

  it('keeps optical fixtures static and measurement-ready', () => {
    for (const fixtureId of ['optical-default', 'optical-minimum'] as const) {
      const fixture = CARD_RIG_FIXTURES[fixtureId];
      expect(fixture.cues).toEqual([]);
      expect(fixture.measurementRequired).toBe(true);
      expect(fixture.finalState.hand).toEqual([
        'Strike',
        'Guard',
        'Mend',
        'Spark',
        'Stun',
        'Heavy Bonk',
      ]);
    }
  });
});

describe('CardRig motion policy', () => {
  it('plays a simulation-authored production plan through the same rig runner', async () => {
    const port = new RecordingPort();
    const rig = new CardRig(port);
    const result = await rig.playPlan({
      id: 'live-strike-1',
      label: 'Live Strike transition',
      initialHand: ['Strike', 'Guard', 'Mend'],
      cues: [
        { type: 'commit', card: 'Strike', slot: 0 },
        { type: 'effect-hold', card: 'Strike' },
        { type: 'discard', card: 'Strike' },
        { type: 'refill', card: 'Spark', slot: 2 },
        { type: 'settle' },
      ],
      finalState: { phase: 'PlayerAction', hand: ['Guard', 'Mend', 'Spark'] },
      measurementRequired: false,
    }, 'full');

    expect(result).toMatchObject({ status: 'completed', fixtureId: 'live-strike-1' });
    expect(port.cues.map(({ type }) => type)).toEqual([
      'commit', 'effect-hold', 'discard', 'refill', 'settle',
    ]);
  });

  it('uses the same semantic cue order in full and reduced motion', async () => {
    const fullPort = new RecordingPort();
    const reducedPort = new RecordingPort();
    const fullRig = new CardRig(fullPort);
    const reducedRig = new CardRig(reducedPort);

    const full = await fullRig.play('spark-sequence', 'full');
    const reduced = await reducedRig.play('spark-sequence', 'reduced');

    expect(full.status).toBe('completed');
    expect(reduced.status).toBe('completed');
    expect(reduced.cues).toEqual(full.cues);
    expect(reduced.finalState).toEqual(full.finalState);
  });

  it('keeps reduced motion brief and free from travel or rotation', () => {
    expect(FULL_MOTION_TIMING).toMatchObject({
      allowTravel: true,
      allowRotation: true,
    });
    expect(REDUCED_MOTION_TIMING).toMatchObject({
      allowTravel: false,
      allowRotation: false,
    });
    expect(REDUCED_MOTION_TIMING.cueMs).toBeLessThan(
      FULL_MOTION_TIMING.cueMs,
    );
  });

  it.each(['reset', 'resize'] as const)(
    'cancels an active deal on %s and cleans transient state',
    async (reason) => {
      const port = new RecordingPort('deal');
      const rig = new CardRig(port);
      const run = rig.play('initial-deal', 'full');

      await port.started;
      rig.cancel(reason);

      await expect(run).resolves.toMatchObject({
        status: 'cancelled',
        reason,
      });
      expect(port.cleanups).toContain(reason);
      expect(port.finishes).toEqual([]);
    },
  );

  it('cancels a stale fixture before starting its replacement', async () => {
    const port = new RecordingPort('commit');
    const rig = new CardRig(port);
    const stale = rig.play('strike-commitment', 'full');

    await port.started;
    const replacement = rig.play('terminal-lock', 'reduced');

    await expect(stale).resolves.toMatchObject({
      status: 'cancelled',
      reason: 'superseded',
    });
    await expect(replacement).resolves.toMatchObject({
      status: 'completed',
      fixtureId: 'terminal-lock',
    });
    expect(port.cleanups).toContain('superseded');
  });
});
