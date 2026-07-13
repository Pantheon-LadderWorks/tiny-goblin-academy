# Tiny Goblin Academy - H6.3C Button Goblin Live GoblinRig Integration

## Purpose

H6.3C replaces the live Button Goblin Clicker floating head renderer with the H6.3B-approved full-body `GoblinRig` while preserving the existing gameplay loop.

This is runtime wiring, not a Button Goblin gameplay redesign.

## Baseline

`bbde034 docs: correct h6.3b rust validation status`

## Implementation Summary

Changed runtime files:

- `games/tier-1/01-button-goblin-clicker/src/scenes/GameScene.ts`
- `games/tier-1/01-button-goblin-clicker/src/actors/GoblinRig.ts`

`GameScene` now imports and owns the approved `GoblinRig` actor. The scene remains responsible for background, encounter labels, HP text, damage feedback, progression timing, and subscription to controller state.

`GoblinRig` owns the actor body parts, expression changes, hover/bonk/defeat animations, full-body hit area, shadow, baseline reset, and cleanup.

## Old Renderer Removal

Removed the active live runtime use of the old flattened Phaser Graphics head renderer:

- old head graphics creation is no longer the active Button Goblin actor;
- old head-only circle click target is no longer the active hit target;
- old head redraw/update path is replaced by `GoblinRig` state calls.

The standalone H6.3B preview page and preview route remain intact.

## Runtime Actor Placement

Live actor placement:

```text
centerX: 400
feetBaselineY: 500
scale: 1
hitArea: 250 x 305 ellipse centered at (0, -155) relative to the rig root
hitBounds: x -125, y -308, width 250, height 308
```

The actor is grounded on the accepted lower cavern floor baseline and remains in the central click-stage safe zone above the lower foreground obstruction band.

## Event To Animation Mapping

```text
normal active goblin -> idle
pointer over actor -> hover on
pointer out -> hover off
1 damage -> Bonk -1 reaction
2 damage -> Bonk -2 reaction
HP reaches zero -> defeat presentation
next goblin begins -> reset to idle
victory -> final defeated/victory presentation preserved
```

The controller and simulation remain authoritative for all gameplay state.

## Lifecycle Hardening

H6.3C also hardens the reusable rig for live runtime ownership:

- stops idle loops before starting new presentation states;
- kills tracked root/body/face/ear/shadow tweens on reset and destroy;
- guards timer callbacks after rig destruction;
- prevents tween completion callbacks from resetting destroyed actors;
- preserves baseline scale during hover, bonk, reset, and defeat;
- resets expression/part transforms for new goblins.

## Gameplay Invariants

Unchanged:

- goblin HP progression;
- click damage;
- coin rewards;
- Bonk Stick cost;
- Bonk Stick damage multiplier;
- goblin count;
- victory condition;
- simulation ownership;
- controller ownership;
- HUD card behavior;
- background asset and source image.

Controller and simulation files were intentionally not changed.

## Feedback Layout

Preserved:

- Goblin # label;
- HP display;
- BONK feedback lane;
- HUD cards;
- Bonk Stick action card;
- victory overlay.

Damage feedback remains in the upper-right actor-adjacent lane so the larger body does not obscure it.

## Evidence

Evidence folder:

```text
games/tier-1/01-button-goblin-clicker/evidence/h6-3c-live-goblin-rig-integration/
```

Captured browser evidence is from the live gameplay route:

```text
http://127.0.0.1:5101/
```

Capture kind:

```text
live-gameplay-browser-evidence
```

Evidence files:

- `button-goblin-live-rig-01-desktop-idle.png`
- `button-goblin-live-rig-02-desktop-hover.png`
- `button-goblin-live-rig-03-bonk-minus-1.png`
- `button-goblin-live-rig-04-defeat.png`
- `button-goblin-live-rig-05-next-goblin-reset.png`
- `button-goblin-live-rig-06-upgrade-purchased.png`
- `button-goblin-live-rig-07-later-stronger-goblin.png`
- `button-goblin-live-rig-08-bonk-minus-2.png`
- `button-goblin-live-rig-09-victory.png`
- `button-goblin-live-rig-10-debug-hit-area.png`
- `button-goblin-live-rig-11-narrow-idle.png`
- `button-goblin-live-rig-12-narrow-bonk.png`
- `button-goblin-live-rig-capture-index.json`

Browser evidence coverage:

