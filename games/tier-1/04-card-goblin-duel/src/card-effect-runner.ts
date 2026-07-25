import {
  CARD_EFFECT_RECIPES,
  type CardEffectLayer,
  type CardEffectMode,
  type CardEffectPlan,
  type CardEffectRecipe,
  type CardEffectRecipeId,
  type CardEffectStableState,
} from './card-effect-recipes';

export type CardEffectCancelReason = 'reset' | 'resize' | 'superseded' | 'fixture-cancel';

export type EffectResourceCounts = Readonly<{
  emitters: number;
  temporaryObjects: number;
  masks: number;
  fx: number;
  listeners: number;
}>;

export interface CardEffectClock {
  wait(ms: number, signal: AbortSignal): Promise<void>;
}

const abortError = (): Error => {
  const error = new Error('Card effect run cancelled');
  error.name = 'AbortError';
  return error;
};

export const browserEffectClock: CardEffectClock = {
  wait: (ms, signal) => new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(abortError());
      return;
    }
    const finish = (): void => {
      signal.removeEventListener('abort', abort);
      resolve();
    };
    const timer = window.setTimeout(finish, Math.max(0, ms));
    const abort = (): void => {
      window.clearTimeout(timer);
      signal.removeEventListener('abort', abort);
      reject(abortError());
    };
    signal.addEventListener('abort', abort, { once: true });
  }),
};

export type CardEffectRunContext = Readonly<{
  recipe: CardEffectRecipe;
  mode: CardEffectMode;
  plan: CardEffectPlan;
  signal: AbortSignal;
  clock: CardEffectClock;
  generation: number;
}>;

export interface CardEffectPort {
  prepare(context: CardEffectRunContext): void | Promise<void>;
  runLayer(layer: CardEffectLayer, context: CardEffectRunContext): void | Promise<void>;
  finish(context: CardEffectRunContext): void | Promise<void>;
  cleanup(reason: string, context: CardEffectRunContext): void | Promise<void>;
  counts(): EffectResourceCounts;
}

export type CardEffectRunResult = Readonly<{
  status: 'completed' | 'cancelled';
  recipeId: CardEffectRecipeId;
  mode: CardEffectMode;
  layerIds: readonly string[];
  stableState: CardEffectStableState;
  counts: EffectResourceCounts;
  reason?: CardEffectCancelReason;
}>;

type ActiveRun = {
  controller: AbortController;
  context: CardEffectRunContext;
  reason?: CardEffectCancelReason;
  cleanupPromise?: Promise<void>;
};

const isAbortError = (error: unknown): boolean =>
  error instanceof Error && error.name === 'AbortError';

const groupedLayers = (layers: readonly CardEffectLayer[]): CardEffectLayer[][] => {
  const groups = new Map<number, CardEffectLayer[]>();
  for (const effectLayer of layers) {
    const group = groups.get(effectLayer.group) ?? [];
    group.push(effectLayer);
    groups.set(effectLayer.group, group);
  }
  return [...groups.entries()]
    .sort(([left], [right]) => left - right)
    .map(([, group]) => [...group].sort((left, right) => left.order - right.order));
};

export class CardEffectRunner {
  private active?: ActiveRun;
  private generation = 0;

  constructor(
    private readonly port: CardEffectPort,
    private readonly clock: CardEffectClock = browserEffectClock,
  ) {}

  private cleanupRun(run: ActiveRun, reason: string): Promise<void> {
    if (!run.cleanupPromise) {
      run.cleanupPromise = Promise.resolve(this.port.cleanup(reason, run.context));
    }
    return run.cleanupPromise;
  }

  cancel(reason: CardEffectCancelReason): void {
    const run = this.active;
    if (!run) return;
    run.reason = reason;
    run.controller.abort();
    void this.cleanupRun(run, reason);
  }

  async play(
    recipeId: CardEffectRecipeId,
    mode: CardEffectMode,
  ): Promise<CardEffectRunResult> {
    const previous = this.active;
    if (previous) {
      previous.reason = 'superseded';
      previous.controller.abort();
      await this.cleanupRun(previous, 'superseded');
    }

    const recipeValue = CARD_EFFECT_RECIPES[recipeId];
    const planValue = recipeValue[mode];
    const controller = new AbortController();
    const context: CardEffectRunContext = Object.freeze({
      recipe: recipeValue,
      mode,
      plan: planValue,
      signal: controller.signal,
      clock: this.clock,
      generation: ++this.generation,
    });
    const run: ActiveRun = { controller, context };
    this.active = run;

    let status: CardEffectRunResult['status'] = 'completed';
    let reason: CardEffectCancelReason | undefined;
    let thrown: unknown;

    try {
      await this.port.prepare(context);
      for (const group of groupedLayers(planValue.layers)) {
        if (context.signal.aborted) throw abortError();
        await Promise.all(group.map((effectLayer) => this.port.runLayer(effectLayer, context)));
      }
      if (context.signal.aborted) throw abortError();
      await this.port.finish(context);
    } catch (error) {
      if (context.signal.aborted || isAbortError(error)) {
        status = 'cancelled';
        reason = run.reason ?? 'superseded';
      } else {
        thrown = error;
      }
    } finally {
      await this.cleanupRun(run, status === 'completed' && !thrown ? 'complete' : (reason ?? 'error'));
      if (this.active === run) this.active = undefined;
    }

    if (thrown) throw thrown;

    return Object.freeze({
      status,
      recipeId,
      mode,
      layerIds: Object.freeze(planValue.layers.map(({ id }) => id)),
      stableState: planValue.stableState,
      counts: Object.freeze({ ...this.port.counts() }),
      reason,
    });
  }
}

export type { CardEffectLayer } from './card-effect-recipes';
