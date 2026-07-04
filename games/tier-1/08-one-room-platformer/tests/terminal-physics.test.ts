import { describe, expect, it } from 'vitest';
import { applyTerminalPlayerLock } from '../src/terminalPhysics';

describe('terminal physics lock', () => {
  it('parks the player body so terminal states stop falling through gravity', () => {
    const body = {
      allowGravity: true,
      moves: true,
      velocity: { x: 120, y: 900 }
    };

    const sprite = {
      setVelocityCalls: [] as Array<[number, number]>,
      body,
      setVelocity(x: number, y: number) {
        this.setVelocityCalls.push([x, y]);
        this.body.velocity.x = x;
        this.body.velocity.y = y;
      }
    };

    applyTerminalPlayerLock(sprite);

    expect(sprite.setVelocityCalls).toEqual([[0, 0]]);
    expect(body.velocity).toEqual({ x: 0, y: 0 });
    expect(body.allowGravity).toBe(false);
    expect(body.moves).toBe(false);
  });
});
