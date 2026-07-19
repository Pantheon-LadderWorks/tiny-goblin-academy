import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const evidenceRoot = path.dirname(fileURLToPath(import.meta.url));
const gameRoot = path.resolve(evidenceRoot, '../..');
const repoRoot = path.resolve(gameRoot, '../../../..');
const playwrightRequire = createRequire(path.resolve(gameRoot, '../01-button-goblin-clicker/package.json'));
const { chromium } = playwrightRequire('playwright');
const captures = path.join(evidenceRoot, 'captures');
const telemetry = path.join(evidenceRoot, 'telemetry');
const videos = path.join(evidenceRoot, 'video');
const videoTemp = path.join(videos, '.capture-temp');
const baseUrl = 'http://127.0.0.1:4315/';

await Promise.all([captures, telemetry, videos].map((directory) => mkdir(directory, { recursive: true })));
await rm(videoTemp, { recursive: true, force: true });
await mkdir(videoTemp, { recursive: true });

const browser = await chromium.launch({ headless: true });
const browserErrors = [];
const attachErrorCapture = (page) => {
  page.on('console', (message) => { if (message.type() === 'error') browserErrors.push(message.text()); });
  page.on('pageerror', (error) => browserErrors.push(error.message));
};

const openGame = async (viewport, { rolls = '4', mode = 'full', dev = false } = {}) => {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  attachErrorCapture(page);
  const url = new URL(baseUrl);
  url.searchParams.set('evidenceRolls', rolls);
  url.searchParams.set('motion', mode);
  if (dev) url.searchParams.set('dev', '1');
  await page.goto(url.toString(), { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__TGA_DICE_DUEL_H6_11__?.getDiagnostics().ready === true);
  await page.waitForTimeout(250);
  return { context, page };
};

const diag = (page) => page.evaluate(() => window.__TGA_DICE_DUEL_H6_11__?.getDiagnostics());
const waitPhase = (page, phase) => page.waitForFunction(
  (expected) => window.__TGA_DICE_DUEL_H6_11__?.getDiagnostics().presentation?.phase === expected,
  phase,
  { timeout: 10000 },
);
const waitState = (page, phase) => page.waitForFunction(
  (expected) => window.__TGA_DICE_DUEL_H6_11__?.getDiagnostics().state?.phase === expected,
  phase,
  { timeout: 10000 },
);
const waitReady = (page) => page.waitForFunction(
  () => window.__TGA_DICE_DUEL_H6_11__?.getDiagnostics().controller?.busyState === 'ready',
  undefined,
  { timeout: 10000 },
);
const shot = (page, name) => page.screenshot({ path: path.join(captures, name), fullPage: false });
const writeJson = (name, value) => writeFile(path.join(telemetry, name), `${JSON.stringify(value, null, 2)}\n`, 'utf8');

for (const viewport of [
  { width: 1920, height: 1080, suffix: '1920x1080' },
  { width: 1024, height: 640, suffix: '1024x640' },
]) {
  const { context, page } = await openGame(viewport, { rolls: '4' });
  await shot(page, `01-initial-ready-${viewport.suffix}.png`);
  await writeJson(`scale-${viewport.suffix}.json`, await diag(page));
  await context.close();

  const diagnostic = await openGame(viewport, { rolls: '4', dev: true });
  await shot(diagnostic.page, `02-production-scale-diagnostic-${viewport.suffix}.png`);
  await diagnostic.context.close();
}

const captureMotionPhase = async (name, phase) => {
  const { context, page } = await openGame({ width: 1920, height: 1080 }, { rolls: '4' });
  await page.evaluate((target) => window.__TGA_DICE_DUEL_H6_11__?.freezeAtPhase(target), phase);
  await page.evaluate(() => document.querySelector('#rollbtn')?.click());
  await waitPhase(page, phase);
  await shot(page, name);
  await writeJson(`${name.replace('.png', '')}.json`, await diag(page));
  await context.close();
};

await captureMotionPhase('03-full-anticipation.png', 'anticipation');
await captureMotionPhase('04-full-airborne-tumble.png', 'release');
await captureMotionPhase('05-full-first-impact.png', 'impact-one');
await captureMotionPhase('06-full-rebound.png', 'rebound');

for (const face of [1, 4, 6]) {
  const { context, page } = await openGame({ width: 1920, height: 1080 }, { rolls: String(face) });
  await page.click('#rollbtn');
  await waitState(page, 'action');
  await shot(page, `07-full-final-settle-face-${face}.png`);
  await writeJson(`full-face-${face}.json`, await diag(page));
  await context.close();
}

{
  const { context, page } = await openGame({ width: 1920, height: 1080 }, { rolls: '4', mode: 'reduced' });
  await page.click('#rollbtn');
  await waitState(page, 'action');
  await shot(page, '08-reduced-final-settle-face-4.png');
  await writeJson('reduced-face-4.json', await diag(page));
  await context.close();
}

{
  const { context, page } = await openGame({ width: 1920, height: 1080 }, { rolls: '4,3' });
  await page.click('#rollbtn');
  await waitState(page, 'action');
  await shot(page, '09-action-controls-unlocked-after-settle.png');
  await page.click('[data-a="heal"]');
  const returning = await page.evaluate(() => ({
    diagnostics: window.__TGA_DICE_DUEL_H6_11__?.getDiagnostics(),
    rollDisabled: document.querySelector('#rollbtn')?.disabled,
  }));
  await writeJson('input-lock-during-return.json', returning);
  await waitReady(page);
  await shot(page, '10-same-actor-returned-ready.png');
  await page.click('#rollbtn');
  await waitState(page, 'action');
  const repeated = await diag(page);
  await writeJson('persistent-actor-repeated-turns.json', repeated);
  await page.click('[data-a="block"]');
  await waitReady(page);
  await page.click('#history-toggle');
  await shot(page, '11-full-history-one-roll-entry-per-turn.png');
  await writeJson('history-and-recent-exchange.json', await diag(page));
  await context.close();
}

const playToTerminal = async (page, expected) => {
  for (let turn = 0; turn < 6; turn += 1) {
    await page.click('#rollbtn');
    await waitState(page, 'action');
    await page.click('[data-a="attack"]');
    const current = await diag(page);
    if (current.state.phase === expected) return current;
    await waitReady(page);
  }
  throw new Error(`Did not reach ${expected}`);
};

for (const terminal of [
  { phase: 'won', rolls: '6,6', shot: '12-victory-final-die-settled.png' },
  { phase: 'lost', rolls: '1,1,1,1', shot: '13-defeat-final-die-settled.png' },
]) {
  const { context, page } = await openGame({ width: 1920, height: 1080 }, { rolls: terminal.rolls });
  const final = await playToTerminal(page, terminal.phase);
  await shot(page, terminal.shot);
  await writeJson(`${terminal.phase}-final-state.json`, final);
  await context.close();
}

{
  const { context, page } = await openGame({ width: 1920, height: 1080 }, { rolls: '4', dev: true });
  await page.click('#rollbtn');
  await waitState(page, 'action');
  await shot(page, '14-dev-authority-diagnostics.png');
  await writeJson('dev-authority-diagnostics.json', await diag(page));
  await context.close();
}

const record = async (name, parameters, action) => {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: videoTemp, size: { width: 1280, height: 720 } },
  });
  const page = await context.newPage();
  attachErrorCapture(page);
  const url = new URL(baseUrl);
  url.searchParams.set('evidenceRolls', parameters.rolls);
  url.searchParams.set('motion', parameters.mode ?? 'full');
  await page.goto(url.toString(), { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__TGA_DICE_DUEL_H6_11__?.getDiagnostics().ready === true);
  await page.waitForTimeout(300);
  const video = page.video();
  await action(page);
  await page.waitForTimeout(350);
  await context.close();
  await video?.saveAs(path.join(videos, name));
};

