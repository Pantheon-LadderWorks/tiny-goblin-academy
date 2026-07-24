'use strict';

const { chromium } = require('playwright');

const URL = 'http://127.0.0.1:5175/';
const TOP_RAIL_SELECTOR = '.duel-top-rail';
const ANCHORS = Object.freeze({
  draw: 'player-draw-origin',
  played: 'played-card-target',
  discard: 'player-discard-target',
});

function fixtureUrl(fixture, mode = 'full') {
  const query = new URLSearchParams({ cardRig: fixture, motion: mode });
  return `${URL}?${query}`;
}

async function openFixture(browser, fixture, mode, viewport) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('requestfailed', (request) => errors.push(
    `${request.url()} · ${request.failure()?.errorText}`,
  ));
  await page.goto(fixtureUrl(fixture, mode), { waitUntil: 'networkidle' });
  await page.waitForFunction(
    () => window.__cardRigLabStatus?.status === 'complete',
    undefined,
    { timeout: 12000 },
  );
  if (errors.length) throw new Error(`${fixture}: ${errors.join(' | ')}`);
  return page;
}

async function geometry(page) {
  return page.evaluate(({ anchors, topRailSelector }) => {
    const rect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) throw new Error(`Missing geometry selector: ${selector}`);
      const box = element.getBoundingClientRect();
      return {
        left: box.left,
        top: box.top,
        right: box.right,
        bottom: box.bottom,
        centerX: box.left + box.width / 2,
        centerY: box.top + box.height / 2,
      };
    };
    return {
      draw: rect(`[data-stage-anchor="${anchors.draw}"]`),
      played: rect(`[data-stage-anchor="${anchors.played}"]`),
      discard: rect(`[data-stage-anchor="${anchors.discard}"]`),
      topRail: rect(topRailSelector),
      hands: Array.from(document.querySelectorAll('#hand .card-btn')).map((button) => {
        const box = button.getBoundingClientRect();
        return {
          centerX: box.left + box.width / 2,
          centerY: box.top + box.height / 2,
        };
      }),
    };
  }, { anchors: ANCHORS, topRailSelector: TOP_RAIL_SELECTOR });
}

function assertGeometry(label, value) {
  for (const hand of value.hands) {
    if (!(value.draw.centerX < hand.centerX)) {
      throw new Error(`${label}: draw origin is not left of every hand target\n${JSON.stringify(value, null, 2)}`);
    }
    if (!(value.discard.centerX > hand.centerX)) {
      throw new Error(`${label}: discard target is not right of every hand target\n${JSON.stringify(value, null, 2)}`);
    }
    if (!(value.played.centerY < hand.centerY)) {
      throw new Error(`${label}: played target is not above the hand`);
    }
  }
  const handMinX = Math.min(...value.hands.map((hand) => hand.centerX));
  const handMaxX = Math.max(...value.hands.map((hand) => hand.centerX));
  if (value.played.centerX < handMinX || value.played.centerX > handMaxX) {
    throw new Error(`${label}: played target is not central relative to the hand`);
  }
  for (const [name, anchor] of Object.entries({
    draw: value.draw,
    played: value.played,
    discard: value.discard,
  })) {
    if (anchor.top < value.topRail.bottom) {
      throw new Error(`${label}: ${name} anchor intersects the top status rail`);
    }
  }
}

async function assertGeometryAt(browser, viewport) {
  const page = await openFixture(
    browser,
    viewport.width === 1024 ? 'optical-minimum' : 'optical-default',
    'full',
    viewport,
  );
  assertGeometry(`${viewport.width}x${viewport.height}`, await geometry(page));
  await page.close();
}

async function routeState(page) {
  return page.evaluate(() => window.__cardRigLabStatus);
}

function compactRoutes(status) {
  return status.routes.map(({ kind, card, fromAnchorId, toAnchorId, mode }) => ({
    kind,
    card,
    from: fromAnchorId,
    to: toAnchorId,
    mode,
  }));
}

