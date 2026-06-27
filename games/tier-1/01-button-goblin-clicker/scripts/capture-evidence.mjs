import { chromium } from 'playwright';
import { createServer } from 'vite';

async function run() {
  console.log('Starting Vite server...');
  const server = await createServer({
    root: process.cwd(),
    server: { port: 5173 },
  });
  await server.listen();
  console.log('Vite server running on http://localhost:5173');

  console.log('Launching browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });

  console.log('Navigating to game...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Wait for game to be ready (canvas created)
  await page.waitForSelector('canvas');
  await page.waitForTimeout(1000); // Give Phaser a second to render the first frame

  console.log('Capturing initial state...');
  await page.screenshot({ path: 'evidence/screenshots/01-initial-state.png' });

  console.log('Bonking the goblin...');
  // Click the center of the canvas a few times
  const canvas = await page.$('canvas');
  const box = await canvas.boundingBox();
  
  // Click the center of the canvas
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  
  // Wait just enough to capture the hit flash, scale tween and damage text popup
  await page.waitForTimeout(50); 
  console.log('Capturing hit reaction...');
  await page.screenshot({ path: 'evidence/screenshots/02-hit-reaction.png' });

  // Click a few more times to get coins
  for(let i=0; i<5; i++) {
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(100);
  }

  console.log('Capturing state with coins...');
  await page.screenshot({ path: 'evidence/screenshots/03-coins-earned.png' });

  console.log('Closing browser and server...');
  await browser.close();
  await server.close();
  console.log('Evidence captured successfully.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
