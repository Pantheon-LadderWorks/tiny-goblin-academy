const test = require('node:test');
const assert = require('node:assert/strict');

const Core = require('../card-vfx-forge-core.js');

test('rounded rectangle perimeter uses straight edges plus four quarter arcs', () => {
  const value = Core.roundedRectPerimeter(170, 235, 12.75);
  const expected = 2 * (170 - 25.5) + 2 * (235 - 25.5) + 2 * Math.PI * 12.75;
  assert.ok(Math.abs(value - expected) < 1e-9);
});

test('perimeter sampler wraps cleanly and preserves clockwise tangent continuity', () => {
  const before = Core.sampleRoundedRectPerimeter(170, 235, 12.75, 0.999999);
  const after = Core.sampleRoundedRectPerimeter(170, 235, 12.75, 0.000001);
  assert.ok(Math.hypot(before.x - after.x, before.y - after.y) < 0.01);
  assert.ok(Number.isFinite(before.tangentX));
  assert.ok(Number.isFinite(before.tangentY));
  assert.equal(Core.sampleRoundedRectPerimeter(170, 235, 12.75, 0).segment, 'top');
});

test('twin trace plan always contains exactly two opposite uninterrupted traces', () => {
  for (const progress of [0, 0.001, 0.249, 0.499, 0.999]) {
    const plan = Core.createTwinTracePlan({ width: 170, height: 235, radius: 12.75, progress, arcLength: 0.18, samples: 40 });
    assert.equal(plan.traces.length, 2);
    assert.equal(plan.traces[0].id, 'trace-a');
    assert.equal(plan.traces[1].id, 'trace-b');
    assert.equal(plan.traces[0].points.length, 41);
    assert.equal(plan.traces[1].points.length, 41);
    assert.equal(Core.normalizedDelta(plan.traces[0].headProgress, plan.traces[1].headProgress), 0.5);
    for (const trace of plan.traces) {
      assert.ok(trace.points.every(point => Number.isFinite(point.x) && Number.isFinite(point.y)));
    }
  }
});

test('reduced motion substitutes a static pulse for continuous perimeter travel', () => {
  assert.equal(Core.borderMotionMode('trace', false), 'trace');
  assert.equal(Core.borderMotionMode('trace', true), 'pulse');
  assert.equal(Core.borderMotionMode('flare', true), 'flare');
});

test('outer-frame catalog contains only true open frames plus the null baseline', () => {
  assert.deepEqual(Core.MAIN_FRAME_IDS, ['none', 'gold-ornate', 'wood', 'bone']);
  assert.deepEqual(Object.keys(Core.FRAME_CATALOG), Core.MAIN_FRAME_IDS);
  assert.equal(Core.FRAME_CATALOG['gold-ornate'].classification, 'valid-transparent-overlay');
  assert.equal(Core.FRAME_CATALOG.bone.classification, 'usable-visually-provisional');
});

test('slot catalog preserves environmental surfaces outside the CardRig outer-frame socket', () => {
  assert.deepEqual(Core.SLOT_SURFACE_IDS, ['green-slot', 'teal-slot', 'gold-glow', 'red-corners', 'gray-gold']);
  assert.equal(Core.SLOT_CATALOG['green-slot'].classification, 'board-slot-surface');
  assert.equal(Core.SLOT_CATALOG['teal-slot'].classification, 'board-slot-surface');
  assert.equal(Core.SLOT_CATALOG['gold-glow'].classification, 'highlighted-slot-state');
  assert.equal(Core.SLOT_CATALOG['red-corners'].classification, 'card-slot-surface');
  assert.equal(Core.SLOT_CATALOG['gray-gold'].classification, 'card-slot-surface');
  for (const id of Core.SLOT_SURFACE_IDS) assert.equal(Object.hasOwn(Core.FRAME_CATALOG, id), false);
});

test('candidate recipes support nullable frames and explicit attachment authority', () => {
  const recipe = Core.createDefaultRecipe('heavy-bonk');
  assert.equal(recipe.schema, Core.RECIPE_SCHEMA);
  assert.equal(recipe.surfaceRecipe.outerFrame, null);
  assert.equal(recipe.surfaceRecipe.borderEffect.attachment, 'card-local');
  assert.equal(recipe.activationRecipe.attachment, 'enemy-target');
  assert.deepEqual(Object.keys(recipe.lifecycle), Core.PHASE_KEYS);
  assert.doesNotThrow(() => Core.validateRecipe(recipe));
});

test('recipe validation rejects malformed attachment, frame, phase, and numeric data', () => {
  const recipe = Core.createDefaultRecipe('spark');
  recipe.surfaceRecipe.borderEffect.attachment = 'viewport-center';
  assert.throws(() => Core.validateRecipe(recipe), /attachment/i);

  const invalidFrame = Core.createDefaultRecipe('spark');
  invalidFrame.surfaceRecipe.outerFrame = 'invented-frame';
  assert.throws(() => Core.validateRecipe(invalidFrame), /outer frame/i);

  const invalidPhase = Core.createDefaultRecipe('spark');
  delete invalidPhase.lifecycle.cleanupMs;
  assert.throws(() => Core.validateRecipe(invalidPhase), /cleanupMs/);

  const invalidNumber = Core.createDefaultRecipe('spark');
  invalidNumber.parameters.speed = Number.NaN;
  assert.throws(() => Core.validateRecipe(invalidNumber), /speed/i);
});

test('recipe serialization round trips without changing the candidate schema', () => {
  const recipe = Core.createDefaultRecipe('guard');
  recipe.surfaceRecipe.outerFrame = 'wood';
  recipe.parameters.intensity = 63;
  const text = Core.serializeRecipe(recipe);
  const restored = Core.parseRecipe(text);
  assert.deepEqual(restored, recipe);
});

test('phase timeline is ordered, complete, and reports total duration', () => {
  const recipe = Core.createDefaultRecipe('spark');
  const timeline = Core.buildPhaseTimeline(recipe.lifecycle);
  assert.deepEqual(timeline.map(item => item.id), Core.PHASE_KEYS);
  assert.equal(timeline[0].startMs, 0);
  assert.equal(timeline.at(-1).endMs, timeline.totalMs);
  assert.ok(timeline.totalMs > 0);
});

test('repository asset paths are local and contain no external network origin', () => {
  for (const asset of Object.values(Core.ASSET_PATHS)) {
    assert.match(asset, /^\.\.\/\.\.\/\.\.\/assets\//);
    assert.doesNotMatch(asset, /^(?:https?:)?\/\//i);
  }
});
