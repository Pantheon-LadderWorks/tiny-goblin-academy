# Tiny Goblin Academy — H6.2 Button Goblin Clicker Shell Migration

## Purpose

H6.2 migrates Button Goblin Clicker out of its permanent side-panel dashboard layout and into the first stage-first game composition.

This pass proves the H6.0/H6.1 shell doctrine on the easiest Tier 1 game:

```text
Academy top bar stays.
The game gets the stage.
Player-facing UI becomes in-stage HUD/action layers.
Ledger, Help, and Dev remain shared shell overlays.
```

H6.2 is not a visual asset integration pass. The cavern background and asset-backed UI polish remain H6.3+.

## Relationship To H6.0-H6.1

H6.0 planned the Academy shell refactor:

- permanent side rails should leave;
- player-facing data should move into the game stage;
- Ledger should live behind a button plus `L`;
- Help should live in a modal/overlay;
- Dev diagnostics should live in Dev overlay;
- UI may be asset-backed, code-native, or hybrid.

H6.1 implemented the shared shell contract in the hub top bar.

H6.2 applies the per-game side-panel migration pattern to Button Goblin Clicker only.

## Composition Method

H6.2 uses layered DOM/game composition instead of putting every UI element inside the Phaser canvas.

```text
game-stage
├── play-surface
│   └── Phaser canvas / goblin click target
├── hud-layer
│   └── goblin progress, HP, coins, bonk power
├── feedback-layer
│   └── short prompt / future temporary feedback space
└── action-layer
    └── Bonk Stick upgrade card
```

The key doctrine:

```text
The side panels do not move into the stage.
Their jobs move into the stage.
```

## Old Surface Classification

| Old surface | New surface | H6.2 status | Notes |
| --- | --- | --- | --- |
| Left statistics panel | In-stage HUD layer | Migrated | Goblin progress, HP, coins, and bonk power are compact stage cards. |
| Center gameplay panel | Full play surface | Migrated | Phaser still owns the goblin click target and bonk feedback. |
| Right upgrade panel | In-stage action layer | Migrated | Bonk Stick remains player-facing and interactive. |
| Instructions / hint text | Feedback layer + future Help overlay | Partially migrated | The short “Bonk the goblin!” prompt remains; fuller rules belong in Help later. |
| Action/event ledger | Shared Ledger overlay | Future bridge | H6.2 does not implement game-to-shell ledger hydration. |
| Debug/diagnostic values | Shared Dev overlay | Future bridge | No new per-game Dev data bridge is added in H6.2. |

## Runtime Files Changed

Changed Button Goblin files:

- `games/tier-1/01-button-goblin-clicker/src/main.ts`
- `games/tier-1/01-button-goblin-clicker/src/style.css`
- `games/tier-1/01-button-goblin-clicker/src/scenes/GameScene.ts`

No hub shell files were changed in H6.2.

## H6.2A Visual Correction

Human/product review accepted the stage-first layout direction but found one visible correction:

```text
-1 BONK!
```

was colliding with:

```text
Goblin #1
```

Those are separate information layers:

- `Goblin #1` is stable encounter identity.
- `-1 BONK!` is temporary action feedback.

H6.2A moves the damage popup into a separate upper-right feedback lane near the goblin target. It no longer spawns over the stable encounter label and it tweens upward less aggressively.

No simulation values, damage timing, controller behavior, or gameplay rules were changed.

## Gameplay Invariants Preserved

H6.2 does not change the simulation or controller.

Preserved:

- 10 goblins;
- first goblin starts at 5 HP;
- each new goblin gains 2 max HP;
- bonk damage starts at 1;
- Bonk Stick costs 3 coins;
- Bonk Stick increases damage to 2;
- victory occurs after the tenth goblin is defeated;
- existing SVG/Phaser placeholder goblin behavior remains.

The authoritative gameplay files were not changed:

- `games/tier-1/01-button-goblin-clicker/src/simulation.ts`
- `games/tier-1/01-button-goblin-clicker/src/controller.ts`

## Responsive Layout Notes

Desktop layout:

- HUD spans the top of the stage as compact cards.
- Goblin click target remains visually centered.
- Bonk Stick card docks bottom-right inside the stage.
- Short prompt docks bottom-left.

Narrow layout:

- HUD collapses to a 2-column grid.
- Bonk Stick card becomes a bottom dock.
- Prompt moves above the bottom action card.

