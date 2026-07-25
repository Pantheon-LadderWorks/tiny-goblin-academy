'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const {
  finalizeCaptureRun,
  prepareCaptureRun,
} = require('../../../tools/evidence/capture-run.cjs');
const {
  CARD_FIXTURES,
  DEFAULT_VIEWPORT,
  FIXTURE_IDS,
  MINIMUM_VIEWPORT,
  MOTION_CONTRACTS,
  verifyEvidenceContracts,
} = require('./h622a-evidence-contracts.cjs');

const URL = 'http://127.0.0.1:5175/';
const LANE_ID = 'h6-22a-card-effect-recipe-lab';
const COUNT_KEYS = Object.freeze([
  'emitters',
  'temporaryObjects',
  'masks',
  'fx',
  'listeners',
]);
const KEYFRAME_DELAYS = Object.freeze({
  strike: 380,
  guard: 430,
  mend: 430,
  spark: 430,
  stun: 430,
  'heavy-bonk': 500,
});

verifyEvidenceContracts();
if (process.argv.includes('--verify-contracts')) {
  console.log('H6.22A capture contracts passed: 14 fixtures, 9 recordings, 1 contact sheet.');
  process.exit(0);
}

const captureRun = prepareCaptureRun({
  scriptDirectory: __dirname,
  gameId: 'level-04-card-goblin-duel',
  laneId: LANE_ID,
});

const consoleErrors = [];
const fixtureAssertions = [];
const containmentResults = [];
const motionResults = [];
const keyframeResults = [];
const review = {
  laneId: LANE_ID,
  sourceState: 'uncommitted H6.22A preview-only lab on committed H6.21B authority',
  sourceCommit: '12428d232713807773774b7cc75d6885f3170035',
  humanReviewPassed: false,
  liveGameplayIntegrated: false,
  fixtureAssertions,
  containmentResults,
  motionResults,
  keyframeResults,
  consoleResults: { errors: consoleErrors },
  protectedHashes: {},
};

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function fixtureUrl(fixture, mode = 'full') {
  const query = new URLSearchParams({ cardFx: fixture, motion: mode });
  return `${URL}?${query}`;
}

function attachDiagnostics(page, label) {
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(`${label}: ${message.text()}`);
  });
  page.on('pageerror', (error) => consoleErrors.push(`${label}: ${error.message}`));
  page.on('requestfailed', (request) => consoleErrors.push(
    `${label}: ${request.url()} · ${request.failure()?.errorText}`,
  ));
}

function isZeroCounts(counts) {
  return counts && COUNT_KEYS.every((key) => counts[key] === 0);
}

function expectedStatus(fixture) {
  return fixture === 'cancellation-layered' || fixture === 'resize-active'
    ? 'cancelled'
    : 'completed';
}

async function waitForStatus(page, fixture, options = {}) {
  await page.waitForFunction(
    (expectedFixture) => window.__cardEffectLabStatus?.fixtureId === expectedFixture
      && ['running', 'completed', 'cancelled', 'error']
        .includes(window.__cardEffectLabStatus.status),
    fixture,
    { timeout: 8000 },
  );
  if (options.resize) {
    await page.waitForFunction(
      () => window.__cardEffectLabStatus?.status === 'running',
      undefined,
      { timeout: 8000 },
    );
    await page.waitForTimeout(options.resizeDelay ?? 480);
    await page.setViewportSize({ width: 1270, height: 650 });
  }
  await page.waitForFunction(
    () => ['completed', 'cancelled', 'error']
      .includes(window.__cardEffectLabStatus?.status),
    undefined,
    { timeout: 20000 },
  );
  const status = await page.evaluate(() => window.__cardEffectLabStatus);
  if (!status) throw new Error(`${fixture}: missing final status`);
  if (status.status === 'error') throw new Error(`${fixture}: ${status.error}`);
  if (status.status !== expectedStatus(fixture)) {
    throw new Error(`${fixture}: expected ${expectedStatus(fixture)}, found ${status.status}`);
  }
  if (!isZeroCounts(status.beforeCounts) || !isZeroCounts(status.afterCounts)) {
    throw new Error(`${fixture}: nonzero boundary resource counts`);
  }
  if (!status.cleanup.every(({ counts }) => isZeroCounts(counts))
    || !status.runs.every(({ counts }) => isZeroCounts(counts))) {
    throw new Error(`${fixture}: cleanup or run residue`);
  }
  return status;
}

