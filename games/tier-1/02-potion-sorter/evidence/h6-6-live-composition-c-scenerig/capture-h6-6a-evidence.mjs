import { spawn, spawnSync } from 'node:child_process';
import { mkdir, readdir, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const repoRoot = process.cwd();
const evidencePath = path.join(repoRoot, 'games', 'tier-1', '02-potion-sorter', 'evidence', 'h6-6-live-composition-c-scenerig');
const capturesPath = path.join(evidencePath, 'captures-h6-6a');
const motionPath = path.join(evidencePath, 'motion');
const gamePath = path.join(repoRoot, 'games', 'tier-1', '02-potion-sorter');
const port = 5122;
const rootUrl = `http://127.0.0.1:${port}`;
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const destinationX = { sun: 340, moon: 800, star: 1260 };

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

function attachErrorAudit(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:')) errors.push(`console: ${message.text()}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) errors.push(`response: ${response.status()} ${response.url()}`);
  });
  page.on('requestfailed', (request) => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
  page.__errors = errors;
}

async function bootPage(page, freezeTimer = true) {
  attachErrorAudit(page);
  if (freezeTimer) await page.addInitScript(() => { window.setInterval = () => 0; });
  await page.goto(rootUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#game-canvas canvas', { timeout: 60000 });
  await page.waitForFunction(() => Boolean(window.__TGA_POTION_SCENE__));
  await page.waitForTimeout(600);
  if (page.__errors.length) throw new Error(page.__errors.join(' | '));
}

async function worldToScreen(page, x, y) {
  const box = await page.locator('#game-canvas canvas').boundingBox();
  if (!box) throw new Error('Potion canvas has no bounds.');
  const zoom = Math.max(box.width / 1600, box.height / 900);
  return { x: box.x + box.width / 2 + (x - 800) * zoom, y: box.y + box.height / 2 + (y - 480) * zoom, zoom, box };
}

async function clickWorld(page, x, y) {
  const point = await worldToScreen(page, x, y);
  await page.mouse.click(point.x, point.y);
}

async function tapSelect(page) {
  await clickWorld(page, 800, 570);
  await page.waitForFunction(() => window.__TGA_POTION_SCENE__.getRoundState().selectedPotion === true);
}

async function tapReceiver(page, type) {
  const before = await page.evaluate(() => window.__TGA_POTION_SCENE__.getRoundState().potionIndex);
  await clickWorld(page, destinationX[type], 755);
  await page.waitForFunction((index) => window.__TGA_POTION_SCENE__.getRoundState().potionIndex === index + 1, before);
  await page.waitForTimeout(900);
}

async function beginDrag(page, x = 820, y = 600) {
  const start = await worldToScreen(page, 800, 570);
  const moved = await worldToScreen(page, x, y);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(moved.x, moved.y, { steps: 4 });
  await page.waitForFunction(() => window.__TGA_POTION_SCENE__.getDragState().dragging === true);
}

async function moveDrag(page, x, y) {
  const point = await worldToScreen(page, x, y);
  await page.mouse.move(point.x, point.y, { steps: 8 });
}

async function releaseDrag(page) {
  await page.mouse.up();
}

async function dragToReceiver(page, type) {
  const before = await page.evaluate(() => window.__TGA_POTION_SCENE__.getRoundState().potionIndex);
  await beginDrag(page);
  await moveDrag(page, destinationX[type], 735);
  await releaseDrag(page);
  await page.waitForFunction((index) => window.__TGA_POTION_SCENE__.getRoundState().potionIndex === index + 1, before);
  await page.waitForTimeout(650);
}

async function audit(page, label) {
  return page.evaluate((stateLabel) => {
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
      drag: window.__TGA_POTION_SCENE__.getDragState(),
      actors: window.__TGA_POTION_SCENE__.getActorContinuitySnapshot(),
      environment: window.__TGA_POTION_SCENE__.getEnvironmentDepthSnapshot(),
      interactions: window.__TGA_POTION_SCENE__.getInteractionAudit()
    };
  }, label);
}

async function gearboxClip(page) {
  const topLeft = await worldToScreen(page, 1165, 185);
  const bottomRight = await worldToScreen(page, 1570, 635);
  return {
    x: Math.max(0, topLeft.x), y: Math.max(0, topLeft.y),
    width: Math.min(page.viewportSize().width - Math.max(0, topLeft.x), bottomRight.x - topLeft.x),
    height: Math.min(page.viewportSize().height - Math.max(0, topLeft.y), bottomRight.y - topLeft.y)
  };
}

