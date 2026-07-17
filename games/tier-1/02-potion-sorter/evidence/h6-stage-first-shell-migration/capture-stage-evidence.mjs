import { spawn, spawnSync } from 'node:child_process';
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const repoRoot = process.cwd();
const evidenceRelative = 'games/tier-1/02-potion-sorter/evidence/h6-stage-first-shell-migration';
const evidencePath = path.join(repoRoot, ...evidenceRelative.split('/'));
const capturesPath = path.join(evidencePath, 'captures');
const gamePath = path.join(repoRoot, 'games', 'tier-1', '02-potion-sorter');
const port = 5122;
const rootUrl = `http://127.0.0.1:${port}`;
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function locatePlaywright() {
  const entries = await readdir(path.join(repoRoot, 'node_modules', '.pnpm'));
  const packageDir = entries.find((name) => name.startsWith('playwright@'));
  if (!packageDir) throw new Error('Repository-local Playwright was not found.');
  return path.join(repoRoot, 'node_modules', '.pnpm', packageDir, 'node_modules', 'playwright', 'index.mjs');
}

async function waitForServer() {
  for (let attempt = 0; attempt < 240; attempt += 1) {
    try {
      const response = await fetch(rootUrl);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Potion Sorter server did not become ready at ${rootUrl}`);
}

async function auditPage(page, label) {
  const audit = await page.evaluate(() => {
    const rect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const bounds = element.getBoundingClientRect();
      return {
        x: Math.round(bounds.x),
        y: Math.round(bounds.y),
        width: Math.round(bounds.width),
        height: Math.round(bounds.height),
      };
    };

    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      bodyScroll: {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      },
      shell: rect('.game-shell'),
      stage: rect('.game-stage'),
      hud: rect('.hud-layer'),
      playSurface: rect('.play-surface'),
      canvas: rect('#game-canvas canvas'),
      permanentSideRails: document.querySelectorAll('.stat-stack, .how-to, .game-layout').length,
      status: {
        timer: document.querySelector('#timer')?.textContent,
        score: document.querySelector('#score')?.textContent,
        combo: document.querySelector('#combo')?.textContent,
        instruction: document.querySelector('#instruction')?.textContent,
        roundResult: document.querySelector('#round-result')?.textContent,
        roundResultHidden: document.querySelector('#round-result')?.hasAttribute('hidden'),
      },
    };
  });

  if (audit.permanentSideRails !== 0) throw new Error(`${label}: permanent side rails remain`);
  if (audit.bodyScroll.width !== audit.viewport.width || audit.bodyScroll.height !== audit.viewport.height) {
    throw new Error(`${label}: unexpected document overflow ${JSON.stringify(audit.bodyScroll)}`);
  }
  if (!audit.stage || !audit.canvas || audit.stage.width < audit.viewport.width * 0.9) {
    throw new Error(`${label}: stage did not claim the supported viewport`);
  }
  return { label, ...audit };
}

async function clickPotion(page) {
  const canvas = page.locator('#game-canvas canvas');
  const box = await canvas.boundingBox();
  if (!box) throw new Error('Potion canvas has no bounds.');
  await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.34);
}

async function clickDestination(page, lane) {
  const canvas = page.locator('#game-canvas canvas');
  const box = await canvas.boundingBox();
  if (!box) throw new Error('Potion canvas has no bounds.');
  await page.mouse.click(box.x + box.width * lane, box.y + box.height * 0.72);
}

async function openPage(browser, width, height) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:')) {
      errors.push(`console: ${message.text()}`);
    }
  });
  page.on('response', (response) => {
    if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) {
      errors.push(`response: ${response.status()} ${response.url()}`);
    }
  });
  page.on('requestfailed', (request) => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
  await page.addInitScript(() => { window.setInterval = () => 0; });
  await page.goto(rootUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#game-canvas canvas', { timeout: 60000 });
  await page.waitForTimeout(500);
  if (errors.length) throw new Error(errors.join(' | '));
  return page;
}

await mkdir(capturesPath, { recursive: true });
for (const file of await readdir(capturesPath)) {
  if (file.endsWith('.png')) await rm(path.join(capturesPath, file));
}

const server = spawn(
  'cmd.exe',
  ['/d', '/s', '/c', `pnpm exec vite --host 127.0.0.1 --port ${port} --strictPort`],
  { cwd: gamePath, stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true },
);

let browser;
try {
  await waitForServer();
  const { chromium } = await import(pathToFileURL(await locatePlaywright()).href);
  browser = await chromium.launch({ headless: true, executablePath: chromePath });
  const audits = [];

  const desktop = await openPage(browser, 1920, 1080);
  audits.push(await auditPage(desktop, 'desktop-initial'));
  await desktop.screenshot({ path: path.join(capturesPath, '01-desktop-initial.png') });

  await clickPotion(desktop);
  await desktop.waitForFunction(() => document.querySelector('#instruction')?.textContent?.includes('choose a shelf'));
  audits.push(await auditPage(desktop, 'desktop-selected'));
  await desktop.screenshot({ path: path.join(capturesPath, '02-desktop-selected.png') });

  await clickDestination(desktop, 0.2);
  await desktop.waitForFunction(() => document.querySelector('#score')?.textContent === '10');
  audits.push(await auditPage(desktop, 'desktop-correct-placement'));
  await desktop.screenshot({ path: path.join(capturesPath, '03-desktop-correct-placement.png') });

  for (const lane of [0.5, 0.8, 0.2, 0.5, 0.8]) {
    await clickPotion(desktop);
    await clickDestination(desktop, lane);
  }
  await desktop.waitForFunction(() => !document.querySelector('#round-result')?.hasAttribute('hidden'));
  audits.push(await auditPage(desktop, 'desktop-round-complete'));
  await desktop.screenshot({ path: path.join(capturesPath, '04-desktop-round-complete.png') });
  await desktop.close();

  const minimum = await openPage(browser, 1024, 640);
  audits.push(await auditPage(minimum, 'minimum-initial'));
  await minimum.screenshot({ path: path.join(capturesPath, '05-minimum-initial.png') });
  await clickPotion(minimum);
  await minimum.waitForFunction(() => document.querySelector('#instruction')?.textContent?.includes('choose a shelf'));
  audits.push(await auditPage(minimum, 'minimum-selected'));
  await minimum.screenshot({ path: path.join(capturesPath, '06-minimum-selected.png') });
  await minimum.close();

  await writeFile(
    path.join(evidencePath, 'runtime-audit.json'),
    `${JSON.stringify({ passed: true, capturedAt: new Date().toISOString(), audits }, null, 2)}\n`,
    'utf8',
  );
  process.stdout.write(`Captured ${audits.length} Potion Sorter stage states.\n`);
} finally {
  await browser?.close();
  if (server.pid) spawnSync('taskkill', ['/pid', String(server.pid), '/t', '/f'], { stdio: 'ignore', windowsHide: true });
}
