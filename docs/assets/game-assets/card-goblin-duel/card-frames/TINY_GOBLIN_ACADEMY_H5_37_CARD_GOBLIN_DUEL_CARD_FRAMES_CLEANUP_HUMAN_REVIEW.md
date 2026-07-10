# Tiny Goblin Academy — H5.37 Card Goblin Duel Card Frames Cleanup Human Review + Promotion

## Purpose

H5.37 records Kryssie's human/product review of the H5.36 Card Goblin Duel card-frames cleanup candidate.

This is a cleanup human-review promotion pass only. No cleanup was rerun, no images were modified, and no runtime/game-code work occurred.

## Review Input

Reviewed H5.36 inputs:

- `docs/assets/TINY_GOBLIN_ACADEMY_H5_36_CARD_GOBLIN_DUEL_CARD_FRAMES_CLEANUP_CANDIDATE.md`
- `manifests/academy.card-goblin-duel.card-frames.cleanup-candidate.json`
- `assets/academy/games/card-goblin-duel/derived/tga-card-goblin-duel-card-frames-cleaned-v0.1.png`
- `assets/academy/evidence/h5-36-card-goblin-duel-card-frames-cleanup/`

## Human Review Decision

Decision:

```text
H5.36 Human Review Passed
```

The Card Goblin Duel card-frames cleanup candidate is accepted for draft pipeline use.

No cleanup correction pass is needed.

Updated cleanup manifest status:

- `status: reviewed`
- `reviewStatus: human-review-passed`
- `pipelineUse: accepted-for-draft-pipeline-use`
- `runtimeEligibility: not-runtime-approved`

## Accepted Cleanup Candidate

Accepted cleanup candidate:

`assets/academy/games/card-goblin-duel/derived/tga-card-goblin-duel-card-frames-cleaned-v0.1.png`

Accepted cleanup candidate manifest:

`manifests/academy.card-goblin-duel.card-frames.cleanup-candidate.json`

Accepted cleanup regions: 32

## Review Notes

Accepted visual findings:

- solid blank/overlay-ready card surfaces look acceptable and should remain preserved;
- open frames, card slots, and board slots correctly became transparent candidates;
- the cleaned candidate is acceptable for draft pipeline use;
- no cleanup correction pass is required.

Retained risk history:

- gray disabled card state remains a risk flag because gray artwork is close to fake-checkerboard values;
- glowing/highlight frames remain risk flags because glow edges need careful future review;
- chains/locks remain a risk flag because thin linework can be fragile;
- ornate open frames and slot apertures remain risk flags because their transparent holes depend on careful aperture cleanup.

These flags are review history, not blockers for draft pipeline use.

## Functional Surface Note

Card frames should be treated as functional surfaces, not just stickers.

Future Card Frame Functional Slot Mapping is needed before runtime card UI integration. The next planning lane should define where card titles, costs, icons, text, stat badges, status overlays, selection zones, disabled/locked overlays, and other dynamic UI/data elements belong inside each usable card surface.

This is the same anchor pattern as scene anchors, applied at card/UI scale.

## Relationship To UI/Tokens Sheet

The Card Goblin Duel UI/tokens sheet remains untouched and out of scope:

`assets/academy/games/card-goblin-duel/tga-card-goblin-duel-ui-tokens-concept-v0.1.png`

It remains a separate future lane.

## Runtime Boundary

H5.37 does not approve:

- runtime card assets;
- card gameplay behavior;
- deck behavior;
- card table layout;
- Card Goblin Duel visual integration;
- Card Goblin Duel wiring;
- UI/tokens processing;
- animation or FX behavior.

The cleanup candidate is accepted for draft pipeline use only.

## Non-Goals

H5.37 does not:

- reclean assets;
- modify source PNGs;
- modify the derived cleaned candidate image;
- modify H5.36 evidence images;
- process the Card Goblin Duel UI/tokens sheet;
- create card gameplay code;
- create runtime visual integration;
- approve runtime assets;
- approve card gameplay behavior;
- run Tauri, Rust, or Cargo.

## Recommended Next Step

Recommended next lane:

```text
H5.38 — Card Goblin Duel Card Frame Functional Slot Mapping
```

Tiny law:

```text
A frame is not a sticker.
A frame is a surface with rules.
```
