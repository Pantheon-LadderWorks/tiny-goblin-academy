import type { CombatFeedbackEvent } from './combat-feedback';

export type DomCombatFeedbackOptions = Readonly<{
  playerPanel: HTMLElement;
  enemyPanel: HTMLElement;
  playerHp: HTMLElement;
  enemyHp: HTMLElement;
}>;

const feedbackText = (event: CombatFeedbackEvent): string => {
  if (event.kind === 'damage') return `−${event.amount ?? 0}`;
  if (event.kind === 'heal') return (event.amount ?? 0) > 0 ? `+${event.amount}` : 'MAX';
  if (event.kind === 'guard') return `+${event.amount ?? 0} GUARD`;
  if (event.kind === 'stun') return 'STUNNED';
  if (event.kind === 'blocked') return 'BLOCKED';
  return '';
};

export class DomCombatFeedbackController {
  private readonly nodes = new Set<HTMLElement>();
  private readonly timers = new Set<number>();

  constructor(private readonly options: DomCombatFeedbackOptions) {}

  show(event: CombatFeedbackEvent): void {
    if (event.target === 'draw-pile') return;
    const panel = event.target === 'enemy' ? this.options.enemyPanel : this.options.playerPanel;
    const hp = event.target === 'enemy' ? this.options.enemyHp : this.options.playerHp;
    const className = `combat-feedback-${event.kind}`;
    if (event.hpAfter !== undefined) {
      const maximum = event.target === 'enemy' ? 12 : 10;
      hp.textContent = `${Math.max(0, event.hpAfter)} / ${maximum} HP`;
    }

    panel.classList.remove(
      'combat-feedback-damage',
      'combat-feedback-heal',
      'combat-feedback-guard',
      'combat-feedback-stun',
      'combat-feedback-blocked',
    );
    void panel.offsetWidth;
    panel.classList.add(className);

    const label = document.createElement('span');
    label.className = `combat-float ${className}`;
    label.dataset.combatFeedback = event.kind;
    label.setAttribute('aria-hidden', 'true');
    label.textContent = feedbackText(event);
    panel.append(label);
    this.nodes.add(label);

    const timer = window.setTimeout(() => {
      panel.classList.remove(className);
      label.remove();
      this.nodes.delete(label);
      this.timers.delete(timer);
    }, 1100);
    this.timers.add(timer);
  }

  cleanup(): void {
    for (const timer of this.timers) window.clearTimeout(timer);
    this.timers.clear();
    for (const node of this.nodes) node.remove();
    this.nodes.clear();
    for (const panel of [this.options.playerPanel, this.options.enemyPanel]) {
      panel.classList.remove(
        'combat-feedback-damage',
        'combat-feedback-heal',
        'combat-feedback-guard',
        'combat-feedback-stun',
        'combat-feedback-blocked',
      );
    }
  }

  counts(): Readonly<{ nodes: number; timers: number }> {
    return Object.freeze({ nodes: this.nodes.size, timers: this.timers.size });
  }
}
