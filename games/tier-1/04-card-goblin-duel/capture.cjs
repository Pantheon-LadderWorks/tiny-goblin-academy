'use strict';

const fs = require('node:fs');
const { chromium } = require('playwright');
const {
  finalizeCaptureRun,
  prepareCaptureRun,
} = require('../../../tools/evidence/capture-run.cjs');

const URL = 'http://127.0.0.1:5175/';
const HUB_DEFAULT_RUNTIME = { width: 1280, height: 660 };
const HUB_MINIMUM_RUNTIME = { width: 1024, height: 580 };

const captureRun = prepareCaptureRun({
  scriptDirectory: __dirname,
  gameId: 'level-04-card-goblin-duel',
  laneId: 'h6-20e-tabletop-dock-correction',
});

const consoleErrors = [];
const review = {
  states: [],
  supportedAuthority: {
    tauriDefaultWindow: { width: 1280, height: 720 },
    tauriMinimumWindow: { width: 1024, height: 640 },
    runtimeSurfaces: [HUB_DEFAULT_RUNTIME, HUB_MINIMUM_RUNTIME],
    belowMinimumLayoutsDesignedOrClaimed: false,
  },
  consoleErrors,
  debugMarkersExplicitOnly: true,
  cardFrameScaling: {
    sourceSheet: 'assets/academy/games/card-goblin-duel/derived/tga-card-goblin-duel-card-frames-cleaned-v0.1.png',
    selectedNativeCrops: {
      'green-banner': { width: 123, height: 170 },
      'teal-banner': { width: 123, height: 170 },
      'tan-banner': { width: 124, height: 170 },
    },
    imageRendering: 'auto',
    states: [],
    assessment: 'Bounded CSS upscaling is expected to soften raster ornament slightly; runtime DOM text and focus chrome remain resolution-independent. Human visual review determines whether higher-resolution frame crops are required.',
  },
  ledgerBridge: null,
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
    const rect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const bounds = element.getBoundingClientRect();
      return {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        right: bounds.right,
        bottom: bounds.bottom,
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
      app: rect('#app'),
      masthead: rect('.academy-header'),
      table: rect('#duel-table'),
      topRail: rect('.duel-top-rail'),
      tabletop: rect('.tabletop-scene'),
      hand: rect('.hand-zone'),
      resolutionCopy: rect('.resolution-copy'),
      terminal: rect('#terminal-outcome:not([hidden])'),
      reset: rect('#reset-duel:not([hidden])'),
      cards: [...document.querySelectorAll('.card-btn')].map((element) => {
        const bounds = element.getBoundingClientRect();
        const tabletopBounds = document.querySelector('.tabletop-scene')?.getBoundingClientRect();
        const dockBounds = document.querySelector('.hand-zone')?.getBoundingClientRect();
        const tabletopOverlapPixels = tabletopBounds
          ? Math.max(0, Math.min(bounds.bottom, tabletopBounds.bottom) - Math.max(bounds.top, tabletopBounds.top))
          : 0;
        const dockContainmentPixels = dockBounds
          ? Math.max(0, Math.min(bounds.bottom, dockBounds.bottom) - Math.max(bounds.top, dockBounds.top))
          : 0;
        return {
          name: element.getAttribute('data-card-name'),
          frame: element.getAttribute('data-card-frame'),
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
          scaleX: bounds.width / Number(element.getAttribute('data-native-width')),
          scaleY: bounds.height / Number(element.getAttribute('data-native-height')),
          imageRendering: getComputedStyle(element.querySelector('.card-frame-art')).imageRendering,
          titleFits: element.querySelector('.card-title').scrollWidth <= element.querySelector('.card-title').clientWidth
            && element.querySelector('.card-title').scrollHeight <= element.querySelector('.card-title').clientHeight,
          bodyFits: element.querySelector('.card-desc').scrollWidth <= element.querySelector('.card-desc').clientWidth
            && element.querySelector('.card-desc').scrollHeight <= element.querySelector('.card-desc').clientHeight,
          disabled: element.disabled,
        };
      }),
    };
  });
}

