# Tiny Goblin Academy — H5.30 Dice Duel Tavern Sheet Intake + Region Mapping

## Purpose

H5.30 maps Dice Duel Tavern source-sheet regions for draft review only. Mapped regions are not runtime-approved assets. SourceRects require evidence review before cleanup or implementation. No game code, runtime wiring, or visual integration occurs in this pass.

This pass continues the remaining standard game asset sheet workflow after Pet Campfire asset prep closed for now in H5.29.

## Source Sheet

Source sheet:

`assets/academy/games/dice-duel-tavern/tga-dice-duel-tavern-sheet-concept-v0.1.png`

Intended use from the asset system plan:

- Game 03 dice faces;
- roll effects;
- duel tokens;
- tavern props;
- feedback icons.

## Source Inspection

Inspection results:

- Dimensions: `1024x1024`
- Image mode: `RGB`
- Alpha exists: no
- Usable alpha: no
- Transparency finding: baked checkerboard / fake transparency
- Layout classification: grid-like 8x8 concept sheet with irregular visible bounds

The sheet is clean and slice-friendly for concept intake, but it is not a transparent runtime asset. Cleanup should happen later as a derived candidate only after region review.

## Mapping Method

The sheet appears organized as an 8x8 concept grid. H5.30 used that grid as the intake scaffold, then mapped visible asset bounds inside each cell rather than treating the full cell as the final sourceRect.

Mapping rules:

- use visible bounds;
- do not map blank padding as asset area;
- split visually distinct assets into separate regions;
- keep grouped motifs together where they are intentionally a single icon or token;
- mark every region as `draft-review` / `needs-human-review`;
- do not runtime-approve anything.

## Region Results

Created manifest:

`manifests/academy.dice-duel-tavern.regions.json`

Mapped regions: 64

Category breakdown:

- `background-prop`: 2
- `dice-face`: 6
- `dice-token`: 3
- `duel-token`: 19
- `feedback-icon`: 8
- `reward-token`: 6
- `roll-effect`: 10
- `tavern-prop`: 7
- `ui-marker`: 3

The manifest remains:

- `status: draft`
- `reviewStatus: needs-human-review`
- `runtimeEligibility: not-runtime-approved`

## Evidence Created

Created evidence folder:

`assets/academy/evidence/h5-30-dice-duel-tavern-region-mapping/`

Evidence files:

- `dice-duel-tavern-bbox-overlay.png`
- `dice-duel-tavern-numbered-contact-sheet.png`
- `dice-duel-tavern-region-table-preview.png`
- `dice-duel-tavern-source-inspection-preview.png`

Evidence confirms draft region mapping only. The source PNG remains untouched, no cleanup was performed, and no game wiring occurred.

## Cleanup / Transparency Findings

The source sheet is RGB with no alpha. The checkerboard-like background is baked into the image and should be treated as fake transparency.

Cleanup recommendation:

```text
Do not use the source sheet directly as transparent runtime art.
After human review of H5.30 regions, create a derived cleanup candidate if these mappings pass.
```

Potential cleanup risk is lower than Pet Campfire or Shared FX because the sheet is grid-like and most icons have strong outlines. Low-contrast smoke/dust regions should still receive careful review before any cleanup candidate is promoted.

## Non-Goals

H5.30 does not:

- modify the source PNG;
- create a derived cleaned asset;
- approve runtime use;
- wire Dice Duel Tavern into runtime;
- change game code;
- process Card Goblin Duel;
- process Potion Sorter;
- process Farm/Settlement;
- process Dungeon Platformer;
- process Top-Down Slime Quest;
- touch Shared FX;
- run Tauri, Rust, or Cargo.

## Human/Product Review Notes

Review should check:

- whether the 64 mapped regions correspond to the visible assets;
- whether grouped dice clusters, laurel icons, medals, and token variants are intentionally grouped;
- whether ambiguous labels such as `Bar/weight token teal` should be renamed;
- whether smoke/dust and glow effects survive enough visual clarity for later cleanup;
- whether any duplicate token variants should be kept as separate draft regions.

## Recommended Next Step

Recommended next lane:

H5.31 — Dice Duel Tavern Region Human Review

Alternative:

H5.31 — Dice Duel Tavern Cleanup Candidate

Tiny verdict:

```text
Pet Campfire was the boss fight.
Dice Duel Tavern is a clean little pantry pass.
```
