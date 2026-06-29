export function isRectShape(rect) {
  return Boolean(rect)
    && typeof rect.x === 'number'
    && typeof rect.y === 'number'
    && typeof rect.w === 'number'
    && typeof rect.h === 'number';
}

export function isZeroRectDraftPlaceholder(rect) {
  return isRectShape(rect) && rect.x === 0 && rect.y === 0 && rect.w === 0 && rect.h === 0;
}

export function rectHasPositiveArea(rect) {
  return isRectShape(rect) && rect.w > 0 && rect.h > 0;
}

export function rectWithinBounds(rect, width, height) {
  if (!isRectShape(rect)) return false;
  if (isZeroRectDraftPlaceholder(rect)) return true;
  return rect.x >= 0
    && rect.y >= 0
    && rect.w > 0
    && rect.h > 0
    && rect.x + rect.w <= width
    && rect.y + rect.h <= height;
}