function assertContained(metrics, label) {
  const {
    document,
    viewport,
    table,
    topRail,
    tabletop,
    hand,
    resolutionCopy,
    terminal,
    reset,
    cards,
  } = metrics;
  const failures = [];
  const overlaps = (left, right) => left && right
    && left.left < right.right && left.right > right.left
    && left.top < right.bottom && left.bottom > right.top;

  if (document.scrollWidth > document.clientWidth) failures.push('horizontal document overflow');
  if (document.scrollHeight > document.clientHeight) failures.push('vertical document overflow');
  if (topRail && tabletop && topRail.bottom > tabletop.top + 0.5) failures.push('top status rail overlaps the tabletop artwork');
  if (tabletop && hand && Math.abs(tabletop.bottom - hand.top) > 0.5) failures.push('tabletop and hand dock have a visible geometry seam');
  for (const [name, bounds] of [['table', table], ['hand', hand], ['reset', reset]]) {
    if (!bounds) continue;
    if (bounds.left < 0 || bounds.top < 0 || bounds.right > viewport.width || bounds.bottom > viewport.height) {
      failures.push(`${name} leaves the runtime surface`);
    }
  }
  for (const bounds of cards) {
    if (bounds.left < 0 || bounds.top < 0 || bounds.right > viewport.width || bounds.bottom > viewport.height) {
      failures.push(`card ${bounds.name ?? 'unknown'} leaves the runtime surface`);
    }
    if (table && (bounds.left < table.left || bounds.top < table.top || bounds.right > table.right || bounds.bottom > table.bottom)) {
      failures.push(`card ${bounds.name ?? 'unknown'} leaves the tabletop`);
    }
    if (!bounds.titleFits || !bounds.bodyFits) failures.push(`card ${bounds.name ?? 'unknown'} runtime text overflows its mapped slot`);
    if (resolutionCopy && overlaps(bounds, resolutionCopy)) failures.push(`card ${bounds.name ?? 'unknown'} blocks the protected result corridor`);
    if (terminal && overlaps(bounds, terminal)) failures.push(`card ${bounds.name ?? 'unknown'} blocks the protected result corridor`);
    if (bounds.focused && bounds.tabletopOverlapRatio > 0.35 + Number.EPSILON) {
      failures.push(`focused card exceeds 35% tabletop exposure: ${bounds.name ?? 'unknown'}`);
    }
    if (!bounds.focused && bounds.tabletopOverlapRatio > 0.30 + Number.EPSILON) {
      failures.push(`resting card exceeds 30% tabletop exposure: ${bounds.name ?? 'unknown'}`);
    }
    if (!bounds.focused && bounds.tabletopOverlapRatio < 0.20 - Number.EPSILON) {
      failures.push(`resting card misses the 20% tabletop exposure floor: ${bounds.name ?? 'unknown'}`);
    }
    if (!bounds.focused && bounds.dockContainmentRatio < 0.70 - Number.EPSILON) {
      failures.push(`resting card keeps less than 70% inside the dock: ${bounds.name ?? 'unknown'}`);
    }
  }

  if (failures.length > 0) {
    throw new Error(`${label} containment failed: ${failures.join(' | ')}`);
  }
}

