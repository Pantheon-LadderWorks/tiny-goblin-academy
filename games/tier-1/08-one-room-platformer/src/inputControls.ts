import type { Input } from './simulation';

export type KeyLike = {
  isDown: boolean;
};

export type KeyboardInputKeys = {
  left: KeyLike;
  right: KeyLike;
  up: KeyLike;
  space: KeyLike;
  a?: KeyLike;
  d?: KeyLike;
  w?: KeyLike;
};

export function readKeyboardInput(keys: KeyboardInputKeys): Input {
  return {
    left: keys.left.isDown || keys.a?.isDown === true,
    right: keys.right.isDown || keys.d?.isDown === true,
    jump: keys.up.isDown || keys.space.isDown || keys.w?.isDown === true
  };
}
