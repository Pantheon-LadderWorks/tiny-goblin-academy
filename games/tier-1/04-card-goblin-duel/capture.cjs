'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const {
  FIXTURE_CONTRACTS,
  validateFixtureContracts,
} = require('./capture-contracts.cjs');
const {
  finalizeCaptureRun,
  prepareCaptureRun,
} = require('../../../tools/evidence/capture-run.cjs');

const URL = 'http://127.0.0.1:5175/';
const HUB_DEFAULT_RUNTIME = { width: 1280, height: 660 };
const HUB_MINIMUM_RUNTIME = { width: 1024, height: 580 };
const ABORTED_EVIDENCE_PATH = 'D:\\Projects\\Active\\Tiny-Goblin-Academy\\Evidence\\level-04-card-goblin-duel\\h6-21a-five-face-card-surface-lab\\capture-20260722t203953z-p16492';
const REPLACEMENT_ONE_EVIDENCE_PATH = 'D:\\Projects\\Active\\Tiny-Goblin-Academy\\Evidence\\level-04-card-goblin-duel\\h6-21a-five-face-card-surface-lab-replacement-1\\capture-20260722t220421z-p9736';
const REPLACEMENT_TWO_EVIDENCE_PATH = 'D:\\Projects\\Active\\Tiny-Goblin-Academy\\Evidence\\level-04-card-goblin-duel\\h6-21a-five-face-card-surface-lab-replacement-2\\capture-20260722t222241z-p2784';

function countPayloadFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).reduce(
    (count, entry) => count + (entry.isDirectory()
      ? countPayloadFiles(path.join(directory, entry.name))
      : 1),
    0,
  );
}

if (!fs.existsSync(ABORTED_EVIDENCE_PATH)) {
  throw new Error('The preserved H6.21A aborted evidence directory is missing.');
}
const abortedPayloadFileCount = countPayloadFiles(ABORTED_EVIDENCE_PATH);
if (abortedPayloadFileCount !== 0) {
  throw new Error('The preserved H6.21A aborted evidence directory now contains payload files.');
}
for (const [evidencePath, expectedFiles, label] of [
  [REPLACEMENT_ONE_EVIDENCE_PATH, 5, 'replacement-1'],
  [REPLACEMENT_TWO_EVIDENCE_PATH, 6, 'replacement-2'],
]) {
  if (!fs.existsSync(evidencePath)) {
    throw new Error(`The preserved H6.21A ${label} evidence directory is missing.`);
  }
  if (countPayloadFiles(evidencePath) !== expectedFiles) {
    throw new Error(`The preserved H6.21A ${label} evidence directory no longer contains exactly ${expectedFiles} payload files.`);
  }
}
const replacementOnePayloadFileCount = countPayloadFiles(REPLACEMENT_ONE_EVIDENCE_PATH);
const replacementTwoPayloadFileCount = countPayloadFiles(REPLACEMENT_TWO_EVIDENCE_PATH);
const DESCRIPTIONS = {
  Strike: 'Deal 2 damage.',
  Guard: 'Reduce next enemy damage by 2.',
  Mend: 'Heal 2 HP.',
  Spark: 'Deal 1 damage and replace one card.',
  Stun: 'Prevent the next enemy attack once.',
  'Heavy Bonk': 'Deal 4 damage; skip next draw.',
};
const FACE_MAP = {
  Strike: 'blank-parchment',
  Guard: 'teal-banner',
  Mend: 'green-banner',
  Spark: 'teal-edged-tan',
  Stun: 'teal-banner',
  'Heavy Bonk': 'tan-banner',
};
const TOKEN_MAP = {
  Strike: 'sword-icon',
  Guard: 'shield-icon',
  Mend: 'heart-plus-icon',
  Spark: 'projectile-star-effect',
  Stun: 'star-cluster-effect',
  'Heavy Bonk': 'club-weapon-icon',
};

const fixtureContracts = validateFixtureContracts();
const fixtureById = Object.fromEntries(fixtureContracts.map((fixture) => [fixture.id, fixture]));

const captureRun = prepareCaptureRun({
  scriptDirectory: __dirname,
  gameId: 'level-04-card-goblin-duel',
  laneId: 'h6-21a-five-face-card-surface-lab-replacement-3',
});

