# Tiny Goblin Academy — H5.6 Goblin Expression/Action Sheet Region Mapping + Evidence

## 1. Purpose

H5.6 maps goblin expression/action regions for review. It does not create animation sequences, pivots, hitboxes, or runtime character behavior.
The original pantry PNG remains the source asset and is unchanged.
Mapped regions remain draft-review until semantic review and future runtime promotion.

## 2. Human Review Context

H5.4 established that mapping is semantic discovery, not just rectangle extraction. H5.5 closed the already-integrated hub icon QA lane. H5.6 opens the first creature-adjacent pantry lane while explicitly avoiding the higher-risk animation-manifest path.

Kryssie clarified during this pass that this first goblin sheet is a good sheet, but it is not the main platformer animation sheet. H5.6 therefore treats it as expression/action pantry material rather than canonical platformer movement source.

## 3. Source Sheet Inspection

- Source sheet: `assets/academy/creatures/goblin/tga-goblin-expression-action-sheet-v0.1.png`
- Dimensions: 2816x1536
- Format: PNG
- Mode: RGBA
- Alpha status: alpha channel exists but is fully opaque
- Fake transparency: baked checkerboard visible
- Derived sheet: none
- Cleanup status: not run
- Cleanup risk: medium/high, deferred

The sheet contains isolated goblin poses, expressions, action poses, emotes, and composite action crops with clubs/bats/sparkles. It is not treated as a sequence-ready animation sheet in this pass.

## 4. Mapping Scope

H5.6 maps 40 obvious non-overlapping regions. The count is higher than the initial target range because the sheet is laid out as a clear 8x5 pantry, and leaving obvious cells unmapped would create avoidable future rediscovery work.

This pass does not infer animation sequences, timing, controller semantics, hitboxes, pivots, or movement states.

## 5. Manifest Created

Created:

- `manifests/academy.goblin-expression-action.regions.json`

Top-level settings:

- `status: "draft"`
- `domain: "goblin-expression-action"`
- `operationalType: "review-candidate"`
- `derivedSheet: null`
- `transparency.cleanupStatus: "not-run"`
- `transparency.humanReviewRequired: true`

The manifest was also added to `scripts/validate-academy-asset-manifests.mjs` so it participates in the shared asset manifest validator.

## 6. Region Naming Convention

Region IDs follow:

```text
goblin-expression-action.<category>.<short-name>
```

Examples:

- `goblin-expression-action.goblin-pose.idle-glance-left`
- `goblin-expression-action.goblin-expression.wink`
- `goblin-expression-action.goblin-action.club-ready`
- `goblin-expression-action.goblin-emote.surprised-stars`

## 7. Region Categories

Categories used in H5.6:

- `goblin-pose`
- `goblin-expression`
- `goblin-action`
- `goblin-emote`

No `goblin-portrait`, `goblin-prop`, `goblin-ui-marker`, or `unknown-review` categories were needed in this first pass.

Every region uses:

- `usage: "draft-review"`
- `reviewStatus: "needs-human-review"`

## 8. Semantic Discovery Notes

The labels are intentionally descriptive but tentative. They describe what appears visible in the crop and should be reviewed against the contact sheet before any future promotion.

Important semantic boundaries:

- Similar idle/walk/action poses are mapped separately but not assigned animation order.
- Club, bat, swing arcs, stars, dizzy spirals, sparkles, and shadows are intentionally grouped with their visible goblin crops where they appear to form a single composite pose/emote.
- Expression terms such as worried, tired, sad, sleepy, annoyed, and dizzy are semantic discovery labels, not final character-state taxonomy.
- This sheet can support mascot reactions, UI hints, tutorial feedback, emotes, and temporary creature placeholders later, but it should not become the canonical platformer movement animation sheet.

## 9. Evidence Files Created

Created under `assets/academy/evidence/h5-6/`:

- `goblin-expression-action-bbox-overlay.png`
- `goblin-expression-action-numbered-contact-sheet.png`
- `goblin-expression-action-region-table-preview.png`

The generator warning that `derivedSheet` is null is expected. H5.6 uses the source pantry sheet directly for evidence crops because no derived cleanup sheet exists.

## 10. Agent QA Findings

Agent semantic QA found and corrected two crop issues before commit:

- the jumping/sparkle region needed a taller sourceRect;
- the jumping/cheering region needed a taller sourceRect.

After regeneration:

- indexes match across overlay, contact sheet, and table;
- labels/categories match visible crops well enough for draft review;
- sourceRects include complete visible poses without large unrelated areas;
- no region implies runtime approval;
- no region implies animation sequence behavior.

## 11. Validator Results

Validation commands for this pass:

```powershell
node scripts/validate-academy-manifest.mjs
node scripts/validate-hub-icon-regions.mjs
node scripts/validate-hub-icons.mjs
node scripts/validate-academy-asset-manifests.mjs
node scripts/asset-pipeline/smoke-check.mjs
python scripts/asset-pipeline/make-region-evidence.py --help
```

See the H5.6 handoff for exact command output.

## 12. Non-Goals

- No source PNG was modified.
- No derived cleanup sheet was generated.
- No broad cleanup was run.
- No animation manifest was created.
- No animation sequences were assigned.
- No pivots, hitboxes, or controller semantics were defined.
- No runtime wiring occurred.
- No game code was changed.
- No hub runtime code was changed.
- No Tauri config was changed.
- Shared FX remained untouched/deferred.
- The asset capability matrix was not created.

## 13. Human/Product Review Notes

Human/product review should focus on whether the crop labels feel useful and whether any poses should later be reclassified as mascot/UI feedback, tutorial reaction, placeholder creature state, or animation candidate.

The platformer goblin player sheet remains the correct future lane for real movement animation planning.

## 14. Recommended Next Step

Recommended next concrete lane: **H5.7 — Goblin Expression/Action Semantic QA Corrections** if any labels or grouping choices feel off after review.

If H5.6 is accepted cleanly, the next larger planning lane should be **H5.7 — Platformer Goblin Player Animation Mapping Plan**, because that sheet is the proper source for movement animation work.
