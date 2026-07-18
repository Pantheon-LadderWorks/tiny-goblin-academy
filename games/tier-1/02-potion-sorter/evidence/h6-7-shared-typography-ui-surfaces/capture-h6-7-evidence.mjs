import { spawn, spawnSync } from 'node:child_process';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const repoRoot = process.cwd();
const gamePath = path.join(repoRoot, 'games', 'tier-1', '02-potion-sorter');
const evidencePath = path.join(gamePath, 'evidence', 'h6-7-shared-typography-ui-surfaces');
const capturesPath = path.join(evidencePath, 'captures');
const port = 5123;
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
    try { if ((await fetch(rootUrl)).ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Potion Sorter server did not become ready at ${rootUrl}`);
}

async function openPage(browser, width, height, freezeTimer = true) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:')) errors.push(`console: ${message.text()}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) errors.push(`response: ${response.status()} ${response.url()}`);
  });
  page.on('requestfailed', (request) => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
  if (freezeTimer) await page.addInitScript(() => { window.setInterval = () => 0; });
  await page.goto(rootUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#game-canvas canvas', { timeout: 60000 });
  await page.waitForFunction(() => Boolean(window.__TGA_POTION_SCENE__));
  await page.waitForFunction(() => window.__TGA_FONT_LOAD_RESULTS__?.every((result) => result.loaded));
  await page.waitForTimeout(500);
  if (errors.length) throw new Error(errors.join(' | '));
  page.__errors = errors;
  return page;
}

async function clickWorld(page, x, y) {
  const box = await page.locator('#game-canvas canvas').boundingBox();
  if (!box) throw new Error('Potion canvas has no bounds.');
  const zoom = Math.max(box.width / 1600, box.height / 900);
  await page.mouse.click(box.x + box.width / 2 + (x - 800) * zoom, box.y + box.height / 2 + (y - 480) * zoom);
}

async function selectPotion(page) {
  await clickWorld(page, 800, 570);
  await page.waitForFunction(() => window.__TGA_POTION_SCENE__.getRoundState().selectedPotion === true);
}

const destinationX = { sun: 340, moon: 800, star: 1260 };
async function place(page, type) {
  await clickWorld(page, destinationX[type], 755);
  await page.waitForTimeout(950);
}

async function completeRound(page) {
  for (const type of ['sun', 'moon', 'star', 'sun', 'moon', 'star']) {
    await selectPotion(page);
    await place(page, type);
  }
  await page.waitForFunction(() => window.__TGA_POTION_SCENE__.getRoundState().roundComplete === true);
}

async function audit(page, label) {
  const result = await page.evaluate((stateLabel) => {
    const rect = (selector) => {
      const bounds = document.querySelector(selector)?.getBoundingClientRect();
      return bounds ? { x: Math.round(bounds.x), y: Math.round(bounds.y), width: Math.round(bounds.width), height: Math.round(bounds.height) } : null;
    };
    const style = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const computed = getComputedStyle(element);
      return { family: computed.fontFamily, size: computed.fontSize, weight: computed.fontWeight, color: computed.color };
    };
    return {
      label: stateLabel,
      viewport: { width: innerWidth, height: innerHeight },
      documentSize: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
      fonts: window.__TGA_FONT_LOAD_RESULTS__,
      typography: {
        title: style('.masthead h1'),
        hudLabel: style('.stat-card span'),
        hudValue: style('.stat-card strong'),
        instruction: style('.instruction'),
        resultTitle: style('.round-result-title'),
        phaserRoles: window.__TGA_TYPOGRAPHY_AUDIT__?.map((entry) => entry.role) ?? []
      },
      result: {
        hidden: document.querySelector('#round-result')?.hasAttribute('hidden'),
        assetState: document.querySelector('#round-result')?.getAttribute('data-asset-state'),
        surface: rect('#round-result'),
        title: document.querySelector('.round-result-title')?.textContent,
        score: document.querySelector('#round-result-score')?.textContent,
        footer: document.querySelector('#round-result-footer')?.textContent
      },
      round: window.__TGA_POTION_SCENE__.getRoundState()
    };
  }, label);
  if (result.documentSize.width !== result.viewport.width || result.documentSize.height !== result.viewport.height) {
    throw new Error(`${label}: document overflow ${JSON.stringify(result.documentSize)}`);
  }
  if (!result.fonts?.every((font) => font.loaded)) throw new Error(`${label}: local font load failure`);
  if (!result.typography.phaserRoles.includes('compact-label')) throw new Error(`${label}: Phaser compact-label recipe not audited`);
  return result;
}

await mkdir(capturesPath, { recursive: true });
const server = spawn('cmd.exe', ['/d', '/s', '/c', `pnpm exec vite --host 127.0.0.1 --port ${port} --strictPort`], {
  cwd: gamePath, stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true
});

let browser;
try {
  await waitForServer();
  const { chromium } = await import(pathToFileURL(await locatePlaywright()).href);
  browser = await chromium.launch({ headless: true, executablePath: chromePath });
  const audits = [];

  for (const contract of [
    { name: 'desktop', width: 1920, height: 1080 },
    { name: 'minimum', width: 1024, height: 640 }
  ]) {
    const page = await openPage(browser, contract.width, contract.height);
    audits.push(await audit(page, `${contract.name}-initial`));
    await page.screenshot({ path: path.join(capturesPath, `${contract.name}-01-initial.png`) });
    await completeRound(page);
    audits.push(await audit(page, `${contract.name}-round-complete`));
    await page.screenshot({ path: path.join(capturesPath, `${contract.name}-02-round-complete.png`) });
    if (page.__errors.length) throw new Error(page.__errors.join(' | '));
    await page.close();
  }

  const expiry = await openPage(browser, 1024, 640, false);
  await expiry.waitForFunction(() => window.__TGA_POTION_SCENE__.getRoundState().roundComplete === true, null, { timeout: 35000 });
  audits.push(await audit(expiry, 'minimum-timer-expired'));
  await expiry.screenshot({ path: path.join(capturesPath, 'minimum-03-timer-expired.png') });
  if (expiry.__errors.length) throw new Error(expiry.__errors.join(' | '));
  await expiry.close();

  await writeFile(path.join(evidencePath, 'runtime-audit.json'), `${JSON.stringify({ passed: true, capturedAt: new Date().toISOString(), audits }, null, 2)}\n`, 'utf8');
  process.stdout.write(`Captured ${audits.length} H6.7 typography/UI states.\n`);
} finally {
  await browser?.close();
  if (server.pid) spawnSync('taskkill', ['/pid', String(server.pid), '/t', '/f'], { stdio: 'ignore', windowsHide: true });
}
