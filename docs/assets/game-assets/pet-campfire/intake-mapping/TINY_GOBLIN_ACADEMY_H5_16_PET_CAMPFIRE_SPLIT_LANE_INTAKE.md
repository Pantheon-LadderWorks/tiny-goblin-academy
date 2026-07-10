# Tiny Goblin Academy — H5.16 Pet Campfire Split-Lane Intake

## 1. Purpose

H5.16 opens Pet Campfire intake as a classification and cleanup-risk evidence pass.

This pass does not create runtime assets, does not wire assets into Game 07, and does not approve any region or animation for runtime use. It exists to preserve the central doctrine before later mapping work:

Pet Campfire is a split-lane asset family. Ember Pup is a character/state asset, not a static prop. Care props, mood/status icons, and environment objects may later receive region manifests, but Ember Pup poses require character/animation review before runtime use. The Pet Campfire background is a scene-anchor background and must not be processed as a sprite sheet.

## 2. Source Assets

| Asset | Path | Dimensions | Mode | Alpha verdict | Likely operational type | Intake decision |
| --- | --- | ---: | --- | --- | --- | --- |
| Ember Pup sheet | `assets/academy/games/pet-campfire/tga-pet-campfire-ember-pup-sheet-concept-v0.1.png` | 1024x1024 | RGB | no alpha; baked checkerboard | split-lane intake: pet animation candidates, static props, UI/status icons | classify and create cleanup-risk evidence only |
| Pet Campfire background | `assets/academy/games/pet-campfire/backgrounds/tga-pet-campfire-background-source-v0.1.png` | 2816x1536 | RGBA | alpha exists but extrema are 255/255, so not usable transparency | scene-anchor background | defer to future background/anchor audit |

## 3. Metadata / Transparency Findings

The Ember Pup sheet is an RGB PNG. It has no alpha channel. The visible checkerboard is therefore baked into the image data and cannot be removed by CSS or renderer transparency settings.

The Pet Campfire background source is an RGBA PNG, but its alpha channel is fully opaque. This is expected for a scene background. The important finding is not cleanup risk; it is misuse risk. It should not be passed through sprite-region extraction.

RGBA mode alone does not prove usable transparency. H5.16 confirms that the Pet Campfire background has alpha present but no transparent pixels.

## 4. Why Pet Campfire Is Not A Standard Sheet

The Ember Pup sheet combines multiple asset types in one concept source:

- Ember Pup character poses and state candidates;
- care props such as bowls, toys, blanket, leash, treat, brush, crate, and bone;
- campfire/environment props such as campfire and tent;
- status, mood, need, reward, and feedback icons.

A normal static-prop region pass would flatten the character poses into ordinary object crops. That would lose the distinction between a pose candidate, an animation candidate, a mood portrait, and a runtime pet state.

The correct intake model is split-lane classification first, then later lane-specific mapping.

## 5. Ember Pup Character Lane

Draft lane:

```text
laneType: pet-animation-sheet
usage: draft-review
reviewStatus: needs-human-review
candidateCountEstimate: 16
```

The top two visible rows appear to contain Ember Pup pose/state candidates:

- idle / neutral;
- happy sitting;
- sad sitting;
- alert sitting;
- sad/floppy;
- happy/waving;
- profile sitting;
- sleeping;
- walking/running candidates;
- eating/play-bow candidate;
- eating from bowl;
- drinking;
- jumping/happy;
- muddy/sick;
- sad/tired.

These are not approved animation sequences. They need later sequence review, baseline/anchor review, scale consistency review, cleanup review, and runtime-state mapping before any game integration.

## 6. Static Care Prop Lane

Draft lane:

```text
laneType: static-prop-sheet
usage: draft-review
reviewStatus: needs-human-review
```

Likely static care prop candidates include:

- food bowl;
- water bowl;
- stick and ball;
- rolling ball;
- blanket or bedroll;
- treat or biscuit;
- brush;
- leash;
- crate;
- bone.

These assets are candidates for a later Pet Campfire static-props region manifest. No sourceRects are approved in H5.16.

## 7. Status / Mood Icon Lane

Draft lane:

```text
laneType: ui-icon-sheet
usage: draft-review
reviewStatus: needs-human-review
```

Likely status or mood icon candidates include:

- angry/upset face;
- water/need droplet;
- happy face;
- sleep indicator;
- fire/warmth marker;
- warning marker;
- sparkle feedback;
- thought cloud;
- moon/night;
- sunrise/sunset indicators.

