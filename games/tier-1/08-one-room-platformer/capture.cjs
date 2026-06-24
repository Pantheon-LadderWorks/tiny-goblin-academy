const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 800 });

  await page.goto('http://localhost:5173');
  await page.waitForTimeout(1000);

  // Boot
  await page.screenshot({ path: 'evidence/screenshots/01-boot.png' });

  // Jump
  await page.dispatchEvent('#btn-jump', 'mousedown');
  await page.waitForTimeout(200); // Wait enough to be mid-air
  await page.screenshot({ path: 'evidence/screenshots/02-jump.png' });
  await page.dispatchEvent('#btn-jump', 'mouseup');

  await page.waitForTimeout(1000); // Wait to land

  // Defeat (spikes)
  await page.dispatchEvent('#btn-right', 'mousedown');
  // Wait until status changes to Defeat
  await page.waitForFunction(() => document.getElementById('run-status-display').textContent === 'Defeat', { timeout: 5000 });
  await page.dispatchEvent('#btn-right', 'mouseup');
  await page.screenshot({ path: 'evidence/screenshots/03-defeat.png' });

  // Victory
  await page.click('#btn-reset');
  await page.waitForTimeout(500);

  await page.dispatchEvent('#btn-right', 'mousedown');
  
  // Jump to Platform 1
  await page.waitForFunction(() => parseInt(document.getElementById('pos-display').textContent.split(',')[0]) >= 130);
  await page.dispatchEvent('#btn-jump', 'mousedown');
  await page.waitForTimeout(100);
  await page.dispatchEvent('#btn-jump', 'mouseup');

  // Jump to Platform 2
  await page.waitForFunction(() => parseInt(document.getElementById('pos-display').textContent.split(',')[0]) >= 360);
  await page.dispatchEvent('#btn-jump', 'mousedown');
  await page.waitForTimeout(100);
  await page.dispatchEvent('#btn-jump', 'mouseup');

  // Wait for Victory
  await page.waitForFunction(() => document.getElementById('run-status-display').textContent === 'Victory', { timeout: 10000 });
  await page.dispatchEvent('#btn-right', 'mouseup');
  
  await page.screenshot({ path: 'evidence/screenshots/04-victory.png' });

  await browser.close();
  console.log('Capture complete!');
})();
