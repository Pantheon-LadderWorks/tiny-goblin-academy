'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const {
  STILL_FIXTURES,
  MOTION_FIXTURES,
  verifyEvidenceContracts,
} = require('./h622r1-evidence-contracts.cjs');

const BASE_URL = 'http://127.0.0.1:5175/';
const EVIDENCE_ROOT = 'D:\\Projects\\Active\\Tiny-Goblin-Academy\\Evidence';
const LANE = 'h6-22r1-cardrig-composition-attachment-authority';

const timestamp = () => new Date().toISOString().replace(/[-:.]/g, '').replace('Z', 'z').toLowerCase();
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const fixtureUrl = ({ id, frameStyle, motion }) => {
  const query = new URLSearchParams({ cardComp: id });
  if (frameStyle) query.set('frameStyle', frameStyle);
  if (motion) query.set('motion', motion);
  return `${BASE_URL}?${query}`;
};

const attachDiagnostics = (page, label, errors) => {
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`${label}: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`${label}: ${error.message}`));
  page.on('requestfailed', (request) => errors.push(
    `${label}: ${request.url()} · ${request.failure()?.errorText}`,
  ));
};

const waitForFixture = async (page, fixture) => {
  await page.waitForFunction(
    () => window.__cardRigCompositionStatus?.status === 'running'
      || ['complete', 'cancelled', 'error'].includes(window.__cardRigCompositionStatus?.status ?? ''),
    undefined,
    { timeout: 10000 },
  );
  if (fixture.resize) await page.setViewportSize({ width: 1024, height: 580 });
  await page.waitForFunction(
    () => ['complete', 'cancelled', 'error'].includes(window.__cardRigCompositionStatus?.status ?? ''),
    undefined,
    { timeout: 30000 },
  );
  await page.waitForTimeout(300);
};

const measure = (page) => page.evaluate(() => {
  const rect = (element) => {
    if (!element) return null;
    const value = element.getBoundingClientRect();
    return { x: value.x, y: value.y, width: value.width, height: value.height };
  };
  const rigs = [...document.querySelectorAll('[data-card-rig-id]')];
  return {
    viewport: { width: innerWidth, height: innerHeight },
    status: window.__cardRigCompositionStatus,
    rigs: rigs.map((rig) => ({
      id: rig.getAttribute('data-card-rig-id'),
      card: rig.getAttribute('data-card-name'),
      rect: rect(rig),
      outerFrame: rig.querySelector('[data-outer-frame]')?.getAttribute('data-outer-frame'),
      outerFrameManifestId: rig.querySelector('[data-outer-frame]')?.getAttribute('data-outer-frame-manifest-id'),
      layers: [...rig.querySelectorAll('[data-card-rig-layer]')]
        .map((layer) => layer.getAttribute('data-card-rig-layer')),
    })),
    slots: [...document.querySelectorAll('[data-card-slot-surface]')].map((slot) => ({
      surface: slot.getAttribute('data-card-slot-surface'),
      manifestId: slot.getAttribute('data-card-slot-manifest-id'),
      anchor: slot.getAttribute('data-stage-anchor'),
      rect: rect(slot),
    })),
    documentContained: document.documentElement.scrollWidth <= document.documentElement.clientWidth
      && document.documentElement.scrollHeight <= document.documentElement.clientHeight,
  };
});

(async () => {
  verifyEvidenceContracts();
  const runId = `capture-${timestamp()}-p${process.pid}`;
  const runRoot = path.join(EVIDENCE_ROOT, 'level-04-card-goblin-duel', LANE, runId);
  const stillRoot = path.join(runRoot, 'stills');
  const motionRoot = path.join(runRoot, 'motion');
  const tempVideoRoot = path.join(runRoot, '.video-temp');
  fs.mkdirSync(stillRoot, { recursive: true });
  fs.mkdirSync(motionRoot, { recursive: true });
  fs.mkdirSync(tempVideoRoot, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const fixtures = [];

  for (const fixture of STILL_FIXTURES) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 660 } });
    const page = await context.newPage();
    attachDiagnostics(page, fixture.id, errors);
    await page.goto(fixtureUrl(fixture), { waitUntil: 'domcontentloaded' });
    await waitForFixture(page, fixture);
    const output = path.join(stillRoot, fixture.file);
    await page.screenshot({ path: output });
    fixtures.push({ ...fixture, kind: 'still', path: `stills/${fixture.file}`, metrics: await measure(page) });
    await context.close();
  }

  for (const fixture of MOTION_FIXTURES) {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 660 },
      recordVideo: { dir: tempVideoRoot, size: { width: 1280, height: 660 } },
    });
    const page = await context.newPage();
    attachDiagnostics(page, `${fixture.id}:${fixture.frameStyle ?? ''}`, errors);
    await page.goto(fixtureUrl(fixture), { waitUntil: 'domcontentloaded' });
    await waitForFixture(page, fixture);
    const metrics = await measure(page);
    const video = page.video();
    await context.close();
    const source = await video.path();
    const output = path.join(motionRoot, fixture.file);
    fs.renameSync(source, output);
    fixtures.push({ ...fixture, kind: 'motion', path: `motion/${fixture.file}`, metrics });
  }

  await browser.close();
  fs.rmSync(tempVideoRoot, { recursive: true, force: true });
  if (errors.length) throw new Error(errors.join('\n'));

  for (const fixture of fixtures) {
    const absolute = path.join(runRoot, fixture.path);
    if (!fs.existsSync(absolute) || fs.statSync(absolute).size === 0) {
      throw new Error(`Missing evidence payload: ${fixture.path}`);
    }
    if (fixture.metrics.status?.status === 'error') {
      throw new Error(`${fixture.id}: ${fixture.metrics.status.error}`);
    }
    if (Object.values(fixture.metrics.status?.finalCounts ?? {}).some((value) => value !== 0)) {
      throw new Error(`${fixture.id}: nonzero attachment residue`);
    }
    if (!fixture.metrics.documentContained) throw new Error(`${fixture.id}: document overflow`);
  }

  const files = fixtures.map((fixture) => {
    const absolute = path.join(runRoot, fixture.path);
    return {
      path: fixture.path.replaceAll('\\', '/'),
      bytes: fs.statSync(absolute).size,
      sha256: sha256(absolute),
    };
  });
  const review = {
    schemaVersion: '0.1',
    lane: LANE,
    runId,
    createdAt: new Date().toISOString(),
    purpose: 'H6.22R1 CardRig composition and attachment-authority Human Review',
    fixtures,
    files,
    consoleErrors: errors,
    result: 'technical-pass-human-review-pending',
  };
  fs.writeFileSync(path.join(runRoot, 'technical-review.json'), `${JSON.stringify(review, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ runRoot, runId, fileCount: files.length, files }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
