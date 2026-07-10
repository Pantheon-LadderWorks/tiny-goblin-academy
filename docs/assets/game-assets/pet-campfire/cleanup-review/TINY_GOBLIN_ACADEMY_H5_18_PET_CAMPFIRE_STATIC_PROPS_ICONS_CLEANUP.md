# Tiny Goblin Academy — H5.18 Pet Campfire Static Props + Icons Cleanup Candidate

## 1. Purpose

H5.18 creates a derived transparent cleanup candidate for the Pet Campfire static props and icons mapped in H5.17.

H5.17 mapped Pet Campfire static props and icons, but mapped sourceRects are not sufficient for visual placement while the source sheet contains baked checkerboard. H5.18 creates a derived transparent cleanup candidate while preserving the source PNG. Cleanup output remains draft-review until human visual review confirms that outlines, glows, sparkles, smoke, and thin-line details survived.

## 2. Source Inputs

Source manifest:

`manifests/academy.pet-campfire.static-props-icons.regions.json`

Source sheet:

`assets/academy/games/pet-campfire/tga-pet-campfire-ember-pup-sheet-concept-v0.1.png`

Background used for preview evidence:

`assets/academy/games/pet-campfire/backgrounds/tga-pet-campfire-background-source-v0.1.png`

The background was used only to prove visual overlay behavior. It was not processed, cropped into runtime output, or converted into a scene-anchor manifest.

## 3. Problem Summary

The H5.17 regions are accurate draft sourceRects, but the source image is RGB with no alpha channel. Its checkerboard background is baked into the pixels.

That means the H5.17 crops are useful as manifest evidence but not useful for actual visual placement over the Pet Campfire background. The visible checkerboard has to be removed into a derived transparent candidate before human review can judge whether the static props/icons are usable.

## 4. Cleanup Method

Cleanup was performed per H5.17 region, not across the full sheet.

Method:

1. Read each mapped region sourceRect from the H5.17 manifest.
2. Crop the region from the original RGB source sheet.
3. Detect neutral gray checkerboard pixels only when they are connected to the crop edge.
4. Convert those edge-connected checkerboard pixels to transparent alpha.
5. Preserve colored pixels, dark outlines, warm flame colors, sparkle marks, smoke/cloud interiors, and thin-line details where the conservative detector was uncertain.
6. Trim each cleaned crop to its non-transparent bounds.
7. Compose the cleaned crops into a derived atlas-style candidate sheet.

This is a conservative cleanup candidate. It is not a runtime-approved production asset.

## 5. Derived Outputs

Derived transparent candidate:

`assets/academy/games/pet-campfire/derived/tga-pet-campfire-static-props-icons-cleaned-v0.1.png`

Cleanup candidate manifest:

`manifests/academy.pet-campfire.static-props-icons.cleanup-candidate.json`

The cleanup candidate manifest preserves the original region IDs, sourceRects, categories, and labels, then adds derived atlas rectangles, cleanup status, risk level, removed pixel counts, and review notes.

## 6. Evidence Created

Evidence folder:

`assets/academy/evidence/h5-18-pet-campfire-static-props-icons-cleanup/`

Files:

- `cleanup-before-after-contact-sheet.png`
- `cleaned-on-background-preview.png`
- `cleanup-edge-risk-preview.png`
- `cleanup-table-preview.png`
- `cleaned-derived-sheet-preview.png`

The most important file is `cleaned-on-background-preview.png`, because it proves whether the checkerboard cleanup actually works when the candidate assets sit on the Pet Campfire background.

## 7. Region Cleanup Results

Processed regions:

```text
25
```

Cleanup status:

```text
candidate-cleaned-needs-human-review
```

Risk summary:

```text
low-medium: ordinary static props and reward tokens
medium: simpler status/mood icons
medium-high: thin-line, flame, sparkle, smoke/cloud, sunrise/sunset, grouped, or detail-heavy assets
```

All 25 regions remain:

```text
reviewStatus: needs-human-review
```

No region is approved or runtime-ready.

## 8. Edge Risk Findings

Regions flagged as medium-high need focused review:

- campfire;
- fire/warmth icon;
- sparkles feedback icon;
- thought cloud icon;
- sunrise check icon;
- sunrise/sunset icon;
- warning icon;
- leash;
- brush;
- water need droplet;
- grouped stick-and-ball;
- moon/night icon.

Specific risks:

- sparkle flecks may be too easy to erase;
- smoke/thought-cloud interiors are neutral and must not be mistaken for background;
- sunrise/sunset rays are thin and separated;
- fire/flame edges must preserve warm silhouette;
- leash and brush contain thin linework;
- grouped stick-and-ball remains a combined candidate until a future cutout pass separates them.

## 9. Background Overlay Preview Findings

The cleaned candidate removes the obvious checkerboard rectangles when placed over the Pet Campfire background preview.

The preview is not runtime placement. It is a visual evidence surface showing that the assets can now be judged against a real scene rather than a checkerboard-backed crop.

Initial agent visual check:

- ordinary props read cleanly over the background;
- fire and sparkle assets remain review-needed but are visibly usable candidates;
- thought cloud and sunrise/sunset icons no longer carry checkerboard boxes;
- no Ember Pup pose was included in the overlay candidate.

## 10. Non-Goals

- No source PNG was modified.
- No full-source-sheet cleanup was performed.
- No Ember Pup pose cleanup occurred.
- No animation manifest was created.
- No background processing occurred beyond preview evidence.
- No runtime/game code was changed.
- No hub code was changed.
- No runtime wiring occurred.
- No Top-Down Slime Quest files were touched.
- Shared FX remained untouched.
- No Tauri, Rust, Cargo, or installer activity occurred.
- No asset was marked approved or runtime-ready.

## 11. Human/Product Review Notes

Human review should inspect:

- whether the background overlay preview feels usable;
- whether fire, sparkle, smoke/cloud, moon, and sunrise/sunset details survived;
- whether the grouped stick-and-ball should stay grouped or be separated by a future dedicated cutout;
- whether the cleaned atlas is acceptable as a candidate format or should be reorganized before any runtime promotion;
- whether any region needs sourceRect adjustment before cleanup promotion.

The derived sheet should not be promoted until this visual review is accepted.

## 12. Recommended Next Step

Recommended next lane:

```text
H5.19 — Pet Campfire Cleanup Human Review + Promotion
```

If review finds visible cleanup damage:

```text
H5.19 — Pet Campfire Static Props/Icon Cleanup Corrections
```

If the cleanup candidate is accepted and the project wants to continue Pet Campfire assets:

```text
H5.19 — Ember Pup Pose / Animation Candidate Mapping
```

The safest immediate next step is human review of the H5.18 evidence, especially the background overlay and edge-risk preview.
