# Tiny Goblin Academy — H6.0 Academy Shell Refactor and In-Game HUD Plan

## Purpose

H6.0 starts the Tier 1.5 runtime visual integration planning layer without changing runtime code yet.

The main finding is that Tiny Goblin Academy currently has two visible shells:

1. The outer academy runtime wrapper in the hub iframe view.
2. Per-game lesson/debug harnesses inside each Tier 1 game.

That was useful while each game was a tiny laboratory specimen. It is now too heavy for visual asset integration. The next runtime stage should keep the Academy identity while freeing the game stage for in-game HUD, visuals, backgrounds, and player-facing UI.

## Current Layout Problem

Current games often display:

- a large title/masthead;
- a left status/debug panel;
- a right action ledger, upgrade card, or help panel;
- controls below the game viewport;
- instructions that remain visible even when the player already knows the loop.

This makes the playable stage feel smaller than it needs to be. It also makes each game solve UI in its own shape instead of sharing an Academy shell contract.

The H6 direction is:

```text
academy top bar
+ full game stage
+ in-stage HUD
+ modal/drawer overlays for secondary information
+ dev overlay for debug state
```

## Inspected Current Surfaces

H6.0 inspected the current shell and representative game harnesses:

- `hub/src/components/DevGameRuntimeView.tsx`
- `hub/src/data/tier1Roster.ts`
- `games/tier-1/01-button-goblin-clicker/src/main.ts`
- `games/tier-1/01-button-goblin-clicker/src/style.css`
- `games/tier-1/02-potion-sorter/src/main.ts`
- `games/tier-1/02-potion-sorter/src/styles.css`
- `games/tier-1/08-one-room-platformer/src/main.ts`
- `games/tier-1/08-one-room-platformer/src/style.css`

No runtime code was modified in this planning pass.

## Academy Shell Preservation

The Academy shell should remain, but it should become much lighter.

Keep:

- Tiny Goblin Academy identity;
- game / lesson title;
- dev-mode indicator when relevant;
- close / return-to-academy action;
- optional modal buttons such as Ledger, Help, and Dev.

Remove from default persistent layout:

- always-visible action ledger;
- always-visible debug inspector panels;
- large side rails that are not part of the game world;
- controls dangling below the game viewport without an explicit placement rule.

## Proposed Minimal Top Bar

The shared shell should become a compact top bar:

```text
Tiny Goblin Academy / Current Game          [Ledger] [Help] [Dev] [Close]
```

Notes:

- `Dev` can be hidden or disabled outside dev mode.
- `Ledger` should open the action ledger modal.
- `Help` should open controls/objective/rules.
- `Close` returns to the Academy launcher.
- The game iframe/stage below the top bar should get the available space.

## Side Panel Migration

The old side panels should be split by purpose:

| Old surface | New home |
| --- | --- |
| Player-facing counters | In-stage HUD widgets |
| Objective / rules | Help modal |
| Action ledger / run log | Ledger modal |
| Debug fields | Dev overlay |
| Shop / upgrade state | In-stage HUD or in-game panel |
| Touch controls | In-stage control overlay or compact in-stage control strip |

This preserves the useful information while stopping the classroom microscope from consuming the stage.

## Action Ledger Modal

The action ledger remains valuable, but it should not be a permanent right rail.

Decision:

- The ledger becomes a modal or drawer.
- It opens from a visible top-bar button.
- It also opens with the `L` key.
- The implementation should avoid using `Tab` as a toggle because it conflicts with browser focus and accessibility expectations.

Implementation note:

The current games run inside the hub iframe. The `L` shortcut may need to be captured inside the game iframe first, then coordinated with the shell later if cross-frame control becomes necessary.

## Help Modal

The Help modal should contain:

- objective;
- keyboard controls;
- mouse/touch controls;
- rule summary;
- game-specific notes;
- optional accessibility hints.

This replaces persistent instruction blocks for games where the player does not need permanent help text.

## Dev Overlay

Debug and teaching instrumentation should remain available, but hidden by default.

Examples:

