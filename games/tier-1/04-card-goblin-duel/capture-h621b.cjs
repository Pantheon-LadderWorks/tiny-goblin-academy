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
  DEFAULT_VIEWPORT,
  routeEvidenceContracts,
  staticContracts,
  motionContracts,
  verifyEvidenceContracts,
} = require('./h621b-evidence-contracts.cjs');

const URL = 'http://127.0.0.1:5175/';
const LANE_ID = 'h6-21b-optical-typography-card-rig-motion-lab-replacement-2';
const H621A_AUTHORITY = 'level-04-card-goblin-duel/h6-21a-five-face-card-surface-lab-replacement-3/capture-20260723t174650z-p712';
const H621B_PARTIAL = 'level-04-card-goblin-duel/h6-21b-optical-typography-card-rig-motion-lab/capture-20260723t224006z-p9188';
const H621B_REPLACEMENT_1 = 'level-04-card-goblin-duel/h6-21b-optical-typography-card-rig-motion-lab-replacement-1/capture-20260724t174914z-p9008';

const historicalEvidence = [
  { lane: 'h6-21a-five-face-card-surface-lab', classification: 'aborted', payloadFiles: 0 },
  { lane: 'h6-21a-five-face-card-surface-lab-replacement-1', classification: 'partial', payloadFiles: 5 },
  { lane: 'h6-21a-five-face-card-surface-lab-replacement-2', classification: 'partial', payloadFiles: 6 },
  { lane: 'h6-21a-five-face-card-surface-lab-replacement-3', classification: 'complete', authority: H621A_AUTHORITY },
  { lane: 'h6-21b-optical-typography-card-rig-motion-lab', classification: 'partial', payloadFiles: 5, authority: H621B_PARTIAL },
  {
    lane: 'h6-21b-optical-typography-card-rig-motion-lab-replacement-1',
    classification: 'superseded',
    authority: H621B_REPLACEMENT_1,
    reason: 'route-geography-correction',
  },
];

const protectedAssets = {
  cardFrames: 'assets/academy/games/card-goblin-duel/derived/tga-card-goblin-duel-card-frames-cleaned-v0.1.png',
  uiTokens: 'assets/academy/games/card-goblin-duel/derived/tga-card-goblin-duel-ui-tokens-cleaned-v0.1.png',
  tabletop: 'assets/academy/games/card-goblin-duel/backgrounds/tga-card-goblin-duel-tabletop-scene-v0.1.png',
};

verifyEvidenceContracts();
if (process.argv.includes('--verify-contracts')) {
  console.log('H6.21B capture contracts passed: 2 stills, 8 recordings.');
  process.exit(0);
}

const captureRun = prepareCaptureRun({
  scriptDirectory: __dirname,
  gameId: 'level-04-card-goblin-duel',
  laneId: LANE_ID,
});

const consoleErrors = [];
const fixtureAssertions = [];
const review = {
  laneId: LANE_ID,
  sourceState: 'uncommitted H6.21B route-corrected presentation lab on committed H6.21A authority',
  humanReviewPassed: false,
  staticAlignment: [],
  motionRecordings: [],
  fixtureAssertions,
  routeEvidenceContracts,
  historicalEvidence,
  consoleResults: { errors: consoleErrors },
  accessibility: { cardInstances: 0, completeNames: 0 },
  protectedHashes: {},
};

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function attachDiagnostics(page, label) {
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(`${label}: ${message.text()}`);
  });
  page.on('pageerror', (error) => consoleErrors.push(`${label}: ${error.message}`));
}

function query(fixture, mode = 'full', guides = false) {
  const params = new URLSearchParams({ cardRig: fixture, motion: mode });
  if (guides) {
    params.set('cardGuides', '1');
    params.set('cardSlots', '1');
  }
  return `${URL}?${params.toString()}`;
}

async function waitForRigComplete(page, fixture, mode) {
  await page.locator('#duel-table').waitFor({ state: 'visible' });
  await page.waitForFunction(
    ({ expectedFixture, expectedMode }) => {
      const status = window.__cardRigLabStatus;
      return status?.fixtureId === expectedFixture
        && status.mode === expectedMode
        && status.status === 'complete';
    },
    { expectedFixture: fixture, expectedMode: mode },
  );
  return page.evaluate(() => ({
    status: window.__cardRigLabStatus,
    handStatus: document.querySelector('#hand')?.getAttribute('data-card-rig-status'),
  }));
}

