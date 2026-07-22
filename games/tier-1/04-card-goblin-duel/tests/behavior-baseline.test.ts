import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  createGame,
  playCard,
  resolveSparkChoice,
  type Card,
  type GameState,
} from '../src/simulation';

type ExpectedState = Pick<
  GameState,
  'phase' | 'hand' | 'queue' | 'playerHp' | 'enemyHp' | 'guard' | 'stun' | 'skip'
>;

type BaselineManifest = {
  schemaVersion: number;
  sourceCommit: string;
  cards: Array<{ name: Card; effect: string }>;
  initialState: ExpectedState;
  scenarios: Record<string, ExpectedState>;
};

const manifest = JSON.parse(
  readFileSync(new URL('../H6_20_BEHAVIOR_BASELINE.json', import.meta.url), 'utf8'),
) as BaselineManifest;

const gameplayState = (state: GameState): ExpectedState => ({
  phase: state.phase,
  hand: state.hand,
  queue: state.queue,
  playerHp: state.playerHp,
  enemyHp: state.enemyHp,
  guard: state.guard,
  stun: state.stun,
  skip: state.skip,
});

describe('H6.20 gameplay baseline manifest', () => {
  it('records the approved source commit and exact six-card set', () => {
    expect(manifest.schemaVersion).toBe(1);
    expect(manifest.sourceCommit).toBe('73911a85f8f955755515008ec18899293cce10b5');
    expect(manifest.cards).toEqual([
      { name: 'Strike', effect: 'Deal 2 damage.' },
      { name: 'Guard', effect: 'Reduce next enemy damage by 2.' },
      { name: 'Mend', effect: 'Heal 2 HP.' },
      { name: 'Spark', effect: 'Deal 1 damage and replace one card.' },
      { name: 'Stun', effect: 'Prevent the next enemy attack once.' },
      { name: 'Heavy Bonk', effect: 'Deal 4 damage; skip next draw.' },
    ]);
  });

  it('matches the exact initial state and reset behavior', () => {
    const initial = createGame();
    expect(gameplayState(initial)).toEqual(manifest.initialState);

    const changed = playCard(initial, 0);
    expect(changed).not.toEqual(initial);
    expect(gameplayState(createGame())).toEqual(manifest.initialState);
  });

  it('matches Strike, Guard, and Mend outcomes', () => {
    expect(gameplayState(playCard(createGame(), 0))).toEqual(manifest.scenarios.strike);
    expect(gameplayState(playCard(createGame(), 1))).toEqual(manifest.scenarios.guard);

    const mendStart = createGame();
    mendStart.playerHp = 6;
    expect(gameplayState(playCard(mendStart, 2))).toEqual(manifest.scenarios.mend);
  });

  it('matches Stun and Heavy Bonk outcomes', () => {
    const stunStart = createGame();
    stunStart.hand = ['Stun', 'Strike', 'Mend'];
    expect(gameplayState(playCard(stunStart, 0))).toEqual(manifest.scenarios.stun);

    const bonkStart = createGame();
    bonkStart.hand = ['Heavy Bonk', 'Strike', 'Mend'];
    expect(gameplayState(playCard(bonkStart, 0))).toEqual(manifest.scenarios.heavyBonk);
  });

  it('preserves the two-step SparkChoice sequence', () => {
    const sparkStart = createGame();
    sparkStart.hand = ['Strike', 'Guard', 'Spark'];

    const awaitingChoice = playCard(sparkStart, 2);
    expect(gameplayState(awaitingChoice)).toEqual(manifest.scenarios.sparkChoice);

    const resolved = resolveSparkChoice(awaitingChoice, 1);
    expect(gameplayState(resolved)).toEqual(manifest.scenarios.sparkResolved);
  });

  it('preserves victory and defeat terminal locks', () => {
    const victoryStart = createGame();
    victoryStart.enemyHp = 2;
    const victory = playCard(victoryStart, 0);
    expect(gameplayState(victory)).toEqual(manifest.scenarios.victory);
    expect(playCard(victory, 0)).toBe(victory);

    const defeatStart = createGame();
    defeatStart.playerHp = 2;
    defeatStart.hand = ['Strike', 'Strike', 'Strike'];
    const defeat = playCard(defeatStart, 0);
    expect(gameplayState(defeat)).toEqual(manifest.scenarios.defeat);
    expect(playCard(defeat, 0)).toBe(defeat);
  });
});