const consoleErrors = [];
const review = {
  laneId: 'h6-21a-five-face-card-surface-lab-replacement-3',
  states: [],
  agentReviewPassed: false,
  humanReviewPassed: false,
  abortedEvidence: {
    path: ABORTED_EVIDENCE_PATH,
    classification: 'aborted capture initialization',
    payloadFileCount: abortedPayloadFileCount,
    initializedEmptyDirectories: ['stills', 'recordings', 'originals'],
    preserved: true,
  },
  historicalAttempts: [
    {
      path: REPLACEMENT_ONE_EVIDENCE_PATH,
      classification: 'partial evidence',
      payloadFileCount: replacementOnePayloadFileCount,
      completedFixtures: [1, 2, 3, 4, 5],
      stoppedBeforeFixture: 6,
      preserved: true,
    },
    {
      path: REPLACEMENT_TWO_EVIDENCE_PATH,
      classification: 'partial evidence',
      payloadFileCount: replacementTwoPayloadFileCount,
      completedFixtures: [1, 2, 3, 4, 5, 6],
      stoppedBeforeFixture: 7,
      preserved: true,
    },
  ],
  fixtureContracts,
  supportedAuthority: {
    tauriDefaultWindow: { width: 1280, height: 720 },
    tauriMinimumWindow: { width: 1024, height: 640 },
    runtimeSurfaces: [HUB_DEFAULT_RUNTIME, HUB_MINIMUM_RUNTIME],
    belowMinimumLayoutsDesignedOrClaimed: false,
  },
  strategyA: {
    id: 'strategy-a-clean-interior',
    rasterTokens: false,
    placeholderGlyphs: false,
  },
  strategyB: {
    id: 'strategy-b-mapped-tokens',
    tokenSheet: 'assets/academy/games/card-goblin-duel/derived/tga-card-goblin-duel-ui-tokens-cleaned-v0.1.png',
    tokenMap: TOKEN_MAP,
  },
  sparkCandidateDecision: {
    selected: 'projectile-star-effect',
    selectedSourceRect: { x: 386, y: 2, w: 124, h: 124 },
    rejected: 'lightning-energy-badge',
    rejectedSourceRect: { x: 256, y: 128, w: 128, h: 192 },
    reason: 'The compact projectile star fits the bounded art slot with the same visual grammar as the other five action tokens; the tall lightning badge reads as a precomposed badge and would require greater scale reduction.',
  },
  frameCrops: {
    'blank-parchment': { x: 4, y: 27, w: 123, h: 170 },
    'green-banner': { x: 132, y: 27, w: 123, h: 170 },
    'teal-banner': { x: 259, y: 27, w: 123, h: 170 },
    'tan-banner': { x: 386, y: 27, w: 124, h: 170 },
    'teal-edged-tan': { x: 514, y: 27, w: 123, h: 170 },
  },
  ledgerBridge: null,
  consoleErrors,
};

const card = (page, name) => page.locator('.card-btn', { hasText: name }).first();

async function clickCard(page, name) {
  const target = card(page, name);
  await target.waitFor({ state: 'visible' });
  await target.click();
  await page.waitForTimeout(120);
}

