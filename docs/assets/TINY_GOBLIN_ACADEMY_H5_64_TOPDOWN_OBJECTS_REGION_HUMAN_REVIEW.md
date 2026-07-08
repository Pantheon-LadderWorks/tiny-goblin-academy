# Tiny Goblin Academy - H5.64 Topdown Objects Region Human Review

## 1. Purpose

H5.64 records Kryssie's human/product review decision for the H5.63 Topdown Objects draft region mapping.

This is a region-mapping review only. Approval here accepts source cells, draft labels, and draft categories for cleanup/planning use. It does not approve runtime behavior.

## 2. Review Input

Review input:

- H5.63 region mapping commit: `b0f96c5 docs: map topdown object regions`
- Region manifest: `manifests/academy.topdown.objects.regions.json`
- Source lane: `assets/academy/topdown/objects/`
- Source sheet: `assets/academy/topdown/objects/tga-topdown-environment-objects-concept-v0.1.png`
- Source dimensions: 1024x1024
- Grid: 8x8, 128px cells
- Regions represented: 64

## 3. Human Review Decision

H5.63 Topdown Objects region mapping passes human/product review.

The 8x8 grid mapping is clean and consistent. Region count, labels, and draft semantic categories are accepted for planning use.

No sourceRect correction pass is needed.

## 4. Accepted Region Mapping

Accepted mapping summary:

- 64 topdown object regions accepted.
- 8x8 128px grid sourceRects retained.
- One blank cell remains explicitly tracked.
- Draft labels and semantic categories are accepted for planning only.
- Runtime eligibility remains not-runtime-approved.

## 5. Semantic Mix / Future Behavior Boundary

The sheet is semantically mixed. Some cells are ordinary props and some are future behavior candidates.

This does not block H5.64 because H5.64 only accepts the inventory mapping, not behavior.

Effect-bearing and runtime-danger regions explicitly remain behavior-deferred:

- 7
- 9
- 10
- 17
- 18
- 47
- 55
- 57
- 58
- 60
- 61
- 62

These are spicy future-runtime goblins, not approved runtime systems.

## 6. Category Breakdown

Category breakdown from the reviewed manifest:

- key-item: 1
- pedestal-or-switch: 2
- portal-or-seal: 3
- plate-or-marker: 5
- chest: 2
- fire-or-light: 4
- rubble-or-rock: 8
- statue-or-monument: 2
- banner-or-sign: 5
- shield-or-crest: 2
- bush-or-foliage: 4
- tree-or-stump: 4
- flower-or-plant: 2
- reed-or-water-plant: 2
- bridge-or-plank: 3
- crate: 2
- barrel: 2
- fence: 4
- campfire: 2
- blank-empty-cell: 1
- hazard-or-trap: 3
- decorative-prop: 1

## 7. Runtime / Interaction Boundary

The following remain not approved:

- loot behavior;
- pickup behavior;
- chest opening behavior;
- key behavior;
- portal teleport behavior;
- light emission behavior;
- trap damage behavior;
- interaction behavior;
- placement behavior;
- collision behavior;
- runtime wiring;
- cleanup output;
- derived runtime atlas use.

## 8. Non-Goals

H5.64 did not:

- modify source PNGs;
- regenerate evidence;
- create cleanup candidates;
- create derived assets;
- alter region bounds;
- wire runtime/game code;
- approve collision, placement, interaction, or behavior.

## 9. Recommended Next Lane

Recommended next lane:

`H5.65 - Topdown Objects Cleanup Candidate`

Carry the runtime-danger notes forward. The object goblins may enter cleanup planning, but none of them get jobs in runtime yet.
