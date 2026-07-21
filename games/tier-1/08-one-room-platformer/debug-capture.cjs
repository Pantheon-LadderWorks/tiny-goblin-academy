const { chromium } = require('playwright');
const { finalizeCaptureRun, prepareCaptureRun } = require('../../../tools/evidence/capture-run.cjs');

(async () => {
  const captureRun = prepareCaptureRun({
    scriptDirectory: __dirname,
    gameId: 'level-08-one-room-platformer',
    laneId: 'debug-capture',
  });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 800 });

  await page.goto('http://localhost:5173');
  await page.waitForTimeout(1000);

  // Victory run
  await page.dispatchEvent('#btn-right', 'mousedown');

  // Jump to Platform 1
  await page.waitForFunction(() => parseInt(document.getElementById('pos-display').textContent.split(',')[0]) >= 210);
  await page.dispatchEvent('#btn-jump', 'mousedown');
  await page.waitForTimeout(100);
  await page.dispatchEvent('#btn-jump', 'mouseup');

  // Wait a bit and take a screenshot
  await page.waitForTimeout(1000);
  await page.screenshot({ path: captureRun.file('stills', 'debug-1.png') });

  // Jump to Platform 2
  try {
    await page.waitForFunction(() => parseInt(document.getElementById('pos-display').textContent.split(',')[0]) >= 360, { timeout: 3000 });
    await page.dispatchEvent('#btn-jump', 'mousedown');
    await page.waitForTimeout(100);
    await page.dispatchEvent('#btn-jump', 'mouseup');
  } catch (e) {
    console.error("Missed jump 2", e.message);
  }

  await page.waitForTimeout(1500);
  await page.screenshot({ path: captureRun.file('stills', 'debug-2.png') });

  await page.waitForTimeout(2000);
  console.log('Pos:', await page.textContent('#pos-display'));
  console.log('Status:', await page.textContent('#run-status-display'));
  await page.screenshot({ path: captureRun.file('stills', 'debug-3.png') });

  await browser.close();
  finalizeCaptureRun(captureRun, {
    captureScript: 'games/tier-1/08-one-room-platformer/debug-capture.cjs',
    captureConfiguration: {
      url: 'http://localhost:5173',
      browser: 'chromium-headless',
      viewport: { width: 1200, height: 800 },
    },
  });
})();
