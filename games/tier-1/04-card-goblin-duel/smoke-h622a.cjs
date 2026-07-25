'use strict';

const { chromium } = require('playwright');

const URL = 'http://127.0.0.1:5175/';
const FIXTURES = Object.freeze([
  'primitive-sampler',
  'strike',
  'guard',
  'mend',
  'spark',
  'stun',
  'heavy-bonk',
  'enemy-attack',
  'victory',
  'defeat',
  'reduced-comparison',
  'cancellation-layered',
  'resize-active',
  'repeat-no-residue',
]);
const VIEWPORTS = Object.freeze([
  { width: 1280, height: 660 },
  { width: 1024, height: 580 },
]);
const COUNT_KEYS = Object.freeze([
  'emitters',
  'temporaryObjects',
  'masks',
  'fx',
  'listeners',
]);

function isZeroCounts(counts) {
  return counts && COUNT_KEYS.every((key) => counts[key] === 0);
}

function fixtureUrl(fixture, mode = 'full') {
  const query = new URLSearchParams({ cardFx: fixture, motion: mode });
  return `${URL}?${query}`;
}

function attachDiagnostics(page, label, errors) {
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`${label}: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`${label}: ${error.message}`));
  page.on('requestfailed', (request) => errors.push(
    `${label}: ${request.url()} · ${request.failure()?.errorText}`,
  ));
}

async function waitForTerminal(page, fixture, viewport) {
  await page.waitForFunction(
    (expectedFixture) => window.__cardEffectLabStatus?.fixtureId === expectedFixture
      && ['running', 'completed', 'cancelled', 'error']
        .includes(window.__cardEffectLabStatus.status),
    fixture,
    { timeout: 8000 },
  );

  if (fixture === 'resize-active') {
    await page.waitForFunction(
      () => window.__cardEffectLabStatus?.status === 'running',
      undefined,
      { timeout: 8000 },
    );
    await page.setViewportSize({
      width: viewport.width - 10,
      height: viewport.height - 10,
    });
  }

  await page.waitForFunction(
    () => ['completed', 'cancelled', 'error']
      .includes(window.__cardEffectLabStatus?.status),
    undefined,
    { timeout: 20000 },
  );

  if (fixture === 'resize-active') {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(120);
  }
}

async function collectState(page) {
  return page.evaluate(() => {
    const rect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return {
        left: box.left,
        top: box.top,
        right: box.right,
        bottom: box.bottom,
        width: box.width,
        height: box.height,
      };
    };
    return {
      status: window.__cardEffectLabStatus,
      bodyClass: document.body.className,
      cardCount: document.querySelectorAll('#hand .card-btn').length,
      cardName: document.querySelector('#hand .card-btn')?.getAttribute('data-card-name'),
      playerHp: document.querySelector('#player-hp')?.textContent,
      enemyHp: document.querySelector('#enemy-hp')?.textContent,
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      overflowY: document.documentElement.scrollHeight - window.innerHeight,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      canvas: rect('#stage-canvas canvas'),
      topRail: rect('.duel-top-rail'),
      resolution: rect('.resolution-copy'),
      hand: rect('#hand'),
    };
  });
}

function assertContained(label, state) {
  for (const [name, box] of Object.entries({
    canvas: state.canvas,
    topRail: state.topRail,
    resolution: state.resolution,
    hand: state.hand,
  })) {
    if (!box) throw new Error(`${label}: missing ${name} geometry`);
    if (box.left < -1 || box.top < -1
      || box.right > state.viewport.width + 1
      || box.bottom > state.viewport.height + 1) {
      throw new Error(`${label}: ${name} escaped viewport ${JSON.stringify(box)}`);
    }
  }
  if (state.overflowX !== 0 || state.overflowY !== 0) {
    throw new Error(`${label}: document overflow ${state.overflowX},${state.overflowY}`);
  }
}

function assertTelemetry(label, fixture, state) {
  const status = state.status;
  if (!status) throw new Error(`${label}: missing lab status`);
  if (status.status === 'error') {
    throw new Error(`${label}: ${status.error || 'unknown fixture error'}`);
  }
  const expected = fixture === 'cancellation-layered' || fixture === 'resize-active'
    ? 'cancelled'
    : 'completed';
  if (status.status !== expected) {
    throw new Error(`${label}: expected ${expected}, received ${status.status}`);
  }
  if (!isZeroCounts(status.beforeCounts) || !isZeroCounts(status.afterCounts)) {
    throw new Error(`${label}: nonzero boundary counts ${JSON.stringify(status)}`);
  }
  if (!status.layers.length || !status.cleanup.length || !status.runs.length) {
    throw new Error(`${label}: incomplete layer/run/cleanup telemetry`);
  }
  if (!status.cleanup.every(({ counts }) => isZeroCounts(counts))) {
    throw new Error(`${label}: cleanup residue ${JSON.stringify(status.cleanup)}`);
  }
  if (!status.runs.every(({ counts }) => isZeroCounts(counts))) {
    throw new Error(`${label}: run residue ${JSON.stringify(status.runs)}`);
  }
  if (fixture === 'reduced-comparison') {
    const modes = status.runs.map(({ mode }) => mode);
    if (JSON.stringify(modes) !== JSON.stringify(['full', 'reduced'])) {
      throw new Error(`${label}: comparison modes ${JSON.stringify(modes)}`);
    }
  }
  if (fixture === 'repeat-no-residue' && status.runs.length !== 3) {
    throw new Error(`${label}: expected 3 repeated runs, found ${status.runs.length}`);
  }
  if (state.cardCount !== 1 || !state.cardName) {
    throw new Error(`${label}: preview card identity missing`);
  }
  if (state.playerHp !== '10 / 10 HP' || state.enemyHp !== '12 / 12 HP') {
    throw new Error(`${label}: status information drifted`);
  }
}

async function assertFixture(browser, fixture, viewport) {
  const label = `${fixture}:${viewport.width}x${viewport.height}`;
  console.log('SMOKE', label);
  const page = await browser.newPage({ viewport });
  const errors = [];
  attachDiagnostics(page, label, errors);
  try {
    await page.goto(fixtureUrl(fixture), { waitUntil: 'networkidle' });
    await waitForTerminal(page, fixture, viewport);
    const state = await collectState(page);
    if (errors.length) throw new Error(errors.join(' | '));
    assertTelemetry(label, fixture, state);
    assertContained(label, state);
    return state;
  } catch (error) {
    console.error('STATUS', await page.evaluate(() => window.__cardEffectLabStatus));
    console.error('ERRORS', errors);
    throw error;
  } finally {
    await page.close();
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  let passed = 0;
  try {
    for (const viewport of VIEWPORTS) {
      for (const fixture of FIXTURES) {
        await assertFixture(browser, fixture, viewport);
        passed += 1;
      }
    }
    console.log(`H6.22A browser contracts passed: ${passed}/${FIXTURES.length * VIEWPORTS.length}`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
