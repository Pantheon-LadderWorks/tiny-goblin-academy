# Phase H2.4 — Checkerboard Transparency Cleanup Audit

**Status:** COMPLETE
**Target:** Tiny Goblin Academy Hub (Tier 1 Dashboard)
**Date:** June 2026

## Objective
Determine whether the checkerboard visible behind hub icon regions is true transparency, baked image pixels, or CSS/frame leakage. Then recommend the safest programmatic cleanup path.

## Problem Summary
Phase H2.3 effectively framed the icons in the hub using CSS containers, but an underlying checkerboard pattern was still visible within the bounding box of the cropped icons. This audit aimed to discover whether this checkerboard was a result of CSS backgrounds bleeding through true alpha transparency, or if the checkerboard was baked directly into the PNG asset as opaque pixel data.

## Pixel / Alpha Findings
An automated python script (`scripts/audit-transparency.py`) was used to analyze the source image (`assets/academy/hub/tga-hub-game-icons-sheet-concept-v0.1.png`) and the individual regions defined in the manifest.

The findings are conclusive:
* **Image Mode:** RGBA
* **Has Alpha Channel:** True
* **Alpha Channel Min/Max:** (255, 255)
* **Alpha Distribution:**
  * Alpha 0 (transparent): 0 (0.00%)
  * Alpha 1-254 (partial): 0 (0.00%)
  * Alpha 255 (opaque): 1056768 (100.00%)
* **Color Analysis:** The most common colors across the sampled source regions are opaque grays representing the checkerboard pattern (e.g., `(101, 101, 101, 255)`, `(102, 102, 102, 255)`, `(146, 146, 146, 255)`).

## Classification Result
The issue is classified as: **baked-checkerboard**.
Despite the image having an RGBA color mode, 100% of its pixels are fully opaque (Alpha = 255). The checkerboard pattern is baked into the RGB color channels.

## Why CSS Cannot Solve It
Because the checkerboard pixels are entirely opaque, CSS `background-color` or frame styling applied behind the `SpriteFrame` will never be visible through them. The only way to remove the checkerboard using CSS alone would be extremely fragile `mix-blend-mode` hacks or SVG masks, both of which are inappropriate for scalable UI design and prone to breaking pixel-art fidelity. 

## Recommended Cleanup Strategy
The recommended strategy is: **Option B — Automated Cleaned Derived Sheet**

* **Keep original source sheet untouched:** The concept asset is a master document and should not be destructively edited.
* **Generate a derived cleaned sheet programmatically:** A python script (using PIL/Pillow or OpenCV) can ingest the source sheet and the `hub.icon-regions.json` manifest. It will target the specific grays used in the checkerboard within the defined source rectangles and convert them to true transparency (Alpha = 0).
* **Respect Asset Doctrine:** This avoids any manual "hand-cutting" in Photoshop. We maintain a single, sliceable image sheet and rely on data-driven rectangles, rather than manually creating 10 individual PNG cutouts.
* **Candidate Output:** `assets/academy/hub/derived/tga-hub-game-icons-cleaned-v0.1.png`

This approach provides a pristine asset tailored for UI rendering while preserving the programmatic pipeline established in the Tiny Goblin Academy architecture.
