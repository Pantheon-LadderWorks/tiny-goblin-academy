import { mkdir, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const evidenceRoot = path.dirname(fileURLToPath(import.meta.url));
const gameRoot = path.resolve(evidenceRoot, '../..');
const requireFromButtonGoblin = createRequire(path.resolve(gameRoot, '../01-button-goblin-clicker/package.json'));
const { chromium } = requireFromButtonGoblin('playwright');
const captures = path.join(evidenceRoot, 'captures');
const telemetry = path.join(evidenceRoot, 'telemetry');
const videos = path.join(evidenceRoot, 'video');
const videoTemp = path.join(videos, '.capture-temp');
const baseUrl = 'http://127.0.0.1:4315/';
const h611WideCaptureUrl = `${baseUrl}@fs/${path.resolve(evidenceRoot, '../h6-11-live-dierig-random-d6-integration/captures/01-initial-ready-1920x1080.png').replaceAll('\\', '/')}`;

await Promise.all([captures, telemetry, videos].map((directory) => mkdir(directory, { recursive: true })));
await Promise.all([captures, telemetry, videos].map((directory) => rm(directory, { recursive: true, force: true })));
await Promise.all([captures, telemetry, videoTemp].map((directory) => mkdir(directory, { recursive: true })));

const browser = await chromium.launch({ headless: true });
const browserErrors = [];
const attachErrors = (page) => {
  page.on('console', (message) => { if (message.type() === 'error') browserErrors.push(message.text()); });
  page.on('pageerror', (error) => browserErrors.push(error.message));
};

const openGame = async ({ width = 1920, height = 1080, rolls = '4', mode = 'full', dev = false } = {}) => {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  attachErrors(page);
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
const waitState = (page, phase) => page.waitForFunction(
  (expected) => window.__TGA_DICE_DUEL_H6_11__?.getDiagnostics().state.phase === expected,
  phase,
  { timeout: 12000 },
);
const waitReady = (page) => page.waitForFunction(
  () => window.__TGA_DICE_DUEL_H6_11__?.getDiagnostics().controller.busyState === 'ready',
  undefined,
  { timeout: 12000 },
);
const shot = (page, name, locator) => locator
  ? locator.screenshot({ path: path.join(captures, name) })
  : page.screenshot({ path: path.join(captures, name), fullPage: false });
const writeJson = (name, value) => writeFile(path.join(telemetry, name), `${JSON.stringify(value, null, 2)}\n`, 'utf8');

const measure = (page) => page.evaluate(() => {
  const rect = (selector) => {
    const value = document.querySelector(selector)?.getBoundingClientRect();
    return value ? { left: value.left, top: value.top, right: value.right, bottom: value.bottom, width: value.width, height: value.height } : null;
  };
  const stage = rect('.duel-stage');
  const tray = rect('.throw-zone');
  const canvas = rect('#game-canvas canvas');
  const causal = rect('.causal-feed-panel');
  const actions = rect('.action-dock');
  return {
    viewport: { width: innerWidth, height: innerHeight },
    documentOverflowX: document.documentElement.scrollWidth > innerWidth,
    stage,
    tray,
    canvas,
    causal,
    actions,
    causalActionOverlap: Boolean(causal && actions && causal.right > actions.left && actions.right > causal.left && causal.bottom > actions.top && actions.bottom > causal.top),
    fonts: [...new Set([...document.querySelectorAll('[data-typography-role]')].map((node) => ({
      role: node.getAttribute('data-typography-role'),
      family: getComputedStyle(node).fontFamily,
      weight: getComputedStyle(node).fontWeight,
      size: getComputedStyle(node).fontSize,
    })).map(JSON.stringify))].map(JSON.parse),
    diagnostics: window.__TGA_DICE_DUEL_H6_11__?.getDiagnostics(),
  };
});

for (const viewport of [
  { width: 1920, height: 1080, suffix: '1920x1080' },
  { width: 1024, height: 640, suffix: '1024x640' },
]) {
  const { context, page } = await openGame({ ...viewport, rolls: '4' });
  await shot(page, `01-initial-tavern-${viewport.suffix}.png`);
  await writeJson(`responsive-initial-${viewport.suffix}.json`, await measure(page));
  await context.close();
}

{
  const { context, page } = await openGame();
  await shot(page, '05-masthead-detail.png', page.locator('.masthead'));
  await shot(page, '06-hp-turn-banner-detail.png', page.locator('.duel-hud'));
  await shot(page, '07-table-tray-material-detail.png', page.locator('.throw-zone'));
  await shot(page, '08-tavern-props-sign-detail.png', page.locator('.duel-stage'));
  await page.click('#history-toggle');
  await shot(page, '09-recent-exchange-history-detail.png');
  await page.click('#history-close');

  await page.evaluate(() => {
    const nodes = [...document.querySelectorAll('[data-typography-role]')];
    const roles = [...new Map(nodes.map((node) => {
      const role = node.getAttribute('data-typography-role');
      const style = getComputedStyle(node);
      return [role, { role, family: style.fontFamily, weight: style.fontWeight, size: style.fontSize, sample: node.textContent?.trim().slice(0, 42) }];
    })).values()];
    const plate = document.createElement('section');
    plate.id = 'h6-12-typography-plate';
    plate.style.cssText = 'position:fixed;inset:24px;z-index:9999;padding:24px;overflow:auto;background:#17101b;color:#f3dfb7;border:3px solid #bd834a;font-family:Outfit,Arial,sans-serif;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;';
    plate.innerHTML = `<h2 style="grid-column:1/-1;margin:0 0 8px;color:#f1c66e">H6.12 Academy typography roles</h2>${roles.map((entry) => `<article style="padding:12px;border:1px solid #76503a;background:#281a24"><b style="color:#efb95e">${entry.role}</b><div>${entry.family} · ${entry.weight} · ${entry.size}</div><div style="margin-top:5px;color:#fff0c4">${entry.sample || '—'}</div></article>`).join('')}`;
    document.body.append(plate);
  });
  await shot(page, '10-typography-role-evidence-plate.png', page.locator('#h6-12-typography-plate'));
  await page.locator('#h6-12-typography-plate').evaluate((node) => node.remove());

  await page.evaluate(() => {
    const diagnostics = window.__TGA_DICE_DUEL_H6_11__?.getDiagnostics();
    const promoted = [...document.querySelectorAll('svg[data-region-id]')].map((node) => ({ id: node.dataset.regionId, svg: node.outerHTML }));
    const plate = document.createElement('section');
    plate.id = 'h6-12-region-plate';
    plate.style.cssText = 'position:fixed;inset:20px;z-index:9999;padding:22px;overflow:auto;background:#17101b;color:#f3dfb7;border:3px solid #bd834a;font-family:Outfit,Arial,sans-serif;';
    plate.innerHTML = `<h2 style="margin:0 0 12px;color:#f1c66e">Promoted mapped regions</h2><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">${promoted.map((entry) => `<article style="padding:10px;border:1px solid #76503a;background:#281a24"><div style="width:68px;height:68px">${entry.svg}</div><small>${entry.id}</small></article>`).join('')}</div><h2 style="margin:18px 0 10px;color:#d98273">Explicitly rejected from runtime</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">${diagnostics.visualAuthority.rejectedRegionIds.map((id) => `<small style="padding:7px;border:1px solid #603944;background:#2a1820">${id}</small>`).join('')}</div>`;
    document.body.append(plate);
  });
  await shot(page, '11-promoted-rejected-region-evidence-plate.png', page.locator('#h6-12-region-plate'));
  await context.close();
}

{
  const { context, page } = await openGame({ rolls: '4' });
  await page.evaluate(() => window.__TGA_DICE_DUEL_H6_11__?.freezeAtPhase('release'));
  await page.click('#rollbtn');
  await page.waitForFunction(() => window.__TGA_DICE_DUEL_H6_11__?.getDiagnostics().presentation.phase === 'release');
  await shot(page, '12-roll-in-motion.png');
  await writeJson('roll-in-motion.json', await diag(page));
  await context.close();
}

{
  const { context, page } = await openGame({ rolls: '4,3' });
  await page.click('#rollbtn');
  await waitState(page, 'action');
  await shot(page, '13-settled-actions-unlocked.png');
  await page.click('[data-a="attack"]');
  await page.waitForTimeout(100);
  await shot(page, '14-attack-action-state.png');
  await waitReady(page);
  await shot(page, '17-same-actor-returned-ready.png');
  await writeJson('same-actor-returned-ready.json', await diag(page));
  await context.close();
}

for (const action of ['heal', 'block']) {
  const { context, page } = await openGame({ rolls: '4' });
  await page.click('#rollbtn');
  await waitState(page, 'action');
  await page.click(`[data-a="${action}"]`);
  await page.waitForTimeout(100);
  await shot(page, `${action === 'heal' ? '15' : '16'}-${action}-action-state.png`);
  await context.close();
}

{
  const { context, page } = await openGame({ rolls: '4', mode: 'reduced' });
  await page.click('#rollbtn');
  await waitState(page, 'action');
  await shot(page, '18-reduced-motion-settled.png');
  await writeJson('reduced-motion-settled.json', await diag(page));
  await context.close();
}

{
  const { context, page } = await openGame({ rolls: '4,3' });
  for (const action of ['heal', 'block']) {
    await page.click('#rollbtn');
    await waitState(page, 'action');
    await page.click(`[data-a="${action}"]`);
    await waitReady(page);
  }
  await page.click('#history-toggle');
  await shot(page, '19-full-combat-history-drawer.png');
  await writeJson('history-open.json', await measure(page));
  await context.close();
}

const playToTerminal = async (page, expected) => {
  for (let turn = 0; turn < 6; turn += 1) {
    await page.click('#rollbtn');
    await waitState(page, 'action');
    await page.click('[data-a="attack"]');
    const state = await diag(page);
    if (state.state.phase === expected) return state;
    await waitReady(page);
  }
  throw new Error(`Did not reach terminal state ${expected}`);
};

for (const terminal of [
  { phase: 'won', rolls: '6,6', wide: '20-victory-final-die-visible.png', compact: '22-victory-1024x640.png' },
  { phase: 'lost', rolls: '1,1,1,1', wide: '21-defeat-final-die-visible.png', compact: '23-defeat-1024x640.png' },
]) {
  for (const viewport of [
    { width: 1920, height: 1080, name: terminal.wide },
    { width: 1024, height: 640, name: terminal.compact },
  ]) {
    const { context, page } = await openGame({ ...viewport, rolls: terminal.rolls });
    const final = await playToTerminal(page, terminal.phase);
    await shot(page, viewport.name);
    await writeJson(`${terminal.phase}-${viewport.width}x${viewport.height}.json`, { final, layout: await measure(page) });
    await context.close();
  }
}

const record = async (name, options, action) => {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: videoTemp, size: { width: 1280, height: 720 } },
  });
  const page = await context.newPage();
  attachErrors(page);
  const url = new URL(baseUrl);
  url.searchParams.set('evidenceRolls', options.rolls);
  url.searchParams.set('motion', options.mode ?? 'full');
  await page.goto(url.toString(), { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__TGA_DICE_DUEL_H6_11__?.getDiagnostics().ready === true);
  const video = page.video();
  await action(page);
  await page.waitForTimeout(350);
  await context.close();
  await video?.saveAs(path.join(videos, name));
};

