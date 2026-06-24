const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Navigate to dev server
  console.log('Navigating to http://localhost:5175/');
  await page.goto('http://localhost:5175/');
  
  // Wait for the app to load
  await page.waitForSelector('#app');
  
  const evidenceDir = path.join(__dirname, 'evidence', 'screenshots');
  if (!fs.existsSync(evidenceDir)) fs.mkdirSync(evidenceDir, { recursive: true });

  const delay = ms => new Promise(res => setTimeout(res, ms));
  await delay(1000); // give phaser a sec

  // 1. Boot / empty farm
  console.log('Capturing boot/empty farm');
  await page.screenshot({ path: path.join(evidenceDir, '01_boot.png') });

  // 2. Planting
  console.log('Planting Plot 0');
  await page.click('#btn-interact'); // Plants Plot 0
  await delay(200);
  await page.screenshot({ path: path.join(evidenceDir, '02_planted.png') });

  // 3. Watering
  console.log('Watering Plot 0');
  await page.click('#btn-interact'); // Waters Plot 0
  await delay(200);
  await page.screenshot({ path: path.join(evidenceDir, '03_watered.png') });

  // 4. Move to Plot 1 and plant
  console.log('Move right, plant Plot 1');
  await page.click('#btn-right');
  await page.click('#btn-interact'); // Plants Plot 1
  await delay(200);
  await page.screenshot({ path: path.join(evidenceDir, '04_plot1_planted.png') });

  // 5. Water Plot 1 -> Plot 0 becomes Grown!
  console.log('Water Plot 1 -> Plot 0 grows');
  await page.click('#btn-interact'); // Waters Plot 1 (Plot 0 grows)
  await delay(200);
  await page.screenshot({ path: path.join(evidenceDir, '05_plot0_grown.png') });

  // 6. Move to Plot 2, plant, water
  console.log('Move right, plant and water Plot 2');
  await page.click('#btn-right');
  await page.click('#btn-interact'); // Plants Plot 2 (Plot 1 grows)
  await delay(200);
  await page.click('#btn-interact'); // Waters Plot 2
  await delay(200);

  // Do a dummy action to advance time so Plot 2 grows
  console.log('Move left to advance time (wait, movement doesnt advance time)');
  console.log('Wait, movement doesnt advance time. Try invalid water to see if it advances time.');
  // The test says "invalid water does not advance time". So we need a valid action.
  // Move to Plot 0 and harvest it! That's a valid action.
  console.log('Move left x2 to Plot 0, and harvest it');
  await page.click('#btn-left');
  await page.click('#btn-left');
  await page.click('#btn-interact'); // Harvests Plot 0. This advances time.
  await delay(200);
  await page.screenshot({ path: path.join(evidenceDir, '06_harvest_plot0.png') });

  // Now Plot 2 is grown.
  // Move to Plot 1 and harvest.
  console.log('Move right, harvest Plot 1');
  await page.click('#btn-right');
  await page.click('#btn-interact'); // Harvests Plot 1
  await delay(200);

  // Move to Plot 2 and harvest.
  console.log('Move right, harvest Plot 2');
  await page.click('#btn-right');
  await page.click('#btn-interact'); // Harvests Plot 2
  await delay(200);
  await page.screenshot({ path: path.join(evidenceDir, '07_all_harvested.png') });

  // 7. Sell crops
  console.log('Sell crops');
  await page.click('#btn-sell');
  await delay(200);
  await page.screenshot({ path: path.join(evidenceDir, '08_sell.png') });

  // 8. Attempt invalid action (sell again)
  console.log('Attempt invalid action');
  await page.click('#btn-sell'); // Should not change state or advance time
  await delay(200);
  await page.screenshot({ path: path.join(evidenceDir, '09_invalid_action.png') });

  // 9. Buy Upgrade
  console.log('Buy Upgrade');
  await page.click('#btn-upgrade');
  await delay(200);
  await page.screenshot({ path: path.join(evidenceDir, '10_upgrade.png') });

  // 10. End Day Victory
  console.log('End Day');
  await page.click('#btn-end');
  await delay(200);
  await page.screenshot({ path: path.join(evidenceDir, '11_victory.png') });

  await browser.close();
  console.log('Capture complete!');
})();