async function collectMeasurements(page) {
  return page.evaluate(() => {
    const round = (value) => Math.round(value * 100) / 100;
    const rect = (element) => {
      const box = element.getBoundingClientRect();
      return {
        left: round(box.left),
        top: round(box.top),
        width: round(box.width),
        height: round(box.height),
        right: round(box.right),
        bottom: round(box.bottom),
        centerX: round(box.left + box.width / 2),
        centerY: round(box.top + box.height / 2),
      };
    };
    const cards = Array.from(document.querySelectorAll('.card-btn')).map((button) => {
      const title = button.querySelector('.card-title');
      const body = button.querySelector('.card-desc');
      const art = button.querySelector('.card-art-slot');
      return {
        name: button.getAttribute('data-card-name'),
        rigId: button.getAttribute('data-card-rig-id'),
        ariaLabel: button.getAttribute('aria-label'),
        disabled: button.disabled,
        exterior: rect(button),
        artRect: rect(art),
        titleRect: rect(title),
        bodyRect: rect(body),
        titleOverflow: {
          horizontal: title.scrollWidth - title.clientWidth,
          vertical: title.scrollHeight - title.clientHeight,
        },
        bodyOverflow: {
          horizontal: body.scrollWidth - body.clientWidth,
          vertical: body.scrollHeight - body.clientHeight,
        },
        optical: {
          title: getComputedStyle(button).getPropertyValue('--title-optical-y').trim(),
          body: getComputedStyle(button).getPropertyValue('--body-optical-y').trim(),
        },
        transient: {
          opacity: button.style.opacity,
          transform: button.style.transform,
          filter: button.style.filter,
          zIndex: button.style.zIndex,
          hidden: button.getAttribute('data-card-rig-hidden'),
        },
      };
    });
    const requiredRect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) throw new Error(`Missing route geometry selector: ${selector}`);
      return rect(element);
    };
    const routeGeometry = {
      draw: requiredRect('[data-stage-anchor="player-draw-origin"]'),
      played: requiredRect('[data-stage-anchor="played-card-target"]'),
      discard: requiredRect('[data-stage-anchor="player-discard-target"]'),
      topRail: requiredRect('.duel-top-rail'),
      handCenters: cards.map(({ exterior }) => ({
        centerX: exterior.centerX,
        centerY: exterior.centerY,
      })),
    };
    return {
      viewport: { width: innerWidth, height: innerHeight },
      documentOverflow: {
        horizontal: document.documentElement.scrollWidth - innerWidth,
        vertical: document.documentElement.scrollHeight - innerHeight,
      },
      cards,
      cardCount: cards.length,
      routeGeometry,
      gameplayAnchors: document.querySelectorAll('[data-academy-anchor^="hand-slot-"]').length,
      uniqueRigIds: new Set(cards.map((card) => card.rigId)).size,
      activeAnimations: document.getAnimations().length,
      bodyClass: document.body.className,
      playerHp: document.querySelector('#player-hp')?.textContent,
      enemyHp: document.querySelector('#enemy-hp')?.textContent,
    };
  });
}

async function measureOpticalAlignment(page) {
  const original = await page.evaluate(() => Array.from(document.querySelectorAll('.card-btn')).map((button) => ({
    title: button.style.getPropertyValue('--title-optical-y'),
    body: button.style.getPropertyValue('--body-optical-y'),
  })));
  await page.evaluate(() => {
    for (const button of document.querySelectorAll('.card-btn')) {
      button.style.setProperty('--title-optical-y', '0%');
      button.style.setProperty('--body-optical-y', '0%');
    }
  });
  const before = await collectMeasurements(page);
  await page.evaluate((values) => {
    Array.from(document.querySelectorAll('.card-btn')).forEach((button, index) => {
      button.style.setProperty('--title-optical-y', values[index].title);
      button.style.setProperty('--body-optical-y', values[index].body);
    });
  }, original);
  const after = await collectMeasurements(page);
  return {
    before,
    after,
    deltas: after.cards.map((card, index) => ({
      name: card.name,
      titleTop: Math.round((card.titleRect.top - before.cards[index].titleRect.top) * 100) / 100,
      bodyTop: Math.round((card.bodyRect.top - before.cards[index].bodyRect.top) * 100) / 100,
    })),
  };
}

