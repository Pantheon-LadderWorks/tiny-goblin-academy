# Tiny Goblin Academy — H5.33 Dice Duel Tavern Cleanup Human Review + Promotion

## Purpose

H5.33 records Kryssie's human/product review of the H5.32 Dice Duel Tavern cleanup candidate.

H5.33 accepts the H5.32 Dice Duel Tavern cleanup candidate for draft pipeline use only. This does not approve runtime assets, dice roll implementation, animation timing, probability logic, gameplay behavior, or Dice Duel Tavern wiring. High-risk FX cleanup notes remain review history, not blockers.

## Review Input

Reviewed H5.32 inputs:

- `docs/assets/TINY_GOBLIN_ACADEMY_H5_32_DICE_DUEL_TAVERN_CLEANUP_CANDIDATE.md`
- `manifests/academy.dice-duel-tavern.cleanup-candidate.json`
- `assets/academy/games/dice-duel-tavern/derived/tga-dice-duel-tavern-cleaned-v0.1.png`
- `assets/academy/evidence/h5-32-dice-duel-tavern-cleanup/`

The reviewed evidence included the before/after contact sheet, cleaned derived sheet preview, edge-risk preview, cleanup table preview, and roll illusion candidate preview.

## Human Review Decision

Decision:

```text
H5.32 Human Review Passed
```

No cleanup correction pass is required.

The cleanup candidate is now accepted for draft pipeline use:

- `status: reviewed`
- `reviewStatus: human-review-passed`
- `pipelineUse: accepted-for-draft-pipeline-use`
- `runtimeEligibility: not-runtime-approved`
- `rollIllusionApproval: none`
- `animationApproval: none`
- `probabilityLogicApproval: none`

## Accepted Cleanup Candidate

Accepted cleanup candidate:

`assets/academy/games/dice-duel-tavern/derived/tga-dice-duel-tavern-cleaned-v0.1.png`

Accepted cleanup candidate manifest:

`manifests/academy.dice-duel-tavern.cleanup-candidate.json`

Accepted cleanup regions: 64

The original `1024x1024` / 8x8 layout preservation is accepted and should remain important for future dice face cycling and planning convenience.

## Risk Notes Retained

The H5.32 risk flags remain useful history:

- glow regions;
- smoke wisps;
- dust puffs;
- sparkle effects;
- burst effects;
- spiral effects;
- motion-line regions;
- rolling/tumbling dice shadows and smears.

Smoke wisps and soft FX are visibly fragile/faint, but accepted for draft pipeline use. Future runtime use should be selective; not every cleaned FX candidate must be used.

## Roll Illusion Planning Boundary

The future roll illusion planning note remains useful but is still not runtime-approved.

Preserved planning concept:

```text
flat die faces 1-6
+
tumbling / rolling dice
+
sparkle / dust / spiral / burst / smoke FX
=
future code-driven roll illusion candidate
```

H5.33 does not approve runtime roll code, animation timing, probability/gameplay logic, or Dice Duel Tavern wiring.

## Runtime Boundary

H5.33 does not approve:

- runtime assets;
- dice roll implementation;
- animation timing;
- frame sequences;
- probability logic;
- gameplay behavior;
- Phaser integration;
- Dice Duel Tavern wiring.

The cleaned sheet is accepted for draft pipeline use only.

## Non-Goals

H5.33 does not:

- reclean assets;
- modify the source PNG;
- modify the derived cleaned candidate image;
- modify H5.32 evidence images;
- create runtime roll code;
- create animation manifests;
- approve animation timing;
- approve probability/gameplay logic;
- change Dice Duel Tavern game code;
- process Card Goblin Duel;
- process Potion Sorter;
- process Farm/Settlement;
- process Dungeon Platformer;
- process Top-Down Slime Quest;
- touch Shared FX;
- run Tauri, Rust, or Cargo.

## Dice Duel Tavern Asset-Prep Status

Dice Duel Tavern asset prep is closed for now:

- region mapping: completed and human-reviewed;
- cleanup candidate: completed and human-reviewed;
- future roll illusion: preserved as planning-only;
- runtime integration remains deferred until broader asset pass is complete.

Current status:

```text
asset-prep complete for now
cleanup accepted for draft pipeline use
roll illusion preserved as planning context
not runtime-wired
```

## Recommended Next Step

Recommended next lane:

Continue Remaining Standard Game Asset Sheets

Alternative future Dice lane when runtime work begins:

Dice Duel Tavern Runtime Visual Integration / Roll Illusion Plan

Tiny verdict:

```text
Dice sheet passed cleanup review.
The die may wiggle later.
Runtime still has no tavern key.
```