async function containmentMetrics(page) {
  return page.evaluate(() => {
    const rectFrom = (element) => {
      if (!element) return null;
      const bounds = element.getBoundingClientRect();
      return {
        x: bounds.x,
        y: bounds.y,
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
        right: bounds.right,
        bottom: bounds.bottom,
      };
    };
    const rect = (selector) => rectFrom(document.querySelector(selector));
    const fit = (element) => !element || {
      clientWidth: element.clientWidth,
      clientHeight: element.clientHeight,
      scrollWidth: element.scrollWidth,
      scrollHeight: element.scrollHeight,
      fits: element.scrollWidth <= element.clientWidth + 0.5
        && element.scrollHeight <= element.clientHeight + 0.5,
    };
    const style = (element) => {
      if (!element) return null;
      const computed = getComputedStyle(element);
      return {
        overflow: computed.overflow,
        textOverflow: computed.textOverflow,
        whiteSpace: computed.whiteSpace,
        imageRendering: computed.imageRendering,
      };
    };

    return {
      viewport: { width: innerWidth, height: innerHeight },
      document: {
        clientWidth: document.documentElement.clientWidth,
        clientHeight: document.documentElement.clientHeight,
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
      },
      bodyClass: document.body.className,
      playerHp: document.querySelector('#player-hp')?.textContent?.trim() || '',
      enemyHp: document.querySelector('#enemy-hp')?.textContent?.trim() || '',
      terminalMessage: document.querySelector('#terminal-message')?.textContent?.trim() || '',
      app: rect('#app'),
      table: rect('#duel-table'),
      topRail: rect('.duel-top-rail'),
      tabletop: rect('.tabletop-scene'),
      hand: rect('.hand-zone'),
      resolutionCopy: rect('.resolution-copy'),
      emblem: rect('.academy-seal'),
      terminal: rect('#terminal-outcome:not([hidden])'),
      reset: rect('#reset-duel:not([hidden])'),
      cards: [...document.querySelectorAll('.card-btn')].map((element) => {
        const bounds = element.getBoundingClientRect();
        const tabletopBounds = document.querySelector('.tabletop-scene')?.getBoundingClientRect();
        const dockBounds = document.querySelector('.hand-zone')?.getBoundingClientRect();
        const art = element.querySelector('.card-art-slot');
        const title = element.querySelector('.card-title');
        const body = element.querySelector('.card-desc');
        const token = element.querySelector('.card-token');
        const badge = element.querySelector('.card-state');
        const tokenSourceWidth = Number(token?.getAttribute('data-token-source-width') || 0);
        const tokenSourceHeight = Number(token?.getAttribute('data-token-source-height') || 0);
        const tokenRect = rectFrom(token);
        const tabletopOverlapPixels = tabletopBounds
          ? Math.max(0, Math.min(bounds.bottom, tabletopBounds.bottom) - Math.max(bounds.top, tabletopBounds.top))
          : 0;
        const dockContainmentPixels = dockBounds
          ? Math.max(0, Math.min(bounds.bottom, dockBounds.bottom) - Math.max(bounds.top, dockBounds.top))
          : 0;
        return {
          name: element.getAttribute('data-card-name'),
          frame: element.getAttribute('data-card-frame'),
          strategy: element.getAttribute('data-card-strategy'),
          semanticRole: element.getAttribute('data-semantic-role'),
          accessibleLabel: element.getAttribute('aria-label'),
          gameplayAnchor: element.getAttribute('data-stage-anchor'),
          frameSourceRect: element.getAttribute('data-frame-source-rect'),
          left: bounds.left,
          top: bounds.top,
          width: bounds.width,
          height: bounds.height,
          right: bounds.right,
          bottom: bounds.bottom,
          tabletopOverlapPixels,
          tabletopOverlapRatio: tabletopOverlapPixels / bounds.height,
          dockContainmentPixels,
          dockContainmentRatio: dockContainmentPixels / bounds.height,
          focused: element === document.activeElement,
          nativeWidth: Number(element.getAttribute('data-native-width')),
          nativeHeight: Number(element.getAttribute('data-native-height')),
          frameScaleFactor: {
            x: bounds.width / Number(element.getAttribute('data-native-width')),
            y: bounds.height / Number(element.getAttribute('data-native-height')),
          },
          artRect: rectFrom(art),
          titleRect: rectFrom(title),
          bodyRect: rectFrom(body),
          stateBadgeRect: rectFrom(badge),
          titleText: title?.textContent?.trim() || '',
          bodyText: body?.textContent?.trim() || '',
          stateBadgeText: badge?.textContent?.trim() || '',
          titleFit: fit(title),
          bodyFit: fit(body),
          stateBadgeFit: fit(badge),
          titleStyle: style(title),
          bodyStyle: style(body),
          token: token ? {
            id: token.getAttribute('data-card-token'),
            sourceRect: {
              x: Number(token.getAttribute('data-token-source-x')),
              y: Number(token.getAttribute('data-token-source-y')),
              w: tokenSourceWidth,
              h: tokenSourceHeight,
            },
            displayedRect: tokenRect,
            tokenScaleFactor: {
              x: tokenRect.width / tokenSourceWidth,
              y: tokenRect.height / tokenSourceHeight,
            },
            imageRendering: getComputedStyle(token).imageRendering,
          } : null,
          disabled: element.disabled,
        };
      }),
    };
  });
}

