const { chromium } = require('playwright');
const { finalizeCaptureRun, prepareCaptureRun } = require('../../../tools/evidence/capture-run.cjs');

(async () => {
  const captureRun = prepareCaptureRun({
    scriptDirectory: __dirname,
    gameId: 'level-05-dungeon-key-run',
    laneId: 'mechanical-capture',
  });
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Navigating to http://localhost:5178/');
  await page.goto('http://localhost:5178/');

  // Wait for Phaser canvas
  await page.waitForSelector('canvas');
  await page.waitForTimeout(1000); // Wait for fonts and Phaser to settle

  console.log('Capturing Initial Boot State');
  await page.screenshot({ path: captureRun.file('stills', '01-boot.png') });

  // 1. Move Up (Into Wall)
  console.log('Testing Blocked Movement');
  // Player at 1,2. Move Up to 1,1. Move Up to 1,0 (Wall).
  await page.click('#btn-up');
  await page.waitForTimeout(200);
  await page.click('#btn-up');
  await page.waitForTimeout(500);
  await page.screenshot({ path: captureRun.file('stills', '02-blocked.png') });

  // Reset to clean state
  await page.click('#btn-reset');
  await page.waitForTimeout(500);

  // 2. Locked Exit
  console.log('Testing Locked Exit');
  // Exit is at 2,2. Player at 1,2.
  await page.click('#btn-right');
  await page.waitForTimeout(500);
  await page.screenshot({ path: captureRun.file('stills', '03-locked-exit.png') });

  // 3. Path to Key
  console.log('Moving to Key');
  await page.click('#btn-reset');
  await page.waitForTimeout(500);

  // Go right to 7,2
  for (let i=0; i<6; i++) { await page.click('#btn-right'); await page.waitForTimeout(100); }

  // Stalling at 7,2
  await page.click('#btn-down'); await page.waitForTimeout(100); // to 7,3
  await page.click('#btn-left'); await page.waitForTimeout(100); // to 6,3
  await page.click('#btn-right'); await page.waitForTimeout(100); // to 7,3

  // The Chokepoint Dance
  await page.click('#btn-down'); await page.waitForTimeout(100); // to 7,4
  await page.click('#btn-right'); await page.waitForTimeout(100); // to 8,4
  await page.click('#btn-down'); await page.waitForTimeout(100); // to 8,5
  await page.click('#btn-left'); await page.waitForTimeout(100); // to 7,5
  await page.click('#btn-down'); await page.waitForTimeout(100); // to 7,6

  // To Key
  for (let i=0; i<6; i++) { await page.click('#btn-left'); await page.waitForTimeout(100); }
  await page.click('#btn-down'); await page.waitForTimeout(500);
  await page.screenshot({ path: captureRun.file('stills', '04-key-acquired.png') });

  // 4. To Exit and Win
  console.log('Moving to Exit');
  // Move right to 7,7
  for (let i=0; i<6; i++) { await page.click('#btn-right'); await page.waitForTimeout(100); }

  // Move up through chokepoint directly
  for (let i=0; i<5; i++) { await page.click('#btn-up'); await page.waitForTimeout(100); }

  // Move left to 2,2 (Exit)
  for (let i=0; i<5; i++) { await page.click('#btn-left'); await page.waitForTimeout(100); }
  await page.waitForTimeout(500);
  await page.screenshot({ path: captureRun.file('stills', '05-victory.png') });

  // 5. Reset and get caught
  console.log('Testing Defeat');
  await page.click('#btn-reset');
  await page.waitForTimeout(500);

  // Go right to 7,2
  for (let i=0; i<6; i++) { await page.click('#btn-right'); await page.waitForTimeout(100); }
  // Plunge into chokepoint blindly without stalling -> Defeat
  await page.click('#btn-down'); await page.waitForTimeout(100);
  await page.click('#btn-down'); await page.waitForTimeout(500);
  await page.screenshot({ path: captureRun.file('stills', '06-defeat.png') });

  console.log('Capture complete!');
  await browser.close();
  finalizeCaptureRun(captureRun, {
    captureScript: 'games/tier-1/05-dungeon-key-run/capture.cjs',
    captureConfiguration: {
      url: 'http://localhost:5178/',
      browser: 'chromium',
      viewport: 'playwright-default',
    },
  });
})();
