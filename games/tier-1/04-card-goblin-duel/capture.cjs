const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1180, height: 850 }
  });

  console.log('Navigating to http://localhost:5175/');
  await page.goto('http://localhost:5175/');
  
  // Wait for the game to load
  await page.waitForTimeout(1000);
  
  const fs = require('fs');
  const destDir = path.join(__dirname, 'evidence', 'screenshots');
  fs.mkdirSync(destDir, { recursive: true });

  // Initial State Screenshot
  console.log('Capturing initial state...');
  await page.screenshot({ path: path.join(destDir, 'initial.png') });

  // Play Spark to enter SparkChoice phase
  console.log('Playing Spark to enter SparkChoice phase...');
  const buttons = await page.$$('.card-btn');
  for (let btn of buttons) {
    const text = await btn.textContent();
    if (text.includes('Spark')) {
      await btn.click();
      break;
    }
  }
  
  await page.waitForTimeout(500);
  console.log('Capturing SparkChoice state...');
  await page.screenshot({ path: path.join(destDir, 'spark.png') });

  // Force terminal state by using page.evaluate to set enemy hp to 0
  console.log('Triggering Terminal state...');
  await page.evaluate(() => {
    // Actually we can't easily modify internal module state from outside unless exposed.
    // Let's just click 'Strike' until someone dies. Wait, SparkChoice is active, we must click a card to replace.
  });
  
  const handCards = await page.$$('.card-btn');
  if (handCards.length > 0) {
      await handCards[0].click(); // Discard a card
  }
  
  await page.waitForTimeout(500);
  
  // Now spam first available card until game over
  for (let i = 0; i < 15; i++) {
      const b = await page.$$('.card-btn:not([disabled])');
      if (b.length > 0) {
          await b[0].click();
          await page.waitForTimeout(200);
      } else {
          break; // Must be terminal
      }
  }

  await page.waitForTimeout(500);
  console.log('Capturing Terminal state...');
  await page.screenshot({ path: path.join(destDir, 'terminal.png') });

  await browser.close();
  console.log('Done!');
})();
