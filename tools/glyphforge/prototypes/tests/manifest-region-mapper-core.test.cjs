'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Core = require('../manifest-region-mapper-core.js');

const functionalManifest = {
  schemaVersion: '0.1',
  status: 'reviewed',
  coordinatePolicy: 'surface-relative-percent-rectangles-only-no-global-runtime-coordinates',
  surfaces: [
    {
      id: 'surface.green',
      label: 'Green banner',
      sourceRegionId: 'region.green',
      reviewStatus: 'human-review-passed',
      slots: [
        {
          id: 'surface.green.art',
          label: 'Art',
          slotType: 'art-or-icon-slot',
          relativeRect: { xPct: 0.1, yPct: 0.2, wPct: 0.5, hPct: 0.25 },
          notes: 'keep me'
        }
      ]
    }
  ],
  notes: ['unrelated authority']
};

const sourceManifest = {
  schemaVersion: '0.1',
  sourceDimensions: { width: 1024, height: 1024 },
  regions: [
    {
      id: 'region.green',
      label: 'Green banner source',
      sourceRect: { x: 100, y: 200, w: 120, h: 160 },
      reviewStatus: 'needs-human-review'
    }
  ]
};

test('resolves functional slots against a companion source-region manifest', () => {
  const session = Core.createSession(functionalManifest, {
    sourceManifest,
    imageSize: { width: 1024, height: 1024 }
  });

  assert.equal(session.scopes.length, 1);
  const scope = session.scopes[0];
  assert.equal(scope.id, 'surface.green');
  assert.deepEqual(scope.bounds, { x: 100, y: 200, w: 120, h: 160 });
  assert.equal(scope.resolution, 'source-manifest');
  assert.equal(scope.items.length, 1);
  assert.equal(scope.items[0].coordinateSpace, 'surface-relative');
  assert.deepEqual(scope.items[0].rect, { x: 12, y: 32, w: 60, h: 40 });
  assert.deepEqual(Core.toImageRect(scope, scope.items[0].rect), {
    x: 112, y: 232, w: 60, h: 40
  });
});

test('updates only the selected relativeRect and preserves unrelated manifest data', () => {
  const original = structuredClone(functionalManifest);
  const companion = structuredClone(sourceManifest);
  const session = Core.createSession(functionalManifest, {
    sourceManifest: companion,
    imageSize: { width: 1024, height: 1024 }
  });
  const item = session.scopes[0].items[0];

  Core.updateItemRect(session, item.key, { x: 12, y: 16, w: 84, h: 48 });

  assert.deepEqual(session.manifest.surfaces[0].slots[0].relativeRect, {
    xPct: 0.1, yPct: 0.1, wPct: 0.7, hPct: 0.3
  });
  assert.equal(session.manifest.surfaces[0].slots[0].notes, 'keep me');
  assert.deepEqual(session.manifest.notes, original.notes);
  assert.deepEqual(sourceManifest, companion);
  assert.deepEqual(functionalManifest, original);
});

test('falls back to treating the loaded image as the selected surface crop', () => {
  const session = Core.createSession(functionalManifest, {
    imageSize: { width: 200, height: 100 }
  });
  const scope = session.scopes[0];

  assert.equal(scope.resolution, 'loaded-image-as-surface');
  assert.deepEqual(scope.bounds, { x: 0, y: 0, w: 200, h: 100 });
  assert.deepEqual(scope.items[0].rect, { x: 20, y: 20, w: 100, h: 25 });
});

test('discovers and updates direct source-pixel rectangles', () => {
  const manifest = {
    sourceDimensions: { width: 512, height: 256 },
    regions: [
      {
        id: 'tile.one',
        label: 'Tile one',
        sourceRect: { x: 10, y: 20, w: 30, h: 40 },
        reviewStatus: 'approved'
      }
    ]
  };
  const session = Core.createSession(manifest, {
    imageSize: { width: 512, height: 256 }
  });
  const item = session.scopes[0].items[0];

  assert.equal(item.id, 'tile.one');
  assert.equal(item.rectKey, 'sourceRect');
  assert.deepEqual(item.rect, { x: 10, y: 20, w: 30, h: 40 });
  Core.updateItemRect(session, item.key, { x: 11, y: 22, w: 33, h: 44 });
  assert.deepEqual(session.manifest.regions[0].sourceRect, {
    x: 11, y: 22, w: 33, h: 44
  });
  assert.equal(session.manifest.regions[0].reviewStatus, 'approved');
});

test('preserves width and height key names for direct bounds', () => {
  const manifest = {
    anchors: [
      {
        id: 'anchor.one',
        bounds: { x: 1, y: 2, width: 30, height: 40, confidence: 'measured' }
      }
    ]
  };
  const session = Core.createSession(manifest, {
    imageSize: { width: 100, height: 100 }
  });
  const item = session.scopes[0].items[0];

  Core.updateItemRect(session, item.key, { x: 5, y: 6, w: 35, h: 45 });
  assert.deepEqual(session.manifest.anchors[0].bounds, {
    x: 5, y: 6, width: 35, height: 45, confidence: 'measured'
  });
});

