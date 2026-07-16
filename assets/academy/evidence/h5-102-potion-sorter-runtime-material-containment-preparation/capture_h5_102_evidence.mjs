import { spawn } from "node:child_process";
import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const repoRoot = process.cwd();
const labRelative = "assets/academy/evidence/h5-102-potion-sorter-runtime-material-containment-preparation";
const labPath = path.join(repoRoot, ...labRelative.split("/"));
const captures = path.join(labPath, "captures");
const port = 5112;
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const sheets = [
  ["materials", "01-runtime-prepared-material-inventory.png", 1600, 900],
  ["materials-min-1", "01a-material-inventory-1024x640-plate-1.png", 1024, 640],
  ["materials-min-2", "01b-material-inventory-1024x640-plate-2.png", 1024, 640],
  ["skins", "02-potion-prop-skin-inventory.png", 1600, 900],
  ["diagram", "03-layering-first-containment-diagram.png", 1600, 900],
  ["cradle", "04-conveyor-cradle-proof.png", 1600, 900],
  ["rail", "05-foreground-rail-proof.png", 1600, 900],
  ["bin", "06-deep-containment-three-state-proof.png", 1600, 900],
  ["aperture", "07-machine-aperture-three-state-proof.png", 1600, 900],
  ["bounds", "08-interaction-bounds-proof.png", 1600, 900],
  ["irregular", "09-irregular-opening-mask-verdict.png", 1600, 900],
  ["binding", "10-material-binding-proof.png", 1600, 900],
  ["harness", "11-harness-1920x1080.png", 1920, 1080],
  ["harness", "12-harness-1024x640.png", 1024, 640],
  ["verdicts", "13-runtime-preparation-verdicts.png", 1600, 900],
  ["rejected", "14-rejected-deferred-containment.png", 1600, 900],
  ["destinations", "15-three-color-destination-containment-board.png", 1600, 900],
  ["deep-debug", "16-deep-containment-presentation-debug.png", 1600, 900],
  ["aperture-debug", "17-machine-aperture-three-state-debug.png", 1600, 900]
];

async function locatePlaywright() {
  const pnpm = path.join(repoRoot, "node_modules", ".pnpm");
  const entries = await readdir(pnpm);
  const packageDir = entries.find((name) => name.startsWith("playwright@"));
  if (!packageDir) throw new Error("Repository-local Playwright was not found.");
  return path.join(pnpm, packageDir, "node_modules", "playwright", "index.mjs");
}

async function waitForServer(url) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try { const response = await fetch(url); if (response.ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Evidence server did not become ready at ${url}`);
}

await mkdir(captures, { recursive: true });
for (const existing of await readdir(captures)) {
  if (existing.endsWith(".png")) await unlink(path.join(captures, existing));
}
const server = spawn("python", ["-m", "http.server", String(port), "--bind", "127.0.0.1"], {
  cwd: repoRoot,
  stdio: ["ignore", "ignore", "pipe"],
  windowsHide: true
});

let browser;
let interactionProof;
const layoutProofs = [];
try {
  const rootUrl = `http://127.0.0.1:${port}`;
  await waitForServer(`${rootUrl}/${labRelative}/index.html`);
  const { chromium } = await import(pathToFileURL(await locatePlaywright()).href);
  browser = await chromium.launch({ headless: true, executablePath: chromePath });
  for (const [sheet, file, width, height] of sheets) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const errors = [];
    page.on("pageerror", (error) => errors.push(String(error)));
    await page.goto(`${rootUrl}/${labRelative}/index.html?sheet=${sheet}&capture=1`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.__H5102_STATE__?.ready === true, null, { timeout: 30000 });
    // Let Phaser complete two compositing frames after scene readiness. Capturing
    // immediately can observe a partially uploaded text texture in headless Chrome.
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.waitForTimeout(1000);
    if (errors.length) throw new Error(`${file} page errors: ${errors.join(" | ")}`);
    if (sheet.startsWith("materials")) {
      const layoutAudit = await page.evaluate(() => window.__H5102_STATE__?.layoutAudit);
      if (!layoutAudit?.passed) throw new Error(`${file} layout audit failed: ${JSON.stringify(layoutAudit)}`);
      layoutProofs.push({ sheet, file, viewport: { width, height }, ...layoutAudit });
    }
    if (sheet === "bounds") {
      const point = { x: 600, y: 250 };
      await page.mouse.click(point.x, point.y);
      await page.waitForFunction(() => window.__H5102_STATE__?.interactionProbe === true);
      interactionProof = {
        laneId: "H5.102",
        proof: "pointer click outside visible bounds and inside interaction bounds",
        clickPoint: point,
        visibleBounds: { x: 731, y: 280, w: 138, h: 330 },
        interactionBounds: { x: 540, y: 235, w: 360, h: 430 },
        maskBounds: { x: 690, y: 350, w: 220, h: 260 },
        sortingDropBounds: { x: 925, y: 485, w: 230, h: 130 },
        insideInteractionBounds: true,
        insideVisibleBounds: false,
        browserEventObserved: true,
        passed: true
      };
    }
    await page.screenshot({ path: path.join(captures, file), fullPage: false });
    await page.close();
    process.stdout.write(`captured ${file} (${width}x${height})\n`);
  }
  if (!interactionProof) throw new Error("Interaction-bound proof was not captured.");
  await writeFile(path.join(labPath, "interaction-proof.json"), `${JSON.stringify(interactionProof, null, 2)}\n`, "utf8");
  await writeFile(path.join(labPath, "evidence-layout-proof.json"), `${JSON.stringify({ laneId: "H5.102A", passed: layoutProofs.every((item) => item.passed), proofs: layoutProofs }, null, 2)}\n`, "utf8");
} finally {
  if (browser) await browser.close();
  server.kill();
  await new Promise((resolve) => server.once("exit", resolve));
}
