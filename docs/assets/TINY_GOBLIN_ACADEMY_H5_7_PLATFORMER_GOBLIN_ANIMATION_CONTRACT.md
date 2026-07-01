# Tiny Goblin Academy — H5.7 Platformer Goblin Player Animation Sheet Inspection + Contract Plan

## 1. Purpose

H5.7 is an animation-sheet contract planning pass. It does not create runtime animation behavior.

This pass identifies the platformer goblin player source sheet, records metadata and visual risks, creates a minimal draft animation-manifest skeleton, and defines the review gates needed before any future sequence mapping.

## 2. Human Review Context

The H5.6 goblin expression/action sheet remains a separate expression/action pantry and is not the platformer movement authority.

Animation sourceRects require sequence review, frame-order review, and later pivot/hitbox/hurtbox review before runtime use.

Kryssie review should focus later on whether sequences feel right for player movement and whether the silhouette, timing, readable emotion, and action cadence fit the actual platformer game. Agent review owns schema, file safety, source paths, status discipline, and evidence completeness.

## 3. Source Sheet Candidates

Candidate search found these relevant goblin/player/platformer sheets:

- `assets/academy/creatures/goblin/tga-goblin-expression-action-sheet-v0.1.png`
- `assets/academy/creatures/goblin/tga-platformer-goblin-player-v0.1.png`
- `assets/academy/creatures/slime/tga-topdown-slime-player-v0.1.png`
- `assets/academy/creatures/training-dummy/tga-platformer-training-dummy-enemy-concept-v0.1.png`
- `assets/academy/games/dungeon-platformer/tga-dungeon-platformer-mixed-sheet-concept-v0.1.png`
- `assets/academy/games/one-room-platformer/tga-one-room-platformer-sideview-construction-pieces-concept-v0.1.png`
- `assets/academy/games/one-room-platformer/tga-one-room-platformer-background-stage-concept-v0.1.png`

Only one candidate matches the prior H5 queue and the platformer goblin player naming directly.

## 4. Selected Source Sheet

Selected source sheet:

```text
assets/academy/creatures/goblin/tga-platformer-goblin-player-v0.1.png
```

Reason:

- It is in the goblin creature folder.
- It is explicitly named `platformer-goblin-player`.
- It is already listed in the asset system plan as the side-view platformer physics entity source.
- It is visually a sequence/grid sheet, unlike the H5.6 expression/action pantry.

## 5. Metadata / Transparency Findings

- Path: `assets/academy/creatures/goblin/tga-platformer-goblin-player-v0.1.png`
- Dimensions: 2816x1536
- Format: PNG
- Image mode: RGBA
- Alpha exists: yes
- Alpha usable: no
- Alpha extrema: 255 to 255
- Transparent or semitransparent pixels: 0
- Fake checkerboard: yes, visibly baked into the sheet
- Derived sheet: none
- Cleanup status: not run
- Cleanup required before transparent runtime use: yes
- Human review required: yes

Evidence created:

```text
assets/academy/evidence/h5-7/platformer-goblin-player-inspection.png
```

## 6. Visual Layout Findings

The sheet appears to be a grid-like side-view animation source with approximately 10 columns and 6 rows. The row/cell structure is visible, but the sheet includes blank cells, baselines, baked checkerboard, and effect/pose details that make fully automatic frame slicing unsafe without a dedicated animation review pass.

Visually obvious candidate movement groups include:

- idle/standing variants;
- run/walk frames;
- crouch or grounded movement poses;
- jump or airborne poses;
- attack/club swing poses;
- hurt/dizzy/fall or knocked-down poses;
- celebration/success poses.

These are layout observations only. H5.7 does not assign frame order, timings, pivots, hitboxes, hurtboxes, or controller semantics.

## 7. Cleanup Risk

Cleanup risk is high.

Reasons:

- The source is RGBA but fully opaque.
- The checkerboard is baked into the RGB pixels.
- Animation silhouettes and outlines are close to the fake background.
- Some poses include stars/effects, shadows, baselines, or non-body motion/readability details.
- Batch cleanup could damage outlines, shadows, limbs, motion edges, facial details, or effect pixels.

Decision:

```text
Cleanup deferred.
No animation-sheet cleanup was run.
No derived transparent sheet was created.
```

## 8. Why This Is Not H5.6

H5.6 mapped:

```text
assets/academy/creatures/goblin/tga-goblin-expression-action-sheet-v0.1.png
```

That sheet is an expression/action pantry for semantic discovery, UI reactions, tutorial flavor, mascot/NPC poses, and future feedback use.

H5.7 inspects:

