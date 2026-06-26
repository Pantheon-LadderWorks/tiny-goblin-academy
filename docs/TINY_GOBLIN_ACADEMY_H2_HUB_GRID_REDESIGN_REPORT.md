# Phase H2 — Hub Layout Redesign: Icon Grid + Game Modal

**Status:** COMPLETE
**Target:** Tiny Goblin Academy Hub (Tier 1 Dashboard)
**Date:** June 2026

## Objective
Replace the initial vertical list/detail dashboard with a desktop-first academy hub layout (2 rows × 5 game icons). Ensure the icons are properly extracted from the sprite sheet while maintaining their aspect ratio. Ensure the main screen feels like a game hub rather than an admin list.

## Execution Details

1. **Critique Addressed:**
   - The vertical list layout has been destroyed and replaced with a proper desktop grid.
   - The permanent right-side detail column has been removed.
   - The icons are now sliced precisely according to the image dimensions (`assets/academy/hub/tga-hub-game-icons-sheet-concept-v0.1.png`), eliminating stretching.
   - The boot screen now properly features the `glyphforge-games-boot-splash-concept.png` asset and updated internal text.

2. **Layout Changes:**
   - Introduced a CSS Grid `display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(2, 1fr);` to build the 2x5 roster without the need for vertical scrolling on standard desktop viewports.
   - `GameCard` instances are now presented as dedicated tiles displaying the icon banner on top with statuses beneath.

3. **Icon Slicing / Aspect Ratio:**
   - Extracted the sprite sheet physical dimensions (768px Width, 1376px Height).
   - Confirmed the 5x2 grid setup via `manifests/hub.icons.json`.
   - Used CSS `aspect-ratio` based on the native dimensions (`1536 / 6880`) to instruct the browser to scale the `background-size` mapping correctly. Icons are no longer squeezed into a 48x48 box.

4. **Modal Behavior:**
   - Selecting a game opens a modal overlay (`.modal-overlay` & `.modal-content`) that centers the `GameDetailPanel`.
   - The modal supports `onClose` behavior via a dismiss button, clicking the backdrop, and hitting the `Escape` key.
   - The underlying grid remains firmly stationary, avoiding scroll jumping.
   - explicit read-only text: `Launch not implemented in this hub build.` remains prominent.

5. **Boot Screen Update:**
   - Replaced "Pantheon LadderWorks" with "Glyphforge Games".
   - Imported and displayed the draft boot splash graphic `glyphforge-games-boot-splash-concept.png`.
   - Retained the existing honest loading phrase ("Opening the Academy...") and the skip button, with no added dependencies or cinematics.

## Screenshot Evidence

The screenshots verify the grid UI and modal mechanics have been implemented as intended.

### 1. Boot Screen
![Boot Screen](file:///C:/Users/kryst/.gemini/antigravity/brain/284692b5-3d65-4fec-aebb-254a4edd625f/01-hub-boot.png)

### 2. Main Dashboard Grid
![Dashboard Grid](file:///C:/Users/kryst/.gemini/antigravity/brain/284692b5-3d65-4fec-aebb-254a4edd625f/02-dashboard-grid.png)

### 3. Detail View (Source Available)
![Game Detail Modal](file:///C:/Users/kryst/.gemini/antigravity/brain/284692b5-3d65-4fec-aebb-254a4edd625f/03-game-modal-source-available.png)

### 4. Detail View (Restoration Deferred)
![Deferred Detail Modal](file:///C:/Users/kryst/.gemini/antigravity/brain/284692b5-3d65-4fec-aebb-254a4edd625f/04-game-modal-restoration-deferred.png)

## Validation Results
- `node scripts/validate-academy-manifest.mjs`: Passed
- `node scripts/validate-hub-icons.mjs`: Passed
- `pnpm --filter tiny-goblin-academy-hub build`: Succeeded (no dev servers left running).

*H2 replaced the rejected vertical list dashboard. Main dashboard is desktop-first and does not require game-list scrolling. Launcher/install/runtime behavior remains deferred.*
