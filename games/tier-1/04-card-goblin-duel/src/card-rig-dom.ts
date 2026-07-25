import type {
  CardRigCue,
  CardRigPort,
  CardRigRunContext,
} from './card-rig';
import {
  planCardRigRoute,
  type CardRigRoutePlan,
} from './card-rig-routes';
import type { Card, Phase } from './simulation';

export type CardRigRouteTelemetry = Readonly<{
  cue: CardRigCue['type'];
  card: Card;
  kind: CardRigRoutePlan['kind'];
  fromAnchorId: CardRigRoutePlan['from'];
  toAnchorId: CardRigRoutePlan['to'];
  startRect: Readonly<{ x: number; y: number; width: number; height: number }>;
  endRect: Readonly<{ x: number; y: number; width: number; height: number }>;
  durationMs: number;
  mode: CardRigRunContext['mode'];
}>;

export type DomCardRigOptions = {
  hand: HTMLElement;
  anchors: Readonly<{
    playerDrawOrigin: HTMLElement;
    playedCardTarget: HTMLElement;
    playerDiscardTarget: HTMLElement;
  }>;
  enemy: HTMLElement;
  renderHand(cards: readonly Card[], phase: Phase): void;
  onCue?(cue: CardRigCue, context: CardRigRunContext): void | Promise<void>;
  onCueComplete?(cue: CardRigCue, context: CardRigRunContext): void | Promise<void>;
  onRoute?(route: CardRigRouteTelemetry): void;
  onCleanup?(reason: string): void;
};

type Point = Readonly<{ x: number; y: number }>;

