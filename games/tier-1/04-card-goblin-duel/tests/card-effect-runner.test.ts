import { describe, expect, it } from 'vitest';
import {
  CardEffectRunner,
  type CardEffectClock,
  type CardEffectLayer,
  type CardEffectPort,
  type CardEffectRunContext,
  type EffectResourceCounts,
} from '../src/card-effect-runner';
import type { CardEffectRecipeId } from '../src/card-effect-recipes';

const ZERO_COUNTS: EffectResourceCounts = Object.freeze({
  emitters: 0,
  temporaryObjects: 0,
  masks: 0,
  fx: 0,
  listeners: 0,
});

const immediateClock: CardEffectClock = {
  wait: async (_ms, signal) => {
    if (signal.aborted) {
      const error = new Error('aborted');
      error.name = 'AbortError';
      throw error;
    }
  },
};

class RecordingEffectPort implements CardEffectPort {
  readonly events: string[] = [];
  readonly cleanups: string[] = [];
  readonly active = new Set<string>();
  private blockKind?: CardEffectLayer['kind'];
  private startedResolve?: () => void;
  readonly started = new Promise<void>((resolve) => {
    this.startedResolve = resolve;
  });

  constructor(blockKind?: CardEffectLayer['kind']) {
    this.blockKind = blockKind;
  }

  prepare(context: CardEffectRunContext): void {
    this.events.push(`prepare:${context.recipe.id}:${context.mode}`);
  }

  async runLayer(layer: CardEffectLayer, context: CardEffectRunContext): Promise<void> {
    this.events.push(`start:${layer.id}`);
    this.active.add(layer.id);
    if (layer.kind === this.blockKind) {
      this.startedResolve?.();
      await new Promise<void>((resolve, reject) => {
        const abort = () => {
          const error = new Error('cancelled');
          error.name = 'AbortError';
          reject(error);
        };
        if (context.signal.aborted) return abort();
        context.signal.addEventListener('abort', abort, { once: true });
      });
    } else {
      await context.clock.wait(layer.durationMs, context.signal);
    }
    this.active.delete(layer.id);
    this.events.push(`finish:${layer.id}`);
  }

  finish(context: CardEffectRunContext): void {
    this.events.push(`finish-recipe:${context.recipe.id}`);
  }

  cleanup(reason: string): void {
    this.cleanups.push(reason);
    this.active.clear();
  }

  counts(): EffectResourceCounts {
    return this.active.size === 0
      ? ZERO_COUNTS
      : { ...ZERO_COUNTS, temporaryObjects: this.active.size };
  }
}

describe('CardEffectRunner', () => {
  it('runs groups in stable order and concurrent layers together', async () => {
    const port = new RecordingEffectPort();
    const runner = new CardEffectRunner(port, immediateClock);

    const result = await runner.play('strike', 'full');

    expect(result.status).toBe('completed');
    const firstGroupStarts = port.events
      .filter((event) => event.startsWith('start:strike-g0'));
    expect(firstGroupStarts).toHaveLength(2);
    const firstLaterStart = port.events.findIndex((event) => event.startsWith('start:strike-g1'));
    expect(port.events.indexOf(firstGroupStarts[0])).toBeLessThan(firstLaterStart);
    expect(port.events.indexOf(firstGroupStarts[1])).toBeLessThan(firstLaterStart);
    expect(result.counts).toEqual(ZERO_COUNTS);
    expect(port.cleanups).toEqual(['complete']);
  });

  it('uses equivalent stable states in full and reduced motion', async () => {
    const full = await new CardEffectRunner(new RecordingEffectPort(), immediateClock)
      .play('spark', 'full');
    const reduced = await new CardEffectRunner(new RecordingEffectPort(), immediateClock)
      .play('spark', 'reduced');

    expect(full.status).toBe('completed');
    expect(reduced.status).toBe('completed');
    expect(reduced.stableState).toEqual(full.stableState);
    expect(reduced.layerIds).not.toEqual(full.layerIds);
  });

  it.each(['reset', 'resize'] as const)(
    'cancels every active layer on %s and cleans once',
    async (reason) => {
      const port = new RecordingEffectPort('projectile');
      const runner = new CardEffectRunner(port, immediateClock);
      const run = runner.play('strike', 'full');

      await port.started;
      runner.cancel(reason);

      await expect(run).resolves.toMatchObject({ status: 'cancelled', reason });
      expect(port.cleanups).toEqual([reason]);
      expect(port.counts()).toEqual(ZERO_COUNTS);
    },
  );

  it('cancels a stale recipe before replacement and leaves no stale callbacks', async () => {
    const port = new RecordingEffectPort('projectile');
    const runner = new CardEffectRunner(port, immediateClock);
    const stale = runner.play('strike', 'full');

    await port.started;
    const replacement = runner.play('guard', 'reduced');

    await expect(stale).resolves.toMatchObject({
      status: 'cancelled',
      reason: 'superseded',
    });
    await expect(replacement).resolves.toMatchObject({
      status: 'completed',
      recipeId: 'guard',
    });
    expect(port.counts()).toEqual(ZERO_COUNTS);
    expect(port.events.at(-1)).toBe('finish-recipe:guard');
  });

  it('repeats every card recipe in full and reduced motion without accumulating resources', async () => {
    const port = new RecordingEffectPort();
    const runner = new CardEffectRunner(port, immediateClock);
    const recipes: readonly CardEffectRecipeId[] = [
      'strike',
      'guard',
      'mend',
      'spark',
      'stun',
      'heavy-bonk',
    ];

    for (let repeat = 0; repeat < 3; repeat += 1) {
      for (const recipe of recipes) {
        for (const mode of ['full', 'reduced'] as const) {
          const result = await runner.play(recipe, mode);
          expect(result.status).toBe('completed');
          expect(result.counts).toEqual(ZERO_COUNTS);
          expect(port.counts()).toEqual(ZERO_COUNTS);
        }
      }
    }

    expect(port.cleanups).toHaveLength(36);
    expect(port.cleanups.every((reason) => reason === 'complete')).toBe(true);
    expect(port.counts()).toEqual(ZERO_COUNTS);
  });
});
