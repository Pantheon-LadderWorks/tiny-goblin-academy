# H6 Potion Sorter Hybrid SceneRig Preview

## Human-review closure

- `humanReviewStatus`: `passed`
- `visualTargetStatus`: `approved`
- `productionIntegrated`: `false`
- `runtimeApproved`: `false`
- `productionIntegrationReady`: `true`

The preview is human-approved as the production visual target. The live Potion Sorter does not yet use this SceneRig. Production implementation may soften the local inspection focus field, polish motion curves and receiver-entry choreography, and tune exact anchors or occlusion where evidence requires it. Those refinements must preserve the approved Composition C spatial structure.

This preview implements the human-approved Composition C as a separate, game-local evidence harness. It does not replace or import into the live Potion Sorter runtime.

The initial H6 spatial draft was rejected because it converted the centered one-point-perspective composition into a diagonal side-feed workshop. The retained component systems were recomposed around the verified Composition C companion source at `C:\Users\kryst\.codex\visualizations\2026\07\14\019f5ef5-23b7-75d1-b8cc-9cd7d4e6a6cf\potion-sorter-room-compositions.html`. `composition-c-reference.html` preserves that frame's spatial percentages as a stable evidence reference; it is not new art or runtime authority.

The seven bounded rig parts are `PotionRoomRig`, `ConveyorRig`, `InspectionApertureRig`, `SortingStationRig`, `PotionActorRig`, `PotionQueuePresentation`, and `AlchemyLightingRig`.

The deterministic presentation uses exactly three stable presentation actors: `potion-red`, `potion-blue`, and `potion-green`. Each actor moves continuously through its own queue, inspection, foreground-transfer, and receiver states. The preview does not create an interchangeable active actor, parked clones, replacement sprites, or invisible handoff frames.

The canonical progression is green rear / blue middle / red inspection → red accepted with green and blue advanced → blue accepted with green advanced → all three accepted with an empty queue. Geometry masks are local to the aperture and destination openings. Interaction bounds remain independent from visible bottle and mask geometry. No alpha mask or scene-wide mask is used.

The inspection structure is an open conveyor gantry rather than an opaque cabinet. The darkened timber deck and converging rails remain visible through the machine, while a bounded oval focus field supports the active potion. The rear actor stays behind the upper crossbar at depth 27, crosses beneath it, and only then advances to the middle corridor at depth 30. The active actor remains between the inspection interior and foreground rim.

## Run locally

From the repository root:

```powershell
python -m http.server 5116 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:5116/games/tier-1/02-potion-sorter/evidence/h6-hybrid-scenerig-preview/index.html
```

Use `?autoplay=1` for the deterministic demonstration, `?debug=1` for diagnostic geometry, or `?motion=reduce` for the reduced-motion presentation.

## Evidence boundary

- Primary desktop: `captures/01-initial-queue-1920x1080.png`
- Minimum desktop: `captures/02-initial-queue-1024x640.png`
- Aperture continuity: `captures/10-aperture-approach-continuity-contact-sheet.png`
- Receiver continuity: `captures/11-receiver-handoff-continuity-contact-sheet.png`
- Open-gantry presentation crop: `captures/16-inspection-gantry-presentation-crop.png`
- Open-gantry diagnostic crop: `captures/17-inspection-gantry-diagnostic-crop.png`
- Rear-to-middle gantry occlusion: `captures/18-rear-middle-gantry-occlusion-contact-sheet.png`
- Opaque-cabinet/open-gantry comparison: `captures/reference/03-opaque-cabinet-vs-open-gantry.png`
- Motion proof: `captures/13-complete-demo-cycle.webm`
- Original-C comparison: `captures/reference/01-original-c-vs-corrected-silhouette.png`
- Rejected/corrected comparison: `captures/reference/02-rejected-vs-corrected-1920x1080.png`
- Perspective contract: `spatial-contract.json`
- Material use: `material-use-matrix.json`
- Responsive behavior: `responsive-audit.json`
- Runtime isolation: `runtime-isolation-audit.json`
- Motion semantics: `motion-proof.json`
- Stable identity, ownership, occupancy, and visibility assertions: `actor-lifecycle-audit.json`
- Human-review and production-readiness boundary: `human-review-closure.json`

Runtime approval remains pending human review. No files are staged or committed by this lane.
