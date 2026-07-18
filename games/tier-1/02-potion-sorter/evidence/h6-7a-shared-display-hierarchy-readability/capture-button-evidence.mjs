import { spawn, spawnSync } from 'node:child_process';
import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const repoRoot = process.cwd();
const gamePath = path.join(repoRoot, 'games', 'tier-1', '01-button-goblin-clicker');
const evidencePath = path.join(repoRoot, 'games', 'tier-1', '02-potion-sorter', 'evidence', 'h6-7a-shared-display-hierarchy-readability');
const capturesPath = path.join(evidencePath, 'after', 'button-goblin');
const port = 5124;
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
  throw new Error(`Button Goblin server did not become ready at ${rootUrl}`);
}

async function openPage(browser, width, height) {
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
  await page.goto(rootUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#game-canvas canvas', { timeout: 60000 });
  await page.waitForFunction(() => window.__TGA_FONT_LOAD_RESULTS__?.every((result) => result.loaded));
  await page.waitForTimeout(500);
  if (errors.length) throw new Error(errors.join(' | '));
  page.__errors = errors;
  return page;
}

async function clickGoblin(page) {
  const box = await page.locator('#game-canvas canvas').boundingBox();
  if (!box) throw new Error('Button Goblin canvas has no bounds.');
  const scale = Math.min(box.width / 800, box.height / 600);
  const originX = box.x + (box.width - 800 * scale) / 2;
  const originY = box.y + (box.height - 600 * scale) / 2;
  await page.mouse.click(originX + 400 * scale, originY + 345 * scale);
}

async function completeGame(page) {
  for (let attempt = 0; attempt < 180; attempt += 1) {
    if (await page.locator('#victory-overlay.visible').count()) return;
    const shop = page.locator('#shop-btn');
    if (await shop.isEnabled()) await shop.click();
    await clickGoblin(page);
    await page.waitForTimeout(140);
    if ((await page.locator('#hp-display').textContent())?.trim().startsWith('0 /')) await page.waitForTimeout(900);
  }
  throw new Error('Button Goblin did not reach victory during the bounded capture loop.');
}

async function audit(page, label) {
  const result = await page.evaluate((stateLabel) => {
    const style = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const computed = getComputedStyle(element);
      return {
        family: computed.fontFamily,
        size: computed.fontSize,
        weight: computed.fontWeight,
        tracking: computed.letterSpacing,
        color: computed.color,
        shadow: computed.textShadow
      };
    };
    return {
      label: stateLabel,
      viewport: { width: innerWidth, height: innerHeight },
      documentSize: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
      fonts: window.__TGA_FONT_LOAD_RESULTS__,
      title: style('.masthead h1'),
      resultTitle: style('.victory-title'),
      victoryVisible: document.querySelector('#victory-overlay')?.classList.contains('visible')
    };
  }, label);
  if (result.documentSize.width !== result.viewport.width || result.documentSize.height !== result.viewport.height) {
    throw new Error(`${label}: document overflow ${JSON.stringify(result.documentSize)}`);
  }
  if (!result.fonts?.every((font) => font.loaded)) throw new Error(`${label}: local font load failure`);
  return result;
}

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
    await completeGame(page);
    await page.waitForTimeout(400);
    audits.push(await audit(page, `${contract.name}-victory`));
    await page.screenshot({ path: path.join(capturesPath, `${contract.name}-02-victory.png`) });
    if (page.__errors.length) throw new Error(page.__errors.join(' | '));
    await page.close();
  }

  await writeFile(path.join(capturesPath, 'runtime-audit.json'), `${JSON.stringify({ passed: true, capturedAt: new Date().toISOString(), audits }, null, 2)}\n`, 'utf8');
  process.stdout.write(`Captured ${audits.length} Button Goblin hierarchy states.\n`);
} finally {
  await browser?.close();
  if (server.pid) spawnSync('taskkill', ['/pid', String(server.pid), '/t', '/f'], { stdio: 'ignore', windowsHide: true });
}