function assertContained(metrics, fixture) {
  const failures = [];
  const label = fixture.screenshotName;
  const intersects = (left, right) => left && right
    && left.left < right.right && left.right > right.left
    && left.top < right.bottom && left.bottom > right.top;
  const stateLabels = metrics.cards.map((cardMetrics) => cardMetrics.stateBadgeText);
  const gameplayAnchorCount = metrics.cards.filter((cardMetrics) => cardMetrics.gameplayAnchor).length;

  if (!metrics.bodyClass.split(/\s+/).includes(fixture.phaseClass)) failures.push(`expected phase ${fixture.phase}`);
  if (metrics.cards.length !== fixture.cardCount) failures.push(`expected ${fixture.cardCount} cards, found ${metrics.cards.length}`);
  if (stateLabels.length !== fixture.stateLabelCount
    || stateLabels.some((stateLabel) => stateLabel !== fixture.stateLabel)) {
    failures.push(`expected ${fixture.stateLabelCount} complete ${fixture.stateLabel} state labels`);
  }
  if (gameplayAnchorCount !== fixture.gameplayAnchorCount) {
    failures.push(`expected ${fixture.gameplayAnchorCount} gameplay anchors, found ${gameplayAnchorCount}`);
  }
  if (metrics.bodyClass.split(/\s+/).includes('card-slot-debug') !== fixture.slotDebug) {
    failures.push('slot-debug activation does not match the explicit fixture contract');
  }
  if (fixture.phase === 'Terminal') {
    if (metrics.cards.some((cardMetrics) => !cardMetrics.disabled)) failures.push('terminal card remains actionable');
    if (!metrics.reset) failures.push('Reset Duel is unavailable');
    if (!metrics.terminal || !metrics.terminalMessage) failures.push('terminal result message is unavailable');
  }

  if (metrics.document.scrollWidth > metrics.document.clientWidth) failures.push('horizontal document overflow');
  if (metrics.document.scrollHeight > metrics.document.clientHeight) failures.push('vertical document overflow');
  if (metrics.topRail && metrics.tabletop && metrics.topRail.bottom > metrics.tabletop.top + 0.5) {
    failures.push('top status rail overlaps the tabletop artwork');
  }
  if (metrics.tabletop && metrics.hand && Math.abs(metrics.tabletop.bottom - metrics.hand.top) > 0.5) {
    failures.push('tabletop and hand dock have a visible geometry seam');
  }
  for (const [name, bounds] of [['table', metrics.table], ['hand', metrics.hand], ['reset', metrics.reset]]) {
    if (!bounds) continue;
    if (bounds.left < 0 || bounds.top < 0 || bounds.right > metrics.viewport.width || bounds.bottom > metrics.viewport.height) {
      failures.push(name + ' leaves the runtime surface');
    }
  }

  for (const bounds of metrics.cards) {
    const cardName = bounds.name || 'unknown';
    if (!bounds.artRect || !bounds.titleRect || !bounds.bodyRect) {
      failures.push('card ' + cardName + ' is missing an expected art, title, or body rectangle');
    }
    if (bounds.left < 0 || bounds.top < 0 || bounds.right > metrics.viewport.width || bounds.bottom > metrics.viewport.height) {
      failures.push('card ' + cardName + ' leaves the runtime surface');
    }
    if (metrics.table && (bounds.left < metrics.table.left || bounds.top < metrics.table.top || bounds.right > metrics.table.right || bounds.bottom > metrics.table.bottom)) {
      failures.push('card ' + cardName + ' leaves the tabletop');
    }
    if (FACE_MAP[cardName] !== bounds.frame) failures.push('card ' + cardName + ' uses wrong face');
    if (bounds.bodyText !== DESCRIPTIONS[cardName]) failures.push('card ' + cardName + ' body copy is incomplete');
    if (!bounds.accessibleLabel?.includes(bounds.bodyText)) failures.push('card ' + cardName + ' accessible label is incomplete');
    if (!bounds.titleFit?.fits || !bounds.bodyFit?.fits) failures.push('card ' + cardName + ' runtime text overflows its mapped slot');
    if (bounds.titleStyle?.textOverflow === 'ellipsis' || bounds.bodyStyle?.textOverflow === 'ellipsis') {
      failures.push('card ' + cardName + ' uses ellipsis');
    }
    if (bounds.titleStyle?.overflow === 'hidden' || bounds.bodyStyle?.overflow === 'hidden') {
      failures.push('card ' + cardName + ' hides text overflow');
    }
    if (!bounds.stateBadgeFit?.fits || !['Play', 'Replace', 'Locked'].includes(bounds.stateBadgeText)) {
      failures.push('card ' + cardName + ' stateBadgeFits=false');
    }
    if (intersects(bounds.artRect, bounds.titleRect)
      || intersects(bounds.artRect, bounds.bodyRect)
      || intersects(bounds.titleRect, bounds.bodyRect)) {
      failures.push('card ' + cardName + ' slot rectangles intersect');
    }
    if (intersects(bounds.stateBadgeRect, bounds.artRect)
      || intersects(bounds.stateBadgeRect, bounds.titleRect)
      || intersects(bounds.stateBadgeRect, bounds.bodyRect)) {
      failures.push('card ' + cardName + ' state badge intersects content');
    }
    if (metrics.resolutionCopy && intersects(bounds, metrics.resolutionCopy)) failures.push('card ' + cardName + ' blocks the protected result corridor');
    if (metrics.terminal && intersects(bounds, metrics.terminal)) failures.push('card ' + cardName + ' blocks the protected result corridor');
    if (bounds.focused && bounds.tabletopOverlapRatio > 0.35 + Number.EPSILON) {
      failures.push('focused card exceeds 35% tabletop exposure: ' + cardName);
    }
    if (!bounds.focused && bounds.tabletopOverlapRatio > 0.30 + Number.EPSILON) {
      failures.push('resting card exceeds 30% tabletop exposure: ' + cardName);
    }
    if (!bounds.focused && bounds.tabletopOverlapRatio < 0.20 - Number.EPSILON) {
      failures.push('resting card misses the 20% tabletop exposure floor: ' + cardName);
    }
    if (!bounds.focused && bounds.dockContainmentRatio < 0.70 - Number.EPSILON) {
      failures.push('resting card keeps less than 70% inside the dock: ' + cardName);
    }
    if (bounds.width < 138 - 0.5 || bounds.width > 156 + 0.5) failures.push('card ' + cardName + ' exterior width drifted');

    if (bounds.strategy !== fixture.strategy) failures.push('card ' + cardName + ' uses wrong strategy');
    if (fixture.strategy === 'clean' && bounds.token) failures.push('Strategy A rendered a raster token for ' + cardName);
    if (fixture.strategy === 'tokens') {
      if (!bounds.token || bounds.token.id !== TOKEN_MAP[cardName]) failures.push('Strategy B token mismatch for ' + cardName);
      if (bounds.token) {
        if (!bounds.artRect
          || bounds.token.displayedRect.left < bounds.artRect.left - 0.5
          || bounds.token.displayedRect.top < bounds.artRect.top - 0.5
          || bounds.token.displayedRect.right > bounds.artRect.right + 0.5
          || bounds.token.displayedRect.bottom > bounds.artRect.bottom + 0.5) {
          failures.push('token leaves art rectangle for ' + cardName);
        }
        const sourceRatio = bounds.token.sourceRect.w / bounds.token.sourceRect.h;
        const displayedRatio = bounds.token.displayedRect.width / bounds.token.displayedRect.height;
        if (Math.abs(sourceRatio - displayedRatio) > 0.02) failures.push('token aspect ratio changed for ' + cardName);
      }
    }
  }

  if (failures.length > 0) throw new Error(label + ' containment failed: ' + failures.join(' | '));
}

