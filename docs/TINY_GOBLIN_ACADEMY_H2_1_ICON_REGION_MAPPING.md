# Phase H2.1 — Hub Icon Sheet Source-Rectangle Mapping

**Status:** COMPLETE (Mapping Phase)
**Target:** Tiny Goblin Academy Hub (Tier 1 Dashboard)
**Date:** June 2026

## Objective
Correct the assumption that the `tga-hub-game-icons-sheet-concept-v0.1.png` is a clean uniform 5×2 sprite grid. It is an irregular composition sheet (a "source pantry") that requires explicit source-rectangle mapping for each icon badge.

## Why Automatic Bounds Detection Failed
Initial attempts to automatically slice the grid based on rows and columns using Python/Pillow failed because the script over-indexed on the irregular checkerboard transparency pattern, resulting in large, useless 733-pixel-wide full-row bounding boxes. The sheet's negative space and irregular positioning requires a true computer-vision shape detection (OpenCV contours) or manual bounds selection rather than simplistic grid division.

## Why This Sheet Needs Source Rectangles
Because the icons are scattered unevenly with large gaps of negative checkerboard space, dividing the image into 5x2 uniform slices yields misaligned icons, chopped borders, and vast amounts of checkerboard noise. Named source rectangles precisely map each icon, isolating the intended art and allowing it to be drawn correctly using a scale-and-translate `SpriteFrame` approach.

## Sheet Properties
- **Image:** `assets/academy/hub/tga-hub-game-icons-sheet-concept-v0.1.png`
- **Width:** 768px
- **Height:** 1376px
- **Alpha:** Yes (RGBA format)
- **Grid Layout:** Irregular

## Mapped Source Rectangles

| Game ID | Slug | Label | Source Rectangle (x, y, w, h) | Status |
|---|---|---|---|---|
| `tga-01` | button-goblin-clicker | Button Goblin Clicker | `{"x": 25, "y": 132, "w": 208, "h": 218}` | mapped |
| `tga-02` | potion-sorter | Potion Sorter | `{"x": 277, "y": 133, "w": 214, "h": 215}` | mapped |
| `tga-03` | dice-duel-tavern | Dice Duel Tavern | `{"x": 286, "y": 429, "w": 195, "h": 219}` | mapped |
| `tga-04` | card-goblin-duel | Card Goblin Duel | `{"x": 30, "y": 711, "w": 179, "h": 198}` | mapped |
| `tga-05` | dungeon-key-run | Dungeon Key Run | `{"x": 560, "y": 708, "w": 185, "h": 215}` | mapped |
| `tga-06` | tiny-farm-day | Tiny Farm Day | `{"x": 401, "y": 1077, "w": 193, "h": 193}` | mapped |
| `tga-07` | pet-campfire | Pet Campfire | `{"x": 186, "y": 1077, "w": 184, "h": 193}` | mapped |
| `tga-08` | one-room-platformer | One-Room Platformer | `{"x": 292, "y": 709, "w": 185, "h": 224}` | mapped |
| `tga-09` | top-down-slime-quest | Top-Down Slime Quest | `{"x": 545, "y": 427, "w": 203, "h": 234}` | mapped |
| `tga-10` | mini-settlement-sim | Mini Settlement Sim | `{"x": 5, "y": 429, "w": 252, "h": 216}` | mapped |

*Note: All bounding boxes include a 6px uniform generous padding to ensure translucent glow/shadow artifacts are not truncated.*

## Review Requirements
All boxes were identified correctly and padded generously. However, human visual review of the overlay is always advised to ensure no intentional design elements were mistakenly clipped.

## Evidence Paths
- **Coordinate Grid:** `hub/evidence/screenshots/h2-1-icon-region-mapping/00-coordinate-grid.png`
- **Rectangle Overlay:** `hub/evidence/screenshots/h2-1-icon-region-mapping/01-hub-icon-regions-overlay.png`

*(Hub UI wiring deferred until review is completed.)*
