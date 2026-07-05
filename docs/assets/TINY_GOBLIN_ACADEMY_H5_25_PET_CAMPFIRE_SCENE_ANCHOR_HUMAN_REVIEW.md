# Tiny Goblin Academy — H5.25 Pet Campfire Scene-Anchor Human Review + Placement Grammar Split

## 1. Purpose

H5.25 records Kryssie's human/product review of the H5.24 Pet Campfire scene-anchor audit and corrects the next planning abstraction.

The H5.24 scene anchors passed as draft planning zones, but the H5.24 ghost preview did not approve generic asset placement. Ember Pup state-symbol placement and UI/prop/care-symbol placement must be modeled as separate planning grammars. Accepted cleaned assets are not automatically valid scene placements.

## 2. Review Input

H5.24 report:

`docs/assets/TINY_GOBLIN_ACADEMY_H5_24_PET_CAMPFIRE_BACKGROUND_SCENE_ANCHORS.md`

Scene-anchor manifest:

`manifests/academy.pet-campfire.background.scene-anchors.json`

Evidence folder:

`assets/academy/evidence/h5-24-pet-campfire-background-scene-anchors/`

Evidence reviewed:

- `pet-campfire-background-anchor-overlay.png`
- `pet-campfire-background-anchor-contact-sheet.png`
- `pet-campfire-background-anchor-table-preview.png`
- `pet-campfire-placement-readability-preview.png`

## 3. Human Review Decision

Decision:

```text
H5.24 Scene-Anchor Human Review: Passed with placement notes
Scene anchors accepted for draft planning
Generic ghost placement not approved
Placement planning must split by asset/problem type
```

Kryssie reviewed the H5.24 scene-anchor evidence and accepted the anchor system as useful.

The correction is that the ghost preview revealed a needed split: some placements are good examples, some placements are obvious no-go examples, and the accepted props/icons atlas should not be treated as one generic world-placement group.

## 4. What Passed

Passed:

- the scene-anchor audit method;
- the idea of treating the background as a rule-readable scene surface;
- the 14 draft anchor zones as useful planning coordinates;
- the overlay/contact/table evidence method;
- the distinction between safe zones, clutter zones, focal zones, and readability-risk zones;
- the use of ghost previews as review evidence.

The scene-anchor manifest is now accepted for draft scene-anchor planning.

## 5. What Did Not Pass

Not passed:

- generic asset placement;
- dumping all accepted props/icons into the scene;
- treating the H5.24 ghost preview as runtime placement data;
- mixing Ember Pup state-symbol placement with UI/prop/care-symbol placement;
- treating cleaned assets as automatically valid scene placements.

The bottom blob of accepted props/icons in the ghost preview is useful specifically because it shows what not to do.

## 6. Placement Grammar Split

Future placement planning must split into two lanes:

```text
1. Ember Pup state-symbol placement grammar
2. UI / prop / care-symbol placement grammar
```

These lanes solve different design problems.

The pup placement lane asks:

```text
Where can each pup state appear and still make emotional and visual sense?
```

The UI/prop/care-symbol lane asks:

```text
Where can icons, bowls, props, feedback, and status marks appear without clutter?
```

## 7. Ember Pup State-Symbol Placement Lane

The Ember Pup lane should connect:

- accepted cleaned Ember Pup pose/state symbols;
- scene anchors;
- emotional/state semantics;
- readable scale and location notes;
- avoid-zone rules.

Example future planning concepts:

```text
idle / happy:
  likely anchors: front clearing, left path entry, right path entry

eating / drinking:
  likely anchors: tent/care cluster, front clearing near bowls

sleeping:
  likely anchors: tent/care cluster, tucked/rest areas

sad / sick / tired:
  likely anchors: quieter edge of clearing, tent/care cluster
```

This lane does not approve runtime animation. Ember Pup remains a pose/state-symbol set.

## 8. UI / Prop / Care-Symbol Placement Lane

The UI/prop/care-symbol lane should connect:

- accepted cleaned static props/icons;
- scene anchors;
- icon/prop categories;
- local bubble or overlay rules;
- clutter and contrast avoidance notes.

Example future planning concepts:

```text
need/status icons:
  likely anchors: near pup, upper sky UI-safe zone, small local bubble zones

care props:
  likely anchors: tent/care cluster, front clearing, right table/stump cluster

quest/status/sign markers:
  likely anchors: right sign/banner board, upper UI-safe zone

feedback icons:
  likely anchors: near pup or central action zone
```

This lane must not treat the whole accepted icon atlas as a scene object.

## 9. Non-Goals

- No source background PNG was modified.
- No background sprites were extracted.
- No cleaned props/icons candidate was modified.
- No cleaned Ember Pup candidate was modified.
- No new evidence images were created.
- No runtime placement data was created.
- No Pet Campfire gameplay was wired.
- No game code was changed.
- No hub code was changed.
- Top-Down Slime Quest was not touched.
- Shared FX remained untouched.
- No Tauri, Rust, Cargo, or installer activity occurred.
- No anchor or asset placement was marked runtime-approved.

## 10. Recommended Next Step

Recommended next lane:

```text
H5.26 — Pet Campfire Dual Placement Grammar Manifests
```

That pass should create two planning manifests:

```text
academy.pet-campfire.ember-pup.state-placement-plan.json
academy.pet-campfire.ui-prop-care-placement-plan.json
```

Tiny doctrine:

```text
The campsite map passed.
The ghost blob did not become law.
Now the puppy and the icons get separate placement grammars.
```
