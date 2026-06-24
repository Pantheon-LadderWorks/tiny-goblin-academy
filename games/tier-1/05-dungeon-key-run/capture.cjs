const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  if (!fs.existsSync('./evidence')) {
    fs.mkdirSync('./evidence');
  }
  if (!fs.existsSync('./evidence/screenshots')) {
    fs.mkdirSync('./evidence/screenshots');
  }

  console.log('Navigating to http://localhost:5178/');
  await page.goto('http://localhost:5178/');
  
  // Wait for Phaser canvas
  await page.waitForSelector('canvas');
  await page.waitForTimeout(1000); // Wait for fonts and Phaser to settle

  console.log('Capturing Initial Boot State');
  await page.screenshot({ path: 'evidence/screenshots/01-boot.png' });

  // 1. Move Up (Into Wall)
  console.log('Testing Blocked Movement');
  // Player at 1,2. Move Up to 1,1. Move Up to 1,0 (Wall).
  await page.click('#btn-up');
  await page.waitForTimeout(200);
  await page.click('#btn-up');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'evidence/screenshots/02-blocked.png' });

  // Reset to clean state
  await page.click('#btn-reset');
  await page.waitForTimeout(500);

  // 2. Locked Exit
  console.log('Testing Locked Exit');
  // Exit is at 2,2. Player at 1,2.
  await page.click('#btn-right');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'evidence/screenshots/03-locked-exit.png' });

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
  await page.screenshot({ path: 'evidence/screenshots/04-key-acquired.png' });

  // 4. To Exit and Win
  console.log('Moving to Exit');
  // Move right to 7,7
  for (let i=0; i<6; i++) { await page.click('#btn-right'); await page.waitForTimeout(100); }
  
  // Move up through chokepoint directly
  for (let i=0; i<5; i++) { await page.click('#btn-up'); await page.waitForTimeout(100); }
  
  // Move left to 2,2 (Exit)
  for (let i=0; i<5; i++) { await page.click('#btn-left'); await page.waitForTimeout(100); }
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'evidence/screenshots/05-victory.png' });

  // 5. Reset and get caught
  console.log('Testing Defeat');
  await page.click('#btn-reset');
  await page.waitForTimeout(500);
  
  // Go right to 7,2
  for (let i=0; i<6; i++) { await page.click('#btn-right'); await page.waitForTimeout(100); }
  // Plunge into chokepoint blindly without stalling -> Defeat
  await page.click('#btn-down'); await page.waitForTimeout(100);
  await page.click('#btn-down'); await page.waitForTimeout(500);
  await page.screenshot({ path: 'evidence/screenshots/06-defeat.png' });

  console.log('Capture complete!');
  await browser.close();
})();
