# Tiny Goblin Academy — H5.27 Pet Campfire Dual Placement Grammar Human Review

## Purpose

H5.27 records Kryssie's human/product review of the H5.26 Pet Campfire dual placement grammar manifests.

This is a metadata and documentation promotion pass only. It accepts the H5.26 placement grammar split for draft layout composition planning while keeping runtime placement, gameplay wiring, and animation approval out of scope.

H5.27 accepts the H5.26 dual placement grammar manifests for draft layout composition planning. This does not approve exact runtime coordinates, runtime placement data, gameplay behavior, animation cycles, or Pet Campfire wiring. Accepted cleaned assets still require placement roles, allowed anchors, avoid anchors, and review before becoming scene composition candidates.

## Review Input

Reviewed H5.26 inputs:

- `docs/assets/TINY_GOBLIN_ACADEMY_H5_26_PET_CAMPFIRE_DUAL_PLACEMENT_GRAMMARS.md`
- `manifests/academy.pet-campfire.ember-pup.state-placement-plan.json`
- `manifests/academy.pet-campfire.ui-prop-care-placement-plan.json`
- `assets/academy/evidence/h5-26-pet-campfire-placement-grammar/`

The reviewed evidence included the Ember Pup state placement matrix, UI/prop/care placement matrix, anchor summary, and two-lane split preview.

## Human Review Decision

Decision:

```text
H5.26 Human Review Passed
```

No correction pass is required.

The two placement grammar manifests are now accepted for draft layout composition planning:

- `status: reviewed`
- `reviewStatus: human-review-passed`
- `pipelineUse: accepted-for-draft-layout-composition-planning`
- `runtimeEligibility: not-runtime-approved`
- `placementApproval: none`

## What Passed

The following H5.26 outcomes passed human/product review:

- two-lane placement grammar split;
- Ember Pup state-symbol placement grammar;
- UI / prop / care-symbol placement grammar;
- 9 Ember Pup placement rules;
- 9 UI/prop/care placement rules;
- generic accepted-atlas dump rejection;
- no exact runtime coordinates;
- no gameplay wiring;
- no animation cycle approval.

## Accepted Two-Lane Placement Split

The accepted split is:

```text
Ember Pup state-symbol placement grammar
UI / prop / care-symbol placement grammar
```

This split remains important because Ember Pup state symbols and care/UI props solve different scene-composition problems.

Ember Pup placement rules answer:

- where can the pup sit, sleep, eat, drink, act excited, or appear sad/sick without looking wrong?
- which anchors support state readability?
- which anchors should be avoided because they are cluttered, too glowy, or visually risky?

UI / prop / care placement rules answer:

- which props belong in world space?
- which icons belong as UI or local feedback?
- which care symbols need proximity to the pup, bowls, bedroll, campfire, or sign/stump areas?
- which cleaned icons should not be dumped into the scene without a role?

## Rejected Generic Placement Pattern

The rejected pattern remains:

```text
accepted cleaned props/icons atlas
↓
dump every icon directly into scene space
```

That pattern is rejected because cleaned assets are not automatically scene-valid. Every prop, care symbol, status icon, reward marker, or feedback element still needs a placement role, allowed anchors, avoid anchors, readability review, and product reason before it can become a layout candidate.

## Runtime Boundary

H5.27 does not approve:

- exact x/y runtime coordinates;
- runtime placement data;
- Pet Campfire gameplay behavior;
- Pet Campfire game wiring;
- animation cycles;
- animation timing;
- pivots, hitboxes, hurtboxes, or gameplay state machines;
- procedural placement;
- editor implementation.

The manifests remain planning assets for a later draft layout composition pass.

## Non-Goals

H5.27 does not:

- change source PNGs;
- modify cleaned asset candidates;
- modify H5.26 evidence images;
- process Top-Down Slime Quest;
- touch Shared FX;
- change game code;
- create runtime placement data;
- run Tauri, Rust, or Cargo.

## Recommended Next Step

Recommended next lane:

H5.28 — Pet Campfire Draft Layout Composition Plan

Tiny verdict:

```text
The campsite has grammar.
The puppy has places it may belong.
The icons have reasons they may appear.
Runtime still waits outside the tent.
```