async function collectContainment(page) {
  return page.evaluate(() => {
    const rect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return {
        left: Math.round(box.left * 100) / 100,
        top: Math.round(box.top * 100) / 100,
        right: Math.round(box.right * 100) / 100,
        bottom: Math.round(box.bottom * 100) / 100,
        width: Math.round(box.width * 100) / 100,
        height: Math.round(box.height * 100) / 100,
      };
    };
    return {
      viewport: { width: innerWidth, height: innerHeight },
      overflow: {
        x: document.documentElement.scrollWidth - innerWidth,
        y: document.documentElement.scrollHeight - innerHeight,
      },
      canvas: rect('#stage-canvas canvas'),
      topRail: rect('.duel-top-rail'),
      resolution: rect('.resolution-copy'),
      hand: rect('#hand'),
      playerHp: document.querySelector('#player-hp')?.textContent,
      enemyHp: document.querySelector('#enemy-hp')?.textContent,
      cardName: document.querySelector('#hand .card-btn')?.getAttribute('data-card-name'),
    };
  });
}

function assertContainment(label, value) {
  if (value.overflow.x !== 0 || value.overflow.y !== 0) {
    throw new Error(`${label}: document overflow ${JSON.stringify(value.overflow)}`);
  }
  for (const [name, box] of Object.entries({
    canvas: value.canvas,
    topRail: value.topRail,
    resolution: value.resolution,
    hand: value.hand,
  })) {
    if (!box) throw new Error(`${label}: missing ${name}`);
    if (box.left < -1 || box.top < -1
      || box.right > value.viewport.width + 1
      || box.bottom > value.viewport.height + 1) {
      throw new Error(`${label}: ${name} escaped viewport`);
    }
  }
  if (value.playerHp !== '10 / 10 HP'
    || value.enemyHp !== '12 / 12 HP'
    || !value.cardName) {
    throw new Error(`${label}: critical card or status information missing`);
  }
}

async function runFixture(browser, fixture, viewport) {
  const label = `${fixture}:${viewport.width}x${viewport.height}`;
  const page = await browser.newPage({ viewport });
  attachDiagnostics(page, label);
  try {
    await page.goto(fixtureUrl(fixture), { waitUntil: 'networkidle' });
    const status = await waitForStatus(page, fixture, {
      resize: fixture === 'resize-active',
    });
    if (fixture === 'resize-active') {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(120);
    }
    const containment = await collectContainment(page);
    assertContainment(label, containment);
    const assertion = { fixture, viewport, status, containment };
    fixtureAssertions.push(assertion);
    containmentResults.push({ fixture, viewport, containment });
    return assertion;
  } finally {
    await page.close();
  }
}

async function finalizeVideo(page, context, targetPath) {
  const video = page.video();
  await page.close();
  await context.close();
  if (!video) throw new Error('Playwright did not produce the requested recording.');
  const sourcePath = await video.path();
  fs.renameSync(sourcePath, targetPath);
}