async function addDiagnosticOverlay(page, kind, payload) {
  await page.evaluate(({ overlayKind, data }) => {
    const overlay = document.createElement('pre');
    overlay.id = 'h6-6a-diagnostic-overlay';
    overlay.textContent = `${overlayKind}\n${JSON.stringify(data, null, 2)}`;
    Object.assign(overlay.style, {
      position: 'fixed', right: '18px', top: '220px', zIndex: '9999', width: '430px', maxHeight: '620px', overflow: 'hidden',
      margin: '0', padding: '14px', border: '2px solid #e7bd6b', borderRadius: '12px', background: 'rgba(13,10,20,.92)',
      color: '#fff1c6', font: '14px/1.35 monospace', whiteSpace: 'pre-wrap', pointerEvents: 'none'
    });
    document.body.appendChild(overlay);
  }, { overlayKind: kind, data: payload });
}

async function removeDiagnosticOverlay(page) {
  await page.evaluate(() => document.querySelector('#h6-6a-diagnostic-overlay')?.remove());
}

await mkdir(capturesPath, { recursive: true });
await mkdir(motionPath, { recursive: true });
for (const directory of [capturesPath, motionPath]) {
  for (const file of await readdir(directory)) await rm(path.join(directory, file));
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
  const dragLifecycle = [];

  const desktopContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1,
    recordVideo: { dir: motionPath, size: { width: 1280, height: 720 } }
  });
  const desktop = await desktopContext.newPage();
  await bootPage(desktop, true);
  audits.push(await audit(desktop, 'desktop-initial-corrected-gearbox'));
  await desktop.screenshot({ path: path.join(capturesPath, '01-desktop-initial-corrected-gearbox.png') });
  const clip = await gearboxClip(desktop);
  await desktop.screenshot({ path: path.join(capturesPath, '03-gearbox-service-bay-crop.png'), clip });
  const environment = await desktop.evaluate(() => window.__TGA_POTION_SCENE__.getEnvironmentDepthSnapshot());
  await addDiagnosticOverlay(desktop, 'GEARBOX / SERVICE BAY DEPTH', environment);
  await desktop.screenshot({ path: path.join(capturesPath, '04-gearbox-depth-diagnostic.png') });
  await removeDiagnosticOverlay(desktop);

  await tapSelect(desktop);
  await tapReceiver(desktop, 'sun');
  audits.push(await audit(desktop, 'tap-correct'));
  await desktop.screenshot({ path: path.join(capturesPath, '05-tap-correct-receiver.png') });
  await tapSelect(desktop);
  await tapReceiver(desktop, 'star');
  audits.push(await audit(desktop, 'tap-wrong'));
  await desktop.screenshot({ path: path.join(capturesPath, '06-tap-wrong-receiver.png') });

  const dragActorId = await desktop.evaluate(() => window.__TGA_POTION_SCENE__.getRoundState().activePotionId);
  dragLifecycle.push({ phase: 'inspection', actorId: dragActorId, actors: await desktop.evaluate(() => window.__TGA_POTION_SCENE__.getActorContinuitySnapshot()) });
  await beginDrag(desktop, 835, 610);
  dragLifecycle.push({ phase: 'drag-start', actorId: dragActorId, actors: await desktop.evaluate(() => window.__TGA_POTION_SCENE__.getActorContinuitySnapshot()) });
  audits.push(await audit(desktop, 'drag-start'));
  await desktop.screenshot({ path: path.join(capturesPath, '07-drag-start.png') });
  await moveDrag(desktop, destinationX.star, 735);
  dragLifecycle.push({ phase: 'receiver-hover', actorId: dragActorId, actors: await desktop.evaluate(() => window.__TGA_POTION_SCENE__.getActorContinuitySnapshot()) });
  audits.push(await audit(desktop, 'drag-hover-correct'));
  await desktop.screenshot({ path: path.join(capturesPath, '08-drag-hover-valid-receiver.png') });
  await releaseDrag(desktop);
  await desktop.waitForTimeout(650);
  dragLifecycle.push({ phase: 'accepted', actorId: dragActorId, actors: await desktop.evaluate(() => window.__TGA_POTION_SCENE__.getActorContinuitySnapshot()) });
  audits.push(await audit(desktop, 'drag-correct-contained'));
  await desktop.screenshot({ path: path.join(capturesPath, '09-drag-correct-contained.png') });

  await dragToReceiver(desktop, 'moon');
  audits.push(await audit(desktop, 'drag-wrong-combo-break'));
  await desktop.screenshot({ path: path.join(capturesPath, '10-drag-wrong-combo-break.png') });

  const outsideActorId = await desktop.evaluate(() => window.__TGA_POTION_SCENE__.getRoundState().activePotionId);
  const indexBeforeOutside = await desktop.evaluate(() => window.__TGA_POTION_SCENE__.getRoundState().potionIndex);
  await beginDrag(desktop);
  await moveDrag(desktop, 1110, 610);
  await releaseDrag(desktop);
  await desktop.waitForTimeout(450);
  const outsideAudit = await audit(desktop, 'outside-drop-return');
  if (outsideAudit.round.potionIndex !== indexBeforeOutside || outsideAudit.round.activePotionId !== outsideActorId) {
    throw new Error('Outside drop consumed or replaced the active potion.');
  }
  audits.push(outsideAudit);
  await desktop.screenshot({ path: path.join(capturesPath, '11-outside-drop-return.png') });
  await addDiagnosticOverlay(desktop, 'STABLE ACTOR DRAG LIFECYCLE', dragLifecycle);
  await desktop.screenshot({ path: path.join(capturesPath, '12-actor-continuity-diagnostic.png') });
  await removeDiagnosticOverlay(desktop);

  await dragToReceiver(desktop, 'moon');
  await tapSelect(desktop);
  await tapReceiver(desktop, 'star');
  await desktop.waitForFunction(() => window.__TGA_POTION_SCENE__.getRoundState().roundComplete === true);
  const completed = await audit(desktop, 'mixed-input-round-complete');
  audits.push(completed);
  await desktop.screenshot({ path: path.join(capturesPath, '13-mixed-input-round-complete.png') });
  const resolutions = completed.interactions.filter((entry) => entry.kind === 'resolution');
  if (resolutions.length !== 6) throw new Error(`Expected 6 exact resolutions, found ${resolutions.length}.`);
  if (desktop.__errors.length) throw new Error(desktop.__errors.join(' | '));
  const video = desktop.video();
  await desktop.close();
  const temporaryVideoPath = await video.path();
  await desktopContext.close();
  await rename(temporaryVideoPath, path.join(motionPath, 'h6-6a-tap-drag-gearbox-motion.webm'));

  const minimumContext = await browser.newContext({ viewport: { width: 1024, height: 640 }, deviceScaleFactor: 1 });
  const minimum = await minimumContext.newPage();
  await bootPage(minimum, true);
  audits.push(await audit(minimum, 'minimum-initial-corrected-gearbox'));
  await minimum.screenshot({ path: path.join(capturesPath, '02-minimum-initial-corrected-gearbox.png') });
  await minimum.close();
  await minimumContext.close();

  const expiryContext = await browser.newContext({ viewport: { width: 1024, height: 640 }, deviceScaleFactor: 1 });
  const expiry = await expiryContext.newPage();
  await bootPage(expiry, false);
  await beginDrag(expiry, 850, 620);
  await expiry.waitForFunction(() => window.__TGA_POTION_SCENE__.getRoundState().roundComplete === true, null, { timeout: 35000 });
  await expiry.waitForTimeout(250);
  const expired = await audit(expiry, 'timer-expired-drag-disabled');
  if (expired.drag.pointerId !== null || expired.round.potionIndex !== 0) throw new Error('Timer expiry did not disable drag without advancing.');
  audits.push(expired);
  await expiry.screenshot({ path: path.join(capturesPath, '14-timer-expiry-drag-disabled.png') });
  await expiry.mouse.up();
  await expiry.close();
  await expiryContext.close();

  const reducedContext = await browser.newContext({ viewport: { width: 1024, height: 640 }, reducedMotion: 'reduce' });
  const reduced = await reducedContext.newPage();
  await bootPage(reduced, true);
  const reducedBefore = await reduced.evaluate(() => window.__TGA_POTION_SCENE__.getEnvironmentDepthSnapshot());
  await reduced.waitForTimeout(1200);
  const reducedAfter = await reduced.evaluate(() => window.__TGA_POTION_SCENE__.getEnvironmentDepthSnapshot());
  if (JSON.stringify(reducedBefore.gearAngles) !== JSON.stringify(reducedAfter.gearAngles)) throw new Error('Reduced-motion gears continued rotating.');
  await reduced.close();
  await reducedContext.close();

  await writeFile(path.join(evidencePath, 'h6-6a-runtime-audit.json'), `${JSON.stringify({ passed: true, capturedAt: new Date().toISOString(), audits }, null, 2)}\n`, 'utf8');
  await writeFile(path.join(evidencePath, 'h6-6a-drag-lifecycle-audit.json'), `${JSON.stringify({ passed: true, actorId: dragActorId, lifecycle: dragLifecycle }, null, 2)}\n`, 'utf8');
  process.stdout.write(`Captured ${audits.length} H6.6A runtime states plus motion proof.\n`);
} finally {
  await browser?.close();
  if (server.pid) spawnSync('taskkill', ['/pid', String(server.pid), '/t', '/f'], { stdio: 'ignore', windowsHide: true });
}
