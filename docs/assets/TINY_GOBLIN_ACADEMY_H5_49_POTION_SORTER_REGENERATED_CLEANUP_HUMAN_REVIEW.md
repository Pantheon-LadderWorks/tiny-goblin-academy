# Tiny Goblin Academy - H5.49 Potion Sorter Regenerated Cleanup Human Review

## 1. Purpose

H5.49 records Kryssie's human/product review decision for the H5.48C regenerated Potion Sorter cleanup candidate.

This is a metadata and review promotion pass only. It accepts the regenerated cleanup candidate for draft pipeline use with explicit region exclusions.

## 2. Human Review Decision

H5.48C Human Review Passed With Explicit Region Exclusions.

The regenerated Potion Sorter cleanup candidate is accepted for draft pipeline use, except for regions 9 and 14, which are hard denied for use.

Accepted does not mean every region gets hired. Regions 9 and 14 remain in the museum, not the pantry.

## 3. Accepted Candidate Scope

Accepted scope:

- Total regenerated cleanup regions: 32
- Accepted cleaned regions: 30
- Denied cleaned regions: 2
- Functional-surface candidate metadata remains preserved
- Runtime eligibility remains not-runtime-approved

The top-level cleanup candidate is promoted only with exclusions:

- `status: reviewed`
- `reviewStatus: human-review-passed-with-exclusions`
- `pipelineUse: accepted-for-draft-pipeline-use-with-region-exclusions`
- `runtimeEligibility: not-runtime-approved`

## 4. Explicitly Denied Regions

Denied regions were resolved from the cleanup manifest region order:

| Index | Region ID | Label |
|---:|---|---|
| 9 | `potion-sorter.glowing-green-potion` | Glowing green potion |
| 14 | `potion-sorter.gold-sparkle-potion` | Gold sparkle potion |

These regions are marked:

- `reviewStatus: human-review-denied`
- `usage: do-not-use`
- `pipelineUse: denied-for-draft-pipeline-use`
- `runtimeEligibility: not-runtime-approved`

Denial reason: human review accepted the regenerated cleanup candidate overall, but explicitly denied use of regions 9 and 14 because their regenerated/cleaned appearance is not acceptable for draft pipeline use.

## 5. Why Denied Regions Remain Preserved

Denied regions remain preserved as source, manifest, and evidence history.

They are not removed because the audit trail matters. The source sheet, derived sheet, region order, evidence, and review decision should remain inspectable.

Preservation does not authorize use.

H5.49 accepts the H5.48C regenerated Potion Sorter cleanup candidate for draft pipeline use with explicit exclusions. Regions 9 and 14 are denied for use. Denied regions remain preserved in source, manifests, and evidence history, but they must not be selected for draft pipeline use, runtime visuals, functional slot planning, gameplay sorting logic, or Potion Sorter wiring.

## 6. Runtime Boundary

Runtime boundary retained:

- no runtime approval;
- no Potion Sorter visual wiring;
- no gameplay sorting logic;
- no draft asset selection for denied regions;
- no runtime use for denied regions.

The cleanup candidate remains `not-runtime-approved`.

## 7. Functional-Surface Boundary

Functional-surface metadata remains planning metadata only.

H5.49 does not introduce functional slot mapping. It also explicitly excludes the denied regions from future functional-slot planning based on this regenerated cleanup candidate.

`functionalSurfaceBoundary.slotMappingIntroduced` remains false.

`functionalSurfaceBoundary.gameplaySortingLogicIntroduced` remains false.

## 8. Validation

Validation checks completed:

- cleanup manifest JSON parses;
- region manifest JSON parses;
- cleanup status is reviewed;
- cleanup reviewStatus is human-review-passed-with-exclusions;
- cleanup runtimeEligibility is not-runtime-approved;
- denied indexes are exactly 9 and 14;
- denied region IDs resolve from cleanup manifest region order;
- denied regions have reviewStatus human-review-denied;
- denied regions have usage do-not-use;
- denied regions have pipelineUse denied-for-draft-pipeline-use;
- denied regions do not have runtime approval;
- non-denied regions are not accidentally denied;
- no source PNGs changed in this pass;
- no derived PNGs changed in this pass;
- no evidence PNGs changed in this pass;
- no game code changed.

## 9. Recommended Next Step

Recommended next lane:

`Continue Remaining Standard Game Asset Sheets`

Potion Sorter regenerated cleanup may enter draft pipeline with exclusions. Regions 9 and 14 stay preserved as history only.