async function recordMotion(browser, contract) {
  const targetPath = captureRun.file('recordings', contract.recording);
  const context = await browser.newContext({
    viewport: DEFAULT_VIEWPORT,
    recordVideo: {
      dir: path.join(captureRun.runDir, 'recordings'),
      size: DEFAULT_VIEWPORT,
    },
  });
  const page = await context.newPage();
  attachDiagnostics(page, contract.recording);
  await page.goto(fixtureUrl(contract.fixture, contract.mode), {
    waitUntil: 'networkidle',
  });
  const status = await waitForStatus(page, contract.fixture, {
    resize: contract.resize,
    resizeDelay: 480,
  });
  if (contract.resize) {
    await page.setViewportSize(DEFAULT_VIEWPORT);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(420);
  const containment = await collectContainment(page);
  assertContainment(contract.recording, containment);
  motionResults.push({
    ...contract,
    recordingPath: path.posix.join('recordings', contract.recording),
    status,
    containment,
  });
  await finalizeVideo(page, context, targetPath);
}

async function captureKeyframe(browser, fixture) {
  const filename = `${fixture}-keyframe.png`;
  const targetPath = captureRun.file('stills', filename);
  const page = await browser.newPage({ viewport: DEFAULT_VIEWPORT });
  attachDiagnostics(page, filename);
  try {
    await page.goto(fixtureUrl(fixture), { waitUntil: 'networkidle' });
    await page.waitForFunction(
      (expectedFixture) => window.__cardEffectLabStatus?.fixtureId === expectedFixture
        && window.__cardEffectLabStatus.status === 'running',
      fixture,
      { timeout: 8000 },
    );
    await page.waitForTimeout(KEYFRAME_DELAYS[fixture]);
    await page.screenshot({ path: targetPath });
    const status = await waitForStatus(page, fixture);
    const containment = await collectContainment(page);
    assertContainment(filename, containment);
    const result = {
      fixture,
      screenshotPath: path.posix.join('stills', filename),
      delayMs: KEYFRAME_DELAYS[fixture],
      status,
      containment,
    };
    keyframeResults.push(result);
    return { ...result, targetPath };
  } finally {
    await page.close();
  }
}

async function createContactSheet(browser, keyframes) {
  const targetPath = captureRun.file('stills', 'card-recipe-contact-sheet.png');
  const items = keyframes.map(({ fixture, targetPath: imagePath }) => ({
    fixture,
    data: `data:image/png;base64,${fs.readFileSync(imagePath).toString('base64')}`,
  }));
  const page = await browser.newPage({ viewport: { width: 1400, height: 980 } });
  try {
    const cards = items.map(({ fixture, data }) => `
      <figure>
        <img src="${data}" alt="${fixture}">
        <figcaption>${fixture.replaceAll('-', ' ')}</figcaption>
      </figure>
    `).join('');
    await page.setContent(`<!doctype html>
      <html><head><style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 26px; background: #171017; color: #f7e5bb;
          font-family: Georgia, serif; }
        h1 { margin: 0 0 18px; font-size: 30px; letter-spacing: .04em; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        figure { margin: 0; padding: 10px; background: #241923; border: 2px solid #76593c;
          border-radius: 12px; }
        img { display: block; width: 100%; aspect-ratio: 1280 / 660; object-fit: cover;
          border-radius: 7px; }
        figcaption { padding: 9px 4px 2px; text-transform: capitalize; font-weight: 700;
          font-size: 18px; }
      </style></head><body>
        <h1>H6.22A — Six CardEffectRecipe Key Frames</h1>
        <div class="grid">${cards}</div>
      </body></html>`, { waitUntil: 'load' });
    await page.screenshot({ path: targetPath });
  } finally {
    await page.close();
  }
  return path.posix.join('stills', 'card-recipe-contact-sheet.png');
}

async function readRecipeRegistry() {
  const { createServer } = await import('vite');
  const viteServer = await createServer({
    root: __dirname,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });
  try {
    const module = await viteServer.ssrLoadModule('/src/card-effect-recipes.ts');
    return {
      requiredPrimitives: module.REQUIRED_EFFECT_PRIMITIVES,
      cardMappings: module.CARD_EFFECT_RECIPE_BY_CARD,
      fixtures: module.CARD_EFFECT_FIXTURES,
      recipes: module.CARD_EFFECT_RECIPES,
    };
  } finally {
    await viteServer.close();
  }
}

function persistJson(filename, value) {
  fs.writeFileSync(
    captureRun.file('root', filename),
    `${JSON.stringify(value, null, 2)}\n`,
  );
}

function recordProtectedHashes() {
  const protectedAssets = {
    cardFrames: 'assets/academy/games/card-goblin-duel/derived/tga-card-goblin-duel-card-frames-cleaned-v0.1.png',
    uiTokens: 'assets/academy/games/card-goblin-duel/derived/tga-card-goblin-duel-ui-tokens-cleaned-v0.1.png',
    tabletop: 'assets/academy/games/card-goblin-duel/backgrounds/tga-card-goblin-duel-tabletop-scene-v0.1.png',
  };
  for (const [name, relativePath] of Object.entries(protectedAssets)) {
    review.protectedHashes[name] = sha256(path.join(captureRun.repoRoot, relativePath));
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const recipeRegistry = await readRecipeRegistry();

    for (const contract of MOTION_CONTRACTS) {
      await recordMotion(browser, contract);
    }

    const keyframes = [];
    for (const fixture of CARD_FIXTURES) {
      keyframes.push(await captureKeyframe(browser, fixture));
    }
    review.contactSheet = await createContactSheet(browser, keyframes);

    for (const viewport of [DEFAULT_VIEWPORT, MINIMUM_VIEWPORT]) {
      for (const fixture of FIXTURE_IDS) {
        await runFixture(browser, fixture, viewport);
      }
    }

    if (consoleErrors.length > 0) {
      throw new Error(`Browser console errors: ${consoleErrors.join(' | ')}`);
    }

    recordProtectedHashes();
    persistJson('recipe-registry.json', recipeRegistry);
    persistJson('fixture-assertions.json', fixtureAssertions);
    persistJson('containment-results.json', containmentResults);
    persistJson('console-results.json', review.consoleResults);
    persistJson('technical-review.json', review);

    const finalized = finalizeCaptureRun(captureRun, {
      sourceCommit: review.sourceCommit,
      captureScript: 'games/tier-1/04-card-goblin-duel/capture-h622a.cjs',
      captureScriptVersion: 'h6.22a-card-effect-recipe-lab',
      captureConfiguration: {
        listenerHost: '127.0.0.1',
        listenerPort: 5175,
        browser: 'chromium',
        defaultViewport: DEFAULT_VIEWPORT,
        minimumViewport: MINIMUM_VIEWPORT,
        fixtures: FIXTURE_IDS,
        motionContracts: MOTION_CONTRACTS,
        contactSheet: review.contactSheet,
        sourceWorktree: review.sourceState,
      },
    });

    console.log(`External evidence: ${captureRun.runDir}`);
    console.log(`Portable manifest: ${finalized.portableManifestPath}`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