## Ledger / Help / Dev Boundary

H6.2 does not hydrate the shared Ledger yet.

The future event bridge remains:

```text
game runtime emits current-session events
→ Academy shell receives active-game events
→ Ledger modal renders the current active game session log
```

Button Goblin candidate events for a later lane:

- `Bonked goblin`
- `Defeated goblin`
- `Earned coin`
- `Bought Bonk Stick`
- `Graduated level`

H6.2 also does not add structured Help or Dev payloads. Those should be bridged after the first migrated game is visually reviewed.

## Non-Goals

H6.2 does not:

- wire the Button Goblin background asset;
- add asset-backed HUD frames;
- integrate shared UI sprite regions;
- create a shared HUD abstraction;
- implement Ledger hydration;
- implement Help data hydration;
- implement Dev data hydration;
- add Academy generator/sink progression;
- alter package or lock files;
- alter Tauri/Rust/dev-server lifecycle behavior;
- migrate any other game.

## Validation Notes

Completed during H6.2 preparation:

```text
pnpm --filter tga-01-button-goblin-clicker test
→ passed, 7 tests

pnpm --filter tga-01-button-goblin-clicker build
→ passed
→ Vite reported the existing large Phaser chunk warning
```

H6.2 visual review evidence created:

- `games/tier-1/01-button-goblin-clicker/evidence/h6-2-shell-migration/button-goblin-h6-2-desktop-stage.png`
- `games/tier-1/01-button-goblin-clicker/evidence/h6-2-shell-migration/button-goblin-h6-2-hit-feedback.png`
- `games/tier-1/01-button-goblin-clicker/evidence/h6-2-shell-migration/button-goblin-h6-2-narrow-stage.png`

H6.2A final review evidence created:

- `games/tier-1/01-button-goblin-clicker/evidence/h6-2a-final-review/01-desktop-initial-stage.png`
- `games/tier-1/01-button-goblin-clicker/evidence/h6-2a-final-review/02-desktop-hit-feedback-separated.png`
- `games/tier-1/01-button-goblin-clicker/evidence/h6-2a-final-review/03-narrow-initial-stage.png`
- `games/tier-1/01-button-goblin-clicker/evidence/h6-2a-final-review/04-narrow-hit-feedback-separated.png`
- `games/tier-1/01-button-goblin-clicker/evidence/h6-2a-final-review/05-defeat-coin-reward.png`
- `games/tier-1/01-button-goblin-clicker/evidence/h6-2a-final-review/06-upgrade-available.png`
- `games/tier-1/01-button-goblin-clicker/evidence/h6-2a-final-review/07-upgrade-purchased.png`
- `games/tier-1/01-button-goblin-clicker/evidence/h6-2a-final-review/08-later-goblin-increased-hp.png`
- `games/tier-1/01-button-goblin-clicker/evidence/h6-2a-final-review/09-victory-state.png`

Evidence confirms:

- old permanent side panels are gone;
- HUD appears inside the stage;
- Bonk Stick remains clickable;
- goblin click behavior still works;
- narrow layout keeps controls accessible;
- hit feedback no longer collides with the stable goblin label;
- defeat awards coins;
- the upgrade becomes purchasable;
- purchasing the upgrade increases Bonk Power;
- later goblins retain increased HP;
- victory state still appears;
- the Academy top bar remains the outer shell owner.

## Human/Product Review Notes

Human/product review passed.

Accepted:

- stage-first composition;
- desktop layout;
- narrow layout;
- corrected upper-right BONK feedback lane;
- preserved Button Goblin gameplay loop;
- victory, upgrade purchase, and later goblin HP evidence;
- embedded Tauri review;
- Help, Ledger, and Dev shell overlay behavior.

Scope boundaries retained:

- game-specific Ledger hydration remains deferred;
- asset integration remains H6.3;
- shared HUD extraction remains H6.4;
- generator/sink Academy progression remains future-only;
- runtime asset approval remains `none`.

The Help and Ledger content remains intentionally generic H6.1 placeholder material. H6.2 only verifies that the shared shell overlay surfaces continue to work around the migrated game stage.

## Recommended Next Step

**H6.3 — Button Goblin Clicker Background Integration**

Tiny shell law:

```text
The Academy keeps the doorframe.
The game gets the room.
The HUD stops pretending it is a spreadsheet.
```
