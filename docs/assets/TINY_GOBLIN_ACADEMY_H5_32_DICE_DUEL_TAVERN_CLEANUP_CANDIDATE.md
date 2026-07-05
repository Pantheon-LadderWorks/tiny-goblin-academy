# Tiny Goblin Academy — H5.32 Dice Duel Tavern Cleanup Candidate

## Purpose

H5.32 creates a derived transparent cleanup candidate for the reviewed Dice Duel Tavern regions. The cleaned candidate remains draft-review only and is not runtime-approved. The future dice roll illusion note is preserved as planning context only; H5.32 does not implement dice rolling, approve animation timing, approve probability logic, or wire Dice Duel Tavern gameplay.

## Source Inputs

Source region manifest:

`manifests/academy.dice-duel-tavern.regions.json`

Source sheet:

`assets/academy/games/dice-duel-tavern/tga-dice-duel-tavern-sheet-concept-v0.1.png`

Source facts:

- Dimensions: `1024x1024`
- Mode: `RGB`
- Alpha: none
- Transparency: baked checkerboard / fake transparency
- Layout: clean 8x8 concept grid with irregular visible bounds

## Relationship To H5.30-H5.31

H5.30 mapped 64 Dice Duel Tavern regions for draft review.

H5.31 accepted those regions for draft cleanup/planning use and preserved the future code-driven roll illusion note:

- flat die faces 1-6 as possible final reveal/result faces;
- tumbling/rolling dice as possible throw/tumble illusion candidates;
- sparkle/dust/spiral/burst/smoke FX as possible feedback candidates.

H5.32 uses that reviewed mapping to create a derived cleanup candidate. It does not approve runtime use or roll implementation.

## Cleanup Method

Cleanup method:

`per-region-edge-connected-neutral-checkerboard-removal`

Method summary:

- created a transparent `1024x1024` derived sheet;
- processed each reviewed sourceRect as an isolated crop;
- removed neutral gray checkerboard pixels only when connected to crop edges;
- pasted each cleaned crop back at its original sheet position;
- preserved the original 8x8 layout and sourceRect/derivedRect relationship.

This intentionally avoids global gray removal so dice pips, outlines, shadows, smoke, and low-contrast FX are not blindly erased.

## Derived Outputs

Derived cleaned candidate:

`assets/academy/games/dice-duel-tavern/derived/tga-dice-duel-tavern-cleaned-v0.1.png`

Cleanup candidate manifest:

`manifests/academy.dice-duel-tavern.cleanup-candidate.json`

The derived sheet preserves:

- original `1024x1024` dimensions;
- original 8x8 layout;
- original sourceRect positions as matching derivedRects;
- transparent background outside cleaned region content.

## Cleanup Results

Regions processed: 64

Risk breakdown:

- low risk: 43
- medium-high risk: 2
- high risk: 19

Low-risk regions are mostly solid outlined dice faces, duel tokens, tavern props, reward tokens, UI markers, and background props.

High-risk or medium-high-risk regions include roll effects, feedback icons, glowing dice, dust/smoke/sparkle/burst/spiral effects, and rolling/tumbling dice with motion lines or shadows.

## Edge Risk Findings

The cleanup candidate is strong enough for draft review, but several categories require human attention before promotion:

- glowing die: glow was preserved, but edge halo should be reviewed against intended style;
- smoke wisps: very low-contrast gray material is fragile and may read faintly on dark backgrounds;
- dust puffs: main silhouettes survive, but subtle edge softness may change;
- sparkle/burst/spiral FX: most shape survives, but tiny particles and anti-aliased edges need review;
- rolling/tumbling dice: motion lines and soft shadows are the most likely cleanup-risk features;
- tilted die glow: the glow/motion smear is intentionally marked high risk.

These are review flags, not automatic failures.

## Roll Illusion Candidate Preservation

The roll illusion candidate remains planning-only.

H5.32 preserves candidate groupings from H5.31:

- flat faces 1-6 may later support final reveal/result faces;
- tumbling dice may later support throw/tumble illusion;
- FX may later support roll feedback.

No runtime roll code, animation timing, frame sequence, probability logic, or gameplay wiring is approved.

## Evidence Created

Created evidence folder:

`assets/academy/evidence/h5-32-dice-duel-tavern-cleanup/`

Evidence files:

- `dice-duel-tavern-cleanup-before-after-contact-sheet.png`
- `dice-duel-tavern-cleaned-derived-sheet-preview.png`
- `dice-duel-tavern-cleanup-edge-risk-preview.png`
- `dice-duel-tavern-cleanup-table-preview.png`
- `dice-duel-tavern-roll-illusion-candidate-preview.png`

All evidence is labeled as draft cleanup candidate work. The source PNG remains untouched, and no runtime wiring, roll implementation, animation approval, or probability/gameplay approval occurred.

## Non-Goals

H5.32 does not:

- modify the source PNG;
- runtime-approve the derived output;
- implement dice rolling;
- create runtime roll code;
- create an animation manifest;
- approve animation timing or frame sequences;
- approve probability or gameplay logic;
- change Dice Duel Tavern game code;
- process Card Goblin Duel;
- process Potion Sorter;
- process Farm/Settlement;
- process Dungeon Platformer;
- process Top-Down Slime Quest;
- touch Shared FX;
- run Tauri, Rust, or Cargo.

## Human/Product Review Notes

Human review should focus on:

- whether the cleaned sheet looks acceptable on checker and dark backgrounds;
- whether dice faces 1-6 remain readable and grid-stable;
- whether dice pips and dark outlines survived cleanup;
- whether glow, smoke, dust, sparkle, burst, spiral, motion lines, and shadows are acceptable;
- whether high-risk regions need correction before promotion;
- whether preserving original 8x8 layout remains desirable for future roll-face cycling.

## Recommended Next Step

Recommended next lane:

H5.33 — Dice Duel Tavern Cleanup Human Review + Promotion

Alternatives:

- H5.33 — Dice Duel Tavern Cleanup Corrections
- H5.33 — Continue Remaining Standard Game Asset Sheets

Tiny law:

```text
The dice may sparkle later.
Today they merely become transparent responsibly.
```