- position;
- velocity;
- grounded flag;
- run status;
- collision/contact debug;
- asset/manifest IDs;
- live scene state.

For One-Room Platformer, `pos`, `vel`, and `grounded` are dev overlay data, not default player HUD data.

## In-Game HUD Surfaces

Each game should own a compact in-stage HUD. The shared shell should provide conventions, not hardcode every game HUD.

Examples:

- Button Goblin Clicker: Goblin count, HP, coins, upgrade/shop state.
- Potion Sorter: timer, score, combo, current instruction/result feedback.
- One-Room Platformer: run status, goal/defeat state, optional compact hint/control overlay.

HUD widgets should be treated as game UI surfaces, not as permanent external sidebars.

## Shared HUD Data Concept

Future implementation should define a lightweight shared HUD contract. It does not need to be a giant framework.

Suggested concept:

```ts
type AcademyHudItem = {
  id: string;
  label: string;
  value: string | number | boolean;
  tone?: "neutral" | "good" | "warning" | "danger" | "debug";
  visibility?: "player" | "help" | "ledger" | "dev";
};
```

Games can provide HUD state to their own in-stage UI first. A later shared shell bridge can standardize this only after the first migration proves the shape.

## UI Sourcing Policy

Tiny Goblin Academy now has many mapped UI assets, card frames, icons, badges, buttons, and panels. That does not mean every UI element must come from an asset sheet.

Use this policy:

### Asset-backed UI

Use asset-backed UI when the asset provides visual identity or a themed surface:

- card frames;
- ornate HUD panels;
- icons and badges;
- decorative backplates;
- game-specific buttons or tokens;
- status symbols;
- fixed visual frames with mapped regions.

Asset-backed UI should come from reviewed manifests and should remain discoverable through the visual pantry.

### Code-native UI

Use code-native DOM/CSS UI when the UI is dynamic, text-heavy, responsive, or accessibility-sensitive:

- action ledger modal;
- help modal;
- dev overlay;
- long text;
- live numeric counters;
- keyboard focus;
- responsive layout;
- scrollable panels;
- forms and regular buttons;
- modal dismissal and accessibility behavior.

These surfaces should not be forced through sprite sheets.

### Hybrid UI

Hybrid UI is expected:

```text
asset frame / backplate / icon
+ DOM/CSS text and live data
```

This is likely the best pattern for card faces, HUD panels, shop cards, and themed status boxes.

### Particle / code-generated FX

Fire, glow, smoke, dust, sparkle, soft light, and similar FX should usually be particles or code-generated effects rather than scraped from fake-transparent sprite sheets.

The asset pipeline already proved that glow/soft-edge cleanup is the trap door.

### Doctrine

Shared UI pieces are optional ingredients, not a complete UI system.

A frame is a surface with rules. A UI asset is not automatically the UI.

## Relationship To Shared UI And Card Token Assets

The Card Goblin Duel slot-mapping realization applies across the Academy:

- scene anchors define where things belong in a world;
- UI anchors define where data belongs in a frame;
- HUD surfaces define where live game state belongs in the stage.

The H6 shell refactor should make room for that pattern before wiring assets.

## Input / On-Screen Control Plan

Existing on-screen buttons are not junk. They are input surfaces.

Classify controls per game:

1. Primary game input
   - keyboard, mouse, tap, click, drag, or stage interaction.
2. Touch/accessibility controls
   - buttons that need to exist for mouse/touch users.
3. Dev/test controls
   - reset, debug, skip, spawn, inspect, or testing actions.

Default placement rules:

- Player-facing controls should become in-stage controls.
- Touch controls should be overlays or compact in-stage control strips.
- Dev/test controls should move to the Dev overlay.
- Keyboard instructions should live in Help.
- Reset must remain available somewhere explicit.

For One-Room Platformer:

- Left / Right / Jump are player-facing controls and should not be lost.
- On desktop they can be keyboard-first.
- On touch/mobile they should become in-stage translucent controls or a themed control strip.
- Reset can live in-stage, Help/Pause, or Dev depending on future product choice, but it must not disappear accidentally.

## Button Goblin Clicker First

