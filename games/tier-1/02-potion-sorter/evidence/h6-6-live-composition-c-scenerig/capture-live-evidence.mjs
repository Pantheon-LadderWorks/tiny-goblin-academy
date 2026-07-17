import { spawn, spawnSync } from 'node:child_process';
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const repoRoot = process.cwd();
const evidencePath = path.join(repoRoot, 'games', 'tier-1', '02-potion-sorter', 'evidence', 'h6-6-live-composition-c-scenerig');
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
  page.on('response', (response) => { if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) errors.push(`response: ${response.status()} ${response.url()}`); });
  page.on('requestfailed', (request) => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
  if (freezeTimer) await page.addInitScript(() => { window.setInterval = () => 0; });
  await page.goto(rootUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#game-canvas canvas', { timeout: 60000 });
  await page.waitForFunction(() => Boolean(window.__TGA_POTION_SCENE__));
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
async function place(page, type, wait = true) {
  await clickWorld(page, destinationX[type], 755);
  if (wait) await page.waitForTimeout(950);
}

async function audit(page, label) {
  const result = await page.evaluate((stateLabel) => {
    const canvas = document.querySelector('#game-canvas canvas')?.getBoundingClientRect();
    return {
      label: stateLabel,
      viewport: { width: innerWidth, height: innerHeight },
      documentSize: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
      canvas: canvas ? { x: Math.round(canvas.x), y: Math.round(canvas.y), width: Math.round(canvas.width), height: Math.round(canvas.height) } : null,
      hud: {
        timer: document.querySelector('#timer')?.textContent,
        score: document.querySelector('#score')?.textContent,
        combo: document.querySelector('#combo')?.textContent,
        feedback: document.querySelector('#instruction')?.textContent,
        resultHidden: document.querySelector('#round-result')?.hasAttribute('hidden')
      },
      round: window.__TGA_POTION_SCENE__.getRoundState(),
      actors: window.__TGA_POTION_SCENE__.getActorContinuitySnapshot()
    };
  }, label);
  if (!result.canvas) throw new Error(`${label}: canvas missing`);
  if (result.documentSize.width !== result.viewport.width || result.documentSize.height !== result.viewport.height) {
    throw new Error(`${label}: document overflow ${JSON.stringify(result.documentSize)}`);
  }
  return result;
}

await mkdir(capturesPath, { recursive: true });
for (const file of await readdir(capturesPath)) if (file.endsWith('.png')) await rm(path.join(capturesPath, file));

const server = spawn('cmd.exe', ['/d', '/s', '/c', `pnpm exec vite --host 127.0.0.1 --port ${port} --strictPort`], {
  cwd: gamePath, stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true
});

let browser;
try {
  await waitForServer();
  const { chromium } = await import(pathToFileURL(await locatePlaywright()).href);
  browser = await chromium.launch({ headless: true, executablePath: chromePath });
  const audits = [];

  const desktop = await openPage(browser, 1920, 1080);
  audits.push(await audit(desktop, 'desktop-initial'));
  await desktop.screenshot({ path: path.join(capturesPath, '01-desktop-initial.png') });
  await selectPotion(desktop);
  audits.push(await audit(desktop, 'desktop-selected'));
  await desktop.screenshot({ path: path.join(capturesPath, '02-desktop-selected.png') });
  await place(desktop, 'sun', false);
  await desktop.waitForTimeout(180);
  audits.push(await audit(desktop, 'desktop-red-transit'));
  await desktop.screenshot({ path: path.join(capturesPath, '03-desktop-red-transit.png') });
  await desktop.waitForTimeout(800);
  audits.push(await audit(desktop, 'desktop-red-accepted'));
  await desktop.screenshot({ path: path.join(capturesPath, '04-desktop-red-accepted.png') });
  await selectPotion(desktop);
  await place(desktop, 'star');
  audits.push(await audit(desktop, 'desktop-blue-incorrect'));
  await desktop.screenshot({ path: path.join(capturesPath, '05-desktop-blue-incorrect.png') });
  for (const type of ['star', 'sun', 'moon', 'star']) { await selectPotion(desktop); await place(desktop, type); }
  await desktop.waitForFunction(() => window.__TGA_POTION_SCENE__.getRoundState().roundComplete === true);
  audits.push(await audit(desktop, 'desktop-round-complete'));
  await desktop.screenshot({ path: path.join(capturesPath, '06-desktop-round-complete.png') });
  if (desktop.__errors.length) throw new Error(desktop.__errors.join(' | '));
  await desktop.close();

  const minimum = await openPage(browser, 1024, 640);
  audits.push(await audit(minimum, 'minimum-initial'));
  await minimum.screenshot({ path: path.join(capturesPath, '07-minimum-initial.png') });
  await selectPotion(minimum);
  await place(minimum, 'sun');
  audits.push(await audit(minimum, 'minimum-red-accepted'));
  await minimum.screenshot({ path: path.join(capturesPath, '08-minimum-red-accepted.png') });
  if (minimum.__errors.length) throw new Error(minimum.__errors.join(' | '));
  await minimum.close();

  const expiry = await openPage(browser, 1024, 640, false);
  await expiry.waitForFunction(() => window.__TGA_POTION_SCENE__.getRoundState().roundComplete === true, null, { timeout: 35000 });
  audits.push(await audit(expiry, 'minimum-timer-expired'));
  await expiry.screenshot({ path: path.join(capturesPath, '09-minimum-timer-expired.png') });
  if (expiry.__errors.length) throw new Error(expiry.__errors.join(' | '));
  await expiry.close();

  await writeFile(path.join(evidencePath, 'runtime-audit.json'), `${JSON.stringify({ passed: true, capturedAt: new Date().toISOString(), audits }, null, 2)}\n`, 'utf8');
  process.stdout.write(`Captured ${audits.length} live Composition C states.\n`);
} finally {
  await browser?.close();
  if (server.pid) spawnSync('taskkill', ['/pid', String(server.pid), '/t', '/f'], { stdio: 'ignore', windowsHide: true });
}
