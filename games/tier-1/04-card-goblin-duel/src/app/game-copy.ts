import type { GameState } from '../simulation';

export const effectSummary = (current: GameState): string => {
  const effects: string[] = [];
  if (current.guard > 0) effects.push(`Guard ${current.guard}`);
  if (current.stun) effects.push('Stun armed');
  return effects.length > 0 ? effects.join(' · ') : 'No active guard or stun.';
};

export const enemySummary = (current: GameState): string => {
  if (current.phase === 'Terminal') {
    return current.enemyHp <= 0 ? 'Defeated.' : 'Duel complete.';
  }
  if (current.phase === 'SparkChoice') return 'Waiting for your replacement choice.';
  return 'Ready to answer your play.';
};

export const resolutionCopy = (
  current: GameState,
): Readonly<{ title: string; detail: string }> => {
  const latest = current.log.at(-1) ?? 'The table is waiting.';
  if (current.phase === 'SparkChoice') {
    return { title: 'Spark is suspended over the table.', detail: latest };
  }
  if (current.phase === 'Terminal') {
    return {
      title: current.enemyHp <= 0 ? 'The Card Goblin falls.' : 'Your hand goes still.',
      detail: latest,
    };
  }
  return {
    title: current.log.length === 1 ? 'The table is waiting.' : 'The exchange resolves.',
    detail: latest,
  };
};
