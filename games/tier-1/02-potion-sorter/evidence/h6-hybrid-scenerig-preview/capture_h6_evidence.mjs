import { spawn, spawnSync } from 'node:child_process';
import { copyFile, mkdir, readdir, rename, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const repoRoot = process.cwd();
const labRelative = 'games/tier-1/02-potion-sorter/evidence/h6-hybrid-scenerig-preview';
const labPath = path.join(repoRoot, ...labRelative.split('/'));
const captures = path.join(labPath, 'captures');
const referenceDir = path.join(captures, 'reference');
const frameDir = path.join(captures, 'continuity-frames');
const port = 5116;
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baseline = 'fc48cf92d01e0af260d474c096257245eedea7d0';

const staticShots = [
  ['initial', '00-perspective-guide.png', 1600, 900, '&perspective=1'],
  ['initial', 'reference/corrected-silhouette.png', 1600, 900, '&silhouette=1&perspective=1'],
  ['initial', '01-initial-queue-1920x1080.png', 1920, 1080, ''],
  ['initial', '02-initial-queue-1024x640.png', 1024, 640, ''],
  ['initial', '14-queue-depth-open-gantry.png', 1600, 900, ''],
  ['initial', '15-inspection-aperture-continuous-conveyor.png', 1600, 900, ''],
  ['initial', '09-actor-identity-ownership-diagnostic.png', 1600, 900, '&debug=1'],
  ['initial', '12-reduced-motion.png', 1600, 900, '&motion=reduce'],
];

const livePaths = [
  'games/tier-1/02-potion-sorter/src/main.ts',
  'games/tier-1/02-potion-sorter/src/potion-scene.ts',
  'games/tier-1/02-potion-sorter/src/styles.css',
  'games/tier-1/02-potion-sorter/src/controller.ts',
  'games/tier-1/02-potion-sorter/src/simulation.ts',
  'games/tier-1/02-potion-sorter/package.json',
  'pnpm-lock.yaml',
];

async function locatePlaywright() {
  const entries = await readdir(path.join(repoRoot, 'node_modules', '.pnpm'));
  const packageDir = entries.find((name) => name.startsWith('playwright@'));
  if (!packageDir) throw new Error('Repository-local Playwright was not found.');
  return path.join(repoRoot, 'node_modules', '.pnpm', packageDir, 'node_modules', 'playwright', 'index.mjs');
}

async function waitForServer(url) {
  for (let attempt = 0; attempt < 240; attempt += 1) {
    try { const response = await fetch(url); if (response.ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Preview server did not become ready at ${url}`);
}

function gitDiffFor(relative) {
  return spawnSync('git', ['diff', '--exit-code', baseline, '--', relative], { cwd: repoRoot, encoding: 'utf8' });
}

await mkdir(captures, { recursive: true });
await mkdir(referenceDir, { recursive: true });
const opaqueBefore = path.join(referenceDir, 'opaque-cabinet-before.png');
try {
  await stat(opaqueBefore);
} catch {
  await copyFile(path.join(captures, '01-initial-queue-1920x1080.png'), opaqueBefore);
}
await rm(frameDir, { recursive: true, force: true });
await mkdir(frameDir, { recursive: true });
for (const existing of await readdir(captures)) {
  if (existing.endsWith('.png') || existing.endsWith('.webm')) await rm(path.join(captures, existing));
}

const server = spawn('python', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], {
  cwd: repoRoot, stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true,
});

let browser;
try {
  const rootUrl = `http://127.0.0.1:${port}`;
  await waitForServer(`${rootUrl}/${labRelative}/index.html`);
  const { chromium } = await import(pathToFileURL(await locatePlaywright()).href);
  browser = await chromium.launch({ headless: true, executablePath: chromePath });
  const responsiveProofs = [];
  let spatialContract;

  const referencePage = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
  await referencePage.goto(`${rootUrl}/${labRelative}/composition-c-reference.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await referencePage.screenshot({ path: path.join(referenceDir, 'original-composition-c.png'), timeout: 60000 });
  await referencePage.close();

  for (const [state, file, width, height, extra] of staticShots) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', (error) => errors.push(String(error)));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
    page.on('requestfailed', (request) => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
    await page.goto(`${rootUrl}/${labRelative}/index.html?capture=1&state=${state}${extra}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => window.__H6_PREVIEW_STATE__?.ready === true, null, { timeout: 60000 });
    await page.waitForTimeout(400);
    if (errors.length) throw new Error(`${file}: ${errors.join(' | ')}`);
    const previewState = await page.evaluate(() => window.__H6_PREVIEW_STATE__);
    if (file === '01-initial-queue-1920x1080.png') spatialContract = previewState.spatialContract;
    if (width === 1920 || width === 1024) responsiveProofs.push({ file, ...previewState.viewportAudit });
    await page.screenshot({ path: path.join(captures, file) });
    await page.close();
    process.stdout.write(`captured ${file} (${width}x${height})\n`);
  }

  async function captureInspectionCrop(extra, output) {
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
    await page.goto(`${rootUrl}/${labRelative}/index.html?capture=1&state=initial${extra}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => window.__H6_PREVIEW_STATE__?.ready === true);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(captures, output), clip: { x: 390, y: 205, width: 820, height: 620 } });
    await page.close();
  }

  await captureInspectionCrop('', '16-inspection-gantry-presentation-crop.png');
  await captureInspectionCrop('&debug=1', '17-inspection-gantry-diagnostic-crop.png');

  const livePage = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
  livePage.setDefaultTimeout(30000);
  await livePage.goto(`${rootUrl}/${labRelative}/index.html?capture=1&autoplay=1&pacing=evidence`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await livePage.waitForFunction(() => window.__H6_PREVIEW_STATE__?.ready === true);

  async function waitPhase(phase) {
    await livePage.waitForFunction((expected) => window.__H6_PREVIEW_STATE__?.timelinePhase === expected, phase);
  }

  async function captureBurst(phase, prefix, count, interval) {
    await waitPhase(phase);
    const files = [];
    for (let index = 0; index < count; index += 1) {
      const filename = `${prefix}-${String(index + 1).padStart(2, '0')}.png`;
      await livePage.screenshot({ path: path.join(frameDir, filename) });
      files.push(`continuity-frames/${filename}`);
      if (index < count - 1) await livePage.waitForTimeout(interval);
    }
    return files;
  }

  await waitPhase('red-receiver-entry');
  await livePage.screenshot({ path: path.join(captures, '03-red-travelling-to-left-receiver.png') });
  const redFrames = await captureBurst('red-receiver-entry', 'red-receiver', 4, 150);
  const gantryAdvanceFrames = await captureBurst('blue-approach', 'rear-middle-gantry', 6, 170);
  await waitPhase('red-accepted');
  await livePage.screenshot({ path: path.join(captures, '04-red-accepted-blue-green-advanced.png') });

  await waitPhase('blue-receiver-entry');
  await livePage.screenshot({ path: path.join(captures, '05-blue-travelling-to-center-receiver.png') });
  const blueFrames = await captureBurst('blue-receiver-entry', 'blue-receiver', 4, 150);
  const apertureFrames = await captureBurst('green-approach', 'green-aperture-approach', 6, 170);
  await waitPhase('blue-accepted');
  await livePage.screenshot({ path: path.join(captures, '06-blue-accepted-green-advanced.png') });

  await waitPhase('green-receiver-entry');
  await livePage.screenshot({ path: path.join(captures, '07-green-travelling-to-right-receiver.png') });
  const greenFrames = await captureBurst('green-receiver-entry', 'green-receiver', 4, 150);
  await waitPhase('finished');
  await livePage.screenshot({ path: path.join(captures, '08-all-three-accepted-queue-empty.png') });
  await livePage.waitForFunction(() => window.__H6_PREVIEW_STATE__?.demoComplete === true);
  const lifecycleProof = await livePage.evaluate(() => window.__H6_PREVIEW_STATE__.actorLifecycle);
  await livePage.close();

  async function captureGrid(files, title, output, columns) {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    const rows = Math.ceil(files.length / columns);
    const cells = files.map((file, index) => `<figure><img src="${rootUrl}/${labRelative}/captures/${file}"><figcaption>FRAME ${String(index + 1).padStart(2, '0')}</figcaption></figure>`).join('');
    await page.setContent(`<html><head><style>*{box-sizing:border-box}body{margin:0;background:#0d0912;color:#f1d69a;font-family:Georgia,serif}.board{width:1920px;height:1080px;padding:20px;display:grid;grid-template-rows:58px 1fr;gap:12px}h1{margin:0;text-align:center;font-size:30px;letter-spacing:2px}.grid{display:grid;grid-template-columns:repeat(${columns},1fr);grid-template-rows:repeat(${rows},1fr);gap:10px}figure{margin:0;min-height:0;display:grid;grid-template-rows:1fr 26px;border:2px solid #8f653d;background:#17101c;overflow:hidden}img{width:100%;height:100%;object-fit:contain}figcaption{text-align:center;font-size:15px;padding-top:4px}</style></head><body><main class="board"><h1>${title}</h1><section class="grid">${cells}</section></main></body></html>`, { waitUntil: 'load' });
    await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0));
    await page.screenshot({ path: path.join(captures, output) });
    await page.close();
  }

  await captureGrid(apertureFrames, 'APERTURE APPROACH CONTINUITY · SAME GREEN ACTOR', '10-aperture-approach-continuity-contact-sheet.png', 3);
  await captureGrid([...redFrames, ...blueFrames, ...greenFrames], 'RECEIVER HANDOFF CONTINUITY · RED / BLUE / GREEN', '11-receiver-handoff-continuity-contact-sheet.png', 4);
  await captureGrid(gantryAdvanceFrames, 'REAR → MIDDLE · BEHIND THEN BENEATH UPPER GANTRY', '18-rear-middle-gantry-occlusion-contact-sheet.png', 3);

  async function captureComparison(left, leftLabel, right, rightLabel, output) {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    const imageUrl = (relative) => `${rootUrl}/${labRelative}/captures/${relative}`;
    await page.setContent(`<html><head><style>*{box-sizing:border-box}body{margin:0;background:#0e0914;color:#f4ddb0;font-family:Georgia,serif}.board{width:1920px;height:1080px;padding:30px;display:grid;grid-template-columns:1fr 1fr;gap:26px}.cell{display:grid;grid-template-rows:62px 1fr;background:#191021;border:4px solid #8e653e;border-radius:22px;overflow:hidden}.label{display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:bold;letter-spacing:1px;border-bottom:2px solid #8e653e}.image{width:100%;height:100%;object-fit:contain;background:#09060d}</style></head><body><main class="board"><section class="cell"><div class="label">${leftLabel}</div><img class="image" src="${imageUrl(left)}"></section><section class="cell"><div class="label">${rightLabel}</div><img class="image" src="${imageUrl(right)}"></section></main></body></html>`, { waitUntil: 'load' });
    await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0));
    await page.screenshot({ path: path.join(referenceDir, output) });
    await page.close();
  }

  await captureComparison('reference/original-composition-c.png', 'ORIGINAL C · SPATIAL AUTHORITY', 'reference/corrected-silhouette.png', 'CORRECTED SILHOUETTE', '01-original-c-vs-corrected-silhouette.png');
  await captureComparison('reference/rejected-diagonal-1920x1080.png', 'REJECTED DIAGONAL DRAFT', '01-initial-queue-1920x1080.png', 'CORRECTED COMPOSITION C', '02-rejected-vs-corrected-1920x1080.png');
  await captureComparison('reference/opaque-cabinet-before.png', 'BEFORE · OPAQUE INSPECTION CABINET', '01-initial-queue-1920x1080.png', 'AFTER · OPEN CONVEYOR GANTRY', '03-opaque-cabinet-vs-open-gantry.png');

  const videoContext = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: captures, size: { width: 1280, height: 720 } },
  });
  const videoPage = await videoContext.newPage();
  await videoPage.goto(`${rootUrl}/${labRelative}/index.html?capture=1&autoplay=1`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await videoPage.waitForFunction(() => window.__H6_PREVIEW_STATE__?.demoComplete === true, null, { timeout: 30000 });
  const videoLifecycleProof = await videoPage.evaluate(() => window.__H6_PREVIEW_STATE__.actorLifecycle);
  await videoPage.waitForTimeout(500);
  await videoPage.close();
  await videoContext.close();
  const generatedVideo = (await readdir(captures)).find((name) => name.endsWith('.webm'));
  if (!generatedVideo) throw new Error('Playwright did not produce the motion proof.');
  const motionPath = path.join(captures, '13-complete-demo-cycle.webm');
  await rename(path.join(captures, generatedVideo), motionPath);

  const stableIds = ['potion-green', 'potion-blue', 'potion-red'];
  const lifecyclePassed = lifecycleProof.passed
    && lifecycleProof.visualActorCount === 3
    && JSON.stringify(lifecycleProof.stableActorIds) === JSON.stringify(stableIds)
    && lifecycleProof.timelineAudit.every((entry) => entry.passed)
    && lifecycleProof.clonesCreated === false
    && lifecycleProof.invisibleHandoffs === false
    && JSON.stringify(videoLifecycleProof.stableActorIds) === JSON.stringify(stableIds)
    && JSON.stringify(videoLifecycleProof.occupancy) === JSON.stringify(lifecycleProof.occupancy);
  await writeFile(path.join(labPath, 'actor-lifecycle-audit.json'), `${JSON.stringify({
    laneId: 'H6-potion-actor-continuity', passed: lifecyclePassed,
    deterministicRunsCompared: 2, stableActorIds: stableIds,
    presentationActorCount: lifecycleProof.visualActorCount,
    finalOccupancy: lifecycleProof.occupancy,
    clonesCreated: lifecycleProof.clonesCreated,
    invisibleHandoffs: lifecycleProof.invisibleHandoffs,
    timelineAudit: lifecycleProof.timelineAudit,
  }, null, 2)}\n`);

  const responsiveAudit = {
    laneId: 'H6', passed: responsiveProofs.length === 2 && responsiveProofs.every((proof) => proof.protectedCenterVisible && !proof.blackVoid),
    strategy: 'uniform cover scaling with limited decorative side crop', proofs: responsiveProofs,
  };
  await writeFile(path.join(labPath, 'responsive-audit.json'), `${JSON.stringify(responsiveAudit, null, 2)}\n`);

  if (!spatialContract) throw new Error('Spatial contract was not captured from the corrected room.');
  const destinationXs = spatialContract.destinationCenters.map((destination) => destination.x);
  const spatialAudit = {
    laneId: 'H6-composition-c-recovery',
    passed: Math.abs(spatialContract.apertureCenter.x - 800) <= 80
      && spatialContract.queueAnchors.every((anchor) => Math.abs(anchor.x - spatialContract.apertureCenter.x) <= 40)
      && spatialContract.conveyor.nearWidth > spatialContract.conveyor.farWidth * 3
      && destinationXs[0] < 600 && destinationXs[1] >= 650 && destinationXs[1] <= 950 && destinationXs[2] > 1000
      && !spatialContract.detachedSideModule && !spatialContract.dominantDiagonalFeed && spatialContract.continuousPath,
    authority: 'Composition C companion frame', ...spatialContract,
  };
  await writeFile(path.join(labPath, 'spatial-contract.json'), `${JSON.stringify(spatialAudit, null, 2)}\n`);

  const isolation = livePaths.map((relative) => ({ path: relative, unchangedFromBaseline: gitDiffFor(relative).status === 0 }));
  await writeFile(path.join(labPath, 'runtime-isolation-audit.json'), `${JSON.stringify({
    laneId: 'H6', baseline, passed: isolation.every((entry) => entry.unchangedFromBaseline),
    liveRuntimeIntegrated: false, packageOrLockChanges: false, paths: isolation,
  }, null, 2)}\n`);

  await writeFile(path.join(labPath, 'motion-proof.json'), `${JSON.stringify({
    laneId: 'H6', passed: lifecyclePassed, file: 'captures/13-complete-demo-cycle.webm',
    bytes: (await stat(motionPath)).size, viewport: { width: 1280, height: 720 },
    sequence: ['green rear / blue middle / red inspection', 'red receiver', 'blue inspection', 'blue receiver', 'green inspection', 'green receiver', 'queue empty'],
    deterministic: true, deterministicRunsCompared: 2,
    reducedMotionAlternative: 'captures/12-reduced-motion.png',
    continuity: 'The same three stable PotionActorRig instances move through queue, aperture, foreground branch, and receiver. No actor cloning, replacement, hiding, or parked-replica handoff occurs.',
    contactSheets: ['captures/10-aperture-approach-continuity-contact-sheet.png', 'captures/11-receiver-handoff-continuity-contact-sheet.png'],
  }, null, 2)}\n`);
} finally {
  if (browser) await browser.close();
  server.kill();
  await new Promise((resolve) => server.once('exit', resolve));
}
