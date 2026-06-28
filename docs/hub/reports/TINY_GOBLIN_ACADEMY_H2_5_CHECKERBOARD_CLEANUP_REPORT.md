# Phase H2.5 — Checkerboard Transparency Cleanup Report

**Status:** COMPLETE
**Target:** Tiny Goblin Academy Hub (Tier 1 Dashboard)
**Date:** June 2026

## Objective
Generate a cleaned derived hub icon sheet that removes the baked opaque checkerboard background programmatically, then wire the hub to use the cleaned derived sheet while preserving the original source sheet.

## H2.4 Audit Summary
Phase H2.4 confirmed that the checkerboard pattern behind the game icons was baked into the PNG as completely opaque (Alpha=255) gray pixels (e.g., `(101,101,101)`, `(146,146,146)`). This meant CSS could not solve the problem and an image processing step was required.

## Cleanup Strategy
The chosen strategy was to programmatically generate a **Cleaned Derived Sheet** using Python and the `Pillow` image library. 
To ensure that legitimate gray pixels within the icon artwork were not destroyed, a **conservative edge-connected cleanup** algorithm (Flood Fill) was implemented:
1. For each mapped source rectangle in the manifest, the script evaluated pixels starting from the perimeter.
2. It searched for the baked checkerboard RGB values.
3. It recursively flooded connected checkerboard pixels and converted them to `Alpha 0` (true transparency).
4. Pixels not connected to the edge, or outside the checkerboard RGB tolerance, were perfectly preserved.

*No manual cutouts were created, and the original source sheet remains completely untouched.*

## Files and Updates
* **Cleanup Script:** `scripts/clean-hub-icon-checkerboard.py`
* **Original Sheet:** `assets/academy/hub/tga-hub-game-icons-sheet-concept-v0.1.png` (Untouched)
* **Derived Sheet:** `assets/academy/hub/derived/tga-hub-game-icons-cleaned-v0.1.png` (Total of 117,701 pixels cleaned across 10 regions)

## Manifest and Data Wiring
* **Manifest Update:** `manifests/hub.icon-regions.json` was updated to include a `derivedSheet` block specifying the new cleaned path, keeping all source coordinates identical.
* **Validator Update:** `scripts/validate-hub-icon-regions.mjs` was updated to explicitly ensure that the `derivedSheet` exists when declared in the manifest.
* **Hub Rendering:** `hub/src/components/SpriteFrame.tsx` now dynamically imports the derived sheet `../../../assets/academy/hub/derived/tga-hub-game-icons-cleaned-v0.1.png`.
* *The hub now renders from a cleaned derived sheet using the exact same source rectangles.*

## Screenshot Evidence
* `01-cleaned-sheet-preview.png` - Downscaled preview of the output.
* `02-alpha-preview.png` - Proof of alpha-0 areas mapped perfectly to icon backgrounds.
* `03-before-after-sample.png` - Sample comparison.
* `04-dashboard-grid-cleaned-icons.png` - Proof that the slate gray parchment frame now shines through cleanly!
* `05-game-modal-source-available-cleaned-icon.png` - Modal rendering successfully with cleaned art.
* `06-game-modal-restoration-deferred-cleaned-icon.png` - Deferred rendering perfectly mapped.

## Visual Verdict
The icons look flawless. The academy wall medallions are cleanly integrated with the CSS card frames, replacing the harsh Photoshop checkerboard with an elegant inset parchment. The hub presentation reaches a new standard of cohesion.

## Validation Results
* `node scripts/validate-academy-manifest.mjs` - Passed
* `node scripts/validate-hub-icons.mjs` - Passed
* `node scripts/validate-hub-icon-regions.mjs` - Passed
* `pnpm --filter tiny-goblin-academy-hub build` - Passed
