# Birthday Build Fix 1 — Terminal State Physics Lock

## 1. Purpose

Fix the Level 8 Birthday Build terminal-state physics bug where a defeated goblin could keep falling after the run had already entered `Defeat`.

This pass fixes only terminal-state motion. It does not tune jump height, player scale, platform placement, assets, manifests, or level layout.

## 2. Bug Summary

When the player overlapped spikes, the simulation correctly changed `runStatus` to `Defeat` and logged `Hit spikes.` once. However, the Phaser Arcade Physics body remained an active gravity-affected body, so vertical velocity continued and the status panel could show the goblin falling into very large Y values.

Victory had the same architectural risk because it is also a terminal state.

## 3. Root Cause

`simulation.ts` already guarded terminal event logging with `runStatus === "Active"`, so the ledger was not the problem.

The root cause was in `main.ts`: after `runStatus` became terminal, the render/physics layer only set horizontal velocity to zero. It did not stop vertical velocity, disable gravity, or park the Arcade Physics body.

## 4. Fix Summary

Added `src/terminalPhysics.ts` with `applyTerminalPlayerLock()`.

The helper:

- sets player velocity to `0, 0`;
- disables gravity on the player body;
- stops active body movement;
- preserves sprite visibility.

`main.ts` now applies the helper once after the simulation state reaches `Defeat` or `Victory`.

## 5. Architecture Boundary

Phaser may solve collision and motion, but simulation/state remains the authority for runStatus and the action ledger.

Terminal states must stop active physics motion so a defeated or victorious goblin does not keep simulating as if the run were active.

The fix keeps that boundary:

- Phaser still solves collisions and overlaps.
- `simulation.ts` still owns `runStatus`, animation intent, and ledger events.
- `main.ts` applies the terminal physics lock to the Phaser body after simulation reaches a terminal state.

## 6. Files Changed

- `CHANGELOG.md`
- `games/tier-1/08-one-room-platformer/PLAYABLE_LOOP_CONTRACT.md`
- `games/tier-1/08-one-room-platformer/BIRTHDAY_BUILD_FIX_1_TERMINAL_STATE_LOCK.md`
- `games/tier-1/08-one-room-platformer/src/main.ts`
- `games/tier-1/08-one-room-platformer/src/terminalPhysics.ts`
- `games/tier-1/08-one-room-platformer/tests/terminal-physics.test.ts`

## 7. Validation Results

Validation performed:

- targeted terminal physics regression test;
- academy manifest validators;
- hub icon validators;
- academy asset/animation manifest validators;
- asset pipeline smoke check;
- Level 8 TypeScript check;
- Level 8 Vite build.

No Tauri, Rust, Cargo, `pnpm install`, asset cleanup, or manifest rewrites were run.

## 8. Remaining Known Issues

- Jump/platform scale mismatch remains active. The first platform is still just above the current jump arc after the Birthday Build playfield/scale changes.
- Human visual playtest is still required to confirm the goblin visibly parks at the terminal contact point in the running browser.

## 9. Recommended Next Fix

Recommended next fix:

```text
Level 8 Birthday Build Fix 2 — Jump / Scale / Platform Reach Tuning
```
