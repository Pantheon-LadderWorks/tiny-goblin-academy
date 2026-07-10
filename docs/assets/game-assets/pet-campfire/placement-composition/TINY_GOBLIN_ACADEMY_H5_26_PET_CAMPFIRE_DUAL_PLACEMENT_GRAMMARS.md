# Tiny Goblin Academy — H5.26 Pet Campfire Dual Placement Grammar Manifests

## Purpose

H5.26 creates draft placement grammar manifests for Pet Campfire. The goal is to connect the human-reviewed Pet Campfire asset lanes to the human-reviewed scene-anchor map without turning those planning rules into runtime behavior.

Accepted cleaned assets are not automatically valid scene placements. H5.26 creates draft placement grammars that connect human-reviewed Pet Campfire asset lanes to human-reviewed scene anchors. Ember Pup state-symbol placement and UI/prop/care-symbol placement are separate planning grammars because they serve different visual and gameplay purposes. This pass does not approve runtime placement, exact coordinates, animation cycles, gameplay behavior, or Pet Campfire wiring.

## Relationship To H5.16-H5.25

H5.16 opened Pet Campfire as a split-lane asset family. H5.17-H5.19 mapped, cleaned, and human-reviewed the static props/icons lane for draft pipeline use. H5.20-H5.23 mapped, cleaned, and human-reviewed the Ember Pup pose/state-symbol lane for draft pipeline use while explicitly preserving `animationApproval: none`. H5.24-H5.25 mapped and human-reviewed the background as a scene-anchor surface while rejecting generic asset dumping into scene space.

H5.26 connects those accepted draft lanes as planning grammar only:

- accepted static props/icons cleanup candidate;
- accepted Ember Pup pose/state cleanup candidate;
- accepted Pet Campfire scene-anchor manifest;
- no exact runtime spawn coordinates;
- no animation cycle approval;
- no gameplay or runtime wiring.

## Why Two Placement Grammars

Pet Campfire needs two placement grammars because the cleaned assets do not all serve the same purpose.

Ember Pup pose/state symbols describe where the puppy can believably appear for a state: idle, happy, sad, sick, sleeping, eating, drinking, active, or excited. These rules care about character readability, emotional tone, and whether the pup feels grounded in the campsite.

UI / prop / care symbols describe where supporting assets can appear: bowls, blanket, brush, leash, campfire, warning icons, water/sleep needs, sparkles, thought bubbles, badges, and quest/status markers. These rules care about whether an asset belongs in world space, UI space, local feedback space, or should avoid the scene entirely unless a later composition plan gives it a reason.

## Ember Pup State-Symbol Placement Plan

Created manifest:

`manifests/academy.pet-campfire.ember-pup.state-placement-plan.json`

The manifest defines 9 draft planning rules:

1. idle / neutral;
2. happy / wave / alert;
3. sad / tired;
4. muddy / sick;
5. sleeping / resting;
6. eating;
7. drinking;
8. walking / active pose-symbol;
9. jumping / excited pose-symbol.

Each rule connects state-symbol groups to preferred, allowed, and avoided scene anchors. The rules use scene-anchor IDs only. They do not assign exact x/y spawn points, pivots, hitboxes, gameplay states, timing, or animation cycles.

## UI / Prop / Care-Symbol Placement Plan

Created manifest:

`manifests/academy.pet-campfire.ui-prop-care-placement-plan.json`

The manifest defines 9 draft planning rules:

1. care bowls / feeding;
2. rest care props;
3. play props;
4. environment focal props;
5. need/status icons;
6. time/warmth icons;
7. feedback icons;
8. reward / quest / marker icons;
9. rejected generic atlas dump pattern.

Each rule separates world-placement intent from UI-placement intent and records proximity expectations where useful. The accepted cleaned props/icons atlas remains a draft asset source, not a license to scatter every icon across the campsite.

## Rejected Generic Placement Pattern

The H5.24 ghost preview proved that a generic "place all accepted assets somewhere" approach is not valid. The bottom icon blob / generic atlas dump pattern is rejected because it treats cleaned assets as automatically scene-valid, ignores visual role, and creates unreadable or awkward placement clusters.

H5.26 records the safer replacement:

```text
accepted cleaned asset
↓
placement grammar
↓
human/product review
↓
future composition plan
↓
possible runtime implementation later
```

## Evidence Created

Created evidence folder:

`assets/academy/evidence/h5-26-pet-campfire-placement-grammar/`

Evidence files:

- `ember-pup-state-placement-matrix.png`
- `ui-prop-care-placement-matrix.png`
- `placement-grammar-anchor-summary.png`
- `placement-grammar-split-preview.png`

All H5.26 evidence is labeled as draft planning grammar. It does not approve runtime placement, exact spawn coordinates, gameplay wiring, or animation cycles.

## Non-Goals

H5.26 does not:

- modify source PNGs;
- modify cleaned asset candidates;
- modify H5.24 scene-anchor evidence;
- create runtime placement data;
- wire Pet Campfire gameplay;
- create an editor;
- create procedural placement;
- approve exact coordinates;
- approve animation cycles;
- process Top-Down Slime Quest;
- touch Shared FX;
- run Tauri, Rust, or Cargo.

## Human/Product Review Notes

This pass remains `draft` / `needs-human-review`. Kryssie should review whether the placement grammar matches product intent:

- Do the Ember Pup state-symbol rules place the pup where it feels believable?
- Do the care props belong near care/camp zones instead of random scene space?
- Do status icons read better as UI/local bubbles than as world props?
- Are any anchors too cluttered, too glowy, or too visually noisy for small symbols?
- Is the rejected generic-placement pattern documented clearly enough for future agents?

## Recommended Next Step

Recommended next lane:

H5.27 — Pet Campfire Dual Placement Grammar Human Review

Tiny goblin law:

```text
A clean puppy still needs a place to sit.
A clean icon still needs a reason to appear.
The campsite now gets grammar.
```