async function capture(page, fixture, metadata = {}, verifyContainment = () => {}) {
  const containment = await containmentMetrics(page);
  assertContained(containment, fixture);
  verifyContainment(containment);
  const screenshotPath = captureRun.file('stills', fixture.screenshotName + '.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  review.states.push({
    name: fixture.screenshotName,
    fixtureId: fixture.id,
    phase: fixture.phase,
    measurementRequired: fixture.measurementRequired,
    containment,
    ...metadata,
  });
  return containment;
}

async function openPage(browser, viewport = HUB_DEFAULT_RUNTIME, suffix = '') {
  const page = await browser.newPage({ viewport });
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  await page.goto(URL + suffix, { waitUntil: 'networkidle' });
  await page.locator('#duel-table').waitFor({ state: 'visible' });
  await page.waitForFunction(() => {
    const status = document.querySelector('#anchor-status')?.textContent || '';
    return status.includes('presentation anchors resolved');
  });
  return page;
}

async function captureSurfaceStrategies(browser) {
  const cleanFixture = fixtureById['01'];
  const clean = await openPage(browser, HUB_DEFAULT_RUNTIME, cleanFixture.query);
  await capture(clean, cleanFixture, { fixture: 'all-six-cards' });
  await clean.close();

  const tokensFixture = fixtureById['02'];
  const tokens = await openPage(browser, HUB_DEFAULT_RUNTIME, tokensFixture.query);
  const strategyBReference = await capture(tokens, tokensFixture, { fixture: 'all-six-cards' });
  await tokens.close();
  return strategyBReference;
}