await record('24-complete-turn.webm', { rolls: '4' }, async (page) => {
  await page.click('#rollbtn');
  await waitState(page, 'action');
  await page.click('[data-a="block"]');
  await waitReady(page);
});

await record('25-typography-material-before-after.webm', { rolls: '4' }, async (page) => {
  await page.evaluate((source) => {
    const comparison = document.createElement('div');
    comparison.id = 'h6-12-video-comparison';
    comparison.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#120d18;display:grid;place-items:center;overflow:hidden';
    comparison.innerHTML = `<img src="${source}" alt="H6.11 before" style="width:100%;height:100%;object-fit:contain"><strong style="position:absolute;top:18px;left:18px;padding:8px 13px;background:#17101be6;border:2px solid #bd834a;color:#fff0c4;font:700 18px Outfit,Arial,sans-serif">BEFORE · H6.11</strong>`;
    document.body.append(comparison);
  }, h611WideCaptureUrl);
  await page.waitForFunction(() => document.querySelector('#h6-12-video-comparison img')?.complete === true);
  await page.waitForTimeout(1500);
  await page.locator('#h6-12-video-comparison').evaluate((node) => node.remove());
  await page.evaluate(() => {
    const label = document.createElement('strong');
    label.id = 'h6-12-after-label';
    label.style.cssText = 'position:fixed;top:18px;left:18px;z-index:99999;padding:8px 13px;background:#17101be6;border:2px solid #bd834a;color:#fff0c4;font:700 18px Outfit,Arial,sans-serif';
    label.textContent = 'AFTER · H6.12';
    document.body.append(label);
  });
  await page.waitForTimeout(1500);
});

await record('26-victory-sequence.webm', { rolls: '6,6' }, async (page) => { await playToTerminal(page, 'won'); });
await record('27-reduced-motion-sequence.webm', { rolls: '4', mode: 'reduced' }, async (page) => {
  await page.click('#rollbtn');
  await waitState(page, 'action');
});

await browser.close();
await rm(videoTemp, { recursive: true, force: true });

const report = {
  lane: 'H6.12',
  status: browserErrors.length === 0 ? 'passed' : 'failed',
  browserErrors,
  pngCountBeforeComparisons: 21,
  webmCount: 4,
  note: 'Before/after comparison plates 03 and 04 are composed separately from protected H6.11 initial captures and H6.12 captures 01.',
};
await writeFile(path.join(evidenceRoot, 'capture-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
if (browserErrors.length) throw new Error(`Browser errors: ${browserErrors.join(' | ')}`);