```text
assets/academy/creatures/goblin/tga-platformer-goblin-player-v0.1.png
```

This sheet is the likely platformer movement source, so it needs animation-manifest law rather than region-manifest law.

## 9. Animation Manifest Contract

SourceRects alone are not enough for animation.

Future animation manifests should include:

- `schemaVersion`
- `status`
- `domain`
- `operationalType`
- `sourceSheet`
- `derivedSheet`
- `transparency`
- `frameGrid` or `frameDetection`
- `animations`
- `reviewNotes`

Proposed future animation entry shape:

```json
{
  "id": "platformer-goblin.idle",
  "label": "Idle",
  "type": "animation-sequence",
  "frames": [
    {
      "index": 0,
      "sourceRect": { "x": 0, "y": 0, "w": 0, "h": 0 },
      "durationMs": null,
      "pivot": null,
      "hitbox": null,
      "hurtbox": null,
      "notes": "Draft frame pending review."
    }
  ],
  "loop": true,
  "reviewStatus": "needs-human-review",
  "usage": "draft-review",
  "notes": "No runtime approval."
}
```

Required doctrine:

- SourceRects alone are not enough for animation.
- Frame order must be reviewed.
- Pivots, hitboxes, and hurtboxes are separate future review gates.
- Cleanup must not be batch-applied to animation sheets without pilot evidence.
- Animation manifest approval is not runtime controller integration.

## 10. Optional Skeleton Manifest Created

Created:

```text
manifests/academy.platformer-goblin-player.animations.json
```

The skeleton is intentionally minimal:

- `schemaVersion: "0.1"`
- `status: "draft"`
- `domain: "platformer-goblin-player"`
- `operationalType: "character-animation-sheet"`
- `sourceSheet: "assets/academy/creatures/goblin/tga-platformer-goblin-player-v0.1.png"`
- `derivedSheet: null`
- `animations: []`
- cleanup not run
- human review required

No fake sequences were created.

## 11. Future Evidence Requirements

Future H5.8-style sequence mapping should create animation-specific evidence, likely including:

- full-sheet grid/sequence overlay;
- sequence-labeled contact sheet;
- numbered frame contact sheet per sequence;
- frame-order table preview;
- alpha/background inspection preview;
- pivot/baseline review overlay;
- hitbox/hurtbox draft overlay only after frame order is reviewed;
- tiny cleanup pilot evidence before any derived transparent animation sheet exists.

## 12. Validator Strategy

Created a dedicated draft animation manifest validator:

```text
scripts/validate-academy-animation-manifests.mjs
```

The validator checks:

- the manifest exists;
- JSON parses;
- `schemaVersion` exists;
- status is one of `draft`, `review`, `approved`, or `deprecated`;
- `sourceSheet` exists;
- `operationalType` is `character-animation-sheet`;
- `animations` is an array;
- empty animation manifests cannot be `approved`;
- any future frame `sourceRect` values are positive and in source bounds.

This keeps animation skeleton validation separate from unrelated region manifests.

## 13. Non-Goals

- No source PNGs were modified.
- No pantry assets were overwritten.
- No game code was changed.
- No hub runtime code was changed.
- No Tauri config was changed.
- Shared FX was not touched.
- No cleanup was run on animation sheets.
- No batch processing was run.
- No runtime animation code was created.
- No pivots, hitboxes, or hurtboxes were created as final truth.
- No assets were marked runtime-approved.
- No manifest status was marked approved.
- The asset capability matrix was not created.
- `tauri dev`, `cargo test`, and `generate_report.py` were not run.

## 14. Agent QA Findings

Agent QA confirms:

- the selected sheet matches the expected platformer goblin player path;
- the source image remained unchanged;
- the sheet is separate from H5.6 expression/action mapping;
- transparency is unusable despite RGBA mode;
- cleanup is high-risk and deferred;
- the skeleton manifest does not create animation frames or runtime approval;
- the dedicated validator is scoped to animation manifests only.

## 15. Human/Product Review Notes

Human review should eventually decide:

- whether the generated goblin silhouette feels like the correct player character;
- whether the visible row groups are strong enough for idle/run/jump/attack/hurt/fall/success states;
- whether the frame count and visual cadence are good enough or need regeneration;
- whether the baked checkerboard makes regeneration/re-export preferable to cleanup;
- whether engine horizontal flipping is acceptable for left movement.

## 16. Recommended Next Step

Recommended next lane:

```text
H5.8 — Platformer Goblin Player Animation Sequence Mapping + Evidence
```

Only proceed if H5.7 is accepted. H5.8 should map candidate sequences as draft-review animation frames, generate sequence evidence, and still avoid runtime wiring.
