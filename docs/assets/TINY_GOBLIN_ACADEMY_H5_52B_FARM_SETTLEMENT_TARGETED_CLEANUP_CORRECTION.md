# Tiny Goblin Academy — H5.52B Farm Settlement Targeted Cleanup Correction

## Purpose

H5.52B records a targeted cleanup correction for the Farm Settlement cleanup candidate after human review found visible baked checkerboard/background remnants on six regions.

This is not a promotion pass. The cleanup candidate remains draft, needs human review, and is not runtime-approved.

## Baseline

- H5.52 commit: `a764222 docs: add farm settlement cleanup candidate`
- Source sheet: `assets/academy/games/farm-settlement/tga-farm-settlement-sheet-v0.1.png`
- Current derived cleanup candidate: `assets/academy/games/farm-settlement/derived/tga-farm-settlement-cleaned-v0.1.png`
- Cleanup manifest: `manifests/academy.farm-settlement.cleanup-candidate.json`

## Human Review Finding

H5.52 was mostly acceptable, but the following regions still showed visible baked checkerboard/background remnants:

- 4 — `farm-settlement.soil-plot-watered-sprout` — Watered sprout soil plot
- 7 — `farm-settlement.withered-crop-plot` — Withered crop plot
- 13 — `farm-settlement.water-drop-token` — Water drop token
- 21 — `farm-settlement.campfire` — Campfire
- 30 — `farm-settlement.smiling-sun` — Smiling sun icon
- 31 — `farm-settlement.crescent-moon` — Crescent moon icon

## Correction Method

The correction regenerated only the six target regions. Regions 7, 13, 21, 30, and 31 use a stricter target-only neutral checker/background matte. Region 4 uses restricted halo cleanup around the water-drop side of the sprite so the puddle/soil interior is not overcut.

Non-target regions were preserved from the H5.52 derived sheet. SourceRects were not changed. Regions were not remapped.

## Manifest Updates

- Top-level status remains `draft`.
- Top-level reviewStatus remains `needs-human-review`.
- Top-level runtimeEligibility remains `not-runtime-approved`.
- `gameplayApproval` remains `none`.
- `placementApproval` remains `none`.
- Regions 4, 7, 13, 21, 30, and 31 received `correctionAttempt: h5-52b-targeted-cleanup`.
- Correction history was added at top-level and per corrected region.
- Risk flags remain preserved as review history.

## Evidence Created

- `assets/academy/evidence/h5-52b-farm-settlement-targeted-cleanup-correction/farm-settlement-targeted-correction-before-after.png`
- `assets/academy/evidence/h5-52b-farm-settlement-targeted-cleanup-correction/farm-settlement-targeted-correction-on-dark.png`
- `assets/academy/evidence/h5-52b-farm-settlement-targeted-cleanup-correction/farm-settlement-targeted-correction-table-preview.png`
- `assets/academy/evidence/h5-52b-farm-settlement-targeted-cleanup-correction/farm-settlement-targeted-correction-summary.png`

## Non-Goals

- No source PNG modification.
- No region remapping.
- No sourceRect changes.
- No non-target cleanup review promotion.
- No runtime approval.
- No placement approval.
- No Farm Settlement gameplay wiring.
- No scene-anchor work.
- No functional slot mapping.

## Recommended Next Lane

H5.53 — Farm Settlement Cleanup Human Review