async function assertRoutes(browser, fixture, mode, expected) {
  const page = await openFixture(
    browser,
    fixture,
    mode,
    { width: 1280, height: 660 },
  );
  const status = await routeState(page);
  const actual = compactRoutes(status);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${fixture}:${mode} route mismatch\n${JSON.stringify(actual, null, 2)}`);
  }
  const drawAnchor = await page.locator('[data-stage-anchor="player-draw-origin"]').boundingBox();
  if (!drawAnchor) throw new Error(`${fixture}:${mode} draw anchor missing`);
  const drawCenter = {
    x: drawAnchor.x + drawAnchor.width / 2,
    y: drawAnchor.y + drawAnchor.height / 2,
  };
  const badDraw = status.routes.find((route) => route.kind === 'draw'
    && (Math.abs(route.startRect.x + route.startRect.width / 2 - drawCenter.x) > 2
      || Math.abs(route.startRect.y + route.startRect.height / 2 - drawCenter.y) > 2));
  if (badDraw) {
    throw new Error(
      `${fixture}:${mode} draw began before governed origin layout\n`
      + JSON.stringify({ drawCenter, route: badDraw }, null, 2),
    );
  }
  await page.close();
}

const initialRoutes = (mode) => [
  { kind: 'draw', card: 'Strike', from: 'player-draw-origin', to: 'hand-slot-0', mode },
  { kind: 'draw', card: 'Guard', from: 'player-draw-origin', to: 'hand-slot-1', mode },
  { kind: 'draw', card: 'Mend', from: 'player-draw-origin', to: 'hand-slot-2', mode },
];

const strikeRoutes = [
  { kind: 'play', card: 'Strike', from: 'hand-slot-0', to: 'played-card-target', mode: 'full' },
  { kind: 'played-discard', card: 'Strike', from: 'played-card-target', to: 'player-discard-target', mode: 'full' },
  { kind: 'draw', card: 'Spark', from: 'player-draw-origin', to: 'hand-slot-2', mode: 'full' },
];

const heavyRoutes = [
  { kind: 'play', card: 'Heavy Bonk', from: 'hand-slot-2', to: 'played-card-target', mode: 'full' },
  { kind: 'played-discard', card: 'Heavy Bonk', from: 'played-card-target', to: 'player-discard-target', mode: 'full' },
];

const sparkRoutes = [
  { kind: 'play', card: 'Spark', from: 'hand-slot-1', to: 'played-card-target', mode: 'full' },
  { kind: 'played-discard', card: 'Spark', from: 'played-card-target', to: 'player-discard-target', mode: 'full' },
  { kind: 'replacement-discard', card: 'Mend', from: 'hand-slot-2', to: 'player-discard-target', mode: 'full' },
  { kind: 'draw', card: 'Guard', from: 'player-draw-origin', to: 'hand-slot-1', mode: 'full' },
  { kind: 'draw', card: 'Stun', from: 'player-draw-origin', to: 'hand-slot-2', mode: 'full' },
];

async function assertCancellation(browser, reason) {
  const fixture = reason === 'resize' ? 'resize-active' : 'reset-during-deal';
  const page = await browser.newPage({ viewport: { width: 1280, height: 660 } });
  await page.goto(fixtureUrl(fixture), { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__cardRigLabStatus?.status === 'running');
  if (reason === 'resize') {
    await page.setViewportSize({ width: 1270, height: 650 });
    await page.waitForFunction(() => window.__cardRigLabStatus?.status === 'cancelled');
  } else {
    await page.locator('#reset-duel').evaluate((button) => button.click());
    await page.waitForFunction(() => window.__cardRigLabStatus?.cleanup.includes('reset'));
    await page.waitForFunction(() => window.__cardRigLabStatus?.status === 'complete');
  }
  const residue = await page.evaluate(() => ({
    cleanup: window.__cardRigLabStatus?.cleanup,
    animations: document.getAnimations().filter((animation) => animation.playState === 'running').length,
    transforms: Array.from(document.querySelectorAll('#hand .card-btn'))
      .filter((button) => button.style.transform || button.style.zIndex).length,
  }));
  if (!residue.cleanup.includes(reason) || residue.animations || residue.transforms) {
    throw new Error(`${reason} cancellation left route residue: ${JSON.stringify(residue)}`);
  }
  await page.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    await assertGeometryAt(browser, { width: 1280, height: 660 });
    await assertGeometryAt(browser, { width: 1024, height: 580 });
    await assertRoutes(browser, 'initial-deal', 'full', initialRoutes('full'));
    await assertRoutes(browser, 'initial-deal', 'reduced', initialRoutes('reduced'));
    await assertRoutes(browser, 'strike-commitment', 'full', strikeRoutes);
    await assertRoutes(browser, 'heavy-bonk-vacancy', 'full', heavyRoutes);
    await assertRoutes(browser, 'spark-sequence', 'full', sparkRoutes);
    await assertCancellation(browser, 'reset');
    await assertCancellation(browser, 'resize');
    console.log('H6.21B semantic route browser contracts passed: 9/9');
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
