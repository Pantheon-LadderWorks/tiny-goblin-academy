'use strict';

const { chromium } = require('playwright');

const URL = process.env.CARD_GOBLIN_URL || 'http://127.0.0.1:5175/';
const zeroCounts = (counts) => Object.values(counts || {}).every((count) => count === 0);

async function waitReady(page) {
  await page.waitForFunction(
    () => window.__cardGoblinPresentationStatus?.status === 'ready'
      && window.__cardGoblinPresentationStatus?.inputLocked === false,
    undefined,
    { timeout: 20000 },
  );
}

async function snapshot(page) {
  return page.evaluate(() => ({
    status: window.__cardGoblinPresentationStatus,
    cards: Array.from(document.querySelectorAll('#hand .card-btn')).map((card) => card.dataset.cardName),
    phase: document.body.className,
    terminal: !document.querySelector('#terminal-outcome')?.hidden,
    terminalMessage: document.querySelector('#terminal-message')?.textContent,
    locked: Array.from(document.querySelectorAll('#hand .card-btn')).every((card) => card.disabled),
  }));
}

async function clickCard(page, card) {
  await page.locator(`#hand .card-btn[data-card-name="${card}"]`).click();
  await waitReady(page);
  return snapshot(page);
}

async function reset(page) {
  await page.evaluate(() => document.querySelector('#reset-duel')?.click());
  await waitReady(page);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 660 } });
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto(URL, { waitUntil: 'networkidle' });
  await waitReady(page);
  console.log('PASS opening deal');
  let current = await snapshot(page);
  if (current.cards.join('|') !== 'Strike|Guard|Mend') throw new Error(`Unexpected opening hand: ${current.cards}`);
  if (!current.status.cues.includes('deal') || !current.status.effects.includes('draw-pile-prepare')) {
    throw new Error(`Opening presentation missing governed draw lifecycle: ${JSON.stringify(current.status)}`);
  }

  current = await clickCard(page, 'Strike');
  for (const effect of ['strike', 'discard-pile-receive', 'enemy-attack']) {
    if (!current.status.effects.includes(effect)) throw new Error(`Strike transition missing ${effect}`);
  }
  if (!zeroCounts(current.status.cleanupCounts)) throw new Error('Strike transition left effect residue.');
  console.log('PASS Strike lifecycle');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await reset(page);
  await clickCard(page, 'Guard');
  current = await clickCard(page, 'Spark');
  if (!current.phase.includes('phase-spark')) throw new Error('Spark did not enter replacement phase.');
  const replacement = current.cards[0];
  current = await clickCard(page, replacement);
  if (!current.status.cues.includes('replace-discard')) throw new Error('Spark replacement did not discard directly.');
  if (!current.status.effects.includes('draw-pile-prepare')) throw new Error('Spark replacement did not draw from pile.');
  console.log('PASS Spark lifecycle');

  await reset(page);
  await clickCard(page, 'Strike');
  await clickCard(page, 'Guard');
  await clickCard(page, 'Mend');
  current = await clickCard(page, 'Heavy Bonk');
  if (current.cards.length !== 2 || !current.status.cues.includes('vacancy')) {
    throw new Error(`Heavy Bonk did not preserve vacancy: ${JSON.stringify(current)}`);
  }
  console.log('PASS Heavy Bonk vacancy');

  await reset(page);
  for (let turn = 0; turn < 20; turn += 1) {
    const phase = await page.evaluate(() => document.body.className);
    if (phase.includes('phase-terminal')) break;
    const button = page.locator('#hand .card-btn:not([disabled])').first();
    await button.click();
    await waitReady(page);
    console.log(`terminal search turn ${turn + 1}`);
  }
  current = await snapshot(page);
  if (!current.terminal || !current.locked) throw new Error(`Terminal presentation did not lock cards: ${JSON.stringify(current)}`);
  if (!current.status.effects.includes('victory') && !current.status.effects.includes('defeat')) {
    throw new Error('Terminal transition omitted its outcome accent.');
  }
  console.log('PASS terminal lifecycle');

  await reset(page);
  await clickCard(page, 'Guard');
  await clickCard(page, 'Spark');
  await clickCard(page, 'Mend');
  for (const card of ['Stun', 'Heavy Bonk', 'Guard', 'Mend', 'Stun', 'Heavy Bonk', 'Strike', 'Guard', 'Mend', 'Stun', 'Heavy Bonk']) {
    await clickCard(page, card);
  }
  current = await snapshot(page);
  if (!current.terminal || !current.locked || !current.status.effects.includes('victory')) {
    throw new Error(`Deterministic victory presentation failed: ${JSON.stringify(current)}`);
  }
  if (!current.terminalMessage?.startsWith('Victory')) throw new Error('Victory copy was not presented.');
  console.log('PASS victory lifecycle');

  await reset(page);
  const moving = page.locator('#hand .card-btn').first();
  await moving.click();
  await page.waitForFunction(() => window.__cardGoblinPresentationStatus?.status === 'running');
  await page.setViewportSize({ width: 1024, height: 580 });
  await page.waitForFunction(() => window.__cardGoblinPresentationStatus?.inputLocked === false);
  current = await snapshot(page);
  if (!['cancelled', 'ready'].includes(current.status.status)) throw new Error(`Resize cancellation failed: ${current.status.status}`);
  if (!zeroCounts(current.status.cleanupCounts)) throw new Error('Resize cancellation left effect residue.');
  console.log('PASS resize cancellation');
  if (errors.length > 0) throw new Error(`Browser errors: ${errors.join(' | ')}`);

  console.log(JSON.stringify({
    status: 'passed',
    opening: 'draw-pile -> hand',
    strike: 'card -> target -> discard -> refill -> enemy',
    spark: 'card -> target -> discard -> replacement -> refill',
    heavyBonk: 'vacancy preserved',
    terminal: 'locked with outcome accent',
    victory: 'deterministic victory locked with victory accent',
    cancellation: 'resize clean',
    consoleErrors: errors.length,
  }, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
