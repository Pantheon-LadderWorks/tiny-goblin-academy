# Tiny Goblin Academy — H5.24 Pet Campfire Background Scene-Anchor Audit

## 1. Purpose

H5.24 audits the Pet Campfire background as a scene-anchor background.

The Pet Campfire background is a scene-anchor background, not a sprite sheet. H5.24 identifies draft visual zones for readability, future placement, UI safety, and interaction planning. It does not extract background props, approve runtime placement, or wire gameplay.

The core question for this pass is:

```text
Where can gameplay/UI/characters safely live on this background?
```

Not:

```text
What can be cut out of the background?
```

## 2. Source Background

Source background:

`assets/academy/games/pet-campfire/backgrounds/tga-pet-campfire-background-source-v0.1.png`

Known source facts from H5.16:

| Field | Value |
| --- | --- |
| Dimensions | 2816x1536 |
| Mode | RGBA |
| Alpha | present but fully opaque |
| Operational type | scene-anchor background |
| Sprite-sheet status | not a sprite sheet |
| H5.24 source status | untouched |

## 3. Relationship To H5.16-H5.23

Pet Campfire split-lane work so far:

```text
H5.16 — Pet Campfire split-lane intake
H5.17 — Static props/icons region mapping
H5.18 — Static props/icons cleanup candidate
H5.19 — Static props/icons cleanup human review promotion
H5.20 — Ember Pup pose/state candidate mapping
H5.21 — Ember Pup pose human review promotion
H5.22 — Ember Pup pose/state cleanup candidate
H5.23 — Ember Pup pose/state cleanup human review promotion
H5.24 — Pet Campfire background scene-anchor audit
```

H5.24 does not modify the accepted static props/icons cleanup candidate or the accepted Ember Pup pose/state cleanup candidate. Those assets are used only as non-runtime ghost preview references for readability evidence.

## 4. Scene-Anchor Method

Method:

1. Inspect the full Pet Campfire background visually.
2. Identify draft zones by visual role and placement risk.
3. Record zone rectangles in a scene-anchor manifest.
4. Generate overlay, contact-sheet, table, and placement/readability evidence.
5. Keep every anchor in `draft-review` / `needs-human-review`.

Categories used:

- `primary-focal-anchor`
- `ember-pup-safe-placement-zone`
- `care-prop-safe-placement-zone`
- `ui-safe-zone`
- `readability-risk-zone`
- `foreground-obstruction-zone`
- `background-detail-zone`
- `possible-interaction-anchor`

These are planning labels only. They are not runtime placement data.

## 5. Anchor Results

Created:

`manifests/academy.pet-campfire.background.scene-anchors.json`

Manifest status:

```text
status: draft
domain: pet-campfire
operationalType: scene-anchor-background
reviewStatus: needs-human-review
anchors: 14
```

Mapped draft anchors:

1. central campfire focal anchor;
2. foreground open clearing / pet stage;
3. left tent and care cluster;
4. right stumps/table activity cluster;
5. right sign and banner board;
6. upper sky and distant forest negative space;
7. left upper tree canopy;
8. right upper tree canopy;
9. left foreground mushrooms/shrubs;
10. right foreground rocks/leaves;
11. left lower path entry;
12. right lower path entry;
13. left lantern glow cluster;
14. right lantern/banner glow cluster.

All anchors remain:

```text
usage: draft-review
reviewStatus: needs-human-review
```

## 6. Placement / Readability Findings

Initial agent findings:

- The central campfire is the strongest focal anchor, but large pets/UI should avoid covering the flame.
- The foreground clearing around the campfire is the best readable pet/state-symbol stage.
- The left tent cluster is thematically strong for care props, inventory, rest, or shelter-related symbols, but it is visually busy.
- The right stump/table/bench cluster is a strong interaction anchor for future care/action concepts.
- The upper sky and distant forest are the best broad UI-safe negative-space candidate, with some contrast risk near clouds and fireflies.
- The left and right upper tree canopies are atmospheric background detail zones and should not carry tiny UI.
- Foreground mushrooms, rocks, and large leaves are obstruction zones; they can frame the scene but may swallow small pets/props.
- Lantern glow clusters and the sign/banner area are strong visual landmarks but risky for tiny status symbols because of contrast and existing glow/detail.

The ghost placement preview suggests that lower path/clearing zones are more readable for Ember Pup state symbols than lantern/sign/foreground obstruction zones.

## 7. Evidence Created

Evidence folder:

`assets/academy/evidence/h5-24-pet-campfire-background-scene-anchors/`

Files:

- `pet-campfire-background-anchor-overlay.png`
- `pet-campfire-background-anchor-contact-sheet.png`
- `pet-campfire-background-anchor-table-preview.png`
- `pet-campfire-placement-readability-preview.png`

All evidence is draft scene-anchor audit evidence only. It is not runtime placement, does not extract sprites, and does not modify the source background.

## 8. Non-Goals

- No source background PNG was modified.
- No background sprites were extracted.
- No background props were cut out.
- No runtime placement data was created.
- No runtime/game code was changed.
- No hub code was changed.
- No Pet Campfire runtime wiring occurred.
- Static props/icons cleanup candidate was not modified.
- Ember Pup pose/state cleanup candidate was not modified.
- Top-Down Slime Quest was not touched.
- Shared FX remained untouched.
- No Tauri, Rust, Cargo, or installer activity occurred.
- No anchor was marked runtime-approved.

## 9. Human/Product Review Notes

Human review should decide:

- whether the anchor categories match the intended Pet Campfire play feel;
- whether the foreground clearing should be treated as the main pet stage;
- whether the upper sky is acceptable for UI or should remain purely scenic;
- whether the left tent and right stump/table clusters are too busy for small care props;
- whether the sign/banner area should become a status/quest surface later;
- whether any anchor rectangles need resizing before draft layout composition.

Review should not treat the anchor rectangles as final runtime coordinates.

## 10. Recommended Next Step

Recommended next lane:

```text
H5.25 — Pet Campfire Background Scene-Anchor Human Review
```

Alternative if Pet Campfire should immediately move toward composition planning:

```text
H5.25 — Pet Campfire Draft Layout Composition Plan
```

Alternative if Pet Campfire should pause and the asset pass should continue broadly:

```text
H5.25 — Continue Remaining Standard Game Asset Sheets
```

Tiny doctrine:

```text
The props are clean.
The puppy is clean.
Now the campsite has a draft map of where things are allowed to exist.
```
