import { describe, expect, it } from 'vitest';

import { PointerDragGesture } from '../src/scene-rig/drag-interaction';

describe('PointerDragGesture', () => {
  it('keeps a short press under threshold as one tap', () => {
    const gesture = new PointerDragGesture(14);
    expect(gesture.pointerDown(1, 100, 100, true).kind).toBe('armed');
    expect(gesture.pointerMove(1, 108, 106).kind).toBe('none');
    expect(gesture.pointerUp(1, 108, 106)).toEqual({ kind: 'tap', x: 108, y: 106 });
  });

  it('emits drag start, drag movement, and exactly one drop after crossing threshold', () => {
    const gesture = new PointerDragGesture(14);
    gesture.pointerDown(7, 100, 100, true);
    expect(gesture.pointerMove(7, 118, 100)).toMatchObject({ kind: 'drag-start', x: 118, y: 100 });
    expect(gesture.pointerMove(7, 145, 120)).toEqual({ kind: 'drag-move', x: 145, y: 120 });
    expect(gesture.pointerUp(7, 160, 130)).toEqual({ kind: 'drop', x: 160, y: 130 });
    expect(gesture.pointerUp(7, 160, 130).kind).toBe('none');
  });

  it('locks ownership to one pointer and safely cancels the owner', () => {
    const gesture = new PointerDragGesture(14);
    gesture.pointerDown(1, 20, 20, true);
    expect(gesture.pointerDown(2, 20, 20, true).kind).toBe('ignored');
    expect(gesture.pointerMove(2, 80, 80).kind).toBe('none');
    expect(gesture.cancel(2).kind).toBe('none');
    expect(gesture.cancel(1).kind).toBe('cancel');
    expect(gesture.snapshot()).toEqual({ pointerId: null, dragging: false });
  });

  it('rejects input while gameplay interaction is disabled', () => {
    const gesture = new PointerDragGesture(14);
    expect(gesture.pointerDown(1, 10, 10, false).kind).toBe('ignored');
    expect(gesture.pointerMove(1, 40, 40).kind).toBe('none');
    expect(gesture.pointerUp(1, 40, 40).kind).toBe('none');
  });
});
