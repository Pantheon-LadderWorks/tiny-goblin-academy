# Tiny Goblin Academy — H5.42 Card Goblin Duel UI/Tokens Region Correction Pass

## 1. Purpose

H5.42 corrects the H5.41 Card Goblin Duel UI/tokens draft region mapping before human-review promotion.

This is a region correction pass only. It does not clean assets, perform functional slot mapping, approve runtime UI, or wire Card Goblin Duel gameplay.

## 2. Human Review Finding

Human/product review found that H5.41 should not be promoted as-is.

The main issues were:

- top visual rows were grouped too broadly;
- paired icons were treated as one region when they were distinct assets;
- blank/no-asset sheet areas were represented as regions;
- some categories were odd because the crops were too wide;
- functional-surface candidate flags needed to remain provisional.

## 3. What H5.41 Got Right

H5.41 correctly found the source sheet and established a draft manifest/evidence lane.

It also correctly identified the source as an RGB/opaque concept sheet with baked checkerboard-style background, meaning cleanup/transparency extraction should be deferred.

The H5.41 evidence was useful for review because it made the grouping mistake visible.

## 4. What Needed Correction

The H5.41 broad paired-cell map needed to be replaced with visible-asset regions.

Blank/no-asset regions were removed.

Distinct visible assets were split into individual regions, especially in the first two visual rows and other paired cells.

Categories were refined after splitting.

## 5. Correction Method

H5.42 used the same source sheet:

`assets/academy/games/card-goblin-duel/tga-card-goblin-duel-ui-tokens-concept-v0.1.png`

The corrected manifest uses source-relative visible bounds for individual assets. Paired assets were split unless they appeared to be a single intentional cluster, such as the star cluster.

No source pixels were modified.

## 6. Corrected Region Results

Corrected manifest:

`manifests/academy.card-goblin-duel.ui-tokens.regions.json`

Results:

- H5.41 draft region count: 32
- H5.42 corrected region count: 48
- Blank/no-asset regions removed: 16
- Status: draft
- Review status: needs-human-review
- Runtime eligibility: not-runtime-approved

Corrected category breakdown:

- status-icon: 9
- effect-icon: 9
- card-ui-marker: 3
- badge: 6
- token: 7
- text-bearing-ui: 1
- button: 7
- label-surface: 2
- icon-button: 2
- divider: 2

## 7. Functional Surface Candidate Notes

Functional surface candidate flags remain draft/provisional.

Likely future functional-surface candidates include:

- shield/energy/time/trophy/crown badges;
- active-turn text-bearing marker;
- blank button/label/badge surfaces;
- check/X/warning buttons;
- check marker bubbles.

Functional-surface candidate count: 18.

Likely token/icon/effect/decorative regions are marked false unless later review determines they need internal data slots.

## 8. Evidence Created

Evidence folder:

`assets/academy/evidence/h5-42-card-goblin-duel-ui-tokens-region-corrections/`

Evidence files:

- `card-goblin-duel-ui-tokens-corrected-bbox-overlay.png`
- `card-goblin-duel-ui-tokens-corrected-numbered-contact-sheet.png`
- `card-goblin-duel-ui-tokens-corrected-region-table-preview.png`
- `card-goblin-duel-ui-tokens-correction-summary.png`
- `card-goblin-duel-ui-tokens-corrected-functional-surface-candidate-preview.png`

Evidence labels state corrected draft region mapping, source PNG untouched, no cleanup, no functional slot mapping, and no runtime UI/game wiring.

## 9. Runtime Boundary

H5.42 preserves the runtime boundary:

- no runtime UI approval;
- no runtime/global layout approval;
- no cleanup or derived cleaned assets;
- no functional slot mapping;
- no card gameplay code;
- no Card Goblin Duel wiring.

H5.42 corrects the draft Card Goblin Duel UI/tokens region mapping before human-review promotion. UI/token sheets may contain a mix of functional surfaces, icons, tokens, badges, status markers, effects, and decorative pieces. Region mapping must avoid broad paired-cell grouping when distinct assets should be addressed separately. Blank areas are not asset regions. H5.42 does not perform cleanup, functional slot mapping, runtime UI, card gameplay, or Card Goblin Duel wiring.

## 10. Non-Goals

H5.42 did not:

- modify the source PNG;
- run cleanup;
- create derived cleaned assets;
- perform functional slot mapping;
- process card-frame manifests or images;
- create runtime UI;
- render text into assets;
- create card gameplay code;
- wire Card Goblin Duel runtime.

## 11. Recommended Next Step

Recommended next lane:

`H5.43 — Card Goblin Duel UI/Tokens Region Human Review`

H5.43 should review the corrected 48-region mapping before cleanup or future functional slot passes begin.
