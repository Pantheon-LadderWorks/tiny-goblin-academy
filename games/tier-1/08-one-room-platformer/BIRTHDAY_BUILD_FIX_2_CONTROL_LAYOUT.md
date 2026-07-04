# Birthday Build Fix 2 — Control Bar / Playfield Layout Correction

## 1. Purpose

Fix the Level 8 Birthday Build control layout bug where the on-screen controls visually floated over the lower part of the playable room after the canvas grew to 800x600.

This pass also adds WASD keyboard support because it touches the same control-input surface.

## 2. Bug Summary

The Level 8 page rendered the control buttons as DOM controls in normal page layout below `#game-container`. However, `#game-container` was still styled as `800x450` while Phaser rendered an `800x600` canvas inside it.

The result: the DOM control row appeared after the old 450px container height and visually covered the bottom of the actual 600px playable canvas.

## 3. Root Cause

The controls were not Phaser-rendered in-game UI. They were HTML buttons in `index.html`, styled by `src/style.css`.

The root cause was a stale CSS container height:

```text
#game-container height: 450px
Phaser canvas height: 600px
```

The page layout believed the playfield ended 150px before the canvas actually ended.

## 4. Fix Summary

Updated `#game-container` to match the current Birthday Build canvas size:

```text
width: 800px
height: 600px
```

The existing DOM control row now sits below the full canvas instead of inside the playable room. The app root now uses `min-height: 100vh` so the taller center column can extend cleanly rather than forcing a viewport-height squeeze.

Added `src/inputControls.ts` to map keyboard input consistently:

- arrows remain supported;
- Spacebar/Up remain supported for jump;
- A/D now move left/right;
- W now jumps.

## 5. Layout Boundary

The playable stage must not be obstructed by development or player controls unless those controls are intentionally part of the game world. Level controls belong in page/HUD layout, not inside the physics stage.

This fix preserves that boundary:

- the canvas remains centered in the page;
- status and ledger panels remain DOM HUD;
- the on-screen controls remain DOM controls;
- the playable 800x600 Phaser stage is unobstructed by the control row.

## 6. Files Changed

- `CHANGELOG.md`
- `games/tier-1/08-one-room-platformer/PLAYABLE_LOOP_CONTRACT.md`
- `games/tier-1/08-one-room-platformer/BIRTHDAY_BUILD_FIX_2_CONTROL_LAYOUT.md`
- `games/tier-1/08-one-room-platformer/index.html`
- `games/tier-1/08-one-room-platformer/src/inputControls.ts`
- `games/tier-1/08-one-room-platformer/src/main.ts`
- `games/tier-1/08-one-room-platformer/src/style.css`
- `games/tier-1/08-one-room-platformer/tests/input-controls.test.ts`

## 7. Validation Results

Validation performed:

- targeted WASD/control input regression test;
- terminal-state regression test from Fix 1;
- academy manifest validators;
- hub icon validators;
- academy asset/animation manifest validators;
- asset pipeline smoke check;
- Level 8 TypeScript check;
- Level 8 Vite build.
- headless browser layout check confirming `.on-screen-controls` renders below the 800x600 canvas.

No Tauri, Rust, Cargo, `pnpm install`, asset cleanup, manifest rewrites, jump tuning, scale tuning, or level geometry edits were run.

## 8. Remaining Known Issues

- Jump/platform scale mismatch remains active. The first platform is still just above the current jump arc after the Birthday Build playfield/scale changes.
- Human visual playtest should confirm the controls are below the canvas in the hosted Tauri/dev shell view.

## 9. Recommended Next Fix

Recommended next fix:

```text
Level 8 Birthday Build Fix 3 — Jump / Scale / Platform Reach Tuning
```
