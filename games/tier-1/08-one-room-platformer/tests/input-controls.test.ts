import { describe, expect, it } from 'vitest';
import { readKeyboardInput } from '../src/inputControls';

function key(isDown: boolean) {
  return { isDown };
}

describe('keyboard input controls', () => {
  it('maps WASD keys to the same movement intent as arrows and space', () => {
    const input = readKeyboardInput({
      left: key(false),
      right: key(false),
      up: key(false),
      space: key(false),
      a: key(true),
      d: key(false),
      w: key(true)
    });

    expect(input).toEqual({
      left: true,
      right: false,
      jump: true
    });
  });

  it('keeps arrow keys and spacebar working', () => {
    const input = readKeyboardInput({
      left: key(false),
      right: key(true),
      up: key(false),
      space: key(true),
      a: key(false),
      d: key(false),
      w: key(false)
    });

    expect(input).toEqual({
      left: false,
      right: true,
      jump: true
    });
  });
});
