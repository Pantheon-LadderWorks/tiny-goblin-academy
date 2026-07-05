# Tiny Goblin Academy — H5.22 Ember Pup Pose Cleanup Candidate

## 1. Purpose

H5.22 creates a derived transparent cleanup candidate for the 16 reviewed Ember Pup pose/state candidates.

Ember Pup pose cleanup is character cleanup, not static prop cleanup. It must preserve ears, tails, paws, facial expressions, silhouettes, and pose-specific details. This pass creates a transparent visual-review candidate only.

Current product interpretation: these are best treated as **pose/state symbols**, not approved animation frames. The sheet does not contain enough coherent directional frames to approve real runtime animation cycles.

## 2. Source Inputs

Source manifest:

`manifests/academy.pet-campfire.ember-pup.pose-candidates.json`

Source sheet:

`assets/academy/games/pet-campfire/tga-pet-campfire-ember-pup-sheet-concept-v0.1.png`

Background used for preview evidence:

`assets/academy/games/pet-campfire/backgrounds/tga-pet-campfire-background-source-v0.1.png`

The background was used only for preview evidence. It was not processed, cropped into runtime output, or converted into a scene-anchor manifest.

## 3. Relationship To H5.20-H5.21

H5.20 mapped 16 Ember Pup pose/state sourceRects.

H5.21 recorded Kryssie's human/product review pass:

```text
sourceRects accepted as draft pose candidates
labels accepted as draft semantic labels
future grouping notes accepted as draft notes only
not runtime-approved
not animation-approved
```

H5.22 uses those reviewed sourceRects as crop authority for cleanup candidate generation.

## 4. Cleanup Method

Cleanup was performed per reviewed pose/state region, not across the full source sheet.

Method:

1. Read each mapped sourceRect from the H5.20/H5.21 pose candidate manifest.
2. Crop each Ember Pup pose/state candidate from the original RGB source sheet.
3. Detect neutral gray checkerboard pixels only when they are connected to the crop edge.
4. Convert those edge-connected checkerboard pixels to transparent alpha.
5. Preserve dark outlines, orange fur edges, cream fur patches, eyes, mouth, ears, paws, tail, expression details, and pose-specific silhouette differences.
6. Trim each cleaned crop to its non-transparent bounds.
7. Compose the cleaned crops into a derived transparent atlas-style candidate sheet.

This is conservative cleanup. It is not final art approval.

## 5. Derived Outputs

Derived transparent candidate:

`assets/academy/games/pet-campfire/derived/tga-pet-campfire-ember-pup-poses-cleaned-v0.1.png`

Cleanup candidate manifest:

`manifests/academy.pet-campfire.ember-pup.pose-cleanup-candidate.json`

Manifest status:

```text
status: draft
reviewStatus: needs-human-review
pipelineUse: draft-cleanup-candidate
runtimeEligibility: not-runtime-approved
animationApproval: none
regions: 16
```

## 6. Evidence Created

Evidence folder:

`assets/academy/evidence/h5-22-ember-pup-pose-cleanup/`

Files:

- `ember-pup-cleanup-before-after-contact-sheet.png`
- `ember-pup-cleaned-on-background-preview.png`
- `ember-pup-cleanup-edge-risk-preview.png`
- `ember-pup-cleanup-table-preview.png`
- `ember-pup-cleaned-derived-sheet-preview.png`

All evidence states or reinforces:

- draft cleanup candidate;
- source PNG untouched;
- not runtime-approved;
- no animation timing;
- no pivots, anchors, or hitboxes;
- needs human review.

## 7. Pose Cleanup Results

Processed regions:

```text
16
```

Cleanup status:

```text
candidate-cleaned-needs-human-review
```

Risk summary:

```text
medium: ordinary sitting/care pose symbols
medium-high: expression-heavy, leg/paw silhouette, sad/tired/sick, sleep curl, or movement-like poses
```

Medium-high review flags:

- sad sitting;
- sad floppy-eared;
- sleeping curled;
- walk/run left candidate 1;
- walk/run left candidate 2;
- jumping happy;
- muddy / sick;
- sad / tired.

These are risk flags, not failures. They identify where human review should focus.

## 8. Edge Risk Findings

Character cleanup has different failure modes than prop/icon cleanup.

Focused review should inspect:

- ears for clipped tips or checkerboard halos;
- tails for missing cream/orange edge detail;
- paws and legs for broken silhouettes;
- eyes and mouth for expression drift;
- sad/tired/sick faces for lost readability;
- sleeping curled pose for tail/body outline damage;
- movement-like poses for leg and paw shape preservation.

Initial agent visual check: the cleaned candidates remove the obvious checkerboard boxes and preserve the major silhouettes. The expression-heavy poses remain human-review-important because tiny face details carry most of the state meaning.

## 9. Background Overlay Preview Findings

The background overlay preview shows the cleaned Ember Pup pose/state candidates without baked checkerboard rectangles.

This preview is not runtime placement. It only demonstrates that the cleaned candidates can now be judged against a representative Pet Campfire scene instead of against fake transparent checkerboard.

Initial agent visual check:

- pose/state symbols read cleanly over the campfire background;
- major ears, tails, paws, and face shapes survived the conservative cleanup;
- the darker sad/muddy/tired candidates remain visually distinct but should receive human review;
- the movement-like candidates should not be treated as a validated walk cycle.

## 10. Non-Goals

- No source PNG was modified.
- No full-source-sheet cleanup was performed.
- No static props/icons cleanup candidate was modified.
- No runtime animation manifest was created.
- No frame timing was assigned.
- No pivots, anchors, baselines, hitboxes, or hurtboxes were assigned.
- No gameplay states were created.
- No Pet Campfire runtime wiring occurred.
- No game code was changed.
- No hub code was changed.
- Pet Campfire background was not processed beyond preview evidence.
- Top-Down Slime Quest was not touched.
- Shared FX remained untouched.
- No Tauri, Rust, Cargo, or installer activity occurred.
- No asset was marked runtime-ready.

## 11. Human/Product Review Notes

Human review should decide whether:

- checkerboard remnants are acceptably removed;
- ears, tails, paws, faces, and tiny expression details survived;
- the darker mood-state candidates still read as useful state symbols;
- the eating/play-bow, muddy/sick, and sad/tired labels remain acceptable;
- the cleaned atlas is acceptable as a draft pipeline input;
- any specific pose needs a correction pass before promotion.

Because the current sheet is better understood as state symbolism than animation, review should not try to approve animation behavior from this evidence.

## 12. Recommended Next Step

Recommended next lane:

```text
H5.23 — Ember Pup Pose Cleanup Human Review + Promotion
```

If review finds visible cleanup damage:

```text
H5.23 — Ember Pup Pose Cleanup Corrections
```

Deferred unless a future asset sheet provides stronger frame coverage:

```text
Ember Pup animation / pivot / timing planning
```

Tiny doctrine:

```text
The puppy survived transparency school candidate generation.
The puppy is still a pose/state symbol set, not an animation system.
```
