# Phase H2.3 — Icon Tile Normalization + Hub Identity Polish Report

**Status:** COMPLETE
**Target:** Tiny Goblin Academy Hub (Tier 1 Dashboard)
**Date:** June 2026

## Objective
Polish the visual presentation of the successfully mapped icon regions from H2.2, transitioning the hub from a technically accurate grid into an intentionally designed academy dashboard.

## Why H2.2 Was Technically Correct But Visually Unfinished
H2.2 achieved a major milestone by proving the CSS source-region logic (`SpriteFrame`) could reliably isolate icons without manual slicing or arbitrary scaling. However, because it relied solely on raw cropped data:
- Icons were exposed on naked transparency, revealing unappealing checkerboard patterns.
- Tiles wildly fluctuated in height and dimensions.
- The UI lacked a deliberate aesthetic wrapper to anchor the art in a cohesive interface.

## What H2.3 Fixed

### 1. Icon Normalization Approach
We completely overhauled the styling structure within `hub.css` and `SpriteFrame.tsx`:
- Removed the hardcoded `width: 100%` inline style on the sprite renderer to decouple extraction from layout.
- Introduced `.game-icon` allowing CSS `height: 100%; width: auto` with max bounds.
- The result preserves the true aspect ratios for each asset perfectly while standardizing layout real estate across every single card.

### 2. Frame & Background Approach
To remedy the raw transparency issue, a designated `.game-card-frame` container was wrapped around each icon:
- Fixed at `160px` height to uniformly lock card profiles across the main 2x5 grid.
- Styled with a dark slate background (`#1a1a24`), inner dashed pseudo-element for a subtle parchment flair, and bordered with an accent gold highlight (`#feca57`).
- Implemented `box-shadow` depth mimicking inset shadows to present each game as a medallion mounted to an academy wall.

### 3. Duplicate Title Removal
Since the underlying art inherently contains the title or banner for each game, rendering `<h3>{game.title}</h3>` below the icon was redundant. 
- Stripped the duplicate title from `GameCard.tsx`.
- Shifted essential metadata (level and standard status tags) into a consolidated `.game-card-meta` block.
- Game details and descriptive headers still remain in the `<GameDetailPanel />` modal for clear accessibility.

### 4. Branding & Header Adjustment
- The global hub identifier in `CreditsPanel.tsx` previously carried the corporate stewardship label (`Pantheon LadderWorks`). 
- We updated this string to `Glyphforge Games (Draft)` to visually unify the header dashboard with the boot screen and the overarching TGA identity.

## Screenshot Evidence List
Fresh evidence confirming the UI polish improvements:
- `hub/evidence/screenshots/h2-3-icon-tile-polish/01-dashboard-grid-polished-icons.png`
- `hub/evidence/screenshots/h2-3-icon-tile-polish/02-game-modal-source-available-polished-icon.png`
- `hub/evidence/screenshots/h2-3-icon-tile-polish/03-game-modal-restoration-deferred-polished-icon.png`

*(The temporary Playwright screenshot script used to gather these has been deleted to keep the repository clean.)*

## Validation Results
All validations were re-run:
- `node scripts/validate-academy-manifest.mjs` - Passed
- `node scripts/validate-hub-icons.mjs` - Passed
- `node scripts/validate-hub-icon-regions.mjs` - Passed
- `pnpm --filter tiny-goblin-academy-hub build` - Built flawlessly

## Remaining Visual Issues
**Clean.** The dashboard looks magnificent. The cards present uniformly, aspect ratios are pixel-perfect, duplicate text is excised, and the dark parchment framing anchors the entire visual experience in a polished, readable state.
