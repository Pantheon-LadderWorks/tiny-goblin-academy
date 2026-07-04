# Birthday Build Fix 3 — Player Scale + Required Path Reachability

## 1. Purpose

Make Level 8 visually readable and winnable using a stable single-jump v0.1 movement contract.

This pass does not add double jump, moving platforms, keys, new rooms, editor validation, new assets, or manifest changes.

## 2. Bug Summary

After the Birthday Build expanded the playfield to 800x600, the goblin looked too small relative to the room and the required first platform / hazard-crossing route sat just above the old jump envelope.

The room could render and respond to input, but the required win path was not yet fair.

## 3. Root Cause

The goblin visual scale was hardcoded in `main.ts` as `64 / 280`, which made the character read small in the taller room.

The movement constants were also scattered enough that the jump envelope was implicit rather than reviewed against required route geometry. With `jumpVelocity = -620` and `gravity = 1800`, the rough maximum jump height was about 107px, while the required first platform rise is about 123px.

## 4. Fix Summary

Created `src/playerTuning.ts` to centralize the Level 8 v0.1 movement contract.

Changed:

- goblin visual width from 64px to 90px via `PLAYER_VISUAL_SCALE`;
- jump velocity from `-620` to `-720`;
- existing run speed, gravity, max fall speed, and body size moved behind named tuning constants;
- no `level8.json` platform coordinates changed.

The new rough max jump height is about 144px, enough for the required first platform rise plus a small tolerance without making optional upper platforms the tuning target.

## 5. Movement Contract

The v0.1 movement contract is:

- single jump only;
- no double jump;
- no wall jump;
- no dash;
- no moving platforms;
- no coyote time yet;
- required path must be reachable;
- optional/future platforms may remain unreachable.

## 6. Required Path Scope

Required v0.1 win path:

- player starts on the left side;
- player can reach the first required platform / route step;
- player can cross or clear the spike hazard through the intended route;
- player can reach the door / goal area.

The tuning test checks the first required vertical jump envelope because that was the observed blocker.

## 7. Optional/Future Platform Scope

The Sticker Book editor is a level authoring tool, not automatic gameplay approval. Required path geometry must be checked against the current player movement contract. Optional or future-route platforms may be visually placed without being reachable in the current v0.1 loop.

Upper platforms may become valid later through future mechanics such as key routes, double jump, moving platforms, wall jump, or room progression contracts. They are not the v0.1 tuning target.

## 8. Files Changed

- `CHANGELOG.md`
- `games/tier-1/08-one-room-platformer/PLAYABLE_LOOP_CONTRACT.md`
- `games/tier-1/08-one-room-platformer/BIRTHDAY_BUILD_FIX_3_JUMP_SCALE_REACH.md`
- `games/tier-1/08-one-room-platformer/src/main.ts`
- `games/tier-1/08-one-room-platformer/src/playerTuning.ts`
- `games/tier-1/08-one-room-platformer/src/simulation.ts`
- `games/tier-1/08-one-room-platformer/tests/player-tuning.test.ts`

## 9. Validation Results

Validation performed:

- targeted player tuning / reachability test;
- terminal-state regression test;
- input-controls regression test;
- academy manifest validators;
- hub icon validators;
- academy asset/animation manifest validators;
- asset pipeline smoke check;
- Level 8 TypeScript check;
- Level 8 Vite build.

No Tauri, Rust, Cargo, `pnpm install`, asset cleanup, manifest rewrites, editor overhaul, double jump, moving platforms, or level geometry edits were run.

## 10. Remaining Known Issues

- Human playtest is still required to confirm the tuned route feels fair in the actual browser/Tauri shell.
- Optional/future upper platforms are not guaranteed reachable in v0.1.

## 11. Future Editor Validator Recommendation

Future Sticker Book editor work should add reachability warnings rather than treating every dragged platform as gameplay-approved truth.

Suggested future warning model:

- green: reachable with current movement contract;
- yellow: optional or future ability route;
- red: unreachable required path;
- purple: decorative / non-gameplay.

## 12. Recommended Next Fix

Recommended next options:

```text
A. Level 8 Birthday Build Fix 4 — Win Route Human Review + Goal Polish
B. Level 8 Editor Validator Planning — Required Path Reachability Warnings
C. Stop and mark Level 8 Birthday Build as Human Review candidate if Kryssie passes the playtest.
```
