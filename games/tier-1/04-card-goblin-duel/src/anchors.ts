export const MAX_HAND_SLOTS = 3;

export type RectLike = Readonly<{
  left: number;
  top: number;
  width: number;
  height: number;
}>;

export type CanvasSize = Readonly<{
  width: number;
  height: number;
}>;

export type CanvasLocalRect = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}>;

export type AnchorMeasurement = Readonly<{
  id: string;
  rect: RectLike;
}>;

export type AnchorSnapshot = Readonly<Record<string, CanvasLocalRect>>;

export class AnchorContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AnchorContractError';
  }
}

const assertPositiveSize = (value: CanvasSize, label: string): void => {
  if (
    !Number.isFinite(value.width)
    || !Number.isFinite(value.height)
    || value.width <= 0
    || value.height <= 0
  ) {
    throw new AnchorContractError(`${label} must have positive dimensions.`);
  }
};

const freezeLocalRect = (value: CanvasLocalRect): CanvasLocalRect => Object.freeze(value);

export const viewportRectToCanvasLocal = (
  anchorRect: RectLike,
  canvasRect: RectLike,
  canvasSize: CanvasSize,
): CanvasLocalRect => {
  assertPositiveSize(canvasRect, 'Canvas viewport rectangle');
  assertPositiveSize(canvasSize, 'Canvas backing size');

  const scaleX = canvasSize.width / canvasRect.width;
  const scaleY = canvasSize.height / canvasRect.height;
  const x = (anchorRect.left - canvasRect.left) * scaleX;
  const y = (anchorRect.top - canvasRect.top) * scaleY;
  const width = anchorRect.width * scaleX;
  const height = anchorRect.height * scaleY;

  return freezeLocalRect({
    x,
    y,
    width,
    height,
    centerX: x + width / 2,
    centerY: y + height / 2,
  });
};

export const handSlotAnchorId = (index: number): `hand-slot-${number}` => {
  if (!Number.isInteger(index) || index < 0 || index >= MAX_HAND_SLOTS) {
    throw new AnchorContractError(`Hand slot index out of range: ${index}`);
  }
  return `hand-slot-${index}`;
};

export const buildAnchorSnapshot = (options: Readonly<{
  canvasRect: RectLike;
  canvasSize: CanvasSize;
  anchors: readonly AnchorMeasurement[];
  required?: readonly string[];
}>): AnchorSnapshot => {
  const measured = new Map<string, RectLike>();

  for (const anchor of options.anchors) {
    if (!anchor.id.trim()) {
      throw new AnchorContractError('Anchor identity must not be empty.');
    }
    if (measured.has(anchor.id)) {
      throw new AnchorContractError(`Duplicate anchor identity: ${anchor.id}`);
    }
    measured.set(anchor.id, anchor.rect);
  }

  for (const id of options.required ?? []) {
    if (!measured.has(id)) {
      throw new AnchorContractError(`Missing required anchor: ${id}`);
    }
  }

  const snapshot: Record<string, CanvasLocalRect> = {};
  for (const [id, anchorRect] of measured) {
    snapshot[id] = viewportRectToCanvasLocal(
      anchorRect,
      options.canvasRect,
      options.canvasSize,
    );
  }

  return Object.freeze(snapshot);
};

export const isAnchorDebugEnabled = (search: string): boolean => {
  const normalized = search.startsWith('?') ? search.slice(1) : search;
  const value = new URLSearchParams(normalized).get('anchors');
  return value === '1' || value === 'true';
};