async function captureOrdinaryLayouts(browser) {
  const normalFixture = fixtureById['03'];
  const normal = await openPage(browser, HUB_DEFAULT_RUNTIME, normalFixture.query);
  await capture(normal, normalFixture, { fixture: 'ordinary-three-card-hand' });
  await normal.close();

  const minimumFixture = fixtureById['04'];
  const minimum = await openPage(browser, HUB_MINIMUM_RUNTIME, minimumFixture.query);
  await capture(minimum, minimumFixture, {
    fixture: 'ordinary-three-card-hand',
    authority: 'Tauri minimum runtime content area',
  });
  await minimum.close();
}

async function captureFocusAndSpark(browser) {
  const focusFixture = fixtureById['05'];
  const focus = await openPage(browser, HUB_DEFAULT_RUNTIME, focusFixture.query);
  await card(focus, 'Heavy Bonk').focus();
  await capture(focus, focusFixture, {
    focusedCard: await focus.locator(':focus').getAttribute('data-card-name'),
  });
  await focus.close();

  const sparkFixture = fixtureById['06'];
  const spark = await openPage(browser, HUB_DEFAULT_RUNTIME, sparkFixture.query);
  await clickCard(spark, 'Guard');
  await clickCard(spark, 'Spark');
  await capture(spark, sparkFixture, {
    bodyClass: await spark.locator('body').getAttribute('class'),
    badges: await spark.locator('.card-state').allTextContents(),
  });
  await spark.close();
}

async function captureTerminalAndSlots(browser, strategyBReference) {
  const terminalFixture = fixtureById['07'];
  const terminal = await openPage(browser, HUB_DEFAULT_RUNTIME, terminalFixture.query);
  for (const name of ['Guard', 'Spark', 'Mend', 'Heavy Bonk', 'Stun', 'Strike', 'Spark', 'Mend', 'Stun', 'Heavy Bonk']) {
    await clickCard(terminal, name);
  }
  await terminal.locator('#terminal-outcome:not([hidden])').waitFor();
  await capture(terminal, terminalFixture, {
    outcome: await terminal.locator('#terminal-message').textContent(),
    disabledCards: await terminal.locator('.card-btn:disabled').count(),
    resetVisible: await terminal.locator('#reset-duel').isVisible(),
  });
  await terminal.close();

  const slotsFixture = fixtureById['08'];
  const slots = await openPage(browser, HUB_DEFAULT_RUNTIME, slotsFixture.query);
  await capture(slots, slotsFixture, {
    bodyClass: await slots.locator('body').getAttribute('class'),
  }, (slotMetrics) => {
    const referenceByName = Object.fromEntries(strategyBReference.cards.map((cardMetrics) => [cardMetrics.name, cardMetrics]));
    for (const cardMetrics of slotMetrics.cards) {
      const reference = referenceByName[cardMetrics.name];
      for (const key of ['left', 'top', 'width', 'height']) {
        if (!reference || Math.abs(cardMetrics[key] - reference[key]) > 0.5) {
          throw new Error(`08-slot-debug-overlay changed ${cardMetrics.name} exterior ${key}`);
        }
      }
    }
    if (slotMetrics.playerHp !== strategyBReference.playerHp || slotMetrics.enemyHp !== strategyBReference.enemyHp) {
      throw new Error('08-slot-debug-overlay altered deterministic simulation state');
    }
  });
  await slots.close();
}

