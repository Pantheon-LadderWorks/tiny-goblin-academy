'use strict';

const { chromium } = require('playwright');

const BASE_URL = 'http://127.0.0.1:5175/';
const FIXTURES = Object.freeze([
  { id: 'layer-stack' },
  { id: 'frame-matrix', frameStyle: 'gold-ornate' },
  { id: 'frame-matrix', frameStyle: 'wood' },
  { id: 'frame-matrix', frameStyle: 'corner-ornate' },
  { id: 'slot-vs-frame' },
  { id: 'card-local-follow', expectsSamples: true, expectsMovement: true },
  { id: 'draw-pile-local', expectsSamples: true },
  { id: 'discard-pile-local', expectsSamples: true },
  { id: 'player-target', expectsSamples: true },
  { id: 'enemy-target', expectsSamples: true },
  { id: 'travel', expectsSamples: true, expectsMovement: true },
  { id: 'tabletop-local', expectsSamples: true },
  { id: 'resize-active', expectsSamples: true, resize: true },
  { id: 'cancel-cleanup', expectsSamples: true, cancelled: true },
  { id: 'reduced-motion', expectsSamples: false, motion: 'reduced' },
]);

const urlFor = ({ id, frameStyle, motion }) => {
  const query = new URLSearchParams({ cardComp: id });
  if (frameStyle) query.set('frameStyle', frameStyle);
  if (motion) query.set('motion', motion);
  return `${BASE_URL}?${query}`;
};

const distance = (left, right) => Math.hypot(left.x - right.x, left.y - right.y);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  let passed = 0;

  for (const fixture of FIXTURES) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 660 } });
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(`${fixture.id}: ${message.text()}`);
    });
    page.on('pageerror', (error) => errors.push(`${fixture.id}: ${error.message}`));
    page.on('requestfailed', (request) => errors.push(
      `${fixture.id}: ${request.url()} ${request.failure()?.errorText}`,
    ));

    await page.goto(urlFor(fixture), { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(
      () => window.__cardRigCompositionStatus?.status === 'running'
        || ['complete', 'cancelled', 'error'].includes(window.__cardRigCompositionStatus?.status ?? ''),
      undefined,
      { timeout: 10000 },
    );
    if (fixture.resize) {
      await page.setViewportSize({ width: 1024, height: 580 });
    }
    await page.waitForFunction(
      () => ['complete', 'cancelled', 'error'].includes(window.__cardRigCompositionStatus?.status ?? ''),
      undefined,
      { timeout: 30000 },
    );

    const result = await page.evaluate(() => {
      const status = window.__cardRigCompositionStatus;
      const rigs = [...document.querySelectorAll('[data-card-rig-id]')];
      const rigLayers = rigs.map((rig) => ({
        id: rig.getAttribute('data-card-rig-id'),
        layers: [...rig.querySelectorAll('[data-card-rig-layer]')]
          .map((layer) => layer.getAttribute('data-card-rig-layer')),
      }));
      const anchors = [...document.querySelectorAll('[data-stage-anchor]')]
        .map((anchor) => anchor.getAttribute('data-stage-anchor'));
      return {
        status,
        rigLayers,
        duplicateAnchors: anchors.filter((id, index) => anchors.indexOf(id) !== index),
        outerFrames: rigs.map((rig) => rig.querySelector('[data-outer-frame]')?.getAttribute('data-outer-frame')),
        slotSurfaces: [...document.querySelectorAll('[data-card-slot-surface]')]
          .map((slot) => slot.getAttribute('data-card-slot-surface')),
      };
    });

    if (!result.status) throw new Error(`${fixture.id}: missing composition status`);
    if (result.status.status === 'error') throw new Error(`${fixture.id}: ${result.status.error}`);
    if (fixture.cancelled && result.status.status !== 'cancelled') {
      throw new Error(`${fixture.id}: expected cancellation`);
    }
    if (!fixture.cancelled && !fixture.resize && result.status.status !== 'complete') {
      throw new Error(`${fixture.id}: expected completion, got ${result.status.status}`);
    }
    if (result.duplicateAnchors.length) {
      throw new Error(`${fixture.id}: duplicate anchors ${result.duplicateAnchors.join(', ')}`);
    }
    for (const rig of result.rigLayers) {
      if (new Set(rig.layers).size !== 7 || !rig.layers.includes('activation-source')) {
        throw new Error(`${fixture.id}: ${rig.id} does not own seven distinct production layers`);
      }
    }
    if (Object.values(result.status.finalCounts).some((value) => value !== 0)) {
      throw new Error(`${fixture.id}: attachment residue ${JSON.stringify(result.status.finalCounts)}`);
    }
    if (fixture.expectsSamples && result.status.samples.length < 2) {
      throw new Error(`${fixture.id}: attachment telemetry missing`);
    }
    if (fixture.expectsMovement) {
      const first = result.status.samples[0];
      const last = result.status.samples.at(-1);
      if (!first || !last || distance(first, last) < 20) {
        throw new Error(`${fixture.id}: moving attachment did not follow its owner`);
      }
    }
    if (fixture.id === 'slot-vs-frame') {
      const expected = ['green-slot', 'teal-slot', 'gold-glow'];
      if (!expected.every((slot) => result.slotSurfaces.includes(slot))) {
        throw new Error('slot-vs-frame: environmental surfaces were not rendered separately');
      }
    }

    passed += 1;
    console.log(`SMOKE ${fixture.id}${fixture.frameStyle ? ` ${fixture.frameStyle}` : ''}`);
    await page.close();
  }

  await browser.close();
  if (errors.length) throw new Error(errors.join('\n'));
  console.log(`H6.22R1 browser contracts passed: ${passed}/${FIXTURES.length}`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