await record('01-live-full-motion-duel-sequence.webm', { rolls: '4,3' }, async (page) => {
  await page.click('#rollbtn');
  await waitState(page, 'action');
  await page.click('[data-a="heal"]');
  await waitReady(page);
  await page.click('#rollbtn');
  await waitState(page, 'action');
});

await record('02-live-repeated-turn-one-actor.webm', { rolls: '4,3,5' }, async (page) => {
  for (const action of ['heal', 'block']) {
    await page.click('#rollbtn');
    await waitState(page, 'action');
    await page.click(`[data-a="${action}"]`);
    await waitReady(page);
  }
  await page.click('#rollbtn');
  await waitState(page, 'action');
});

await record('03-live-reduced-motion.webm', { rolls: '4', mode: 'reduced' }, async (page) => {
  await page.click('#rollbtn');
  await waitState(page, 'action');
});

await record('04-live-concurrent-input-lock.webm', { rolls: '4' }, async (page) => {
  const returns = await page.evaluate(() => [
    window.__TGA_DICE_DUEL_H6_11__?.requestRoll(),
    window.__TGA_DICE_DUEL_H6_11__?.requestRoll(),
    window.__TGA_DICE_DUEL_H6_11__?.requestRoll(),
  ]);
  await writeJson('concurrent-roll-return-values.json', returns);
  await waitState(page, 'action');
  await writeJson('concurrent-roll-final-state.json', await diag(page));
});

await record('05-live-victory-final-die-settled.webm', { rolls: '6,6' }, async (page) => {
  await playToTerminal(page, 'won');
});

const hash = async (file) => createHash('sha256').update(await readFile(file)).digest('hex');
const protectedLabFiles = [
  'dierig-lab.html',
  'vite.config.ts',
  'src/dierig/cube-projection.ts',
  'src/dierig/dierig-authority.ts',
  'src/dierig/dierig-model.ts',
  'src/dierig/dierig.ts',
  'src/dierig/face-mapping.ts',
  'src/dierig/lab-main.ts',
  'src/dierig/lab-styles.css',
  'src/dierig/motion-plan.ts',
];
const labHashes = Object.fromEntries(await Promise.all(protectedLabFiles.map(async (file) => [file, await hash(path.join(gameRoot, file))])));
const rollSourceText = await readFile(path.join(gameRoot, 'src/roll-source.ts'), 'utf8');
await writeFile(path.join(evidenceRoot, 'random-source-audit.json'), `${JSON.stringify({
  productionSource: 'Web Crypto getRandomValues Uint32 rejection sampling',
  rejectionLimit: 4_294_967_292,
  directModuloWithoutRejection: false,
  mathRandomPresent: rollSourceText.includes('Math.random'),
  fixedProductionSequencePresent: /createRuntimeRollSource[\s\S]*HISTORICAL_FIXED_D6_SEQUENCE/.test(rollSourceText),
  deterministicEvidenceInjectionDevelopmentOnly: true,
  faces: [1, 2, 3, 4, 5, 6],
  distributionClaimedFromSmallSample: false,
}, null, 2)}\n`, 'utf8');
await writeFile(path.join(evidenceRoot, 'protected-hashes.json'), `${JSON.stringify({ labHashes }, null, 2)}\n`, 'utf8');

await browser.close();
await rm(videoTemp, { recursive: true, force: true });
const report = { status: browserErrors.length ? 'failed' : 'passed', browserErrors };
await writeFile(path.join(evidenceRoot, 'capture-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
if (browserErrors.length) throw new Error(`Browser errors: ${browserErrors.join(' | ')}`);
