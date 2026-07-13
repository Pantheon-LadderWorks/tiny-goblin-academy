# Tiny Goblin Academy — H5.96 Academy UI Grammar and Font Architecture Plan

## Purpose

H5.96 defines an Academy-wide UI grammar and font architecture before Button Goblin Clicker chooses any shared UI/HUD assets.

The goal is to prevent the first runtime-polished game from accidentally becoming the only UI law for the whole Academy. Button Goblin should prove the grammar, not trap every later game inside a clicker-shaped frame.

This pass is planning and inventory only.

## Relationship To H5.94 / H5.95

H5.94 mapped the internal functional slots inside the shared UI/HUD sheet. H5.95 accepted that mapping for draft planning use.

H5.96 uses that accepted shared UI/HUD intelligence as one input, but does not choose specific shared UI regions for Button Goblin or any other game.

Key inherited facts:

* 34 shared UI/HUD outer regions are classified.
* 11 regions are dynamic host surfaces.
* 18 surface-relative internal draft slots are mapped.
* Shared UI/HUD functional slots remain planning-only.
* Runtime eligibility remains `not-runtime-approved`.
* Game selection approval remains `none`.
* Nine-slice approval remains `none`.

## Scope Audited

H5.96 reviewed the current Academy UI and typography shape across:

* Academy Hub / Launcher
* Button Goblin Clicker
* Potion Sorter
* Dice Duel Tavern
* Card Goblin Duel
* Dungeon Key Run
* Tiny Farm Day
* Pet Campfire
* One-Room Platformer
* Top-Down Slime Quest
* Mini Settlement Sim

The audit also reviewed current CSS and Phaser text usage, the shared UI/HUD mapping lineage, Card Goblin Duel functional slot precedent, and the H5.89/H5.90 font pantry planning records.

## UI Ownership Model

H5.96 separates interface responsibilities into three ownership classes.

### Academy-shared

Academy-shared UI belongs to the shell or the Academy identity layer.

Examples:

* Academy top bar and return controls
* Help / Ledger / Dev overlays
* keyboard shortcuts and focus rules
* development-only debug/status inspector
* semantic font role names

These should be code-native first. They are global operating surfaces, not game decoration.

### Shared-skinnable

Shared-skinnable UI has a shared structure, but game-specific values, labels, or flavor.

Examples:

* title / subtitle treatment
* stat and value cards
* action / upgrade cards
* instruction and hint surfaces
* progress, timer, and resource displays
* victory / failure / result notices
* touch or on-screen control surfaces

These may eventually use reviewed shared UI/HUD assets as frames, backplates, icons, or decorative trim. Live text and data should still be rendered by code.

### Game-specific

Game-specific UI is governed by a particular game's mechanics, interaction grammar, or asset lane.

Examples:

* Potion Sorter shelves and sort destinations
* Dice Duel Tavern roll/reveal/status language
* Card Goblin Duel card hand/board slots and card frame internals
* Pet Campfire care meters, state bubbles, and scene-anchor placement logic
* One-Room Platformer movement controls
* Top-Down Slime Quest combat/movement HUD
* Mini Settlement Sim economy/building panels

These surfaces may borrow shared visual ingredients, but their behavior and layout cannot be owned by a generic panel sheet.

## Rendering Mode Policy

H5.96 defines three rendering modes.

### Code-native

Use code-native DOM/CSS/Phaser text for:

* live text
* dynamic counters
* dense data
* responsive layout
* keyboard focus
* accessibility
* Help / Ledger / Dev overlays
* debug truth surfaces

### Asset-backed

Use asset-backed UI for:

* decorative frames
* icons
* badges
* static backplates
* reviewed visual skins

Asset-backed does not mean baked dynamic text.

### Hybrid

Hybrid is the preferred fantasy UI pattern:

```text
 reviewed asset frame / backplate
+ code-rendered text / value / icon content
= readable themed UI
```

Hybrid UI should only use asset host surfaces whose internal slots have been mapped and reviewed.

## Font Inventory Findings

Current runtime typography is mostly system and fallback stacks, not repo-ingested font binaries.

Current references include:

* `Georgia`, `Times New Roman`, and generic `serif`
* `Segoe UI`, `Tahoma`, `Geneva`, `Verdana`, and generic `sans-serif`
* `Inter` in hub CSS, but no repo font binary/import was found in this pass
* `ui-monospace`, `SFMono-Regular`, `Consolas`, and generic `monospace`

Planned but not ingested font directions from H5.89/H5.90 include:

