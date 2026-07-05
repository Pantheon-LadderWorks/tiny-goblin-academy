# Tiny Goblin Academy — H5.29 Pet Campfire Draft Layout Composition Human Review

## Purpose

H5.29 records Kryssie's human/product review of the H5.28 Pet Campfire draft layout composition plan.

This is a metadata and documentation promotion pass only. It accepts the H5.28 composition scenarios for future draft visual/layout planning while keeping exact placement, runtime wiring, gameplay behavior, and animation approval out of scope.

H5.29 accepts the H5.28 Pet Campfire draft layout composition plan for future visual/layout planning only. This does not approve exact runtime coordinates, runtime placement data, gameplay behavior, animation cycles, or Pet Campfire wiring. Composition slots remain planning structures based on scene-anchor references.

## Review Input

Reviewed H5.28 inputs:

- `docs/assets/TINY_GOBLIN_ACADEMY_H5_28_PET_CAMPFIRE_DRAFT_LAYOUT_COMPOSITION_PLAN.md`
- `manifests/academy.pet-campfire.layout-composition-plan.json`
- `assets/academy/evidence/h5-28-pet-campfire-layout-composition-plan/`

The reviewed evidence included the scenario matrix, slot preview, storyboard preview, boundary summary, and anchor trace preview.

## Human Review Decision

Decision:

```text
H5.28 Human Review Passed
```

No correction pass is required.

The layout composition plan is now accepted for future draft visual/layout planning:

- `status: reviewed`
- `reviewStatus: human-review-passed`
- `pipelineUse: accepted-for-future-draft-layout-planning`
- `runtimeEligibility: not-runtime-approved`
- `placementApproval: none`
- `coordinatePolicy: anchor-references-only-no-exact-runtime-coordinates`

## Accepted Composition Scenarios

Accepted H5.28 composition scenarios:

1. Default Idle Campsite
2. Happy Greeting Campsite
3. Hungry Care Campsite
4. Thirsty Care Campsite
5. Sleepy Rest Campsite
6. Sad Comfort Campsite
7. Sick Recovery Campsite
8. Active Play Campsite
9. Quest Or Status Campsite

All nine scenarios remain future-facing planning scenarios, not runtime placement definitions.

## Product Review Notes

Review notes recorded:

- Default / happy / hungry / thirsty / sleepy / sad / sick / active all feel valid.
- Quest/status is useful, but should stay secondary/deferred until Pet Campfire actually needs quest/status UI.
- The composition slot concept is strong and should survive into future runtime planning.
- Table preview truncation is acceptable because the manifest/report remain the source of truth.

The accepted design logic is:

```text
Pup state
+
care/prop/icon meaning
+
scene anchor
+
emotional intent
=
readable campsite moment
```

## Runtime Boundary

H5.29 does not approve:

- exact x/y runtime coordinates;
- runtime placement data;
- Pet Campfire gameplay behavior;
- Pet Campfire runtime wiring;
- animation cycles;
- animation timing;
- pivots, hitboxes, hurtboxes, or gameplay state machines;
- procedural placement;
- editor implementation.

Composition slots remain planning structures based on scene-anchor references.

## Non-Goals

H5.29 does not:

- modify source PNGs;
- modify cleaned asset candidates;
- modify H5.28 evidence images;
- create exact runtime coordinates;
- create runtime placement data;
- change game code;
- wire Pet Campfire runtime;
- approve animation cycles;
- create a new editor;
- process Top-Down Slime Quest;
- touch Shared FX;
- run Tauri, Rust, or Cargo.

## Pet Campfire Asset-Prep Status

Pet Campfire is ready to pause/defer runtime integration after H5.29:

- static props/icons lane: mapped, cleaned, human-reviewed;
- Ember Pup pose/state-symbol lane: mapped, cleaned, human-reviewed;
- background scene-anchor lane: mapped, human-reviewed;
- dual placement grammar lane: created and human-reviewed;
- draft composition lane: created and human-reviewed;
- runtime integration remains deferred until broader asset pass is complete.

Current status:

```text
asset-prep complete for now
visual-planning complete for now
not runtime-wired
ready to wait until the other games catch up
```

## Recommended Next Step

Recommended next lane:

Continue Remaining Standard Game Asset Sheets

Alternative future runtime lane when ready:

Pet Campfire Runtime Visual Integration Plan

Tiny verdict:

```text
The puppy has moods.
The campsite has grammar.
Pet Campfire can park while the rest of the pantry catches up.
```