async function verifyLedgerBridge(browser) {
  const page = await browser.newPage({ viewport: HUB_DEFAULT_RUNTIME });
  await page.setContent(
    '<!doctype html><html><body style="margin:0">'
    + '<iframe id="game" src="' + URL + '" style="width:100vw;height:100vh;border:0"></iframe>'
    + '<script>window.__academyLedgerMessages=[];window.addEventListener("message",(event)=>{'
    + 'if(typeof event.data?.type==="string"&&event.data.type.startsWith("tga:ledger-"))'
    + 'window.__academyLedgerMessages.push(event.data);});</script></body></html>',
  );
  const frame = page.frames().find((candidate) => candidate.url().startsWith(URL));
  if (!frame) throw new Error('Ledger bridge iframe failed to load.');
  await frame.locator('#duel-table').waitFor({ state: 'visible' });
  await frame.waitForFunction(() => (document.querySelector('#anchor-status')?.textContent || '').includes('presentation anchors resolved'));
  await frame.locator('.card-btn', { hasText: 'Guard' }).first().click();
  await page.waitForFunction(() => window.__academyLedgerMessages.some((message) => message.type === 'tga:ledger-event'));
  await page.evaluate(() => {
    document.querySelector('#game').contentWindow.postMessage({
      type: 'tga:ledger-request-snapshot',
      gameId: 'tga-04',
    }, '*');
  });
  await page.waitForFunction(() => window.__academyLedgerMessages.filter((message) => message.type === 'tga:ledger-snapshot').length >= 2);
  const messages = await page.evaluate(() => window.__academyLedgerMessages);
  const snapshots = messages.filter((message) => message.type === 'tga:ledger-snapshot');
  const events = messages.filter((message) => message.type === 'tga:ledger-event').map((message) => message.event);
  const latestSnapshot = snapshots.at(-1);
  if (!latestSnapshot || latestSnapshot.gameId !== 'tga-04' || events.length === 0 || latestSnapshot.events.length < events.length) {
    throw new Error('Ledger snapshot handshake did not preserve event authority.');
  }
  review.ledgerBridge = {
    gameId: latestSnapshot.gameId,
    runId: latestSnapshot.runId,
    eventMessages: events.length,
    snapshotMessages: snapshots.length,
    snapshotSequences: latestSnapshot.events.map((event) => event.sequence),
    snapshotKinds: latestSnapshot.events.map((event) => event.kind),
  };
  await page.close();
}

(async () => {
  const browser = await chromium.launch();
  try {
    const strategyBReference = await captureSurfaceStrategies(browser);
    await captureOrdinaryLayouts(browser);
    await captureFocusAndSpark(browser);
    await captureTerminalAndSlots(browser, strategyBReference);
    await verifyLedgerBridge(browser);

    const completedNames = review.states.map((stateReview) => stateReview.name);
    const expectedNames = fixtureContracts.map((fixture) => fixture.screenshotName);
    if (JSON.stringify(completedNames) !== JSON.stringify(expectedNames)
      || review.states.some((stateReview) => !stateReview.measurementRequired || !stateReview.containment)) {
      throw new Error('The complete eight-fixture measurement set did not finalize in contract order.');
    }
    if (consoleErrors.length > 0) throw new Error('Browser errors: ' + consoleErrors.join(' | '));

    fs.writeFileSync(
      captureRun.file('root', 'technical-review.json'),
      JSON.stringify(review, null, 2) + '\n',
      'utf8',
    );

    const finalized = finalizeCaptureRun(captureRun, {
      captureScript: 'games/tier-1/04-card-goblin-duel/capture.cjs',
      captureScriptVersion: 'h6.21a',
      captureConfiguration: {
        listenerHost: '127.0.0.1',
        listenerPort: 5175,
        browser: 'chromium',
        supportedRuntimeSurfaces: [HUB_DEFAULT_RUNTIME, HUB_MINIMUM_RUNTIME],
        fixtureQueries: [...new Set(fixtureContracts.map((fixture) => fixture.query).filter(Boolean))],
        fixtureContracts,
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