- desktop idle live gameplay scene: `button-goblin-live-rig-01-desktop-idle.png` (1280x720)
- desktop hover live gameplay scene: `button-goblin-live-rig-02-desktop-hover.png` (1280x720)
- Bonk -1 live runtime reaction: `button-goblin-live-rig-03-bonk-minus-1.png` (1280x720)
- defeat state before next goblin reset: `button-goblin-live-rig-04-defeat.png` (1280x720)
- next goblin reset to idle: `button-goblin-live-rig-05-next-goblin-reset.png` (1280x720)
- Bonk Stick upgrade purchased: `button-goblin-live-rig-06-upgrade-purchased.png` (1280x720)
- later stronger goblin after upgrade: `button-goblin-live-rig-07-later-stronger-goblin.png` (1280x720)
- Bonk -2 live runtime reaction: `button-goblin-live-rig-08-bonk-minus-2.png` (1280x720)
- victory overlay with final defeated goblin presentation: `button-goblin-live-rig-09-victory.png` (1280x720)
- debug hit-area outline on live gameplay scene: `button-goblin-live-rig-10-debug-hit-area.png` (1280x720)
- narrow idle live gameplay scene: `button-goblin-live-rig-11-narrow-idle.png` (420x720)
- narrow bonk live gameplay scene: `button-goblin-live-rig-12-narrow-bonk.png` (420x720)

One desktop idle screenshot was visually surfaced in chat during the lane and confirmed as the live runtime route. The remaining screenshot files were generated and indexed from the live route; this conversation's image-return path was flaky, so H6.3C does not claim full in-chat visual inspection of every PNG by Mega.

## Embedded Tauri Evidence Status

Embedded Tauri evidence was captured after the browser evidence pass.

Evidence folder:

```text
games/tier-1/01-button-goblin-clicker/evidence/h6-3c-embedded-tauri-review/
```

Embedded evidence files:

- `tauri-embedded-00-academy-printwindow.png`
- `tauri-embedded-01-button-goblin-idle.png`
- `tauri-embedded-02-hover.png`
- `tauri-embedded-03-bonk-minus-1.png`
- `tauri-embedded-04-outside-click-check.png`
- `tauri-embedded-05-defeat-transition.png`
- `tauri-embedded-06-next-goblin-reset.png`
- `tauri-embedded-07-upgrade-available-or-earned.png`
- `tauri-embedded-08-upgrade-purchased.png`
- `tauri-embedded-09-bonk-minus-2-after-upgrade.png`
- `tauri-embedded-10-victory.png`
- `tauri-embedded-14-close-game-return-to-academy.png`

Embedded review findings:

- Live full-body GoblinRig renders inside the Tauri Academy cavern stage.
- Feet remain grounded on the cavern floor and above the foreground obstruction band.
- Hover state slightly scales the actor and remains readable.
- Bonk reactions remain visible without colliding with the stable Goblin label.
- Bonk power 2 after upgrade was observed in the embedded runtime.
- Defeat, next-goblin reset, later stronger goblin, and victory state were exercised.
- Full-body clicks register reliably.
- Clicks well outside the actor did not advance the game state during the outside-click check.
- Close Game returned to the Academy and stopped the Button Goblin dev server.
- Post-review cleanup left no TGA-owned listener on ports 5101-5110 or 5173.

Kryssie live-observed animation review:

- idle blink reads cleanly;
- occasional ear twitch reads cleanly;
- body breathing rhythm reads cleanly;
- hover scale reads cleanly;
- click/bonk scene jolt reads cleanly;
- overall actor-rig motion is accepted for H6.3C human visual review.

Overlay note:

Help/Ledger/Dev overlay behavior was already accepted in H6.2. H6.3C does not change the shell overlay implementation. An additional embedded overlay capture attempt during H6.3C produced invalid tiny screenshots during operator cursor contention, so those files were discarded and are not counted as H6.3C evidence.

## Validation Status

Final validation passed before commit:

- `pnpm --filter tga-01-button-goblin-clicker test` — passed.
- `pnpm --filter tga-01-button-goblin-clicker build` — passed, with the existing Vite large-chunk warning.
- `pnpm --filter tiny-goblin-academy-hub exec tsc --noEmit --pretty false` — passed.
- `cargo check` from `hub/src-tauri` — passed.
- `node scripts/asset-pipeline/cli.mjs validate-provenance` — passed with known legacy pre-H5.67 provenance warnings.
- `node scripts/asset-pipeline/smoke-check.mjs` — passed.
- `node scripts/asset-pipeline/cli.mjs validate` — passed.
- `git diff --check` — passed, with the expected Git CRLF working-copy warnings.

## Runtime Approval Status

- H6.3B GoblinRig preview: approved.
- H6.3C live runtime integration: human-review passed and validated for Button Goblin runtime use.
- Vector primitives remain the current skin implementation.
- Future segmented transparent art may inherit the same rig contract.

## Remaining Limitations

- Help/Ledger/Dev overlays were not recaptured as valid H6.3C evidence; H6.2 overlay evidence remains the accepted shell baseline.
- The current GoblinRig is still vector primitive art, not a large generated character sprite sheet.
