# Tiny Goblin Academy - H5.53 Farm Settlement Cleanup Human Review With Exclusions

## 1. Purpose

H5.53 records Kryssie's human/product review decision for the H5.52B Farm Settlement cleanup candidate.

This is a metadata and review promotion pass only. It accepts the cleanup candidate for draft pipeline use with explicit region exclusions.

## 2. Human Review Decision

H5.52B Farm Settlement cleanup candidate passed human/product review with explicit exclusions.

All cleaned Farm Settlement regions except the six denied regions are accepted for draft pipeline use.

No further cleanup correction pass is needed for the current asset pass.

## 3. Accepted / Denied Counts

Accepted cleanup scope:

- Total cleanup regions: 32
- Accepted cleaned regions: 26
- Denied cleaned regions: 6
- Runtime eligibility: not-runtime-approved
- Gameplay approval: none
- Placement approval: none

## 4. Explicitly Denied Regions

The following cleanup regions are explicit do-not-use regions:

| Index | Region ID | Label |
|---:|---|---|
| 4 | `farm-settlement.soil-plot-watered-sprout` | Watered sprout soil plot |
| 7 | `farm-settlement.withered-crop-plot` | Withered crop plot |
| 13 | `farm-settlement.water-drop-token` | Water drop token |
| 21 | `farm-settlement.campfire` | Campfire |
| 30 | `farm-settlement.smiling-sun` | Smiling sun icon |
| 31 | `farm-settlement.crescent-moon` | Crescent moon icon |

Reason for exclusion: these six regions still retain visible baked checkerboard/halo remnants around natural sprite borders after H5.52 and H5.52B cleanup attempts.

## 5. Preservation Policy

Denied regions are not deleted.

They remain preserved as source, manifest, and evidence history only. They must not be selected for draft pipeline use, runtime visuals, placement, scene-anchor planning, functional slot planning, gameplay wiring, or Farm Settlement wiring.

The original source region mapping remains valid as reviewed source history. The exclusion applies to the cleaned draft pipeline use path.

## 6. Runtime Boundary

Runtime boundary retained:

- `runtimeEligibility: not-runtime-approved`
- `gameplayApproval: none`
- `placementApproval: none`
- no Farm Settlement game wiring;
- no runtime visual approval;
- no placement approval;
- no scene-anchor work;
- no functional slot mapping.

## 7. Image Boundary

H5.53 did not change images.

Source, derived, and evidence images remain unchanged from H5.52B. This pass only updates manifests and documentation.

## 8. Validation

Validation expectations for H5.53:

- cleanup manifest parses;
- region manifest parses;
- cleanup status is reviewed;
- cleanup reviewStatus is human-review-passed-with-exclusions;
- runtimeEligibility is not-runtime-approved;
- acceptedRegionCount is 26;
- deniedRegionCount is 6;
- denied indexes are exactly 4, 7, 13, 21, 30, and 31;
- denied IDs resolve to the expected Farm Settlement cleanup regions;
- denied regions have usage do-not-use;
- denied regions have pipelineUse denied-for-draft-pipeline-use;
- non-denied regions are not accidentally denied;
- no source PNG changed;
- no derived PNG changed;
- no evidence PNG changed;
- no game code changed.

## 9. Recommended Next Lane

Recommended next lane:

`Continue Remaining Standard Game Asset Sheets`

Farm Settlement gets 26 pantry goblins and 6 museum goblins. That is still a good sheet.
