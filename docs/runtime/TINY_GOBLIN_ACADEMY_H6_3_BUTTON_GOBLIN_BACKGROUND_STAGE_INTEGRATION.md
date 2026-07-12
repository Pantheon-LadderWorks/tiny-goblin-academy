# Tiny Goblin Academy — H6.3 Button Goblin Clicker Background Stage Integration

## Purpose

H6.3 integrates the approved Button Goblin Clicker cavern background into the live Button Goblin runtime as the first narrow visual asset wiring pass of Tier 1.5.

This pass proves that an H5 asset can graduate into runtime use without turning the whole pantry into runtime-approved material.

## Relationship To H5.85-H6.2

H5.85 ingested the Button Goblin Clicker cavern background as a scene-anchor background.

H5.86 accepted the background and its 9 scene anchors for planning use only.

H6.0 planned the Academy shell refactor and runtime visual integration order.

H6.1 hardened the Academy runtime shell, overlays, manifest paths, and dev-server lifecycle.

H6.2 migrated Button Goblin Clicker into a stage-first layout with DOM HUD/action layers around the Phaser play surface.

H6.3 wires the cavern background into that Phaser play surface while preserving the H6.2 stage-first composition.

## Runtime Approval Decision

H6.3 grants narrow runtime approval to:

```text
assets/academy/games/button-goblin-clicker/backgrounds/tga-button-goblin-clicker-cavern-stage-background-v0.1.png
```

Approved role:

```text
Button Goblin Clicker decorative Phaser background stage
```

This approval does not approve:

- all visual pantry assets;
- exact coordinate placement;
- replacement goblin sprites;
- UI sprite-sheet integration;
- gameplay behavior;
- other games;
- background abstraction for all games.

## Implementation Summary

Changed runtime file:

- `games/tier-1/01-button-goblin-clicker/src/scenes/GameScene.ts`

The Phaser scene now:

- loads the cavern background through Vite using `new URL(..., import.meta.url).href`;
- renders a fallback Academy slate background first;
- renders the cavern background as a cover-scaled image inside the Phaser play surface;
- applies a conservative contrast scrim for text/goblin readability;
- keeps the existing SVG/Phaser goblin head, click target, hit face, HP label, and BONK feedback;
- logs a runtime error/warning and keeps gameplay active if the background texture is unavailable.

## Scaling / Anchor Policy

The background uses a cover-style scale inside the Phaser play surface:

```text
scale = max(playSurfaceWidth / backgroundWidth, playSurfaceHeight / backgroundHeight)
```

The background is centered so the large H5.85 central click-stage anchor remains the focal area.

This pass does not approve exact spawn coordinates. It only approves the background as the decorative stage behind the current goblin target.

## Layering / Readability

Composition remains:

```text
game-stage
├── play-surface
│   └── Phaser canvas
│       ├── cavern background
│       ├── conservative readability scrim
│       └── existing goblin target / labels / feedback
├── hud-layer
├── feedback-layer
└── action-layer
```

DOM HUD cards and the Bonk Stick action card remain above the Phaser play surface.

The goblin remains readable in the central negative space. The HUD/action layers remain readable over the stage.

## Gameplay Invariants Preserved

H6.3 does not change:

- simulation rules;
- controller rules;
- goblin count;
- HP scaling;
- Bonk Stick cost;
- Bonk Stick damage;
- victory condition;
- current goblin SVG/Phaser head design;
- Ledger, Help, or Dev shell behavior.

## Evidence Created

Evidence folder:

```text
games/tier-1/01-button-goblin-clicker/evidence/h6-3-background-stage-integration/
```

Evidence files:

- `button-goblin-background-desktop-initial.png`
- `button-goblin-background-desktop-hit.png`
- `button-goblin-background-desktop-upgrade-available.png`
- `button-goblin-background-desktop-upgrade-purchased.png`
- `button-goblin-background-desktop-victory.png`
- `button-goblin-background-narrow-initial.png`
- `button-goblin-background-narrow-hit.png`
- `browser-evidence-capture-log.json`

## Review Notes

Direct browser evidence shows:

- background renders inside the Phaser play surface;
- current goblin head remains the click target;
- hit feedback remains separated from the stable goblin label;
- HUD and action card remain DOM layers;
- narrow layout remains readable;
- victory state remains readable over the cavern background.

Human/product review accepted the background composition evidence for H6.3:

- the cavern background gives Button Goblin Clicker a readable place;
- the current goblin remains usable as the click target;
- the HUD and Bonk Stick action card remain readable;
- the mapped background anchors are accepted as the design contract for this stage.

Anchor review result:

```text
Region 1: central click-stage safe zone accepted.
Region 2: lower floor grounding zone accepted.
Regions 6/7: torch/readability risk zones accepted.
Region 8: bottom foreground obstruction warning accepted.
Region 9: top HUD caution band accepted.
```

The anchor map is approved as a placement-region/design contract, not exact final pixel-coordinate approval.

Embedded Tauri review was not re-run in this pass. H6.2 already proved embedded Tauri shell behavior for Button Goblin; H6.3 browser evidence proves the new runtime asset renders correctly in the game surface. If a later Tauri-specific visual issue appears, it should be handled as a focused correction.

## Future Code-Authored Goblin Actor Note

H6.3 intentionally does not replace the goblin target.

The current goblin is not a raster sprite sheet or SVG asset. It is a Phaser vector drawing in `GameScene.ts`. Human/product review identified the next visual opportunity: formalize this into a code-authored vector actor rig instead of forcing a large animated sprite-sheet lane before the project is ready.

Recommended next character lane:

```text
H6.3B — Button Goblin Code-Authored Vector Actor Rig Preview
```

The future actor should separate:

```text
GoblinActor
├── gameplay-facing state
├── GoblinRig
└── GoblinSkin
```

The rig defines how a goblin moves. The skin defines which goblin is wearing it.

That means future custom-designed goblin parts can slot into the rig later without rewriting the Button Goblin controller, simulation, or clicker loop.

## Non-Goals

H6.3 does not:

- replace the goblin with sprites;
- add a goblin body;
- integrate UI sprite sheets;
- integrate FX, particles, or audio;
- hydrate the Ledger from Button Goblin events;
- add Academy generator/sink progression;
- extract a shared background loader;
- migrate another game;
- change Rust/Tauri lifecycle code;
- modify package or lock files.

## Recommended Next Step

**H6.3B — Button Goblin Code-Authored Vector Actor Rig Preview**

After this background pass is accepted:

**H6.4 — Button Goblin HUD / Help / Ledger Data Bridge Planning**

Tiny runtime law:

```text
One asset may enter the stage.
The pantry does not stampede behind it.
```
