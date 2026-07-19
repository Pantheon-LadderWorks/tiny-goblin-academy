import { writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const evidenceRoot = path.dirname(fileURLToPath(import.meta.url));
const gameRoot = path.resolve(evidenceRoot, '../..');
const requireFromButtonGoblin = createRequire(path.resolve(gameRoot, '../01-button-goblin-clicker/package.json'));
const { chromium } = requireFromButtonGoblin('playwright');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const consoleErrors = [];
page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', (error) => consoleErrors.push(error.message));

await page.goto('http://127.0.0.1:4316/?evidenceRolls=4,3&motion=reduced', { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__TGA_DICE_DUEL_H6_11__?.getDiagnostics().ready === true);
const before = await page.evaluate(() => window.__TGA_DICE_DUEL_H6_11__?.getDiagnostics());
const titleFont = await page.locator('[data-typography-role="game-title"]').evaluate((node) => getComputedStyle(node).fontFamily);
await page.click('#rollbtn');
await page.waitForFunction(() => window.__TGA_DICE_DUEL_H6_11__?.getDiagnostics().state.phase === 'action');
const after = await page.evaluate(() => window.__TGA_DICE_DUEL_H6_11__?.getDiagnostics());
await browser.close();

const result = {
  buildEntry: 'dist/index.html',
  queryAttempted: '?evidenceRolls=4,3&motion=reduced',
  reportedSource: after?.source,
  reportedMode: after?.presentation?.mode,
  settledFace: after?.state?.roll,
  settledFaceInRange: Number.isInteger(after?.state?.roll) && after.state.roll >= 1 && after.state.roll <= 6,
  deterministicEvidenceOverrideIgnored: before?.source === 'production-crypto',
  developmentMotionOverrideIgnored: after?.presentation?.mode === 'full',
  materialTreatmentPresent: Object.keys(after?.visualAuthority?.materialUrls ?? {}).length === 4,
  academyTypographyPresent: titleFont.includes('Cinzel'),
  consoleErrors,
};
result.status = result.deterministicEvidenceOverrideIgnored
  && result.developmentMotionOverrideIgnored
  && result.settledFaceInRange
  && result.materialTreatmentPresent
  && result.academyTypographyPresent
  && result.consoleErrors.length === 0
  ? 'passed'
  : 'failed';

await writeFile(path.join(evidenceRoot, 'production-preview-audit.json'), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
if (result.status !== 'passed') throw new Error(JSON.stringify(result));