async function capture(page, name, metadata = {}) {
  const containment = await containmentMetrics(page);
  assertContained(containment, name);
  const path = captureRun.file('stills', `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  review.states.push({ name, containment, ...metadata });
  if (name === '01-default-complete-hand' || name === '07-minimum-complete-hand') {
    review.cardFrameScaling.states.push({
      name,
      viewport: containment.viewport,
      cards: containment.cards.map(({ name: cardName, frame, width, height, nativeWidth, nativeHeight, scaleX, scaleY, imageRendering }) => ({
        name: cardName,
        frame,
        displayedCssPixels: { width, height },
        nativeCropPixels: { width: nativeWidth, height: nativeHeight },
        scaleFactor: { x: scaleX, y: scaleY },
        imageRendering,
      })),
    });
  }
}

async function openPage(browser, viewport = HUB_DEFAULT_RUNTIME, suffix = '') {
  const page = await browser.newPage({ viewport });
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  await page.goto(`${URL}${suffix}`, { waitUntil: 'networkidle' });
  await page.locator('#duel-table').waitFor({ state: 'visible' });
  await page.waitForFunction(() => {
    const status = document.querySelector('#anchor-status')?.textContent ?? '';
    return status.includes('presentation anchors resolved');
  });
  return page;
}

async function captureInitialAndSpark(browser) {
  const page = await openPage(browser);
  await capture(page, '01-default-complete-hand', {
    phase: await page.locator('#banner').textContent(),
    debug: false,
  });

  await page.locator('.card-btn').first().focus();
  await capture(page, '02-keyboard-focused-card', {
    focusedCard: await page.locator(':focus').getAttribute('data-card-name'),
  });

  await clickCard(page, 'Guard');
  await capture(page, '03-card-resolution-enemy-response', {
    latestResult: await page.locator('#resolution-detail').textContent(),
  });

  await clickCard(page, 'Spark');
  await capture(page, '04-spark-choice', {
    phase: await page.locator('#banner').textContent(),
  });
  await page.close();
}

async function captureVictory(browser) {
  const page = await openPage(browser);
  for (const name of ['Guard', 'Spark', 'Mend', 'Heavy Bonk', 'Stun', 'Strike', 'Spark', 'Mend', 'Stun', 'Heavy Bonk']) {
    await clickCard(page, name);
  }

  await page.locator('#terminal-outcome:not([hidden])').waitFor();
  await capture(page, '05-victory-terminal-disabled-hand', {
    outcome: await page.locator('#terminal-message').textContent(),
    disabledCards: await page.locator('.card-btn:disabled').count(),
    resetVisible: await page.locator('#reset-duel').isVisible(),
  });

  await page.locator('#reset-duel').click();
  await page.waitForTimeout(120);
  const resetContainment = await containmentMetrics(page);
  assertContained(resetContainment, 'reset-after-victory-check');
  review.states.push({
    name: 'reset-after-victory-check',
    containment: resetContainment,
    phase: await page.locator('#banner').textContent(),
    playerHp: await page.locator('#player-hp').textContent(),
    enemyHp: await page.locator('#enemy-hp').textContent(),
    enabledCards: await page.locator('.card-btn:not([disabled])').count(),
  });
  await page.close();
}

async function captureDefeat(browser) {
  const page = await openPage(browser);
  for (let step = 0; step < 12; step += 1) {
    if (await page.locator('#terminal-outcome:not([hidden])').count()) break;
    await page.locator('.card-btn:not([disabled])').first().click();
    await page.waitForTimeout(120);
  }

  await page.locator('#terminal-outcome:not([hidden])').waitFor();
  await capture(page, '06-defeat-terminal', {
    outcome: await page.locator('#terminal-message').textContent(),
    resetVisible: await page.locator('#reset-duel').isVisible(),
  });
  await page.close();
}

async function captureSupportedMinimumAndDebug(browser) {
  const minimum = await openPage(browser, HUB_MINIMUM_RUNTIME);
  await capture(minimum, '07-minimum-complete-hand', {
    authority: 'Tauri minimum runtime content area',
  });
  await minimum.close();

  const debug = await openPage(browser, HUB_DEFAULT_RUNTIME, '?anchors=1');
  await capture(debug, '08-anchor-debug-explicit', {
    status: await debug.locator('#anchor-status').textContent(),
    bodyClass: await debug.locator('body').getAttribute('class'),
  });
  await debug.close();
}

async function verifyLedgerBridge(browser) {
  const page = await browser.newPage({ viewport: HUB_DEFAULT_RUNTIME });
  await page.setContent(`
    <!doctype html>
    <html><body style="margin:0">
      <iframe id="game" src="${URL}" style="width:100vw;height:100vh;border:0"></iframe>
      <script>
        window.__academyLedgerMessages = [];
        window.addEventListener('message', (event) => {
          if (typeof event.data?.type === 'string' && event.data.type.startsWith('tga:ledger-')) {
            window.__academyLedgerMessages.push(event.data);
          }
        });
      </script>
    </body></html>
  `);

  const frame = page.frames().find((candidate) => candidate.url().startsWith(URL));
  if (!frame) throw new Error('Ledger bridge iframe failed to load.');
  await frame.locator('#duel-table').waitFor({ state: 'visible' });
  await frame.waitForFunction(() => {
    const status = document.querySelector('#anchor-status')?.textContent ?? '';
    return status.includes('presentation anchors resolved');
  });
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

  if (!latestSnapshot || latestSnapshot.gameId !== 'tga-04') {
    throw new Error('Ledger snapshot handshake did not return the active game.');
  }
  if (events.length === 0 || latestSnapshot.events.length < events.length) {
    throw new Error('Ledger snapshot did not restore the published event history.');
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
    await captureInitialAndSpark(browser);
    await captureVictory(browser);
    await captureDefeat(browser);
    await captureSupportedMinimumAndDebug(browser);
    await verifyLedgerBridge(browser);

    if (consoleErrors.length > 0) {
      throw new Error(`Browser errors: ${consoleErrors.join(' | ')}`);
    }

    fs.writeFileSync(
      captureRun.file('root', 'technical-review.json'),
      `${JSON.stringify(review, null, 2)}\n`,
      'utf8',
    );

    const finalized = finalizeCaptureRun(captureRun, {
      captureScript: 'games/tier-1/04-card-goblin-duel/capture.cjs',
      captureScriptVersion: 'h6.20e',
      captureConfiguration: {
        listenerHost: '127.0.0.1',
        listenerPort: 5175,
        browser: 'chromium',
        supportedRuntimeSurfaces: [HUB_DEFAULT_RUNTIME, HUB_MINIMUM_RUNTIME],
        debugQuery: '?anchors=1',
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
