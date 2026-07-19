import { createRequire } from 'node:module';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const evidenceRoot = path.dirname(fileURLToPath(import.meta.url));
const playwrightRequire = createRequire(path.resolve(evidenceRoot, '../../../01-button-goblin-clicker/package.json'));
const { chromium } = playwrightRequire('playwright');
const captures = path.join(evidenceRoot, 'captures');
const telemetryDir = path.join(evidenceRoot, 'telemetry');
const videos = path.join(evidenceRoot, 'video');
const videoTemp = path.join(videos, '.capture-temp');
const baseUrl = 'http://127.0.0.1:4314/dierig-lab.html';

await Promise.all([captures, telemetryDir, videos].map((directory) => mkdir(directory, { recursive: true })));
await rm(videoTemp, { recursive: true, force: true });
await mkdir(videoTemp, { recursive: true });

const browser = await chromium.launch({ headless: true });
const consoleErrors = [];

const openLab = async (viewport, parameters = {}) => {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  const url = new URL(baseUrl);
  Object.entries(parameters).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  await page.goto(url.toString(), { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__DIE_RIG_LAB__?.ready === true);
  return { context, page };
};

const waitSettled = (page, count = 1) => page.waitForFunction(
  (minimum) => {
    const telemetry = window.__DIE_RIG_LAB__?.getTelemetry();
    return telemetry && !telemetry.busy && telemetry.completionCount >= minimum;
  },
  count,
  { timeout: 10000 },
);

const screenshot = (page, name) => page.screenshot({ path: path.join(captures, name), fullPage: false });

for (const viewport of [
  { width: 1920, height: 1080, suffix: '1920x1080' },
  { width: 1024, height: 640, suffix: '1024x640' },
]) {
  const { context, page } = await openLab(viewport, { autoplay: 0 });
  await screenshot(page, `01-initial-${viewport.suffix}.png`);
  await context.close();
}

for (const face of [1, 2, 3, 4, 5, 6]) {
  const { context, page } = await openLab({ width: 1920, height: 1080 }, { face, mode: 'reduced', seed: 100 + face });
  await waitSettled(page);
  await screenshot(page, `02-settled-face-${face}-1920x1080.png`);
  await context.close();
}

for (const face of [1, 4, 6]) {
  for (const mode of ['full', 'reduced']) {
    const { context, page } = await openLab({ width: 1024, height: 640 }, { face, mode, seed: 200 + face });
    await waitSettled(page);
    const telemetry = await page.evaluate(() => window.__DIE_RIG_LAB__?.getTelemetry());
    await writeFile(path.join(telemetryDir, `face-${face}-${mode}.json`), `${JSON.stringify(telemetry, null, 2)}\n`, 'utf8');
    if (mode === 'reduced') await screenshot(page, `03-settled-face-${face}-1024x640.png`);
    await context.close();
  }
}

{
  const { context, page } = await openLab({ width: 1920, height: 1080 }, { face: 4, mode: 'full', seed: 314, diagnostic: 1 });
  await page.waitForTimeout(650);
  await screenshot(page, '04-topology-diagnostic-in-motion-1920x1080.png');
  await waitSettled(page);
  await screenshot(page, '05-topology-diagnostic-settled-1920x1080.png');
  await context.close();
}

const record = async (name, action) => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: videoTemp, size: { width: 1280, height: 720 } } });
  const page = await context.newPage();
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  await page.goto(`${baseUrl}?autoplay=0`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__DIE_RIG_LAB__?.ready === true);
  const video = page.video();
  await action(page);
  await page.waitForTimeout(400);
  await context.close();
  await video?.saveAs(path.join(videos, name));
};

await record('01-full-six-face-injected-results.webm', async (page) => {
  for (const face of [1, 2, 3, 4, 5, 6]) {
    await page.evaluate(({ face, seed }) => window.__DIE_RIG_LAB__?.roll(face, 'full', seed), { face, seed: 400 + face });
    await waitSettled(page, face);
    await page.waitForTimeout(160);
  }
});

await record('02-persistent-actor-repeat-rolls.webm', async (page) => {
  for (const [index, face] of [6, 1, 4, 2].entries()) {
    await page.evaluate(({ face, seed }) => window.__DIE_RIG_LAB__?.roll(face, 'full', seed), { face, seed: 500 + index });
    await waitSettled(page, index + 1);
  }
  await writeFile(path.join(telemetryDir, 'persistent-actor-repeat-rolls.json'), `${JSON.stringify(await page.evaluate(() => window.__DIE_RIG_LAB__?.getTelemetry()), null, 2)}\n`, 'utf8');
});

await record('03-reduced-motion-representative-faces.webm', async (page) => {
  for (const [index, face] of [1, 4, 6].entries()) {
    await page.evaluate(({ face, seed }) => window.__DIE_RIG_LAB__?.roll(face, 'reduced', seed), { face, seed: 600 + face });
    await waitSettled(page, index + 1);
    await page.waitForTimeout(260);
  }
});

await record('04-full-vs-reduced-comparison.webm', async (page) => {
  await page.evaluate(() => window.__DIE_RIG_LAB__?.roll(5, 'full', 701));
  await waitSettled(page, 1);
  await page.waitForTimeout(500);
  await page.evaluate(() => window.__DIE_RIG_LAB__?.roll(5, 'reduced', 702));
  await waitSettled(page, 2);
});

await record('05-overlap-rejection-proof.webm', async (page) => {
  const accepted = await page.evaluate(() => [
    window.__DIE_RIG_LAB__?.roll(3, 'full', 801),
    window.__DIE_RIG_LAB__?.roll(6, 'full', 802),
  ]);
  await writeFile(path.join(telemetryDir, 'overlap-request-return-values.json'), `${JSON.stringify(accepted, null, 2)}\n`, 'utf8');
  await waitSettled(page, 1);
  await writeFile(path.join(telemetryDir, 'overlap-final-telemetry.json'), `${JSON.stringify(await page.evaluate(() => window.__DIE_RIG_LAB__?.getTelemetry()), null, 2)}\n`, 'utf8');
});

await browser.close();
await rm(videoTemp, { recursive: true, force: true });
await writeFile(path.join(evidenceRoot, 'capture-report.json'), `${JSON.stringify({ consoleErrors, status: consoleErrors.length ? 'failed' : 'passed' }, null, 2)}\n`, 'utf8');
if (consoleErrors.length) throw new Error(`Browser console errors: ${consoleErrors.join(' | ')}`);
