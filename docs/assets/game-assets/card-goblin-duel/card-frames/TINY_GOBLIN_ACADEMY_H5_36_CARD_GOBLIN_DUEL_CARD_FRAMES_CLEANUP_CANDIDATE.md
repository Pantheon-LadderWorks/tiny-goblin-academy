# Tiny Goblin Academy — H5.36 Card Goblin Duel Card Frames Cleanup Candidate

## Purpose

H5.36 creates a derived transparent cleanup candidate for the 32 H5.35-reviewed Card Goblin Duel card-frame regions.

This pass follows the generalized asset processing workflow:

`docs/assets/TINY_GOBLIN_ACADEMY_ASSET_PROCESSING_WORKFLOW.md`

H5.36 does not approve runtime card assets, card gameplay behavior, visual integration, or Card Goblin Duel wiring.

## Source Inputs

Source region manifest:

`manifests/academy.card-goblin-duel.card-frames.regions.json`

Source sheet:

`assets/academy/games/card-goblin-duel/tga-card-goblin-duel-card-frames-concept-v0.1.png`

Source facts:

- Dimensions: `1024x1024`
- Mode: `RGB`
- Alpha: none
- Transparency: baked checkerboard / fake transparency
- Source PNG: untouched

## Relationship To H5.34-H5.35

H5.34 mapped 32 Card Goblin Duel card-frame regions.

H5.35 accepted the region mapping for draft cleanup/planning use:

- blank/overlay-ready card surfaces are important and should remain preserved;
- card fronts, card backs, board slots, card slots, highlighted states, and disabled states are separated;
- open frames and slot interiors require careful fake-checkerboard cleanup;
- the Card Goblin Duel UI/tokens sheet remains a separate future lane.

H5.36 uses the reviewed mapping to create a derived cleanup candidate only.

## Cleanup Method

Cleanup method:

`per-region-neutral-checkerboard-removal-with-open-slot-aperture-pass`

Method summary:

- created a transparent `1024x1024` derived sheet;
- processed each reviewed sourceRect as an isolated crop;
- removed neutral gray checkerboard pixels connected to crop edges for standard regions;
- applied a conservative interior aperture pass for open frames, board slots, card slots, and highlighted empty slots;
- pasted each cleaned crop back at its original sourceRect position;
- preserved the original sheet layout and sourceRect/derivedRect relationship.

This method protects blank parchment/card interiors while allowing transparent holes for frame/slot assets that were visibly filled with baked checkerboard.

## Derived Outputs

Derived cleanup candidate:

`assets/academy/games/card-goblin-duel/derived/tga-card-goblin-duel-card-frames-cleaned-v0.1.png`

Cleanup candidate manifest:

`manifests/academy.card-goblin-duel.card-frames.cleanup-candidate.json`

The derived sheet preserves:

- original `1024x1024` dimensions;
- original card-frame layout;
- original sourceRect positions as matching derivedRects;
- transparent background outside cleaned region content.

## Cleanup Results

Regions processed: 32

Risk breakdown:

- low risk: 18
- medium risk: 1
- medium-high risk: 6
- high risk: 7

Risk flags are review prompts, not automatic failures.

## Edge Risk Findings

The cleanup candidate is strong enough for draft review, but several categories require human attention before promotion:

- gray disabled card state: gray card artwork is visually close to fake-checkerboard colors;
- highlighted/glowing card states: glow edges must be checked for damage or over-cleaning;
- board slots and card slots: aperture cleanup intentionally cleared interiors and should be visually reviewed;
- open frames: transparent interiors are useful, but borders, corners, and ornaments need review;
- locked-chain card back: thin chain/lock linework should be checked after cleanup;
- corner ornate open frame: corner ornaments and disconnected frame pieces are high-risk because the interior aperture is large.

## Evidence Created

Created evidence folder:

`assets/academy/evidence/h5-36-card-goblin-duel-card-frames-cleanup/`

Evidence files:

- `card-goblin-duel-card-frames-cleanup-before-after-contact-sheet.png`
- `card-goblin-duel-card-frames-cleaned-derived-sheet-preview.png`
- `card-goblin-duel-card-frames-cleanup-edge-risk-preview.png`
- `card-goblin-duel-card-frames-cleanup-table-preview.png`

All evidence is labeled as draft cleanup candidate work. The source PNG remains untouched, the UI/tokens sheet remains untouched, and no runtime wiring occurred.

## Runtime Boundary

H5.36 does not approve:

- runtime card assets;
- card gameplay behavior;
- deck behavior;
- card table layout;
- Card Goblin Duel visual integration;
- Card Goblin Duel wiring;
- UI/tokens processing;
- animation or FX behavior.

The cleanup candidate remains `status: draft`, `reviewStatus: needs-human-review`, and `runtimeEligibility: not-runtime-approved`.

## Non-Goals

H5.36 does not:

- modify the source PNG;
- process the Card Goblin Duel UI/tokens sheet;
- mark the cleanup candidate human-review-passed;
- approve runtime card assets;
- approve card gameplay behavior;
- change game code;
- wire Card Goblin Duel runtime;
- process Potion Sorter, Farm/Settlement, Dungeon Platformer, Top-Down Slime Quest, or Shared FX;
- run Tauri, Rust, or Cargo.

## Human/Product Review Notes

Human review should focus on:

- whether blank/overlay-ready card interiors stayed intact;
- whether open frames and slot interiors are cleanly transparent enough;
- whether highlighted/glowing states kept readable glow edges;
- whether the gray disabled card survived without unwanted transparency;
- whether chain/lock linework survived;
- whether corner ornaments on open frames still read correctly;
- whether any high-risk region needs correction before promotion.

## Recommended Next Step

Recommended next lane:

```text
H5.37 — Card Goblin Duel Card Frames Cleanup Human Review + Promotion
```

Alternative:

```text
H5.37 — Card Goblin Duel Card Frames Cleanup Corrections
```

Tiny law:

```text
The cards got transparent responsibly.
The holes are holes.
Runtime still has no deck.
```
