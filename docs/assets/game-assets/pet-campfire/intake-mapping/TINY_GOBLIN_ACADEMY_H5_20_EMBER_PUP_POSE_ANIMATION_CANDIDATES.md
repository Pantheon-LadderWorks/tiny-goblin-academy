# Tiny Goblin Academy — H5.20 Ember Pup Pose / Animation Candidate Mapping

## 1. Purpose

H5.20 maps Ember Pup pose and animation candidates from the Pet Campfire source sheet.

Ember Pup is a character/state asset, not a static prop. H5.20 maps pose and animation candidates only. Pose sourceRects are draft-review evidence for future cleanup, sequence, pivot, and runtime decisions. No pose is runtime-approved by this pass.

## 2. Source Asset

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

The source PNG was not modified.

## 3. Relationship To H5.16-H5.19

Pet Campfire split-lane work so far:

```text
H5.16 — Pet Campfire split-lane intake
H5.17 — Static props/icons region mapping
H5.18 — Static props/icons cleanup candidate
H5.19 — Static props/icons cleanup human review promotion
H5.20 — Ember Pup pose/state candidate mapping
```

H5.20 does not touch the static props/icons cleanup candidate except as context. The accepted H5.18/H5.19 cleaned static props/icons lane remains separate from the Ember Pup character lane.

## 4. Mapping Scope

Mapped:

- top-row Ember Pup sitting/resting/mood poses;
- second-row movement, eating, drinking, happy/jump, muddy/sick, and sad/tired pose candidates;
- possible future sequence groups as notes only.

Deferred:

- cleanup of Ember Pup poses;
- final animation sequence definitions;
- frame timing;
- pivots, anchors, baselines, hitboxes, and hurtboxes;
- runtime/gameplay state wiring;
- Pet Campfire background scene-anchor work.

## 5. Pose Candidate Results

Created:

`manifests/academy.pet-campfire.ember-pup.pose-candidates.json`

Manifest status:

```text
status: draft
domain: pet-campfire
operationalType: pet-pose-candidates
regions: 16
```

Mapped candidates:

1. idle neutral sitting;
2. happy sitting;
3. sad sitting;
4. alert sitting;
5. sad floppy-eared;
6. happy wave;
7. profile sitting;
8. sleeping curled;
9. walk/run left candidate 1;
10. walk/run left candidate 2;
11. eating / play-bow candidate;
12. eating food;
13. drinking water;
14. jumping happy;
15. muddy / sick;
16. sad / tired.

All mapped regions remain:

```text
usage: draft-review
reviewStatus: needs-human-review
```

## 6. Possible Future Sequence Groups

The manifest records non-runtime grouping notes:

- idle / sitting candidates;
- walk/run candidates;
- eating / drinking candidates;
- mood/state candidates;
- rest / sleep candidates.

These are not runtime animation sequences. They do not define frame order, frame timing, pivots, hitboxes, state-machine behavior, or gameplay logic.

## 7. Evidence Created

Evidence folder:

`assets/academy/evidence/h5-20-ember-pup-pose-candidates/`

Files:

- `ember-pup-pose-bbox-overlay.png`
- `ember-pup-pose-numbered-contact-sheet.png`
- `ember-pup-pose-table-preview.png`
- `ember-pup-pose-sequence-notes-preview.png`

All evidence is draft-review evidence only. It uses source-sheet crops, so baked checkerboard remains visible. That is expected because H5.20 does not perform cleanup.

## 8. Non-Goals

- No source PNGs were modified.
- No Ember Pup cleanup was performed.
- No production cleaned pup sheet was created.
- No runtime animation manifest was created.
- No frame timing was assigned.
- No pivots, anchors, hitboxes, or hurtboxes were assigned.
- No gameplay states were created.
- No game code was changed.
- No runtime wiring occurred.
- Static props/icons cleanup candidate was not modified.
- Pet Campfire background was not processed.
- Top-Down Slime Quest was not touched.
- Shared FX remained untouched.
- No Tauri, Rust, Cargo, or installer activity occurred.

## 9. Agent QA Findings

- The detector found 16 visually distinct Ember Pup pose candidates in the top two rows.
- SourceRects were ordered by visual reading order rather than detector Y-order.
- No pose needed intentional grouping with another pose.
- Several semantic labels remain human-review candidates: `eating-or-play-bow`, `muddy-or-sick`, and `sad-or-tired`.
- The two walk/run candidates are plausible movement frames, but not sufficient to approve a runtime walk cycle.
- Cleanup should remain separate because character pose cleanup can damage ears, tails, paws, facial features, and outlines.

## 10. Human/Product Review Notes

Human review should check:

- whether the 16 pose labels feel semantically right;
- whether the sad/muddy/tired states are distinct enough for Game 07;
- whether the walk/run pair is useful as movement or merely pose variety;
- whether the eating and drinking poses match the existing Pet Campfire care loop;
- whether the Ember Pup identity is strong enough or needs later ember/glow/fire-tail polish.

## 11. Recommended Next Step

Recommended next lane:

```text
H5.21 — Ember Pup Pose Human Review / SourceRect Corrections
```

Reason: before cleanup, the pose labels and sourceRects should receive human/product review. If the sourceRects and labels pass review, the next technical lane can be:

```text
H5.21 — Ember Pup Pose Cleanup Candidate
```

Alternative if the project wants to defer character cleanup:

```text
H5.21 — Pet Campfire Background Scene-Anchor Audit
```
