export const PLAYER_GRAVITY = 1800;
export const PLAYER_RUN_SPEED = 180;
export const PLAYER_JUMP_VELOCITY = -720;
export const PLAYER_MAX_FALL_SPEED = 900;

export const PLAYER_BODY_WIDTH = 32;
export const PLAYER_BODY_HEIGHT = 48;

export const PLAYER_FRAME_WIDTH = 280;
export const PLAYER_FRAME_HEIGHT = 256;
export const PLAYER_VISUAL_WIDTH = 90;
export const PLAYER_VISUAL_SCALE = PLAYER_VISUAL_WIDTH / PLAYER_FRAME_WIDTH;

export const REQUIRED_PATH = {
  floorTopY: 512,
  firstPlatformTopY: 389,
  firstPlatformVerticalRise: 123,
  jumpTolerance: 8
} as const;

export function maxJumpHeightPx(jumpVelocity: number, gravity: number) {
  return (jumpVelocity * jumpVelocity) / (2 * gravity);
}
