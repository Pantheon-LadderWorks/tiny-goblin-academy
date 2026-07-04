export type TerminalLockBody = {
  allowGravity: boolean;
  moves: boolean;
  velocity?: {
    x: number;
    y: number;
  };
};

export type TerminalLockSprite = {
  body: TerminalLockBody;
  setVelocity(x: number, y: number): void;
};

export function applyTerminalPlayerLock(sprite: TerminalLockSprite) {
  sprite.setVelocity(0, 0);
  sprite.body.allowGravity = false;
  sprite.body.moves = false;
}
