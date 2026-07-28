import type { Card, GameState } from './simulation';

export type CombatFeedbackEvent = Readonly<{
  kind: 'damage' | 'heal' | 'guard' | 'stun' | 'blocked' | 'skip-draw';
  target: 'player' | 'enemy' | 'draw-pile';
  amount?: number;
  hpAfter?: number;
}>;

export type CombatFeedbackPlan = Readonly<{
  activation: readonly CombatFeedbackEvent[];
  retaliation: readonly CombatFeedbackEvent[];
}>;

const DAMAGE_BY_CARD: Readonly<Partial<Record<Card, number>>> = Object.freeze({
  Strike: 2,
  Spark: 1,
  'Heavy Bonk': 4,
});

const retaliationDamage = (
  before: GameState,
  after: GameState,
): number | undefined => {
  const newEntries = after.log.slice(before.log.length);
  const attack = newEntries.find((entry) => entry.startsWith('Card Goblin attacks'));
  if (!attack) return undefined;
  const reduced = attack.match(/reduced it to (\d+)/i);
  if (reduced) return Number(reduced[1]);
  const direct = attack.match(/attacks for (\d+)/i);
  return direct ? Number(direct[1]) : undefined;
};

export const buildCombatFeedbackPlan = (
  before: GameState,
  after: GameState,
  card: Card,
): CombatFeedbackPlan => {
  const activation: CombatFeedbackEvent[] = [];
  const damage = DAMAGE_BY_CARD[card];
  if (damage) {
    activation.push({
      kind: 'damage',
      target: 'enemy',
      amount: damage,
      hpAfter: Math.max(0, before.enemyHp - damage),
    });
  }

  if (card === 'Mend') {
    const amount = Math.max(0, Math.min(2, 10 - before.playerHp));
    activation.push({
      kind: 'heal',
      target: 'player',
      amount,
      hpAfter: before.playerHp + amount,
    });
  } else if (card === 'Guard') {
    activation.push({ kind: 'guard', target: 'player', amount: 2 });
  } else if (card === 'Stun') {
    activation.push({ kind: 'stun', target: 'enemy' });
  }

  if (card === 'Heavy Bonk') {
    activation.push({ kind: 'skip-draw', target: 'draw-pile' });
  }

  const retaliation: CombatFeedbackEvent[] = [];
  const enemyDamage = retaliationDamage(before, after);
  if (enemyDamage !== undefined) {
    retaliation.push(enemyDamage > 0
      ? {
          kind: 'damage',
          target: 'player',
          amount: enemyDamage,
          hpAfter: after.playerHp,
        }
      : { kind: 'blocked', target: 'player', amount: 0 });
  }

  return Object.freeze({
    activation: Object.freeze(activation),
    retaliation: Object.freeze(retaliation),
  });
};