Button Goblin Clicker should be the first runtime visual integration candidate because it is the simplest:

- it already has a working click loop;
- it does not require tilemaps;
- it does not need collision/pathfinding;
- it does not need deferred slime/soldier animation;
- it has a newly ingested background asset ready for future draft planning.

H6 should not start with Top-Down Slime Quest runtime just because the topdown pantry is rich.

## Button Goblin Clicker Migration Notes

Current Button Goblin Clicker has:

- left stat cards for Goblin, HP, Coins;
- a central Phaser playfield and SVG goblin click target;
- right upgrade card for Bonk Stick;
- instruction/victory overlays inside the playfield.

Future migration should:

- preserve the current click target, crossed-eyes behavior, damage numbers, and bonk feedback;
- move Goblin / HP / Coins into compact in-stage HUD widgets;
- move upgrade/shop state into an in-stage panel or HUD card;
- place the cavern background behind the play layer;
- keep the goblin centered in the large negative space;
- keep the ledger hidden behind Ledger button + `L`.

## Potion Sorter Notes

Potion Sorter currently uses left stat cards and a right how-to panel.

Future migration should:

- move Time / Score / Combo into in-stage HUD;
- move How To into Help;
- keep transient instruction/result feedback in-stage;
- use potion-specific visual assets only after the shell pattern is stable.

## One-Room Platformer Notes

One-Room Platformer currently exposes the classroom microscope most clearly:

- left player status;
- right action ledger;
- lower on-screen controls;
- position/velocity/grounded debug data.

Future migration should:

- move debug data to Dev overlay;
- move action ledger to Ledger modal with `L`;
- keep run status as compact player-facing HUD;
- convert Left / Right / Jump into in-stage controls or touch overlay;
- keep Reset available;
- fix stale manifest import paths before any new asset wiring.

Known stale import risks:

- `hub/src/data/tier1Roster.ts` still imports `../../../manifests/academy.games.json`.
- `games/tier-1/08-one-room-platformer/src/main.ts` still imports old flat construction/goblin animation manifest paths.

These should be fixed in the first implementation slice, not during H6.0 planning.

## Why Asset Integration Waits

If assets are wired before the shell is simplified, every game will need asset placement twice:

1. once inside the old side-panel layout;
2. again after the shell refactor.

The safer sequence is:

```text
shell/hud contract
→ first game shell migration
→ first visual asset integration
→ repeat per game
```

## Proposed H6 Lane Sequence

Recommended next lanes:

1. **H6.1 — Minimal Academy Runtime Shell Contract + Stale Manifest Path Cleanup**
   - define shell buttons, modal contracts, dev overlay contract, and fix active stale manifest imports.
2. **H6.2 — Button Goblin Clicker Shell Migration**
   - remove permanent side panels, move HUD data in-stage, preserve click loop.
3. **H6.3 — Button Goblin Clicker Background + First Visual Asset Integration**
   - wire the cavern background after the shell is ready.
4. **H6.4 — Shared HUD Surface Pattern**
   - extract the small reusable HUD/modal/control conventions after one game proves them.

## Non-Goals

H6.0 does not:

- change runtime code;
- change game code;
- wire assets;
- create the full GlyphForge tool suite;
- do audio pipeline work;
- start Top-Down Slime Quest runtime;
- approve runtime use for visual assets;
- move manifests or docs folders;
- edit package or lock files;
- change PNGs/images.

## Human/Product Review Notes

Needs review:

- whether the top bar should show Ledger / Help / Dev as text buttons, icons, or both;
- whether Ledger modal should pause gameplay by default or be game-specific;
- whether Help and Pause are separate surfaces or one shared modal;
- whether touch controls are always visible on touch devices or opt-in;
- whether Button Goblin Clicker shop state should be a permanent in-stage panel or a contextual panel.

## Recommended Next Step

**H6.1 — Minimal Academy Runtime Shell Contract + Stale Manifest Path Cleanup**

Tiny shell law:

```text
The Academy stays.
The side rails leave.
The stage becomes the game.
The microscope becomes a modal.
```
