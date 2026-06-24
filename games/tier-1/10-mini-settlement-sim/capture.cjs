const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');

async function run() {
  console.log('Starting Vite server...');
  const viteProcess = spawn(path.join(__dirname, 'node_modules', '.bin', 'vite.cmd'), ['--port', '5173'], {
    cwd: __dirname,
    stdio: 'ignore',
    shell: true
  });
  
  // Wait longer for vite
  await new Promise(r => setTimeout(r, 4000));

  console.log('Launching browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });

  await page.goto('http://localhost:5173');
  await page.waitForTimeout(500);

  // 1. Boot / Day 1
  await page.screenshot({ path: path.join(__dirname, 'evidence', 'screenshots', '01-boot.png') });
  console.log('Captured 01-boot.png');

  // 2. Player priority selection
  await page.click('#btn-chop');
  await page.waitForTimeout(100);
  await page.screenshot({ path: path.join(__dirname, 'evidence', 'screenshots', '02-priority-selection.png') });
  console.log('Captured 02-priority-selection.png');

  // 3. Visible citizen/resource update after advancing day
  await page.click('#btn-advance'); // Day -> 2
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(__dirname, 'evidence', 'screenshots', '03-advance-day.png') });
  console.log('Captured 03-advance-day.png');

  // Reset for Storm Failure
  await page.click('#btn-reset');
  await page.waitForTimeout(100);

  // Advance to Day 5 without building shelter, but avoiding starvation
  await page.click('#btn-forage');
  await page.click('#btn-advance'); // 2 (Food 7)

  await page.click('#btn-chop');
  await page.click('#btn-advance'); // 3 (Food 4, Wood 6)

  await page.click('#btn-chop');
  await page.click('#btn-advance'); // 4 (Food 1, Wood 9)

  await page.click('#btn-forage');
  await page.click('#btn-advance'); // 5 (Food 2). Storm! Defeat!
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(__dirname, 'evidence', 'screenshots', '04-storm-failure.png') });
  console.log('Captured 04-storm-failure.png');

  // Reset for Storm Survival & Victory
  await page.click('#btn-reset');
  await page.waitForTimeout(100);

  // We need to survive Day 5 and reach Day 10.
  // Starting food = 6, wood = 3, shelter = 1.
  // Day 1: Forage (Food 7)
  await page.click('#btn-forage');
  await page.click('#btn-advance');

  // Day 2: Forage (Food 8)
  await page.click('#btn-forage');
  await page.click('#btn-advance');

  // Day 3: Build (Food 5, Shelter 2, Wood 0)
  await page.click('#btn-build');
  await page.click('#btn-advance');

  // Day 4: Forage (Food 6)
  await page.click('#btn-forage');
  await page.click('#btn-advance');

  // Day 5: Forage (Food 7) - Storm hits! Shelter is 2, survive.
  await page.click('#btn-forage');
  await page.click('#btn-advance');
  
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(__dirname, 'evidence', 'screenshots', '05-storm-survival.png') });
  console.log('Captured 05-storm-survival.png');

  // To reach Day 10, just Forage every day
  // Currently we are at the start of Day 6. So we advance 5 more times.
  await page.click('#btn-advance'); // 6
  await page.click('#btn-advance'); // 7
  await page.click('#btn-advance'); // 8
  await page.click('#btn-advance'); // 9
  await page.click('#btn-advance'); // 10 -> Victory!

  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(__dirname, 'evidence', 'screenshots', '06-victory.png') });
  console.log('Captured 06-victory.png');

  await browser.close();
  viteProcess.kill();
  console.log('Capture complete!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