const center = (element: Element): Point => {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

const rectSnapshot = (element: Element) => {
  const rect = element.getBoundingClientRect();
  return Object.freeze({ x: rect.x, y: rect.y, width: rect.width, height: rect.height });
};

const layoutCenter = (element: Element): Point => {
  const current = center(element);
  const transform = getComputedStyle(element).transform;
  if (!transform || transform === 'none') return current;
  const matrix = new DOMMatrixReadOnly(transform);
  return { x: current.x - matrix.e, y: current.y - matrix.f };
};

const travelTo = (target: Element, card: Element): Point => {
  const destination = center(target);
  const origin = layoutCenter(card);
  return { x: destination.x - origin.x, y: destination.y - origin.y };
};

const reducedTravel = (delta: Point, distance = 28): Point => {
  const magnitude = Math.hypot(delta.x, delta.y);
  if (magnitude === 0) return { x: 0, y: 0 };
  const scale = Math.min(1, distance / magnitude);
  return { x: delta.x * scale, y: delta.y * scale };
};

const abortError = (): DOMException =>
  new DOMException('CardRig run cancelled', 'AbortError');

export class DomCardRigPort implements CardRigPort {
  private readonly animations = new Set<Animation>();

  constructor(private readonly options: DomCardRigOptions) {}

  private recordRoute(
    cue: CardRigCue,
    context: CardRigRunContext,
    from: Element,
    to: Element,
  ): void {
    const plan = planCardRigRoute(cue);
    if (!plan || !cue.card) return;
    this.options.onRoute?.(Object.freeze({
      cue: cue.type,
      card: cue.card,
      kind: plan.kind,
      fromAnchorId: plan.from,
      toAnchorId: plan.to,
      startRect: rectSnapshot(from),
      endRect: rectSnapshot(to),
      durationMs: context.timing.cueMs,
      mode: context.mode,
    }));
  }

  private buttons(): HTMLButtonElement[] {
    return Array.from(
      this.options.hand.querySelectorAll<HTMLButtonElement>('.card-btn'),
    );
  }

  private decorate(): void {
    this.buttons().forEach((button, index) => {
      button.dataset.cardRigSlot = String(index);
      button.dataset.cardRigId = `${button.dataset.cardName}-${index}`;
    });
  }

  private card(name: Card | undefined): HTMLButtonElement | undefined {
    return this.buttons().find((button) => button.dataset.cardName === name);
  }

  private visibleButtons(): HTMLButtonElement[] {
    return this.buttons().filter((button) => button.dataset.cardRigHidden !== '1');
  }

  private clearButtonStyles(button: HTMLButtonElement): void {
    button.style.removeProperty('opacity');
    button.style.removeProperty('transform');
    button.style.removeProperty('z-index');
    button.style.removeProperty('filter');
    button.classList.remove(
      'card-rig-committed',
      'card-rig-choice',
      'card-rig-vacancy',
      'card-rig-card-back',
    );
    delete button.dataset.cardRigHidden;
  }

  private async animate(
    element: Element,
    frames: Keyframe[],
    context: CardRigRunContext,
    duration = context.timing.cueMs,
  ): Promise<void> {
    if (context.signal.aborted) throw abortError();
    const animation = element.animate(frames, {
      duration,
      easing: 'cubic-bezier(0.2, 0.72, 0.2, 1)',
      fill: 'forwards',
    });
    this.animations.add(animation);
    const cancel = () => animation.cancel();
    context.signal.addEventListener('abort', cancel, { once: true });

    try {
      await animation.finished;
      if (context.signal.aborted) throw abortError();
    } catch (error) {
      if (context.signal.aborted) throw abortError();
      throw error;
    } finally {
      context.signal.removeEventListener('abort', cancel);
      this.animations.delete(animation);
      if (animation.playState !== 'idle') animation.cancel();
    }
  }

  prepare(context: CardRigRunContext): void {
    this.options.renderHand(context.fixture.initialHand, 'PlayerAction');
    this.decorate();
    this.options.hand.dataset.cardRigFixture = context.fixture.id;
    this.options.hand.dataset.cardRigMode = context.mode;
    this.options.hand.dataset.cardRigStatus = 'running';

    if (
      context.fixture.id === 'initial-deal'
      || context.fixture.id === 'reset-during-deal'
    ) {
      for (const button of this.buttons()) {
        button.style.opacity = '0';
        button.dataset.cardRigHidden = '1';
      }
    }
  }

  private async deal(
    cue: CardRigCue,
    context: CardRigRunContext,
  ): Promise<void> {
    const button = this.card(cue.card);
    if (!button) return;
    const drawOrigin = this.options.anchors.playerDrawOrigin;
    const fullDelta = travelTo(drawOrigin, button);
    const delta = context.timing.allowTravel ? fullDelta : reducedTravel(fullDelta);
    this.recordRoute(cue, context, drawOrigin, button);
    delete button.dataset.cardRigHidden;
    button.style.opacity = '1';
    button.classList.add('card-rig-card-back');
    const rotation = context.timing.allowRotation ? -5 : 0;
    const halfwayRotation = context.timing.allowRotation ? -2 : 0;
    const halfway = `translate(${delta.x * 0.35}px, ${delta.y * 0.35}px) rotate(${halfwayRotation}deg) scale(0.96)`;
    const origin = `translate(${delta.x}px, ${delta.y}px) rotate(${rotation}deg) scale(${context.timing.allowTravel ? 0.9 : 0.96})`;

    await this.animate(button, [
      { opacity: 0.38, transform: origin },
      { opacity: 0.84, transform: halfway },
    ], context, context.timing.cueMs / 2);
    button.classList.remove('card-rig-card-back');
    await this.animate(button, [
      { opacity: 0.84, transform: halfway },
      { opacity: 1, transform: 'translate(0, 0) rotate(0) scale(1)' },
    ], context, context.timing.cueMs / 2);
    button.style.opacity = '1';
    button.style.transform = 'translate(0, 0)';
  }

  private async emphasize(
    cue: CardRigCue,
    context: CardRigRunContext,
    lift: number,
  ): Promise<void> {
    const button = this.card(cue.card);
    if (!button) return;
    if (cue.type === 'focus') button.focus({ preventScroll: true });
    const transform = `translateY(-${lift}px) scale(1.015)`;
    await this.animate(button, [
      { transform: 'translateY(0) scale(1)' },
      { transform },
    ], context);
    button.style.transform = transform;
  }

  private async commit(
    cue: CardRigCue,
    context: CardRigRunContext,
  ): Promise<void> {
    const button = this.card(cue.card);
    if (!button) return;
    const playedTarget = this.options.anchors.playedCardTarget;
    const fullDelta = travelTo(playedTarget, button);
    const delta = context.timing.allowTravel ? fullDelta : reducedTravel(fullDelta, 24);
    this.recordRoute(cue, context, button, playedTarget);
    button.classList.add('card-rig-committed');
    button.style.zIndex = '30';
    const rotation = context.timing.allowRotation ? -2 : 0;
    const target = `translate(${delta.x}px, ${delta.y}px) rotate(${rotation}deg) scale(1.03)`;

    await this.animate(button, [
      { transform: 'translate(0, 0) rotate(0) scale(1)' },
      { transform: target },
    ], context);
    button.style.transform = target;
  }

  private async effectHold(
    cue: CardRigCue,
    context: CardRigRunContext,
  ): Promise<void> {
    const button = this.card(cue.card);
    if (!button) return;
    const base = button.style.transform || 'translate(0, 0)';
    await this.animate(button, [
      { boxShadow: '0 0 0 0 rgba(101, 217, 255, 0)', transform: base },
      {
        boxShadow: '0 0 0 4px rgba(101, 217, 255, 0.55)',
        transform: `${base} scale(1.025)`,
      },
      { boxShadow: '0 0 0 0 rgba(101, 217, 255, 0)', transform: base },
    ], context, context.timing.holdMs);
  }

  private async discard(
    cue: CardRigCue,
    context: CardRigRunContext,
  ): Promise<void> {
    const button = this.card(cue.card);
    if (!button) return;
    const discardTarget = this.options.anchors.playerDiscardTarget;
    const fullDelta = travelTo(discardTarget, button);
    const delta = context.timing.allowTravel ? fullDelta : reducedTravel(fullDelta);
    const semanticOrigin = cue.type === 'discard'
      ? this.options.anchors.playedCardTarget
      : button;
    this.recordRoute(cue, context, semanticOrigin, discardTarget);
    const rotation = context.timing.allowRotation ? 5 : 0;
    const target = `translate(${delta.x}px, ${delta.y}px) rotate(${rotation}deg) scale(${context.timing.allowTravel ? 0.9 : 0.96})`;

    await this.animate(button, [
      { opacity: 1, transform: button.style.transform || 'scale(1)' },
      { opacity: 0, transform: target },
    ], context);
    button.style.opacity = '0';
    button.style.transform = target;
    button.dataset.cardRigHidden = '1';
  }

  private markSparkChoice(): void {
    for (const button of this.visibleButtons()) {
      if (button.classList.contains('card-rig-committed')) continue;
      button.classList.add('card-choice', 'card-rig-choice');
      button.classList.remove('card-playable');
      const label = button.querySelector<HTMLElement>('.card-state');
      if (label) label.textContent = 'Replace';
      button.setAttribute(
        'aria-label',
        button.getAttribute('aria-label')?.replace(/^Play /, 'Replace ') ?? '',
      );
    }
  }

  private async refill(
    cue: CardRigCue,
    context: CardRigRunContext,
  ): Promise<void> {
    if (!cue.card) return;
    const cards = this.visibleButtons()
      .map((button) => button.dataset.cardName)
      .filter((name): name is Card => Boolean(name));
    const slot = Math.min(cue.slot ?? cards.length, cards.length);
    cards.splice(slot, 0, cue.card);
    this.options.renderHand(cards, 'PlayerAction');
    this.decorate();

    const button = this.card(cue.card);
    if (!button) return;
    const drawOrigin = this.options.anchors.playerDrawOrigin;
    const fullDelta = travelTo(drawOrigin, button);
    const delta = context.timing.allowTravel ? fullDelta : reducedTravel(fullDelta);
    this.recordRoute(cue, context, drawOrigin, button);
    const rotation = context.timing.allowRotation ? -3 : 0;
    const origin = `translate(${delta.x}px, ${delta.y}px) rotate(${rotation}deg) scale(${context.timing.allowTravel ? 0.92 : 0.97})`;
    button.classList.add('card-rig-card-back');
    await this.animate(button, [
      { opacity: 0.2, transform: origin },
      { opacity: 0.76, transform: 'translate(0, 0) scale(0.985)' },
    ], context, context.timing.cueMs / 2);
    button.classList.remove('card-rig-card-back');
    await this.animate(button, [
      { opacity: 0.76, transform: 'scale(0.985)' },
      { opacity: 1, transform: 'scale(1)' },
    ], context, context.timing.cueMs / 2);
  }

  private async enemyHold(context: CardRigRunContext): Promise<void> {
    const distance = context.timing.allowTravel ? 4 : 0;
    await this.animate(this.options.enemy, [
      { transform: 'translateX(0)', filter: 'brightness(1)' },
      {
        transform: `translateX(${distance}px)`,
        filter: 'brightness(1.18)',
      },
      { transform: 'translateX(0)', filter: 'brightness(1)' },
    ], context, context.timing.holdMs);
  }

  private async terminalLock(context: CardRigRunContext): Promise<void> {
    this.options.renderHand(context.fixture.finalState.hand, 'Terminal');
    this.decorate();
    await Promise.all(this.buttons().map(async (button, index) => {
      button.disabled = true;
      const lockedTransform = context.timing.allowTravel
        ? 'translateY(2px) scale(0.99)'
        : 'scale(0.995)';
      await this.animate(button, [
        { filter: 'saturate(1) brightness(1)', transform: 'translateY(0) scale(1)' },
        { filter: 'saturate(0.62) brightness(0.84)', transform: lockedTransform },
      ], context, context.timing.cueMs + index * 30);
      button.style.filter = 'saturate(0.62) brightness(0.84)';
      button.style.transform = lockedTransform;
    }));
  }

  async perform(
    cue: CardRigCue,
    context: CardRigRunContext,
  ): Promise<void> {
    await this.options.onCue?.(cue, context);

    switch (cue.type) {
      case 'deal':
        await this.deal(cue, context);
        break;
      case 'hover':
        await this.emphasize(cue, context, 6);
        break;
      case 'focus':
        await this.emphasize(cue, context, 8);
        break;
      case 'commit':
        await this.commit(cue, context);
        break;
      case 'effect-hold':
        await this.effectHold(cue, context);
        break;
      case 'discard':
      case 'replace-discard':
        await this.discard(cue, context);
        break;
      case 'refill':
        await this.refill(cue, context);
        break;
      case 'spark-choice':
        this.markSparkChoice();
        break;
      case 'enemy-hold':
        await this.enemyHold(context);
        break;
      case 'terminal-lock':
        await this.terminalLock(context);
        break;
      case 'vacancy':
        this.options.hand.dataset.cardRigVacancy = String(cue.slot ?? '');
        break;
      case 'settle':
        for (const button of this.visibleButtons()) {
          button.style.transform = 'translate(0, 0)';
          button.style.opacity = '1';
          button.style.removeProperty('z-index');
        }
        break;
    }
    await this.options.onCueComplete?.(cue, context);
  }

  finish(context: CardRigRunContext): void {
    if (
      context.fixture.id !== 'pointer-hover'
      && context.fixture.id !== 'keyboard-focus'
    ) {
      this.options.renderHand(
        context.fixture.finalState.hand,
        context.fixture.finalState.phase,
      );
      this.decorate();
    }
    this.options.hand.dataset.cardRigStatus = 'complete';
    this.options.hand.dataset.cardRigPhase = context.fixture.finalState.phase;
  }

  cleanup(reason: string): void {
    for (const animation of this.animations) animation.cancel();
    this.animations.clear();
    for (const button of this.buttons()) this.clearButtonStyles(button);
    this.options.enemy.removeAttribute('style');
    this.options.hand.dataset.cardRigStatus = 'cancelled';
    this.options.hand.dataset.cardRigCancelReason = reason;
    delete this.options.hand.dataset.cardRigVacancy;
    this.options.onCleanup?.(reason);
  }
}
