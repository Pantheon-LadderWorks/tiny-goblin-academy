const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173');
  
  // Wait for the game to boot
  await page.waitForFunction(() => {
    const el = document.getElementById('ledger-list');
    return el && el.innerText.includes('Slime awakened');
  }, { timeout: 5000 });
  
  // 1. Boot screenshot
  await page.screenshot({ path: path.join(__dirname, 'evidence', 'screenshots', '01-boot.png') });
  
  // 2. Pounce screenshot
  await page.keyboard.press('Space');
  await page.waitForTimeout(100); // mid-pounce
  await page.screenshot({ path: path.join(__dirname, 'evidence', 'screenshots', '02-pounce.png') });
  
  // Wait for pounce to finish
  await page.waitForTimeout(300);

  // Reset
  await page.click('#btn-reset');
  await page.waitForTimeout(100);

  // 3. Normal Defeat
  await page.keyboard.down('ArrowRight');
  
  await page.waitForFunction(() => {
    const el = document.getElementById('ui-run-status');
    return el && el.innerText.includes('Defeat');
  }, { timeout: 10000 });

  await page.keyboard.up('ArrowRight');
  await page.screenshot({ path: path.join(__dirname, 'evidence', 'screenshots', '03-defeat.png') });

  // Reset
  await page.click('#btn-reset');
  await page.waitForTimeout(100);

  // 4. Victory (Pounce enemy, get essence, reach exit)
  await page.keyboard.down('ArrowRight');
  
  // Wait until distance to enemy is exactly right for a pounce
  // Pounce covers 90px in 0.3s.
  // Enemy max X is 520. It moves left at 90px/s, player right at 150px/s.
  // We'll pounce when player X is >= 400
  await page.waitForFunction(() => {
    const el = document.getElementById('ui-slime-pos');
    if (!el) return false;
    const match = el.innerText.match(/X:\s*(\d+)/i);
    return match && parseInt(match[1]) >= 400;
  }, { timeout: 10000 });
  
  await page.keyboard.down(' '); // pounce
  await page.waitForTimeout(50);
  await page.keyboard.up(' ');

  // Wait for Enemy Defeated / Essence Collected
  await page.waitForFunction(() => {
    const essenceUi = document.getElementById('ui-essence');
    return essenceUi && essenceUi.innerText.includes('Collected');
  }, { timeout: 15000 });
  
  // Now move to exit
  // We're already moving right, wait until x >= 680
  await page.waitForFunction(() => {
    const pos = document.getElementById('ui-slime-pos');
    if (!pos) return false;
    const match = pos.innerText.match(/X:\s*(\d+)/i);
    return match && parseInt(match[1]) >= 680;
  }, { timeout: 10000 });
  
  await page.keyboard.up('ArrowRight');

  // Move up to enter exit Y range
  await page.keyboard.down('ArrowUp');
  await page.waitForFunction(() => {
    const pos = document.getElementById('ui-slime-pos');
    if (!pos) return false;
    const match = pos.innerText.match(/Y:\s*(\d+)/i);
    return match && parseInt(match[1]) <= 280;
  }, { timeout: 10000 });
  await page.keyboard.up('ArrowUp');

  // Face right and pounce to break the bounds!
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(50); // Just enough to turn right
  await page.keyboard.up('ArrowRight');
  
  await page.keyboard.press('Space'); // Pounce!
  
  // Wait for Victory
  await page.waitForFunction(() => {
    const runStatus = document.getElementById('ui-run-status');
    return runStatus && runStatus.innerText.includes('Victory');
  }, { timeout: 10000 });
  
  await page.screenshot({ path: path.join(__dirname, 'evidence', 'screenshots', '04-victory.png') });
  
  await browser.close();
  console.log('Capture script complete.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
