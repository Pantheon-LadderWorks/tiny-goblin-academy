import { createRequire } from 'node:module';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const evidenceRoot = path.dirname(fileURLToPath(import.meta.url));
const captures = path.join(evidenceRoot, 'captures');
const videos = path.join(evidenceRoot, 'video');
const url = 'http://127.0.0.1:4313';

await mkdir(captures, { recursive: true });
await mkdir(videos, { recursive: true });

const browser = await chromium.launch({ headless: true });
const consoleErrors = [];

const openGame = async (viewport) => {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('#game-canvas canvas');
  return { context, page };
};

const shot = (page, name) => page.screenshot({ path: path.join(captures, name), fullPage: true });

for (const viewport of [
  { width: 1920, height: 1080, suffix: '1920x1080' },
  { width: 1024, height: 640, suffix: '1024x640' },
]) {
  const { context, page } = await openGame(viewport);
  await shot(page, `01-initial-${viewport.suffix}.png`);
  await page.click('#rollbtn');
  await shot(page, `02-rolled-action-choice-${viewport.suffix}.png`);
  await context.close();
}

{
  const { context, page } = await openGame({ width: 1920, height: 1080 });
  await page.click('#rollbtn');
  await page.click('[data-a="attack"]');
  await shot(page, '03-attack-enemy-response-1920x1080.png');

  await page.click('#rollbtn');
  await page.click('[data-a="heal"]');
  await shot(page, '04-heal-enemy-response-1920x1080.png');

  await page.click('#rollbtn');
  await page.click('[data-a="block"]');
  await shot(page, '05-block-reduced-damage-1920x1080.png');

  await page.click('#history-toggle');
  await shot(page, '06-expanded-combat-history-1920x1080.png');
  await page.click('#history-close');

  await page.click('#rollbtn');
  await page.click('[data-a="attack"]');
  await page.click('#rollbtn');
  await page.click('[data-a="attack"]');
  await shot(page, '07-victory-1920x1080.png');
  await context.close();
}

{
  const { context, page } = await openGame({ width: 1024, height: 640 });
  for (let turn = 0; turn < 60; turn += 1) {
    if (await page.isDisabled('#rollbtn')) break;
    await page.click('#rollbtn');
    await page.click('[data-a="block"]');
  }
  if (!(await page.locator('#result').textContent())?.includes('defeated')) {
    throw new Error('Deterministic Block path did not reach defeat.');
  }
  await shot(page, '08-defeat-deterministic-1024x640.png');
  await context.close();
}

{
  const context = await browser.newContext({
    viewport: { width: 1024, height: 640 },
    recordVideo: { dir: videos, size: { width: 1024, height: 640 } },
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('#game-canvas canvas');
  const video = page.video();
  await page.waitForTimeout(600);
  await page.click('#rollbtn');
  await page.waitForTimeout(700);
  await page.click('[data-a="attack"]');
  await page.waitForTimeout(800);
  await page.click('#history-toggle');
  await page.waitForTimeout(900);
  await page.click('#history-close');
  await page.waitForTimeout(600);
  await context.close();
  if (video) {
    const rawVideo = await video.path();
    const canonicalVideo = path.join(videos, 'h6-9-shell-migration-interaction.webm');
    await video.saveAs(canonicalVideo);
    if (rawVideo !== canonicalVideo) await rm(rawVideo, { force: true });
  }
}

await browser.close();

if (consoleErrors.length > 0) {
  throw new Error(`Browser console errors:\n${consoleErrors.join('\n')}`);
}

console.log(`Captured H6.9 evidence in ${evidenceRoot}`);
