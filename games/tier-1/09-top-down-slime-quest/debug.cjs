const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173');
  
  await page.waitForFunction(() => {
    const el = document.getElementById('ledger-panel');
    return el && el.innerText.includes('Slime awakened');
  });

  await page.keyboard.down('ArrowRight');
  
  let pounced = false;
  for (let i=0; i<80; i++) {
    await page.waitForTimeout(100);
    const text = await page.evaluate(() => {
      const p = document.getElementById('ui-slime-pos')?.innerText;
      const e = document.getElementById('ui-enemy-pos')?.innerText;
      const st = document.getElementById('ui-slime-state')?.innerText;
      const rs = document.getElementById('ui-run-status')?.innerText;
      return `${p} | ${e} | State: ${st} | Run: ${rs}`;
    });
    console.log(`t=${(i*100)}ms: ${text}`);

    if (!pounced && text.includes('Player: x: 40')) {
      pounced = true;
      console.log('--- POUNCING NOW ---');
      await page.keyboard.down(' ');
      await page.waitForTimeout(50);
      await page.keyboard.up(' ');
    }
  }
  
  await browser.close();
}
run();
