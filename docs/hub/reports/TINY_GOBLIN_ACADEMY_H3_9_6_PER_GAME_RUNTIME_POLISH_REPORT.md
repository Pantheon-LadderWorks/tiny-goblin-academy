# Tiny Goblin Academy H3.9.6: Per-Game Runtime Polish Report

## Context
* **Current H3.9.5E Commit SHA:** `10f25e5 fix: polish embedded dev runtime viewport`
* **Validation Baseline:** The launcher works end-to-end, traversing through the Hub, Game Launch Boot Screen, dev server spawn, loading inside Tauri, and safely closing back to the Hub. Most games successfully load and display in the viewport.

## Investigation & Fixes

### Level 02: Potion Sorter
* **Root Cause:** The `index.html` file contained only an empty `<div id="app"></div>` shell. However, `src/main.ts` immediately queried the DOM for specific elements (`#timer`, `#score`, `#combo`, etc.) before initializing Phaser, throwing a fatal JavaScript error (`Potion Sorter DOM shell is incomplete`) when they were not found. This prevented the game from rendering its playfield.
* **Fix:** Injected the missing HTML shell directly into `#app` within `src/main.ts` before querying the DOM elements, matching the setup pattern successfully used in Level 01.

### Level 01: Button Goblin Clicker
* **Viewport Fix:** The game previously caused awkward outer scrolling in the Tauri runtime because `body` and `.game-shell` used `min-height: 100vh` along with significant vertical padding, and `.playfield-wrap` had a hardcoded `min-height: 520px`. 
* **Changes:** 
  * Updated `body` and `.game-shell` to `height: 100vh` and added `overflow: hidden` to the body.
  * Converted `.game-shell` to a flex column so the internal `.game-layout` grid could stretch dynamically using `flex: 1` and `min-height: 0`.
  * Replaced `min-height: 520px` on `.playfield-wrap` with `min-height: 0` and `height: 100%`, allowing it to cleanly shrink to fit the available embedded Tauri viewport without triggering scrollbars.

### Level 06: Tiny Farm Day
* **Viewport Fix:** The game's layout similarly exceeded the viewport due to `min-height: 100vh` on the `body`. 
* **Changes:**
  * Updated `body` to `height: 100vh` and `overflow: hidden`.
  * Set `#app` to `height: 100%` and configured it as a flex column.
  * Updated `#layout` to `flex: 1` and `min-height: 0` so it absorbs available vertical space.
  * Added `min-height: 0` to `#ledger` so the scrolling log cleanly fits inside its grid column instead of stretching the outer container.

### Shared Runtime CSS
* Per-game CSS fixes were strongly preferred for these three problem children, so no global runtime CSS changes were forcibly applied to avoid breaking the 7 successfully tested games.

## Packaged App Validation Results
* **Level 01 — Button Goblin Clicker:** Launches through boot screen, loads inside Tauri cleanly without awkward outer runtime scroll, play area is fully usable. Close returns to Hub and stops server.
* **Level 02 — Potion Sorter:** Launches through boot screen, the playable body now visibly renders inside Tauri, verbs are visible and usable. Close returns to Hub and stops server.
* **Level 06 — Tiny Farm Day:** Launches through boot screen, loads cleanly inside Tauri without awkward outer scroll, log ledger scrolls internally. Close returns to Hub and stops server.
* **Level 09 & 10 (Spot Check):** Still load perfectly without being negatively affected by the per-game viewport changes.
* **Orphan Process Check:** Confirmed clean shutdown of `node`/`pnpm` processes for ports 5101, 5102, 5106, 5109, and 5110 after validation tests.

## Confirmations
* **`tauri dev` Used:** No. Validation was strictly performed using the packaged `app.exe` generated via `pnpm run hub:tauri:build`.
* **Static Build Artifact Command:** Remains retired and banished to the swamp.
* **Production Behavior:** Not added.
* **CodeCraft:** Untouched.

## Conclusion
With the viewport clipping and rendering issues resolved, the embedded classrooms now securely fit inside the Tauri doorway. The **H3.9 Dev Launcher** successfully fulfills its intended responsibilities and can be considered complete.
