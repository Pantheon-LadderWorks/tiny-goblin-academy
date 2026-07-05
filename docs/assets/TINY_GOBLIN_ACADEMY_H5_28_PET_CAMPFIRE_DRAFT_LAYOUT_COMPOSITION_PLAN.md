# Tiny Goblin Academy — H5.28 Pet Campfire Draft Layout Composition Plan

## Purpose

H5.28 creates draft Pet Campfire layout composition scenarios from reviewed scene anchors and reviewed placement grammars. These compositions use anchor references and named slot roles only. They do not approve exact runtime coordinates, runtime placement data, gameplay behavior, animation cycles, or Pet Campfire wiring. The goal is to preserve readable emotional scene logic before implementation.

This pass answers what a readable Pet Campfire scene should feel like when Ember Pup is idle, happy, hungry, thirsty, sleepy, sad, sick, active, or when the campsite needs a quest/status surface.

## Relationship To H5.16-H5.27

H5.16-H5.23 established the Pet Campfire asset lanes:

- static props/icons cleanup candidate accepted for draft pipeline use;
- Ember Pup pose/state-symbol cleanup candidate accepted for draft pipeline use;
- Ember Pup remains a pose/state-symbol set, not an approved animation sheet.

H5.24-H5.25 established the Pet Campfire background as a scene-anchor surface:

- 14 anchors reviewed for draft scene-anchor planning;
- generic ghost placement rejected;
- `placementApproval` remains `none`.

H5.26-H5.27 established and human-reviewed two placement grammars:

- Ember Pup state-symbol placement grammar;
- UI / prop / care-symbol placement grammar.

H5.28 composes those pieces into draft visual scenarios without crossing into runtime.

## Composition Method

The method is:

```text
reviewed scene anchors
+
reviewed Ember Pup state-symbol grammar
+
reviewed UI / prop / care-symbol grammar
=
draft layout composition scenarios
```

Each composition records:

- emotional intent;
- primary and secondary Ember Pup state symbols;
- preferred, allowed, and avoided pup anchors;
- recommended props/icons;
- preferred, allowed, and avoided prop/icon anchors;
- UI/status surface hints;
- named composition slots;
- readability notes;
- rejected patterns.

Composition slots use named roles and anchor IDs only. They do not approve runtime placement.

## Draft Composition Scenarios

Created manifest:

`manifests/academy.pet-campfire.layout-composition-plan.json`

Draft compositions:

1. **Default Idle Campsite** — calm baseline with neutral pup, minimal UI/status, and no prop clutter.
2. **Happy Greeting Campsite** — cheerful greeting/readability moment with happy or excited pup and sparse feedback.
3. **Hungry Care Campsite** — food/care scenario using care cluster or front clearing with bowl/treat/bone support.
4. **Thirsty Care Campsite** — water/care scenario using water bowl or droplet logic while avoiding fire/glow clutter.
5. **Sleepy Rest Campsite** — quiet rest scenario using care/rest anchors and optional sleep/moon symbol.
6. **Sad Comfort Campsite** — soft comfort scenario with sad/tired pup and sparse care/thought support.
7. **Sick Recovery Campsite** — recovery/care scenario for muddy/sick pup with warning/water/brush/care symbols.
8. **Active Play Campsite** — play/action scenario using active or excited pose-symbols without claiming animation cycles.
9. **Quest Or Status Campsite** — status/quest marker scenario using sign/banner or upper UI-safe anchors.

## Slot Roles

The plan uses reusable named slot roles:

- `primary-pup`
- `secondary-pup/state-variation`
- `care-prop`
- `local-status-bubble`
- `ui-status-surface`
- `quest/status marker`

Slots define what the composition needs to express, not where the runtime must spawn a sprite.

Allowed slot shape:

```json
{
  "slotRole": "primary-pup",
  "anchorId": "pet-campfire.background.anchor.front-clearing",
  "relativeHint": "center-lower area of anchor; keep pup grounded and off the direct fire focal point",
  "exactCoordinatesApproved": false
}
```

## Anchor Reference Policy

The H5.28 manifest uses:

`coordinatePolicy: "anchor-references-only-no-exact-runtime-coordinates"`

The policy means:

- use scene-anchor IDs;
- use named slot roles;
- use relative readability hints;
- do not approve exact runtime spawn points;
- do not create runtime placement data;
- do not convert planning slots into gameplay wiring.

## Readability / Emotional Intent Findings

The strongest pattern is that Pet Campfire should express state through sparse, role-aware composition instead of showing every accepted asset.

Findings:

- idle/default should breathe and avoid prop clutter;
- happy/greeting can use sparkles or feedback, but only if it does not eat the pup silhouette;
- hungry/thirsty states work best near care anchors with one clear care object or need symbol;
- sleepy/sad/sick states should avoid the central flame and busy foreground clutter;
- active/play states can use pose-symbol variation, but this still does not approve animation cycles;
- quest/status markers belong on sign/banner or UI-safe surfaces, not the central fire by default.

## Rejected Patterns

Rejected patterns remain:

- dumping the accepted props/icons atlas into scene space;
- treating cleaned assets as automatically scene-valid;
- turning the central fire into permanent UI clutter;
- using foreground obstruction zones for tiny state reads;
- treating two active pose-symbols as an approved walk/run animation cycle;
- converting draft slots into exact runtime coordinates.

## Evidence Created

Created evidence folder:

`assets/academy/evidence/h5-28-pet-campfire-layout-composition-plan/`

Evidence files:

- `pet-campfire-composition-scenario-matrix.png`
- `pet-campfire-composition-slot-preview.png`
- `pet-campfire-composition-storyboard-preview.png`
- `pet-campfire-composition-boundary-summary.png`
- `pet-campfire-composition-anchor-trace-preview.png`

All evidence is labeled as draft layout composition planning. It does not approve runtime placement, exact spawn coordinates, gameplay wiring, or animation cycles.

## Non-Goals

H5.28 does not:

- modify source PNGs;
- modify cleaned asset candidates;
- modify H5.26/H5.27 manifests;
- modify existing evidence images;
- create exact runtime coordinates;
- create runtime placement data;
- change game code;
- wire Pet Campfire runtime;
- approve animation cycles;
- create a new editor;
- process Top-Down Slime Quest;
- touch Shared FX;
- run Tauri, Rust, or Cargo.

## Human/Product Review Notes

Kryssie should review:

- whether the nine scenarios match the intended Pet Campfire emotional range;
- whether any composition feels too cluttered or too sparse;
- whether the preferred/avoid anchors feel right for each pup state;
- whether status icons should be local bubbles, UI surfaces, or omitted;
- whether the quest/status scenario belongs in this pass or should stay deferred.

The current manifest remains `draft` / `needs-human-review`.

## Recommended Next Step

Recommended next lane:

H5.29 — Pet Campfire Draft Layout Composition Human Review

Tiny law:

```text
Grammar says what may belong.
Composition says what the scene is trying to feel like.
Runtime still waits for permission.
```