* `Cinzel Decorative` / `Cinzel` for Academy display use
* `Caudex` / `Alegreya` for readable fantasy body/UI use
* `Atkinson Hyperlegible` / `Outfit` for accessible readable UI fallback
* `Fira Code` / `Space Mono` for debug/tooling mono
* optional one-per-game accent candidates such as `Macondo`, `Almendra`, `Merienda`, and `MedievalSharp`

`ROGLyonsTypeRegular3.ttf` remains do-not-ingest without license proof.

No font binaries were copied, generated, licensed, or runtime-approved in H5.96.

Slash-separated font groups are planning comparison sets, not single ingest units. Future visual evaluation, licensing, provenance review, and binary intake must happen per individual font family, style, and weight.

## Font Role Grammar

H5.96 defines semantic font roles:

| Role | Purpose | Boundary |
| --- | --- | --- |
| `academy-display` | Tiny Goblin Academy identity headings and major title moments | Large use only; never dense body text |
| `game-display` | Individual game title styling and splash headers | Shared hierarchy; optional game flavor |
| `ui-body` | Instructions, modal copy, card body text | Readability outranks ornament |
| `ui-label` | Small uppercase labels, stat names, compact HUD labels | Must remain legible at small sizes |
| `ui-data` | Numbers, HP, coins, turns, timers | Stable, readable figures preferred |
| `debug-mono` | Dev overlay, diagnostics, source paths, raw ledger detail | Plain developer truth surface |
| `optional-game-accent` | Small game-specific flavor moments | At most one accent per game |

Font doctrine:

```text
One Academy identity face.
One readable UI body.
One stable data/mono role.
At most one optional accent per game.
No decorative font for dense or tiny text.
No baked dynamic text in asset panels.
Fallbacks must preserve layout.
```

## Future Font Ingestion Requirements

Future font intake should be its own lane.

Recommended shelf:

```text
assets/academy/fonts/
```

Recommended manifest shape should record:

* family
* style
* weight
* source path
* license
* license URL
* provenance
* format
* SHA-256
* runtime eligibility
* CSS variable
* fallback stack
* intended roles
* review status

Runtime font policy:

* Prefer WOFF2 for browser runtime.
* Keep original TTF/OTF as source only when license permits.
* Use `@font-face` only after repo ingest and license review.
* Use CSS variables for semantic roles.
* Preload only the minimum approved Academy identity/body/mono faces after performance review.
* Phaser `Text` can use loaded web fonts only after a font-loading gate exists.
* Phaser `BitmapText` requires a separate bitmap font generation lane and is not assumed.

## Cross-Game Findings

The recurring UI pattern is real, but not uniform enough to justify one universal visual frame.

Strong shared candidates:

* stat/value cards
* action cards
* result notices
* Help / Ledger / Dev modal structure
* compact title/subtitle hierarchy
* semantic font roles
* narrow-mode HUD rules

Strong game-specific candidates:

* Card Goblin Duel card frame and token grammar
* Pet Campfire scene-anchor and care-state grammar
* Potion Sorter sort destinations
* One-Room Platformer and Top-Down Slime Quest input/control surfaces
* Mini Settlement Sim dense economy panels

Main conflict:

```text
Shared fantasy UI assets are useful ingredients.
They are not a complete UI system.
```

## Evidence Created

Evidence folder:

```text
assets/academy/evidence/h5-96-academy-ui-grammar-font-architecture/
```

Created evidence:

* `academy-ui-ownership-matrix-preview.png`
* `academy-font-inventory-preview.png`
* `academy-font-role-grammar-preview.png`
* `tier-1-ui-responsibility-cross-game-preview.png`

These are planning tables, not visual mockups.

## Non-Goals

H5.96 does not:

* select Button Goblin UI assets
* create H5.97 visual mockups
* ingest fonts
* generate fonts
* edit Hub/game CSS
* edit Phaser scenes
* change gameplay
* create shared runtime components
* approve nine-slice behavior
* modify package or lock files
* modify source images
* approve runtime UI

## Recommended Next Step

Recommended next lane:

```text
H5.97 — Button Goblin Clicker UI Asset Selection Comparison
```

H5.97 should compare:

* code-native only
* hybrid shared stat/value cards
* hybrid shared action card
* limited decorative frame accents only

It should still avoid runtime wiring until Kryssie accepts the visual direction.

## Tiny Doctrine

```text
The Academy owns the grammar.
The game owns the meaning.
The asset may decorate the frame.
The code must carry the truth.
```
