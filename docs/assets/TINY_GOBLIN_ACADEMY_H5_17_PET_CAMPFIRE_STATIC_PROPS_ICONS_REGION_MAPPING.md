# Tiny Goblin Academy — H5.17 Pet Campfire Static Props + Icons Region Mapping

## 1. Purpose

H5.17 maps the Pet Campfire static props, environment props, reward tokens, and status/mood icons from the Ember Pup source sheet.

This pass follows H5.16. It uses H5.16 as classification evidence, but it does not map Ember Pup character poses and does not approve any runtime usage.

## 2. Source Asset

Source sheet:

`assets/academy/games/pet-campfire/tga-pet-campfire-ember-pup-sheet-concept-v0.1.png`

Metadata:

| Field | Value |
| --- | --- |
| Dimensions | 1024x1024 |
| Mode | RGB |
| Alpha | none |
| Transparency verdict | baked checkerboard / no usable alpha |
| Derived sheet | none |
| Cleanup status | not run |

The source PNG was not modified.

## 3. Scope

Mapped in H5.17:

- care props;
- campfire/environment props;
- reward tokens;
- status/mood icons;
- UI feedback icon candidates.

Deferred:

- Ember Pup poses;
- Ember Pup animation/state sequence decisions;
- Pet Campfire background scene-anchor audit;
- cleanup production sheet;
- runtime wiring.

## 4. Region Manifest

Created:

`manifests/academy.pet-campfire.static-props-icons.regions.json`

Manifest status:

```text
status: draft
domain: pet-campfire-static-props-icons
usage: draft-review
reviewStatus: needs-human-review
regions: 25
```

The manifest was added to `scripts/validate-academy-asset-manifests.mjs` so the source path, domain, sourceRects, IDs, and usage fields are validated with the other academy region manifests.

## 5. Region Summary

The mapped draft regions are:

- food bowl;
- water bowl;
- grouped fetch stick and small ball;
- rolling tennis ball;
- blanket / bedroll;
- campfire;
- tent;
- paw badge ribbon;
- upset face icon;
- water need droplet;
- happy face icon;
- sleep ZZZ icon;
- fire/warmth icon;
- warning icon;
- sparkles feedback icon;
- thought cloud icon;
- sunrise check icon;
- paw coin token;
- treat biscuit;
- pet brush;
- pet leash;
- pet crate;
- bone;
- moon/night icon;
- sunrise/sunset icon.

## 6. Grouping / Separation Decisions

The fetch stick and small ball are intentionally grouped as one region:

`pet-campfire.care-prop.stick-and-ball`

Reason: the two objects are visually distinct but too close together for honest independent rectangle crops on this source sheet. Mapping them separately produced a misleading crop where the stick region caught part of the ball.

The rightmost thought-cloud and sunrise/sunset-style icons are intentionally separated:

- `pet-campfire.status-icon.thought-cloud`
- `pet-campfire.status-icon.sunrise-check`
- `pet-campfire.status-icon.sunrise-sunset`

Reason: H5.16 exposed that the far-right column is vertically stacked and should not be treated as one uniform 8x5 cell.

## 7. Evidence Created

Evidence folder:

`assets/academy/evidence/h5-17-pet-campfire-static-props-icons/`

Files:

- `pet-campfire-static-props-icons-bbox-overlay.png`
- `pet-campfire-static-props-icons-numbered-contact-sheet.png`
- `pet-campfire-static-props-icons-region-table-preview.png`

The evidence uses the source sheet for crops because no derived cleaned sheet exists. This is expected and is not runtime approval.

## 8. Cleanup Risk

The source sheet is RGB with baked checkerboard.

H5.17 does not create a cleaned production sheet. The manifest records exact sourceRects against the original source only.

Cleanup remains a later review decision. The highest-risk areas are:

- fire and warmth icons;
- sparkle thin lines;
- moon/sun/sunrise rays;
- closely grouped stick/ball;
- checkerboard around small status icons.

## 9. Non-Goals

- No source PNGs were modified.
- No derived cleaned sheet was created.
- No runtime wiring occurred.
- No game code was changed.
- No hub code was changed.
- No Tauri files were touched.
- No Ember Pup animation manifest was created.
- No background scene-anchor manifest was created.
- No Top-Down Slime Quest files were touched.
- Shared FX remained untouched.
- No region was marked approved or runtime-ready.

## 10. Agent QA Findings

- The H5.16 rough grid was useful for classification, but not safe for final sourceRects.
- The stick and ball should stay grouped unless a future cleanup/cutout pass creates separated derived assets.
- The far-right column contains stacked status/sunrise/sunset-style icons and needs careful review in any future cleanup pass.
- The contact sheet is readable, but checkerboard remains baked because no production cleanup was run.
- Ember Pup poses remain protected for a future character/state lane.

## 11. Human/Product Review Notes

Human review should check:

- whether the 25 regions cover the static props/icons needed by the current Pet Campfire loop;
- whether the grouped stick-and-ball is acceptable as one candidate;
- whether the sunrise check and sunrise/sunset icons are semantically named correctly;
- whether any status/mood icon should be categorized differently before runtime promotion;
- whether the baked checkerboard is acceptable for draft review evidence before cleanup.

## 12. Validation

Validation commands for this pass:

```powershell
node scripts/validate-academy-manifest.mjs
node scripts/validate-hub-icon-regions.mjs
node scripts/validate-hub-icons.mjs
node scripts/validate-academy-asset-manifests.mjs
node scripts/validate-academy-animation-manifests.mjs
node scripts/asset-pipeline/smoke-check.mjs
python scripts/asset-pipeline/make-region-evidence.py --manifest manifests/academy.pet-campfire.static-props-icons.regions.json --out assets/academy/evidence/h5-17-pet-campfire-static-props-icons
```

## 13. Recommended Next Step

Recommended next lane:

```text
H5.18 — Pet Campfire Static Props + Icons Cleanup Pilot Review
```

Reason: the static props/icons are now sourceRect-mapped, but the source still has baked checkerboard. A cleanup pilot can compare derived crop previews against the H5.17 manifest without creating or approving a production cleaned sheet.

Ember Pup animation/state mapping should remain deferred until the static props/icons lane has a clear cleanup decision.