The last column has vertical stacking ambiguity in the rough contact sheet. Future sourceRect mapping must inspect that area carefully instead of trusting uniform slot math.

## 8. Campfire / Environment Prop Lane

Draft lane:

```text
laneType: static-prop-sheet
usage: draft-review
reviewStatus: needs-human-review
```

Likely environment candidates include:

- campfire;
- tent;
- fire/warmth marker if treated as an object-linked environment icon.

These objects are mostly static, but flame and sparkle edges make cleanup review important.

## 9. Background Scene-Anchor Lane

The background source is a full scene background:

`assets/academy/games/pet-campfire/backgrounds/tga-pet-campfire-background-source-v0.1.png`

It should be handled by a future scene-anchor background pass. That pass should evaluate:

- gameplay-safe zones;
- pet/campfire placement anchors;
- UI-safe negative space;
- readability around the fire, tent, signs, logs, and foreground foliage;
- whether the scene should be cropped, scaled, or framed for the Game 07 canvas.

It should not be processed as a sprite sheet.

## 10. Cleanup Risk

Cleanup posture:

```text
Ember Pup sheet: medium-high cleanup risk
Pet Campfire background: low cleanup need, high misuse risk
```

The Ember Pup sheet is RGB/no-alpha with baked checkerboard. Tiny diagnostic crop previews suggest that conservative gray-key cleanup may work on selected crops, but the sheet should not be batch-cleaned yet.

Risk areas include:

- ears and thin outlines;
- tail fluff;
- paws near bowls;
- fire and glow edges;
- sparkle thin lines;
- checkerboard gaps near small icons.

H5.16 creates cleanup-risk evidence only. It does not create a cleaned production sheet.

## 11. Evidence Created

Evidence folder:

`assets/academy/evidence/h5-16-pet-campfire-intake/`

Files:

- `pet-campfire-source-overview.png`
- `ember-pup-cleanup-risk-crops.png`
- `ember-pup-split-lane-contact-sheet.png`
- `pet-campfire-intake-table-preview.png`
- `pet-campfire-source-metadata.json`

The split-lane contact sheet is a draft classification tool, not a final sourceRect manifest.

## 12. Draft Classification Output

Created:

`manifests/academy.pet-campfire.intake-classification.json`

This JSON is not a runtime manifest. It records source metadata, transparency verdicts, lane decisions, candidate count estimates, and review notes.

It does not create approved sourceRects, runtime animation sequences, hitboxes, hurtboxes, pivots, or runtime asset registry entries.

## 13. Non-Goals

- No source PNGs were modified.
- No production cleaned sheet was created.
- No batch cleanup was run.
- No runtime wiring occurred.
- No Game 07 code was changed.
- No hub runtime code was changed.
- No Tauri configuration was changed.
- No Top-Down Slime Quest assets were processed.
- No top-down creature assets were processed.
- No One-Room Platformer assets were processed.
- Shared FX remained untouched.
- No asset was marked approved or runtime-ready.

## 14. Agent QA Findings

- Pet Campfire spans at least three active lane types: pet animation, static props/UI icons, and scene-anchor background.
- Ember Pup should be treated as a character/state asset.
- Care props and status/mood icons can later receive region manifests, but should not be mixed with Ember Pup pose approval.
- The background is a scene source, not a sprite pantry.
- Rough contact-sheet slotting is useful for intake, but not precise enough for final sourceRects.
- The rightmost status/sunrise area shows vertical stacking ambiguity and needs careful future mapping.

## 15. Human/Product Review Notes

Human review should decide:

- whether the Ember Pup identity is strong enough for v0.1 or needs stronger ember/fire-tail/glow variants later;
- whether muddy/sick/sad poses are distinct enough for runtime state labels;
- whether the current care props cover the Game 07 loop needs;
- whether the mood/status icons are readable at in-game UI scale;
- whether the background composition fits Pet Campfire's eventual canvas and UI layout.

## 16. Recommended Next Step

Recommended next lane:

```text
H5.17 — Pet Campfire Static Props + Icons Region Mapping
```

Reason: the static care props, reward tokens, and status/mood icons are safer than the Ember Pup pose lane. They can use the H5.2B region evidence method after cleanup review, while the Ember Pup character lane remains protected for later sequence/pivot/baseline review.

If human review flags cleanup risk as too high, use:

```text
H5.17 — Pet Campfire Cleanup Pilot Review
```

That lane should still operate on derived preview crops or a clearly marked review candidate, not a production cleaned sheet.