test('discovers nested animation frame sourceRects with stable owner labels', () => {
  const manifest = {
    animations: [
      {
        id: 'goblin.idle',
        label: 'Idle',
        frames: [
          { index: 0, sourceRect: { x: 0, y: 0, w: 32, h: 48 } },
          { index: 1, sourceRect: { x: 32, y: 0, w: 32, h: 48 } }
        ]
      }
    ]
  };
  const session = Core.createSession(manifest, {
    imageSize: { width: 64, height: 48 }
  });

  assert.equal(session.scopes[0].items.length, 2);
  assert.equal(session.scopes[0].items[0].id, 'goblin.idle / frame 0');
  assert.equal(session.scopes[0].items[1].id, 'goblin.idle / frame 1');
});

test('reports invalid size and out-of-bounds geometry', () => {
  assert.deepEqual(
    Core.validateRect({ x: -1, y: 4, w: 0, h: 12 }, { width: 10, height: 10 }),
    ['Width and height must be greater than zero.', 'Rectangle extends outside the active surface.']
  );
  assert.deepEqual(
    Core.validateRect({ x: 1, y: 2, w: 3, h: 4 }, { width: 10, height: 10 }),
    []
  );
});

test('computes normalized display coordinates without changing export policy', () => {
  assert.deepEqual(
    Core.normalizedRect({ x: 12, y: 16, w: 84, h: 48 }, { width: 120, height: 160 }),
    { xPct: 0.1, yPct: 0.1, wPct: 0.7, hPct: 0.3 }
  );
});

test('serializes the corrected primary manifest rather than a mapper schema', () => {
  const session = Core.createSession(functionalManifest, {
    sourceManifest,
    imageSize: { width: 1024, height: 1024 }
  });
  Core.updateItemRect(session, session.scopes[0].items[0].key, {
    x: 6, y: 8, w: 96, h: 80
  });

  const exported = JSON.parse(Core.serializeManifest(session));
  assert.equal(exported.schemaVersion, '0.1');
  assert.equal(exported.status, 'reviewed');
  assert.equal(exported.coordinatePolicy, functionalManifest.coordinatePolicy);
  assert.equal(exported.mapperVersion, undefined);
  assert.deepEqual(exported.notes, ['unrelated authority']);
  assert.deepEqual(exported.surfaces[0].slots[0].relativeRect, {
    xPct: 0.05, yPct: 0.05, wPct: 0.8, hPct: 0.5
  });
});

test('keeps the empty state visible until both required inputs are loaded', () => {
  assert.equal(Core.getEmptyStatePresentation({ hasImage: false, hasPrimaryManifest: false }).visible, true);
  assert.equal(Core.getEmptyStatePresentation({ hasImage: true, hasPrimaryManifest: false }).visible, true);
  assert.equal(Core.getEmptyStatePresentation({ hasImage: false, hasPrimaryManifest: true }).visible, true);
  assert.equal(Core.getEmptyStatePresentation({ hasImage: true, hasPrimaryManifest: true }).visible, false);
});

test('does not require the optional companion manifest to dismiss the empty state', () => {
  const withoutCompanion = Core.getEmptyStatePresentation({
    hasImage: true,
    hasPrimaryManifest: true,
    hasSourceManifest: false
  });
  const withCompanion = Core.getEmptyStatePresentation({
    hasImage: true,
    hasPrimaryManifest: true,
    hasSourceManifest: true
  });

  assert.deepEqual(withoutCompanion, withCompanion);
});

test('hidden empty state is non-rendering, non-interactive, and inaccessible', () => {
  assert.deepEqual(
    Core.getEmptyStatePresentation({ hasImage: true, hasPrimaryManifest: true }),
    {
      visible: false,
      hidden: true,
      ariaHidden: 'true',
      inert: true,
      display: 'none',
      pointerEvents: 'none'
    }
  );
});

test('recomputes empty-state presentation when a primary manifest is replaced', () => {
  const beforeReplacement = Core.getEmptyStatePresentation({ hasImage: true, hasPrimaryManifest: false });
  const afterReplacement = Core.getEmptyStatePresentation({ hasImage: true, hasPrimaryManifest: true });

  assert.equal(beforeReplacement.visible, true);
  assert.equal(afterReplacement.visible, false);
});

test('prototype applies the centralized empty-state presentation and a hard hidden rule', () => {
  const prototypePath = path.join(__dirname, '..', 'manifest-region-mapper-prototype-v0.1.html');
  const html = fs.readFileSync(prototypePath, 'utf8');

  assert.match(html, /#emptyState\[hidden\]\s*\{[^}]*display:\s*none\s*!important;/s);
  assert.match(html, /Core\.getEmptyStatePresentation/);
  assert.match(html, /els\.emptyState\.setAttribute\('aria-hidden', presentation\.ariaHidden\)/);
  assert.match(html, /els\.emptyState\.inert = presentation\.inert/);
  assert.match(html, /els\.emptyState\.style\.pointerEvents = presentation\.pointerEvents/);
});