function assertMeasurements(label, measurements, expectedCards) {
  if (measurements.cardCount !== expectedCards) {
    throw new Error(`${label}: expected ${expectedCards} cards, found ${measurements.cardCount}`);
  }
  if (measurements.gameplayAnchors !== 0 || measurements.uniqueRigIds !== expectedCards) {
    throw new Error(`${label}: fixture anchors or stable rig identities failed`);
  }
  if (measurements.documentOverflow.horizontal !== 0 || measurements.documentOverflow.vertical !== 0) {
    throw new Error(`${label}: document overflow detected`);
  }
  const geometry = measurements.routeGeometry;
  const invalidGeometry = geometry.handCenters.some(({ centerX, centerY }) =>
    geometry.draw.centerX >= centerX
      || geometry.discard.centerX <= centerX
      || geometry.played.centerY >= centerY)
    || Math.abs(geometry.played.centerX - geometry.topRail.centerX) > 2
    || [geometry.draw, geometry.played, geometry.discard]
      .some((anchor) => anchor.top < geometry.topRail.bottom);
  if (invalidGeometry) {
    throw new Error(`${label}: governed route geometry failed\n${JSON.stringify(geometry, null, 2)}`);
  }
  for (const card of measurements.cards) {
    if (!card.ariaLabel || card.titleOverflow.horizontal > 0 || card.titleOverflow.vertical > 0
      || card.bodyOverflow.horizontal > 0 || card.bodyOverflow.vertical > 0) {
      throw new Error(`${label}: accessibility or typography containment failed for ${card.name}`);
    }
  }
}

function assertRouteEvidence(fixture, finalStatus, measurements) {
  const fixtureId = Array.isArray(fixture) ? fixture.at(-1) : fixture;
  const expected = routeEvidenceContracts[fixtureId];
  if (!expected) return;
  const actual = finalStatus?.status?.routes;
  const compact = actual?.map(({ kind, card, fromAnchorId, toAnchorId }) => ({
    kind,
    card,
    from: fromAnchorId,
    to: toAnchorId,
  }));
  if (JSON.stringify(compact) !== JSON.stringify(expected)) {
    throw new Error(
      `${fixtureId}: semantic route evidence drifted\n`
      + `expected ${JSON.stringify(expected)}\nactual ${JSON.stringify(compact)}`,
    );
  }
  const forbidden = new Set(['deck', 'discard', 'enemy-card-origin', 'phase-banner']);
  if (compact.some(({ from, to }) => forbidden.has(from) || forbidden.has(to))) {
    throw new Error(`${fixtureId}: semantic route used forbidden generic or top-rail authority`);
  }
  const geometry = measurements.routeGeometry;
  const globalAnchors = {
    'player-draw-origin': geometry.draw,
    'played-card-target': geometry.played,
    'player-discard-target': geometry.discard,
  };
  const center = (box) => ({
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  });
  const mismatched = actual.find((route) => {
    const from = globalAnchors[route.fromAnchorId];
    const to = globalAnchors[route.toAnchorId];
    const start = center(route.startRect);
    const end = center(route.endRect);
    return (from && (Math.abs(start.x - from.centerX) > 2 || Math.abs(start.y - from.centerY) > 2))
      || (to && (Math.abs(end.x - to.centerX) > 2 || Math.abs(end.y - to.centerY) > 2));
  });
  if (mismatched) {
    throw new Error(
      `${fixtureId}: route telemetry does not touch its governed physical anchors\n`
      + JSON.stringify(mismatched, null, 2),
    );
  }
}

async function captureStatic(browser, contract) {
  const page = await browser.newPage({ viewport: contract.viewport });
  attachDiagnostics(page, contract.fixture);
  await page.goto(query(contract.fixture, 'full', true), { waitUntil: 'networkidle' });
  const status = await waitForRigComplete(page, contract.fixture, 'full');
  const alignment = await measureOpticalAlignment(page);
  assertMeasurements(contract.fixture, alignment.after, contract.expectedCards);
  const screenshotPath = captureRun.file('stills', contract.screenshot);
  await page.screenshot({ path: screenshotPath });
  review.staticAlignment.push({
    ...contract,
    screenshotPath: path.posix.join('stills', contract.screenshot),
    status,
    measurements: alignment,
  });
  review.accessibility.cardInstances += alignment.after.cardCount;
  review.accessibility.completeNames += alignment.after.cards.filter((card) => card.ariaLabel).length;
  await page.close();
}

