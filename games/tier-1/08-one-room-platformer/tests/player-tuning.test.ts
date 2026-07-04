import { describe, expect, it } from 'vitest';
import levelData from '../src/level8.json';
import {
  REQUIRED_PATH,
  maxJumpHeightPx,
  PLAYER_FRAME_HEIGHT,
  PLAYER_GRAVITY,
  PLAYER_JUMP_VELOCITY,
  PLAYER_VISUAL_SCALE
} from '../src/playerTuning';

describe('Level 8 player tuning', () => {
  it('keeps the goblin readable in the 800x600 Birthday Build room', () => {
    expect(PLAYER_VISUAL_SCALE).toBeGreaterThanOrEqual(0.3);
  });

  it('makes the required first platform reachable within the single-jump v0.1 movement contract', () => {
    expect(maxJumpHeightPx(PLAYER_JUMP_VELOCITY, PLAYER_GRAVITY)).toBeGreaterThanOrEqual(
      REQUIRED_PATH.firstPlatformVerticalRise + REQUIRED_PATH.jumpTolerance
    );
  });

  it('spawns the readable goblin above the floor instead of inside it', () => {
    const visualBottom =
      levelData.player.y +
      levelData.player.h / 2 +
      (PLAYER_FRAME_HEIGHT * PLAYER_VISUAL_SCALE) / 2;

    expect(visualBottom).toBeLessThanOrEqual(REQUIRED_PATH.floorTopY);
    expect(REQUIRED_PATH.floorTopY - visualBottom).toBeLessThan(2);
  });
});
