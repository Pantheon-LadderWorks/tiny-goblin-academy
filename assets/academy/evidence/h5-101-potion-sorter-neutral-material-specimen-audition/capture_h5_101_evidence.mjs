import { spawn } from "node:child_process";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const labRelative = "assets/academy/evidence/h5-101-potion-sorter-neutral-material-specimen-audition";
const labPath = path.join(repoRoot, ...labRelative.split("/"));
const capturePath = path.join(labPath, "captures");
const port = 5111;
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function locatePlaywright() {
  const pnpm = path.join(repoRoot, "node_modules", ".pnpm");
  const entries = await readdir(pnpm);
  const packageDir = entries.find((name) => name.startsWith("playwright@"));
  if (!packageDir) throw new Error("A repository-local Playwright package was not found.");
  return path.join(pnpm, packageDir, "node_modules", "playwright", "index.mjs");
}

async function waitForServer(url) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try { const response = await fetch(url); if (response.ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Evidence server did not become ready at ${url}`);
}

const sheets = [
  ["timber", "01-timber-comparison.png", 1600, 900],
  ["masonry", "02-masonry-comparison.png", 1600, 900],
  ["conveyor", "03-conveyor-repetition.png", 1600, 900],
  ["iron", "04-iron-rail-bracket.png", 1600, 900],
  ["gear", "05-gear-brass-accent.png", 1600, 900],
  ["parchment", "06-parchment-labels.png", 1600, 900],
  ["bottle", "07-potion-bottles.png", 1600, 900],
  ["fx", "08-fx-helper-board.png", 1600, 900],
  ["lighting", "09-neutral-vs-warm-light.png", 1600, 900],
  ["palette", "10-provisional-palette.png", 1600, 900],
  ["verdicts", "11-material-recipe-verdicts.png", 1600, 900],
  ["rejected", "12-constrained-rejected.png", 1600, 900],
  ["coherence", "13-coherence-1920x1080.png", 1920, 1080],
  ["coherence", "14-coherence-1024x640.png", 1024, 640]
];

await mkdir(capturePath, { recursive: true });
const server = spawn("python", ["-m", "http.server", String(port), "--bind", "127.0.0.1"], {
  cwd: repoRoot,
  stdio: ["ignore", "ignore", "pipe"],
  windowsHide: true
});

let browser;
try {
  const rootUrl = `http://127.0.0.1:${port}`;
  await waitForServer(`${rootUrl}/${labRelative}/index.html`);
  const { chromium } = await import(pathToFileURL(await locatePlaywright()).href);
  browser = await chromium.launch({ headless: true, executablePath: chromePath });
  for (const [sheet, file, width, height] of sheets) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.goto(`${rootUrl}/${labRelative}/index.html?sheet=${sheet}&capture=1`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.__H5101_READY__ === true);
    await page.screenshot({ path: path.join(capturePath, file), fullPage: false });
    await page.close();
    process.stdout.write(`captured ${file} (${width}x${height})\n`);
  }
} finally {
  if (browser) await browser.close();
  server.kill();
  await new Promise((resolve) => server.once("exit", resolve));
}

function pathToFileURL(filePath) {
  const normalized = filePath.replace(/\\/g, "/");
  return new URL(`file:///${normalized}`);
}
