# Tiny Goblin Academy — H5.52 Farm Settlement Cleanup Candidate

## Purpose

H5.52 creates a derived transparent cleanup candidate for the reviewed Farm Settlement regions. The goal is to repair the baked checkerboard/fake transparency enough for human review while preserving the original source sheet untouched.

This is a draft cleanup candidate only. It is not runtime-approved, not gameplay-approved, and not placement-approved.

## Source Metadata Summary

- Source sheet: `assets/academy/games/farm-settlement/tga-farm-settlement-sheet-v0.1.png`
- Source dimensions: `1408x768`
- Source mode: `RGBA`
- Alpha range after RGBA conversion: `255` to `255`
- Transparency finding: the source is RGBA but alpha is fully opaque; checkerboard/fake transparency is baked into the pixels.

## Relationship To H5.50 / H5.50B / H5.51

- H5.50 mapped 32 Farm Settlement regions.
- H5.50B corrected human-flagged sourceRect padding and neighbor-bleed issues.
- H5.51 recorded human review pass for the corrected region manifest.
- H5.52 uses the reviewed H5.51 sourceRects only and does not remap regions.

## Cleanup Method Summary

The cleanup pass creates a derived 1408x768 transparent sheet using only reviewed region rectangles. For each reviewed crop, it removes edge-connected neutral gray checker pixels conservatively and leaves colored glows, fire, weather effects, character edges, banners, moons, suns, and other fragile details for human review instead of aggressive cleanup.

High-risk areas are flagged as review risk, not failures.

## Derived Output

- Derived cleaned sheet: `assets/academy/games/farm-settlement/derived/tga-farm-settlement-cleaned-v0.1.png`
- Cleanup manifest: `manifests/academy.farm-settlement.cleanup-candidate.json`

## Region Count

- Regions preserved: `32`
- Region ids changed: none
- SourceRects changed: none
- DerivedRects: match reviewed sourceRects

## Category Summary

- animal-or-creature: 3
- building: 6
- crop: 5
- crop-plot: 2
- fx-icon: 1
- resource-icon: 2
- resource-prop: 4
- status-icon: 5
- terrain-prop: 1
- tool: 1
- ui-token: 2

## Cleanup Risk Summary

- high: 8
- medium: 15
- medium-high: 9

## High-Risk Cleanup Review Notes

- `farm-settlement.soil-plot-sprout` — Sprout soil plot (medium-high)
- `farm-settlement.soil-plot-watered-sprout` — Watered sprout soil plot (high)
- `farm-settlement.withered-crop-plot` — Withered crop plot (high)
- `farm-settlement.dead-crop-plot` — Dead crop plot (medium-high)
- `farm-settlement.water-drop-token` — Water drop token (high)
- `farm-settlement.map-scroll` — Map scroll (medium-high)
- `farm-settlement.campfire` — Campfire (high)
- `farm-settlement.watchtower` — Watchtower (medium-high)
- `farm-settlement.shield-monument` — Shield monument (medium-high)
- `farm-settlement.goblin-idle` — Idle farm goblin (medium-high)
- `farm-settlement.goblin-worker` — Worker farm goblin (medium-high)
- `farm-settlement.no-food-tool-icon` — No food/tool icon (high)
- `farm-settlement.animal-house-complete` — Animal house complete icon (medium-high)
- `farm-settlement.storm-cloud` — Storm cloud lightning (high)
- `farm-settlement.smiling-sun` — Smiling sun icon (high)
- `farm-settlement.crescent-moon` — Crescent moon icon (high)
- `farm-settlement.farm-banner` — Farm banner (medium-high)

These regions need visual review for edge preservation, especially glow halos, fire edges, weather effects, thin crop silhouettes, banner curves, and goblin outlines. The cleanup candidate intentionally avoids overcutting these details.

## Functional-Surface Candidate Metadata

Functional-surface candidate metadata from the reviewed region manifest is preserved in the cleanup manifest. H5.52 does not create functional slot mapping, scene anchors, placement grammar, or gameplay behavior.

## Evidence Created

- `assets/academy/evidence/h5-52-farm-settlement-cleanup-candidate/farm-settlement-cleaned-derived-sheet-preview.png`
- `assets/academy/evidence/h5-52-farm-settlement-cleanup-candidate/farm-settlement-cleanup-before-after-contact-sheet.png`
- `assets/academy/evidence/h5-52-farm-settlement-cleanup-candidate/farm-settlement-cleanup-edge-risk-preview.png`
- `assets/academy/evidence/h5-52-farm-settlement-cleanup-candidate/farm-settlement-cleanup-table-preview.png`
- `assets/academy/evidence/h5-52-farm-settlement-cleanup-candidate/farm-settlement-cleaned-on-dark-preview.png`

## Non-Goals

- No source PNG modification.
- No region remapping.
- No sourceRect, id, label, category, or functional-surface metadata changes.
- No cleanup correction pass in this lane.
- No runtime/game wiring.
- No Farm Settlement gameplay logic.
- No scene-anchor planning.
- No functional slot mapping.
- No runtime approval, gameplay approval, or placement approval.

## Recommended Next Lane

H5.53 — Farm Settlement Cleanup Human Review
