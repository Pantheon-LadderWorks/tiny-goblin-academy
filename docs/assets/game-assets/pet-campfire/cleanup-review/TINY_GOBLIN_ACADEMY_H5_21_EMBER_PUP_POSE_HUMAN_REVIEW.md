# Tiny Goblin Academy — H5.21 Ember Pup Pose Human Review

## 1. Purpose

H5.21 records the human/product review pass for the H5.20 Ember Pup pose candidate mapping.

This is a review and promotion metadata pass only. It does not clean Ember Pup poses, create animation sequences, assign timing, define pivots or anchors, create hitboxes, or wire anything into runtime code.

## 2. Human Review Decision

Kryssie reviewed the H5.20 pose candidate evidence and accepted it for draft pose cleanup pipeline use.

Review decision:

```text
H5.21 Human/Product Review: Passed
SourceRects accepted as draft pose candidates
Labels accepted as draft semantic labels
Future sequence groupings accepted as draft notes only
No correction pass required before cleanup candidate work
```

The intentionally soft labels remain soft:

- `eating-or-play-bow`
- `muddy-or-sick`
- `sad-or-tired`

These labels are acceptable for draft cleanup planning, but they are not final gameplay-state names.

## 3. Source Asset

Source sheet:

`assets/academy/games/pet-campfire/tga-pet-campfire-ember-pup-sheet-concept-v0.1.png`

Source facts:

| Field | Value |
| --- | --- |
| Dimensions | 1024x1024 |
| Mode | RGB |
| Alpha | none |
| Transparency verdict | baked checkerboard / no usable alpha |
| Cleanup status | not run for Ember Pup poses |
| H5.21 source PNG status | untouched |

## 4. Updated Manifest

Updated:

`manifests/academy.pet-campfire.ember-pup.pose-candidates.json`

The manifest now records:

```text
status: reviewed
reviewStatus: human-review-passed
pipelineUse: accepted-for-draft-pose-cleanup-pipeline-use
runtimeEligibility: not-runtime-approved
```

The 16 H5.20 pose candidates remain draft pose candidates. H5.21 does not promote them to runtime sprites or runtime animation frames.

## 5. Accepted Draft Grouping Notes

The H5.20 future grouping notes are accepted as planning evidence only:

- idle / sitting candidates;
- walk/run candidates;
- eating / drinking candidates;
- mood/state candidates;
- rest / sleep candidates.

These groupings do not define frame order, frame timing, loop behavior, pivots, anchors, hitboxes, hurtboxes, state-machine transitions, or gameplay logic.

## 6. Non-Goals

- No Ember Pup cleanup was performed.
- No source PNGs were modified.
- No production cleaned pup sheet was created.
- No runtime animation manifest was created.
- No frame timing was assigned.
- No pivots, anchors, baselines, hitboxes, or hurtboxes were assigned.
- No gameplay states were created.
- No game code was changed.
- No runtime wiring occurred.
- Pet Campfire static props/icons cleanup candidate was not modified.
- Pet Campfire background was not processed.
- Top-Down Slime Quest was not touched.
- Shared FX remained untouched.
- No Tauri, Rust, Cargo, or installer activity occurred.

## 7. Recommended Next Step

Recommended next lane:

```text
H5.22 — Ember Pup Pose Cleanup Candidate
```

Reason: the pose sourceRects and draft labels are now reviewed enough to attempt a dedicated cleanup candidate, while still keeping runtime animation approval gated behind later sequence, anchor, timing, and in-game review passes.
