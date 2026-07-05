# Tiny Goblin Academy — H5.35 Card Goblin Duel Card Frames Region Human Review

## Purpose

H5.35 records Kryssie's human/product review of the H5.34 Card Goblin Duel card-frames region mapping.

H5.35 accepts the H5.34 Card Goblin Duel card-frame region mapping for draft cleanup and planning use only. This does not approve runtime assets, card gameplay behavior, visual integration, or Card Goblin Duel wiring. The Card Goblin Duel UI/tokens sheet remains a separate future lane because it has different semantic and cleanup risks.

## Review Input

Reviewed H5.34 inputs:

- `docs/assets/TINY_GOBLIN_ACADEMY_H5_34_CARD_GOBLIN_DUEL_CARD_FRAMES_REGION_MAPPING.md`
- `manifests/academy.card-goblin-duel.card-frames.regions.json`
- `assets/academy/evidence/h5-34-card-goblin-duel-card-frames-region-mapping/`

Reviewed source sheet:

`assets/academy/games/card-goblin-duel/tga-card-goblin-duel-card-frames-concept-v0.1.png`

## Human Review Decision

Decision:

```text
H5.34 Human Review Passed
```

The 32 mapped card-frame regions are accepted for draft cleanup/planning use.

No sourceRect correction pass is needed.

## Accepted Region Mapping

Accepted mapping notes:

- blank/overlay-ready card surfaces are important and should remain preserved;
- card backs, card fronts, board slots, card slots, highlighted states, and disabled states are correctly separated;
- open card frames and transparent-looking slot interiors need careful cleanup later because the sheet has baked checkerboard/fake transparency;
- the Card Goblin Duel UI/tokens sheet remains a separate future lane.

Updated manifest status:

- `status: reviewed`
- `reviewStatus: human-review-passed`
- `pipelineUse: accepted-for-draft-cleanup-and-planning-use`
- `runtimeEligibility: not-runtime-approved`

Individual regions remain draft planning/cleanup candidates, not runtime-approved assets.

## Cleanup Status

Cleanup remains deferred.

No cleanup was run in H5.35, and no derived cleaned assets were created.

The source sheet remains `1024x1024` RGB with no alpha channel and baked checkerboard/fake transparency.

## Open Frame / Slot Cleanup Caution

Open frames and slot interiors are the main future cleanup risk.

The cleanup pass must not accidentally treat the checkerboard interior as real card art, but it also must preserve intentional frame edges, glow states, open-frame holes, and blank/overlay-ready card surfaces.

This is especially important for:

- open card frames;
- board/card slots;
- highlighted empty slots;
- blank card surfaces intended for future overlays.

## Relationship To UI/Tokens Sheet

The Card Goblin Duel UI/tokens sheet remains out of scope:

`assets/academy/games/card-goblin-duel/tga-card-goblin-duel-ui-tokens-concept-v0.1.png`

It should receive its own future intake/mapping lane because it contains different asset types and known baked text risk.

## Runtime Boundary

H5.35 does not approve:

- runtime card assets;
- card gameplay behavior;
- visual integration;
- Card Goblin Duel wiring;
- card table layout;
- animation or FX behavior;
- cleaned/transparent runtime output.

## Non-Goals

H5.35 does not:

- modify the source PNG;
- run cleanup;
- create derived cleaned assets;
- process the Card Goblin Duel UI/tokens sheet;
- create runtime card code;
- wire Card Goblin Duel;
- change game code;
- process Potion Sorter, Farm/Settlement, Dungeon Platformer, Top-Down Slime Quest, or Shared FX;
- run Tauri, Rust, or Cargo.

## Recommended Next Step

Recommended next lane:

```text
H5.36 — Card Goblin Duel Card Frames Cleanup Candidate
```

Alternative:

```text
Continue Remaining Standard Game Asset Sheets
```

Tiny verdict:

```text
The cards are mapped.
The blank spell-slabs survived.
The tokens goblin waits its turn.
```
