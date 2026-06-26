# Phase H2.2 — Hub Icon Source Region Wiring Report

**Status:** COMPLETE
**Target:** Tiny Goblin Academy Hub (Tier 1 Dashboard)
**Date:** June 2026

## Objective
Wire the newly mapped icon source regions from `hub.icon-regions.json` into the Hub UI, replacing the broken uniform-grid calculation with a robust, translation-based SpriteFrame renderer.

## What H2.2 Fixed
- **Visual Accuracy:** Eradicated the checkerboard "slabs" and neighbor-chopping artifacts caused by treating the irregular asset pantry as a 5x2 uniform atlas.
- **Aspect Ratio Protection:** Icons now render with correct internal proportions and fit their containers without arbitrary stretching.
- **Modal Support:** A clean, larger version of the mapped source region now appears inside the Game Detail Panel to establish stronger visual continuity.

## How `hub.icon-regions.json` is Consumed
The JSON manifest was ingested into a TypeScript data module (`hub/src/data/hubIconRegions.ts`). This allows Vite to cleanly bundle the data as an exported array of region objects, avoiding any out-of-root JSON import restrictions while retaining strongly typed access. The `GameCard` and `GameDetailPanel` components simply look up the matching region by `gameId`.

## SpriteFrame Rendering Approach
The `SpriteFrame` component renders a single source rectangle directly from the master asset without needing individual icon cutouts.
- **Outer Wrapper:** Receives the specific aspect ratio `w / h` of the mapped source rectangle and enforces `overflow: hidden`.
- **Inner Image:** Receives the full `sheetUrl`. To prevent scaling issues, its width is set proportionally to `(768 / w) * 100%`, forcing the image's layout footprint to scale correctly inside the wrapper.
- **Translation:** The inner image is shifted using CSS `transform: translate(-X%, -Y%)`, where the percentages refer to the translated image's *own* scaled dimensions: `-(x / 768) * 100%`. This securely frames the designated icon.

## Validator Result
The `validate-hub-icon-regions.mjs` script was created and run successfully. It checks:
- All 10 Tier 1 game IDs have exactly one mapped region.
- All mapped boundaries fall within the `768x1376` bounds of the source sheet.
- Valid width/height properties exist for every rectangle.

Both `validate-academy-manifest.mjs` and `validate-hub-icons.mjs` also continued to pass without regressions.

## Screenshot Evidence List
Fresh evidence confirming the UI improvements:
- `hub/evidence/screenshots/h2-2-source-region-icons/01-dashboard-grid-source-regions.png`
- `hub/evidence/screenshots/h2-2-source-region-icons/02-game-modal-source-available-source-region.png`
- `hub/evidence/screenshots/h2-2-source-region-icons/03-game-modal-restoration-deferred-source-region.png`

*(The temporary Playwright screenshot script used to gather these has been deleted to keep the repository clean.)*

## Visual Verdict
**Clean.** The dashboard looks highly polished and professional. The icons feel at home within their cards, preserving the studio's pixel-art styling without rendering artifacts. The 2x5 grid layout handles the dynamically proportioned icons gracefully. No manual asset cutting was needed.
