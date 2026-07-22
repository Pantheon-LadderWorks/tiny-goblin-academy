import { describe, expect, it } from 'vitest';
import {
  AnchorContractError,
  buildAnchorSnapshot,
  handSlotAnchorId,
  isAnchorDebugEnabled,
  viewportRectToCanvasLocal,
  type RectLike,
} from '../src/anchors';

const rect = (
  left: number,
  top: number,
  width: number,
  height: number,
): RectLike => ({ left, top, width, height });

describe('DOM-to-Phaser anchor geometry', () => {
  it('converts viewport rectangles into canvas-local coordinates', () => {
    const local = viewportRectToCanvasLocal(
      rect(400, 150, 100, 50),
      rect(100, 50, 600, 300),
      { width: 1200, height: 600 },
    );

    expect(local).toEqual({
      x: 600,
      y: 200,
      width: 200,
      height: 100,
      centerX: 700,
      centerY: 250,
    });
  });

  it('handles an unscaled offset canvas', () => {
    const local = viewportRectToCanvasLocal(
      rect(90, 70, 40, 20),
      rect(50, 20, 400, 200),
      { width: 400, height: 200 },
    );

    expect(local).toEqual({
      x: 40,
      y: 50,
      width: 40,
      height: 20,
      centerX: 60,
      centerY: 60,
    });
  });

  it('recalculates from the newest responsive canvas rectangle', () => {
    const anchor = rect(240, 180, 80, 40);
    const wide = viewportRectToCanvasLocal(
      anchor,
      rect(40, 80, 800, 400),
      { width: 800, height: 400 },
    );
    const narrow = viewportRectToCanvasLocal(
      anchor,
      rect(120, 120, 400, 200),
      { width: 800, height: 400 },
    );

    expect(wide.centerX).toBe(240);
    expect(narrow.centerX).toBe(320);
    expect(narrow.centerY).toBe(160);
  });

  it('omits missing optional anchors', () => {
    const snapshot = buildAnchorSnapshot({
      canvasRect: rect(0, 0, 600, 300),
      canvasSize: { width: 600, height: 300 },
      anchors: [{ id: 'enemy-center', rect: rect(450, 40, 40, 40) }],
      required: ['enemy-center'],
    });

    expect(snapshot['enemy-center']?.centerX).toBe(470);
    expect(snapshot['discard']).toBeUndefined();
  });

  it('fails when a required anchor is missing', () => {
    expect(() => buildAnchorSnapshot({
      canvasRect: rect(0, 0, 600, 300),
      canvasSize: { width: 600, height: 300 },
      anchors: [],
      required: ['enemy-center'],
    })).toThrowError(new AnchorContractError('Missing required anchor: enemy-center'));
  });

  it('refuses ambiguous duplicate anchor identities', () => {
    expect(() => buildAnchorSnapshot({
      canvasRect: rect(0, 0, 600, 300),
      canvasSize: { width: 600, height: 300 },
      anchors: [
        { id: 'deck', rect: rect(10, 10, 20, 20) },
        { id: 'deck', rect: rect(40, 10, 20, 20) },
      ],
      required: ['deck'],
    })).toThrowError(new AnchorContractError('Duplicate anchor identity: deck'));
  });

  it('keeps hand-slot identities stable and bounded', () => {
    expect(handSlotAnchorId(0)).toBe('hand-slot-0');
    expect(handSlotAnchorId(1)).toBe('hand-slot-1');
    expect(handSlotAnchorId(2)).toBe('hand-slot-2');
    expect(() => handSlotAnchorId(-1)).toThrowError(AnchorContractError);
    expect(() => handSlotAnchorId(3)).toThrowError(AnchorContractError);
  });

  it('returns a frozen read-only presentation snapshot', () => {
    const snapshot = buildAnchorSnapshot({
      canvasRect: rect(0, 0, 600, 300),
      canvasSize: { width: 600, height: 300 },
      anchors: [{ id: 'player-center', rect: rect(20, 200, 40, 40) }],
      required: ['player-center'],
    });

    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot['player-center'])).toBe(true);
    expect(snapshot['player-center']).not.toHaveProperty('phase');
    expect(snapshot['player-center']).not.toHaveProperty('damage');
  });

  it('enables debug markers only through an explicit flag', () => {
    expect(isAnchorDebugEnabled('')).toBe(false);
    expect(isAnchorDebugEnabled('?foo=bar')).toBe(false);
    expect(isAnchorDebugEnabled('?anchors=1')).toBe(true);
    expect(isAnchorDebugEnabled('?anchors=true')).toBe(true);
    expect(isAnchorDebugEnabled('?anchors=0')).toBe(false);
  });
});
