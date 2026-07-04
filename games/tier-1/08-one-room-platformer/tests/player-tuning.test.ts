import { describe, expect, it } from 'vitest';
import { REQUIRED_PATH, maxJumpHeightPx, PLAYER_GRAVITY, PLAYER_JUMP_VELOCITY, PLAYER_VISUAL_SCALE } from '../src/playerTuning';

describe('Level 8 player tuning', () => {
  it('keeps the goblin readable in the 800x600 Birthday Build room', () => {
    expect(PLAYER_VISUAL_SCALE).toBeGreaterThanOrEqual(0.3);
  });

  it('makes the required first platform reachable within the single-jump v0.1 movement contract', () => {
    expect(maxJumpHeightPx(PLAYER_JUMP_VELOCITY, PLAYER_GRAVITY)).toBeGreaterThanOrEqual(
      REQUIRED_PATH.firstPlatformVerticalRise + REQUIRED_PATH.jumpTolerance
    );
  });
});
