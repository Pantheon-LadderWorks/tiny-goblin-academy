# Phase H1.6 — Hub Screenshot Evidence Pass

**Status:** COMPLETE
**Target:** Tiny Goblin Academy Hub (Tier 1 Dashboard)
**Date:** June 2026

## Objective
Capture visual evidence of the current read-only hub to verify the "beautiful dashboard" claim before proceeding to H2 polish. This ensures we are basing future UI decisions on actual visual state, not assumed logic.

## Execution
We utilized Playwright over Microsoft Edge to load the hub in a local Vite dev server and capture the entry sequence, main layout, detail states, and responsive narrow modes.

## Evidence

### 1. Boot Sequence
The boot screen enforces Pantheon product identity with a 2-second timeout before transitioning to the roster.

![Boot Screen](file:///C:/Users/kryst/.gemini/antigravity/brain/284692b5-3d65-4fec-aebb-254a4edd625f/01-hub-boot.png)

### 2. Main Dashboard Layout
The main dashboard displays the game roster correctly. The 10 games are listed with their badges, icons, and status flags.

![Main Dashboard](file:///C:/Users/kryst/.gemini/antigravity/brain/284692b5-3d65-4fec-aebb-254a4edd625f/02-dashboard-main.png)

### 3. Detail View (Source Available)
When a typical "pass" game with source available (like 02 - Potion Sorter) is clicked, the detail panel updates to show its specific data, including the source path.

![Game Detail](file:///C:/Users/kryst/.gemini/antigravity/brain/284692b5-3d65-4fec-aebb-254a4edd625f/03-game-detail-source-available.png)

### 4. Detail View (Restoration Deferred)
When a historically passed game without source (like 01 - Button Goblin Clicker) is clicked, the panel gracefully displays a "Restoration Deferred" notice in lieu of source paths.

![Restoration Deferred Game Detail](file:///C:/Users/kryst/.gemini/antigravity/brain/284692b5-3d65-4fec-aebb-254a4edd625f/04-game-detail-restoration-deferred.png)

### 5. Responsive / Narrow Mode
When the viewport is narrowed (e.g. 375px width), the grid adjusts its columns to maintain readability.

![Narrow Mode](file:///C:/Users/kryst/.gemini/antigravity/brain/284692b5-3d65-4fec-aebb-254a4edd625f/05-dashboard-narrow.png)

## Findings
The read-only Hub is functional and visually clean. The underlying data structures correctly hydrate the UI. As evidence supports, it constitutes a completed "scaffold" that is ready for subsequent H2 visual polish and launcher logic.
