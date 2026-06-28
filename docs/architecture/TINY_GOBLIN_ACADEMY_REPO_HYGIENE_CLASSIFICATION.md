# Tiny Goblin Academy Repo Hygiene Classification

## Overview
This document classifies the dirty state of the working tree identified during the aborted H3.1 Tauri Spike preflight (and prior evidence generation work). 

**Critical Note:** No Rust, Cargo, or rustup commands were run during this classification. No cleanup, deletion, or staging of these files has been performed yet.

## Working Tree Dirty Items

### 1. `pnpm-lock.yaml`
* **Classification**: Mixed (Legitimate workspace changes + Questionable evidence tooling).
* **Origin**: Since Level 1 was restored and added back into the workspace, dependencies for `tga-01-button-goblin-clicker` such as `phaser`, `vite`, `vitest`, and `typescript` are expected and legitimate. The only questionable entry is `playwright` and whether its scoping as evidence/dev tooling should remain.
* **Recommended Action**: **DO NOT** revert the entire lockfile blindly. **DO NOT** remove valid Level 1 dependency lock entries. Inspect `package.json` vs lockfile scope to determine if `playwright` should remain as an evidence workflow dependency or be moved elsewhere before any cleanup.

### 2. `assets/academy/hub/tga-hub-game-icons-transparent.png`
* **Classification**: Duplicate asset.
* **Origin**: Leftover from the transparent icon generation script.
* **Analysis**: A hash comparison confirms this is an exact binary duplicate of the officially accepted `assets/academy/hub/derived/tga-hub-game-icons-transparent-v0.1.png`.
* **Recommended Action**: Delete.

### 3. `get-pip.py`
* **Classification**: Temporary tooling artifact.
* **Origin**: Leftover from installing Python dependencies (like OpenCV/Pillow) for the image transparency scripts.
* **Recommended Action**: Delete.

### 4. `game_studio_tree.md`
* **Classification**: User-created Game Studio plugin tree snapshot / local reference artifact.
* **Origin**: Created intentionally by the user (`tree /F /A > "game_studio_tree.md"`) to inspect the plugin shape.
* **Recommended Action**: Kryssie decision. Keep local only, move to docs/reference if useful, or delete later if obsolete. Do not treat as accidental junk.

### 5. Temporary Evidence Scripts
* `scripts/capture-h1-screenshots.cjs`
* `scripts/capture-h1-screenshots.mjs`
* `scripts/capture-h2-5b.cjs`
* `scripts/generate-h2-5b-evidence.py`
* `scripts/test-playwright.cjs`
* **Classification**: Ephemeral tooling.
* **Origin**: Used during the H1 and H2 phases to capture screenshots and process images for Human Review. They hardcode paths to the unauthorized `playwright` installation in `games/tier-1/04-card-goblin-duel/node_modules/playwright`.
* **Recommended Action**: Delete, unless any specifically need to be generalized and moved into an official `tools/` directory.

## Risk Notes
* The workspace dependency tree for Level 1 (and potentially others) is polluted by the unauthorized Playwright install. This should be explicitly sanitized before resuming any H3 launcher work, as we don't want the launcher accidentally wrapping or running unauthorized dev tooling.
* **DO NOT** use `git clean -fd` blindly without ensuring we don't wipe out any intentionally unstaged work, though currently, all untracked files are classified as junk.