async function finalizeVideo(page, context, targetPath) {
  const video = page.video();
  await page.close();
  await context.close();
  if (!video) throw new Error('Playwright did not create the requested motion recording.');
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
  const fixtures = Array.isArray(contract.fixture) ? contract.fixture : [contract.fixture];
  let finalStatus;

  for (const fixture of fixtures) {
    await page.goto(query(fixture, contract.mode), { waitUntil: 'networkidle' });
    finalStatus = await waitForRigComplete(page, fixture, contract.mode);
    await page.waitForTimeout(300);
  }

  if (contract.fixture === 'terminal-lock') {
    await page.locator('#reset-duel').evaluate((button) => button.click());
    finalStatus = await waitForRigComplete(page, 'terminal-lock', contract.mode);
    await page.waitForTimeout(300);
  }

  if (contract.fixture === 'reset-during-commitment') {
    await page.goto(query('reset-during-commitment', contract.mode), { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__cardRigLabStatus?.status === 'running'
      && window.__cardRigLabStatus.cues.includes('commit'));
    await page.locator('#reset-duel').evaluate((button) => button.click());
    await page.waitForFunction(() => window.__cardRigLabStatus?.events.includes('cancel:reset'));
    finalStatus = await waitForRigComplete(page, 'reset-during-commitment', contract.mode);
    await page.waitForTimeout(300);
  }

  const measurements = await collectMeasurements(page);
  assertMeasurements(contract.recording, measurements, contract.expectedCards);
  assertRouteEvidence(contract.fixture, finalStatus, measurements);
  if (contract.fixture === 'terminal-lock'
    && (measurements.cards.filter((card) => card.disabled).length !== 2
      || measurements.cards.some((card) => !card.ariaLabel?.startsWith('Locked ')))) {
    throw new Error('terminal lock fixture did not finish with two complete locked cards');
  }
  if (contract.fixture === 'reset-during-commitment'
    && (measurements.activeAnimations !== 0
      || measurements.cards.some((card) => Object.values(card.transient).some(Boolean)))) {
    throw new Error('reset cancellation left CardRig animation residue');
  }

  const assertion = {
    fixture: contract.fixture,
    mode: contract.mode,
    recording: contract.recording,
    finalStatus,
    measurements,
  };
  fixtureAssertions.push(assertion);
  review.motionRecordings.push({
    ...contract,
    recordingPath: path.posix.join('recordings', contract.recording),
    finalStatus,
    cardCount: measurements.cardCount,
    gameplayAnchors: measurements.gameplayAnchors,
  });
  review.accessibility.cardInstances += measurements.cardCount;
  review.accessibility.completeNames += measurements.cards.filter((card) => card.ariaLabel).length;
  await finalizeVideo(page, context, targetPath);
}

function persistReview() {
  const measurements = {
    staticAlignment: review.staticAlignment.map((entry) => ({
      fixture: entry.fixture,
      viewport: entry.viewport,
      measurements: entry.measurements,
    })),
    motionFinalStates: fixtureAssertions.map((entry) => ({
      fixture: entry.fixture,
      mode: entry.mode,
      measurements: entry.measurements,
    })),
  };
  fs.writeFileSync(
    captureRun.file('root', 'measurements.json'),
    JSON.stringify(measurements, null, 2) + '\n',
  );
  fs.writeFileSync(
    captureRun.file('root', 'fixture-assertions.json'),
    JSON.stringify(fixtureAssertions, null, 2) + '\n',
  );
  fs.writeFileSync(
    captureRun.file('root', 'console-results.json'),
    JSON.stringify(review.consoleResults, null, 2) + '\n',
  );
  fs.writeFileSync(
    captureRun.file('root', 'technical-review.json'),
    JSON.stringify(review, null, 2) + '\n',
  );
}

(async () => {
  const browser = await chromium.launch();
  try {
    for (const contract of staticContracts) await captureStatic(browser, contract);
    for (const contract of motionContracts) await recordMotion(browser, contract);

    if (consoleErrors.length > 0) {
      throw new Error('Browser console errors: ' + consoleErrors.join(' | '));
    }
    if (review.accessibility.cardInstances !== review.accessibility.completeNames) {
      throw new Error('One or more CardRig cards lack a complete accessible name.');
    }

    for (const [name, relativePath] of Object.entries(protectedAssets)) {
      review.protectedHashes[name] = sha256(path.join(captureRun.repoRoot, relativePath));
    }
    persistReview();

    const finalized = finalizeCaptureRun(captureRun, {
      captureScript: 'games/tier-1/04-card-goblin-duel/capture-h621b.cjs',
      captureScriptVersion: 'h6.21b-route-correction',
      captureConfiguration: {
        listenerHost: '127.0.0.1',
        listenerPort: 5175,
        browser: 'chromium',
        staticContracts,
        motionContracts,
        routeEvidenceContracts,
        fixtureAssertions: 'fixture-assertions.json',
        historicalEvidence,
        sourceWorktree: 'uncommitted H6.21B route-corrected presentation lab',
      },
    });

    console.log('External evidence: ' + captureRun.runDir);
    console.log('Portable manifest: ' + finalized.portableManifestPath);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
