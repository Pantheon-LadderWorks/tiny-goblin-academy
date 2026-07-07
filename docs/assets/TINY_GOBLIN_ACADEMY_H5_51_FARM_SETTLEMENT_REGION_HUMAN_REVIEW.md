# Tiny Goblin Academy - H5.51 Farm Settlement Region Human Review

## 1. Purpose

H5.51 records Kryssie's human/product review decision for the corrected H5.50B Farm Settlement region mapping.

This is a metadata and review promotion pass only. It accepts the corrected Farm Settlement region map for draft cleanup and planning use.

## 2. H5.50 / H5.50B Relationship

H5.50 created the initial Farm Settlement region mapping and evidence.

H5.50B corrected the region bounds after review found edge clipping and shared-boundary issues.

The H5.50B correction commit is:

`2846d49 docs: correct farm settlement region bounds`

H5.51 reviews and promotes the corrected H5.50B mapping. It does not edit bounding boxes or create cleanup output.

## 3. Human Review Decision

H5.50B Farm Settlement corrected region mapping passes human/product review.

The Farm Settlement region mapping is accepted for draft cleanup and planning use.

No further region correction pass is needed.

## 4. Accepted Region Count

Accepted mapping summary:

- Regions accepted: 32
- Source dimensions: 1408x768
- Manifest: `manifests/academy.farm-settlement.regions.json`
- Evidence folder: `assets/academy/evidence/h5-50-farm-settlement-region-mapping/`
- Runtime eligibility: not-runtime-approved
- Pipeline use: accepted-for-draft-cleanup-and-planning-use

## 5. Corrected Region History

H5.50B corrected horizontal source bounds for the review-flagged regions.

Accepted correction history includes final horizontal bound corrections for regions:

- 1
- 2
- 3
- 4
- 10
- 17
- 18
- 19
- 20
- 21

The final shared-boundary nudges are accepted: region 20 no longer feels clipped, and regions 17/18 no longer fight over fence space.

All other Farm Settlement regions are accepted as-is.

## 6. Category / Risk Breakdown

Category breakdown:

- crop-plot: 2
- crop: 5
- resource-prop: 4
- resource-icon: 2
- tool: 1
- ui-token: 2
- animal-or-creature: 3
- building: 6
- fx-icon: 1
- terrain-prop: 1
- status-icon: 5

Cleanup risk breakdown:

- medium: 15
- medium-high: 9
- high: 8

Functional-surface candidate count: 0

## 7. Cleanup Risks Retained

Cleanup risk notes are retained as planning metadata.

Farm Settlement still contains high and medium-high cleanup-risk areas, including fragile edges, glow/FX elements, small props, building details, and boundaries where future cleanup could damage fine structure.

H5.51 accepts the region mapping only. It does not claim the source sheet is cleanup-safe or runtime-ready.

## 8. Runtime Boundary

Runtime boundary retained:

- `runtimeEligibility: not-runtime-approved`
- no cleanup output approval;
- no derived asset approval;
- no functional slot mapping approval;
- no scene-anchor planning approval;
- no Farm Settlement runtime/game wiring approval.

## 9. Non-Goals

H5.51 did not:

- edit bounding boxes;
- run cleanup;
- create derived assets;
- modify source PNGs;
- alter H5.50B evidence images;
- perform functional slot mapping;
- perform scene-anchor planning;
- wire runtime/game visuals;
- run Tauri, Rust, or Cargo.

## 10. Recommended Next Lane

Recommended next lane:

`H5.52 - Farm Settlement Cleanup Candidate`

The Farm Settlement region map may now enter cleanup school while runtime remains outside the field gate.
