const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(120000);

  await page.goto('http://localhost:5175');
  
  // Wait for Phaser to boot
  await page.waitForTimeout(1000);
  
  // 1. Boot state
  await page.screenshot({ path: path.join(__dirname, 'evidence/screenshots/01-boot.png') });

  // 2. Wait 10 seconds for degraded state
  await page.waitForTimeout(10000);
  await page.screenshot({ path: path.join(__dirname, 'evidence/screenshots/02-degraded.png') });

  // 3. Feed and Play
  await page.click('#btn-feed');
  await page.waitForTimeout(100);
  await page.click('#btn-play');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(__dirname, 'evidence/screenshots/03-recovered.png') });

  // 4. Defeat state
  await page.click('#btn-reset');
  await page.waitForTimeout(500);
  // Hunger decays 4/sec. 100/4 = 25 sec.
  await page.waitForTimeout(26000);
  await page.screenshot({ path: path.join(__dirname, 'evidence/screenshots/04-defeat.png') });

  // 5. Victory state
  await page.click('#btn-reset');
  await page.waitForTimeout(500);
  
  // Survive 60 seconds
  for (let i = 0; i < 6; i++) {
    await page.waitForTimeout(10000);
    await page.click('#btn-feed', { force: true });
    await page.click('#btn-play', { force: true });
  }
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(__dirname, 'evidence/screenshots/05-victory.png') });

  console.log("Playtest screenshots captured.");
  await browser.close();
})();
