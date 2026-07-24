'use strict';

const { chromium } = require('playwright');
const {
  fixtureExpectedCards,
  fixtureIds,
  verifyEvidenceContracts,
} = require('./h621b-evidence-contracts.cjs');

verifyEvidenceContracts();

const URL = 'http://127.0.0.1:5175/';

async function assertCompleted(page, fixtureId, mode = 'full') {
  console.log('SMOKE', fixtureId, mode);
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('requestfailed', (request) => errors.push(
    request.url() + ' · ' + request.failure()?.errorText,
  ));

  const query = new URLSearchParams({ cardRig: fixtureId, motion: mode });
  await page.goto(URL + '?' + query, { waitUntil: 'networkidle' });
  try {
    await page.waitForFunction(
      () => window.__cardRigLabStatus?.status === 'complete',
      undefined,
      { timeout: 12000 },
    );
  } catch (error) {
    console.log('STATUS', await page.evaluate(() => ({
      rig: window.__cardRigLabStatus,
      href: location.href,
      body: document.body.className,
      banner: document.querySelector('#banner')?.textContent,
      cards: document.querySelectorAll('#hand .card-btn').length,
    })));
    console.log('ERRORS', errors);
    throw error;
  }

  const state = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('#hand .card-btn'));
    const ids = buttons.map((button) => button.dataset.cardRigId);
    return {
      status: window.__cardRigLabStatus,
      cardCount: buttons.length,
      uniqueIds: new Set(ids).size,
      rigAnchors: buttons.filter(
        (button) => button.hasAttribute('data-stage-anchor'),
      ).length,
      disabled: buttons.filter((button) => button.disabled).length,
      allSized: buttons.every((button) => {
        const rect = button.getBoundingClientRect();
        return rect.width > 130 && rect.height > 180;
      }),
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      overflowY: document.documentElement.scrollHeight - window.innerHeight,
    };
  });

  if (errors.length) throw new Error(fixtureId + ' console: ' + errors.join(' | '));
  if (state.cardCount !== fixtureExpectedCards[fixtureId]) {
    throw new Error(fixtureId + ' card count ' + state.cardCount);
  }
  if (state.uniqueIds !== state.cardCount) {
    throw new Error(fixtureId + ' duplicate semantic card identities');
  }
  if (state.rigAnchors !== 0) {
    throw new Error(fixtureId + ' registered production gameplay anchors');
  }
  if (!state.allSized || state.overflowX > 0 || state.overflowY > 0) {
    throw new Error(fixtureId + ' geometry or document containment failed');
  }
  if (fixtureId === 'terminal-lock' && state.disabled !== 2) {
    throw new Error('terminal-lock did not disable exactly two cards');
  }
  return state;
}

async function assertResetCancellation(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 660 } });
  await page.goto(URL + '?cardRig=reset-during-deal&motion=full');
  await page.waitForFunction(
    () => window.__cardRigLabStatus?.status === 'running'
      && window.__cardRigLabStatus.cues.includes('deal'),
  );
  await page.evaluate(() => document.querySelector('#reset-duel').click());
  await page.waitForFunction(
    () => window.__cardRigLabStatus?.status === 'complete'
      && window.__cardRigLabStatus.events.includes('cancel:reset')
      && window.__cardRigLabStatus.events.filter(
        (event) => event.startsWith('run:'),
      ).length >= 2,
    undefined,
    { timeout: 12000 },
  );
  const result = await page.evaluate(() => ({
    status: window.__cardRigLabStatus,
    animations: document.getAnimations().filter(
      (animation) => animation.playState === 'running',
    ).length,
    anchors: document.querySelectorAll(
      '#hand .card-btn[data-stage-anchor]',
    ).length,
  }));
  if (result.animations || result.anchors) {
    throw new Error('reset cancellation left animation or anchor residue');
  }
  await page.close();
}

async function assertResizeCancellation(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 660 } });
  await page.goto(URL + '?cardRig=resize-active&motion=full');
  await page.waitForFunction(
    () => window.__cardRigLabStatus?.status === 'running'
      && window.__cardRigLabStatus.cues.includes('commit'),
  );
  await page.setViewportSize({ width: 1270, height: 650 });
  await page.waitForFunction(
    () => window.__cardRigLabStatus?.status === 'cancelled'
      && window.__cardRigLabStatus.reason === 'resize'
      && window.__cardRigLabStatus.events.includes('cancel:resize'),
  );
  const residue = await page.evaluate(() => ({
    animations: document.getAnimations().filter(
      (animation) => animation.playState === 'running',
    ).length,
    transforms: Array.from(document.querySelectorAll('#hand .card-btn'))
      .filter((button) => button.style.transform).length,
    anchors: document.querySelectorAll(
      '#hand .card-btn[data-stage-anchor]',
    ).length,
  }));
  if (residue.animations || residue.transforms || residue.anchors) {
    throw new Error('resize cancellation left transient DOM state');
  }
  await page.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const fixtureId of fixtureIds) {
      const viewport = fixtureId === 'optical-minimum'
        ? { width: 1024, height: 580 }
        : { width: 1280, height: 660 };
      const page = await browser.newPage({ viewport });
      await assertCompleted(page, fixtureId);
      await page.close();
    }

    const reducedPage = await browser.newPage({
      viewport: { width: 1280, height: 660 },
    });
    const reduced = await assertCompleted(
      reducedPage,
      'initial-deal',
      'reduced',
    );
    if (reduced.status.mode !== 'reduced') {
      throw new Error('reduced-motion mode was not retained');
    }
    await reducedPage.close();

    await assertResetCancellation(browser);
    await assertResizeCancellation(browser);
    console.log('H6.21B browser contracts passed: 18/18');
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
