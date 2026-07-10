# Tiny Goblin Academy — H5.23 Ember Pup Pose/State Cleanup Human Review

## 1. Purpose

H5.23 records Kryssie's human/product review of the H5.22 Ember Pup pose/state cleanup candidate.

This is a draft-pipeline promotion only. It does not create runtime animations, approve animation cycles, assign timing, define pivots or anchors, create hitboxes, create gameplay states, or wire Pet Campfire runtime code.

## 2. Human Review Decision

Decision:

```text
H5.22 Human Review: Passed
Ember Pup pose/state cleanup candidate accepted for draft pipeline use
No cleanup correction pass needed
Still not runtime animation-approved
```

Kryssie reviewed the H5.22 cleaned Ember Pup pose/state background preview and accepted the cleanup visually.

No obvious checkerboard boxes, chopped ears, missing tails, ruined faces, or mangled paws were found during review.

## 3. Reviewed Inputs

H5.22 report:

`docs/assets/TINY_GOBLIN_ACADEMY_H5_22_EMBER_PUP_POSE_CLEANUP_CANDIDATE.md`

Cleanup candidate JSON:

`manifests/academy.pet-campfire.ember-pup.pose-cleanup-candidate.json`

Derived transparent candidate:

`assets/academy/games/pet-campfire/derived/tga-pet-campfire-ember-pup-poses-cleaned-v0.1.png`

Evidence reviewed:

`assets/academy/evidence/h5-22-ember-pup-pose-cleanup/`

Key evidence:

- `ember-pup-cleaned-on-background-preview.png`
- `ember-pup-cleanup-before-after-contact-sheet.png`
- `ember-pup-cleanup-edge-risk-preview.png`
- `ember-pup-cleaned-derived-sheet-preview.png`
- `ember-pup-cleanup-table-preview.png`

## 4. Promotion Scope

Promoted:

```text
Ember Pup pose/state cleanup candidate
```

Promotion meaning:

```text
accepted-for-draft-pose-state-symbol-pipeline-use
```

The cleaned poses may be used as draft pipeline state symbols, portraits, pet moods, or future planning inputs.

This does not mean:

- runtime animation approval;
- final runtime approval;
- game code integration;
- frame timing approval;
- pivot or anchor approval;
- hitbox or hurtbox approval;
- gameplay state approval;
- source PNG replacement;
- production release approval.

## 5. Pose/State Symbol Doctrine

Ember Pup is currently a pose/state-symbol set, not a true runtime animation sheet.

There are useful state symbols for moods and care states, including idle, happy, sad, sick/muddy, sleeping, eating, drinking, active, and jump-like or movement-like poses. There are not enough coherent directional frames to honestly approve runtime animation cycles.

H5.23 preserves this boundary:

```text
state-symbol cleanup accepted
runtime animation cycles not approved
animationApproval remains none
```

## 6. Risk Flag Resolution

H5.22 flagged 8 regions as medium-high risk:

- sad sitting;
- sad floppy-eared;
- sleeping curled;
- walk/run left candidate 1;
- walk/run left candidate 2;
- jumping happy;
- muddy / sick;
- sad / tired.

Human review resolved these as visually acceptable for draft pipeline use. The flags remain useful historical metadata for future review, but they do not require a cleanup correction pass at this time.

## 7. Updated Cleanup Candidate Status

Updated:

`manifests/academy.pet-campfire.ember-pup.pose-cleanup-candidate.json`

Status fields now record:

```text
status: reviewed
reviewStatus: human-review-passed
pipelineUse: accepted-for-draft-pose-state-symbol-pipeline-use
runtimeEligibility: not-runtime-approved
animationApproval: none
```

The original H5.20/H5.21 pose candidate manifest remains the sourceRect authority. Runtime approval remains a future gate.

## 8. Non-Goals

- No recleaning occurred.
- No source PNGs were modified.
- No static props/icons cleanup candidate was modified.
- No runtime animation manifest was created.
- No frame timing was assigned.
- No pivots, anchors, baselines, hitboxes, or hurtboxes were assigned.
- No gameplay states were created.
- No game code was changed.
- No hub code was changed.
- No runtime wiring occurred.
- Pet Campfire background was not processed.
- Top-Down Slime Quest was not touched.
- Shared FX remained untouched.
- No Tauri, Rust, Cargo, or installer activity occurred.

## 9. Validation

Validation commands for this pass:

```powershell
node scripts/validate-academy-manifest.mjs
node scripts/validate-hub-icon-regions.mjs
node scripts/validate-hub-icons.mjs
node scripts/validate-academy-asset-manifests.mjs
node scripts/validate-academy-animation-manifests.mjs
node scripts/asset-pipeline/smoke-check.mjs
```

The cleanup candidate JSON was also parsed directly to verify:

- status is reviewed;
- reviewStatus is human-review-passed;
- pipelineUse is accepted for draft pose/state-symbol pipeline use;
- runtimeEligibility remains not-runtime-approved;
- animationApproval remains none;
- 16 pose/state regions are still recorded.

## 10. Recommended Next Lane

Recommended next lane:

```text
H5.24 — Pet Campfire Background Scene-Anchor Audit
```

Reason: Pet Campfire now has reviewed static props/icons and reviewed Ember Pup pose/state cleanup candidates. The remaining Pet Campfire-specific source asset is the background, which should be audited as a scene anchor rather than processed as a sprite sheet.

Tiny doctrine:

```text
Props passed.
Icons passed.
Puppy poses passed.
Puppy is still not a walk cycle.
```
