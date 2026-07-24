(function initRegionMapperCore(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.RegionMapperCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function buildRegionMapperCore() {
  'use strict';

  const RECT_KEYS = new Set(['sourceRect', 'derivedRect', 'rect', 'bounds', 'relativeRect']);

  function deepClone(value) {
    if (typeof structuredClone === 'function') return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
  }

  function round(value, places = 12) {
    const factor = 10 ** places;
    const result = Math.round((Number(value) + Number.EPSILON) * factor) / factor;
    return Object.is(result, -0) ? 0 : result;
  }

  function positiveNumber(value) {
    return Number.isFinite(Number(value)) && Number(value) > 0;
  }

  function dimensionObject(width, height) {
    const w = Number(width);
    const h = Number(height);
    if (!positiveNumber(w) || !positiveNumber(h)) {
      throw new Error('A loaded image with positive width and height is required.');
    }
    return { width: w, height: h };
  }

  function hasPixelShape(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    const widthKey = Object.hasOwn(value, 'w') ? 'w' : (Object.hasOwn(value, 'width') ? 'width' : null);
    const heightKey = Object.hasOwn(value, 'h') ? 'h' : (Object.hasOwn(value, 'height') ? 'height' : null);
    return Object.hasOwn(value, 'x') && Object.hasOwn(value, 'y') && widthKey && heightKey;
  }

  function hasRelativeShape(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value)
      && Object.hasOwn(value, 'xPct') && Object.hasOwn(value, 'yPct')
      && Object.hasOwn(value, 'wPct') && Object.hasOwn(value, 'hPct'));
  }

  function readPixelRect(value) {
    return {
      x: Number(value.x),
      y: Number(value.y),
      w: Number(value.w ?? value.width),
      h: Number(value.h ?? value.height)
    };
  }

  function normalizedRect(rect, size) {
    const dimensions = dimensionObject(size.width, size.height);
    return {
      xPct: round(rect.x / dimensions.width),
      yPct: round(rect.y / dimensions.height),
      wPct: round(rect.w / dimensions.width),
      hPct: round(rect.h / dimensions.height)
    };
  }

  function relativeToPixels(value, size) {
    const dimensions = dimensionObject(size.width, size.height);
    return {
      x: round(Number(value.xPct) * dimensions.width),
      y: round(Number(value.yPct) * dimensions.height),
      w: round(Number(value.wPct) * dimensions.width),
      h: round(Number(value.hPct) * dimensions.height)
    };
  }

  function pathKey(path) {
    return JSON.stringify(path);
  }

  function ownerIdentity(node, ancestors, path) {
    if (node && node.id != null) return String(node.id);
    const ancestor = [...ancestors].reverse().find(entry => entry.node && entry.node.id != null);
    if (ancestor && node && node.index != null) {
      return `${ancestor.node.id} / frame ${node.index}`;
    }
    if (node && node.label) return String(node.label);
    return path.slice(0, -1).map(String).join(' / ') || 'manifest';
  }

  function ownerLabel(node, ancestors, fallback) {
    if (node && node.label) return String(node.label);
    const ancestor = [...ancestors].reverse().find(entry => entry.node && entry.node.label);
    if (ancestor && node && node.index != null) {
      return `${ancestor.node.label} / frame ${node.index}`;
    }
    return fallback;
  }

  function collectRectItems(root, options = {}) {
    const items = [];
    const allowRelative = options.allowRelative !== false;

    function visit(node, path, ancestors) {
      if (!node || typeof node !== 'object') return;
      if (Array.isArray(node)) {
        node.forEach((value, index) => visit(value, [...path, index], ancestors));
        return;
      }

      for (const [key, value] of Object.entries(node)) {
        if (RECT_KEYS.has(key) && hasPixelShape(value)) {
          const id = ownerIdentity(node, ancestors, [...path, key]);
          items.push({ id, label: ownerLabel(node, ancestors, id), path: [...path, key], rectKey: key, coordinateSpace: 'image-pixel', rawRect: value });
        } else if (allowRelative && key === 'relativeRect' && hasRelativeShape(value)) {
          const id = ownerIdentity(node, ancestors, [...path, key]);
          items.push({ id, label: ownerLabel(node, ancestors, id), path: [...path, key], rectKey: key, coordinateSpace: 'surface-relative', rawRect: value });
        } else {
          visit(value, [...path, key], [...ancestors, { node, path }]);
        }
      }
    }

    visit(root, [], []);
    return items;
  }

  function findSourceBounds(sourceManifest, sourceRegionId) {
    if (!sourceManifest || !sourceRegionId) return null;
    const candidates = collectRectItems(sourceManifest, { allowRelative: false });
    const preferred = candidates.find(item => item.id === sourceRegionId && item.rectKey === 'sourceRect');
    const fallback = candidates.find(item => item.id === sourceRegionId);
    return preferred || fallback || null;
  }

  function itemRecord(item, scope, prefix = '') {
    const size = { width: scope.bounds.w, height: scope.bounds.h };
    const rect = item.coordinateSpace === 'surface-relative'
      ? relativeToPixels(item.rawRect, size)
      : readPixelRect(item.rawRect);
    const key = `${prefix}${pathKey(item.path)}`;
    return {
      key,
      id: item.id,
      label: item.label,
      path: item.path,
      rectKey: item.rectKey,
      coordinateSpace: item.coordinateSpace,
      rect,
      originalRect: deepClone(item.rawRect)
    };
  }

  function createSurfaceScopes(manifest, sourceManifest, imageSize) {
    return manifest.surfaces.map((surface, surfaceIndex) => {
      const source = findSourceBounds(sourceManifest, surface.sourceRegionId);
      const sourceBounds = source ? readPixelRect(source.rawRect) : null;
      const bounds = sourceBounds || { x: 0, y: 0, w: imageSize.width, h: imageSize.height };
      const resolution = sourceBounds
        ? 'source-manifest'
        : (sourceManifest ? 'unresolved-source-region' : 'loaded-image-as-surface');
      const scope = {
        id: String(surface.id ?? `surface-${surfaceIndex + 1}`),
        label: String(surface.label ?? surface.id ?? `Surface ${surfaceIndex + 1}`),
        sourceRegionId: surface.sourceRegionId || null,
        bounds,
        resolution,
        items: []
      };
      const slots = Array.isArray(surface.slots) ? surface.slots : [];
      slots.forEach((slot, slotIndex) => {
        if (!hasRelativeShape(slot.relativeRect)) return;
        const raw = {
          id: String(slot.id ?? `${scope.id}.slot-${slotIndex + 1}`),
          label: String(slot.label ?? slot.id ?? `Slot ${slotIndex + 1}`),
          path: ['surfaces', surfaceIndex, 'slots', slotIndex, 'relativeRect'],
          rectKey: 'relativeRect', coordinateSpace: 'surface-relative', rawRect: slot.relativeRect
        };
        scope.items.push(itemRecord(raw, scope, `${scope.id}:`));
      });
      return scope;
    });
  }

  function createImageScope(manifest, imageSize) {
    const scope = {
      id: 'image',
      label: 'Whole image',
      sourceRegionId: null,
      bounds: { x: 0, y: 0, w: imageSize.width, h: imageSize.height },
      resolution: 'whole-image',
      items: []
    };
    const items = collectRectItems(manifest);
    scope.items = items.map(item => itemRecord(item, scope));
    return scope;
  }

  function createSession(primaryManifest, options = {}) {
    if (!primaryManifest || typeof primaryManifest !== 'object' || Array.isArray(primaryManifest)) {
      throw new Error('Primary manifest must be a JSON object.');
    }
    const imageSize = dimensionObject(options.imageSize?.width, options.imageSize?.height);
    const manifest = deepClone(primaryManifest);
    const sourceManifest = options.sourceManifest ? deepClone(options.sourceManifest) : null;
    const hasSurfaceSlots = Array.isArray(manifest.surfaces)
      && manifest.surfaces.some(surface => Array.isArray(surface.slots)
        && surface.slots.some(slot => hasRelativeShape(slot.relativeRect)));
    const scopes = hasSurfaceSlots
      ? createSurfaceScopes(manifest, sourceManifest, imageSize)
      : [createImageScope(manifest, imageSize)];

    return {
      manifest,
      sourceManifest,
      imageSize,
      mode: hasSurfaceSlots ? 'surface-relative' : 'image-pixel',
      scopes,
      originalManifest: deepClone(primaryManifest)
    };
  }

  function getAtPath(root, path) {
    return path.reduce((value, segment) => value?.[segment], root);
  }

  function findItem(session, key) {
    for (const scope of session.scopes) {
      const item = scope.items.find(candidate => candidate.key === key);
      if (item) return { scope, item };
    }
    throw new Error(`Unknown region item: ${key}`);
  }

  function updateItemRect(session, key, nextRect) {
    const { scope, item } = findItem(session, key);
    const rect = {
      x: Number(nextRect.x), y: Number(nextRect.y),
      w: Number(nextRect.w), h: Number(nextRect.h)
    };
    const target = getAtPath(session.manifest, item.path);
    if (!target || typeof target !== 'object') {
      throw new Error(`Rectangle path no longer exists: ${item.path.join('.')}`);
    }

    if (item.coordinateSpace === 'surface-relative') {
      const normalized = normalizedRect(rect, { width: scope.bounds.w, height: scope.bounds.h });
      Object.assign(target, normalized);
    } else {
      target.x = rect.x;
      target.y = rect.y;
      if (Object.hasOwn(target, 'w')) target.w = rect.w;
      else target.width = rect.w;
      if (Object.hasOwn(target, 'h')) target.h = rect.h;
      else target.height = rect.h;
    }
    item.rect = rect;
    return item;
  }

  function validateRect(rect, size) {
    const warnings = [];
    if (!positiveNumber(rect.w) || !positiveNumber(rect.h)) {
      warnings.push('Width and height must be greater than zero.');
    }
    const width = Number(size.width);
    const height = Number(size.height);
    if (Number(rect.x) < 0 || Number(rect.y) < 0
      || Number(rect.x) + Number(rect.w) > width
      || Number(rect.y) + Number(rect.h) > height) {
      warnings.push('Rectangle extends outside the active surface.');
    }
    return warnings;
  }

  function toImageRect(scope, localRect) {
    return {
      x: round(scope.bounds.x + localRect.x),
      y: round(scope.bounds.y + localRect.y),
      w: round(localRect.w),
      h: round(localRect.h)
    };
  }

  function serializeManifest(session) {
    return `${JSON.stringify(session.manifest, null, 2)}\n`;
  }

  function getEmptyStatePresentation(input = {}) {
    const visible = !(Boolean(input.hasImage) && Boolean(input.hasPrimaryManifest));
    return Object.freeze({
      visible,
      hidden: !visible,
      ariaHidden: visible ? 'false' : 'true',
      inert: !visible,
      display: visible ? 'grid' : 'none',
      pointerEvents: 'none'
    });
  }

  return Object.freeze({
    createSession,
    updateItemRect,
    serializeManifest,
    validateRect,
    normalizedRect,
    toImageRect,
    collectRectItems,
    getEmptyStatePresentation
  });
});
