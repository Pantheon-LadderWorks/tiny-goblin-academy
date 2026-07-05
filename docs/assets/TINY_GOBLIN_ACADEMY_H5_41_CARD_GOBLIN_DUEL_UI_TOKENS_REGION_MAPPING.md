# Tiny Goblin Academy - H5.41 Card Goblin Duel UI/Tokens Region Mapping

## 1. Purpose

H5.41 performs the first intake and region mapping pass for the Card Goblin Duel UI/tokens source sheet.

This pass creates a draft region manifest and visual evidence for human/product review. It does not clean assets, approve runtime UI, or perform functional slot mapping.

## 2. Source Sheet

Expected source sheet was present:

`assets/academy/games/card-goblin-duel/tga-card-goblin-duel-ui-tokens-concept-v0.1.png`

Source metadata:

- Dimensions: 1024 x 1024
- Pixel format: Format24bppRgb
- Alpha: none detected
- Transparency condition: checkerboard-style background appears baked into the RGB concept sheet

## 3. Source Inspection

The sheet appears to be a mixed UI/token concept sheet for Card Goblin Duel. It may contain panels, buttons, icon-like tokens, badges, labels, and other UI surface candidates.

Because the source is RGB/opaque and uses a checkerboard-style background, H5.41 treats cleanup/transparency extraction as deferred work.

## 4. Mapping Method

Regions were mapped for draft review using the source sheet's visible layout. The pass used a grid-aware visible-bounds scan to isolate draft candidate regions across the sheet.

Every region is marked as draft review only. Categories are provisional and require human/product review before cleanup or later slot mapping.

## 5. Region Results

Draft region manifest created:

`manifests/academy.card-goblin-duel.ui-tokens.regions.json`

Summary:

- Regions mapped: 32
- Status: draft
- Review status: needs-human-review
- Runtime eligibility: not-runtime-approved
- Cleanup output: none
- Functional slot mapping: none

The manifest records source-relative rectangles only. No runtime/global UI layout is approved.

## 6. Functional Surface Candidate Notes

H5.41 marks likely future functional-surface candidates where useful. These candidates may later need internal slot mapping if human review accepts them as surfaces rather than decorative stickers.

Likely future functional-surface candidates include provisional UI panels, buttons, badges, progress bars, labels, and other text-bearing or state-bearing surfaces.

Likely non-surface or lower-priority candidates include tokens, icon-like regions, status icons, effect icons, and decorative markers unless human review identifies surface behavior.

## 7. Cleanup / Transparency Findings

The source PNG is RGB/opaque and does not provide true alpha transparency.

The apparent checkerboard background is treated as baked into the concept sheet. Cleanup, transparency repair, edge-risk review, and derived cleaned assets are deferred to a future bounded lane.

H5.41 created no cleaned or derived asset sheet.

## 8. Relationship To Card Frames

H5.40 accepted the corrected Card Goblin Duel card-frame functional slot mapping for draft planning use. H5.41 carries that doctrine forward into the UI/tokens sheet.

Card frames taught the surface rule: not every asset owns the same internal content slots.

UI tokens are where that rule becomes important. Buttons, panels, badges, progress bars, labels, bubbles, and status pieces may become future functional surfaces, but they must be reviewed by surface type before slot mapping.

H5.41 maps Card Goblin Duel UI/tokens regions for draft review only. Some UI/token assets may later become functional surfaces with internal slots, but H5.41 does not perform functional slot mapping, cleanup, runtime UI, text rendering, card gameplay, or Card Goblin Duel wiring.

## 9. Evidence Created

Evidence folder:

`assets/academy/evidence/h5-41-card-goblin-duel-ui-tokens-region-mapping/`

Evidence files:

- `card-goblin-duel-ui-tokens-bbox-overlay.png`
- `card-goblin-duel-ui-tokens-numbered-contact-sheet.png`
- `card-goblin-duel-ui-tokens-region-table-preview.png`
- `card-goblin-duel-ui-tokens-source-inspection-preview.png`
- `card-goblin-duel-ui-tokens-functional-surface-candidate-preview.png`

## 10. Non-Goals

H5.41 did not:

- modify the source PNG;
- run cleanup;
- create derived cleaned assets;
- process card-frame source or derived images;
- change card-frame functional slot manifests;
- create runtime UI;
- render text into assets;
- create card gameplay code;
- wire Card Goblin Duel runtime;
- process unrelated asset lanes;
- run Tauri, Rust, or Cargo.

## 11. Human/Product Review Notes

Human/product review should check:

- whether the provisional 32-region mapping matches the visible assets;
- whether any regions need split/merge corrections;
- which regions are true UI surfaces versus decorative tokens;
- which regions contain baked text or label risk;
- which regions may require cleanup or transparency repair;
- which regions should later receive functional slot mapping.

## 12. Recommended Next Step

Recommended next lane:

`H5.42 - Card Goblin Duel UI/Tokens Region Human Review`

H5.42 should review the region manifest and evidence before any cleanup or functional slot pass begins.
