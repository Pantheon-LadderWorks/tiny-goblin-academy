# H6.6 Potion Sorter Live Composition C SceneRig Evidence

## Review status

- implementation: complete
- automated runtime QA: passed
- human visual review: passed
- runtime approval: passed
- staging/commit: approved for H6.6B closure

## Final human/runtime approval

- `humanReviewPassed: true`
- `compositionCApproved: true`
- `productionIntegrated: true`
- `runtimeApproved: true`
- `tapInputApproved: true`
- `additiveDragInputApproved: true`
- `stableActorContinuityApproved: true`
- `openGantryApproved: true`
- `mechanicalServiceBayApproved: true`
- `duplicateRightRackRemoved: true`
- `sourceGameplayAuthorityPreserved: true`

## What this packet proves

- the H6.5 stage-first shell remains in place;
- approved Composition C is now the live Phaser presentation;
- the simulation and controller remain gameplay authority;
- the presentation reads `activePotionId` and `upcomingPotions` from simulation state rather than inventing preview queue state;
- each of the six round entities owns one stable `PotionActorRig` for its lifecycle;
- the same actor travels from queue/inspection through the branch and into a receiver;
- tap-select → tap-receiver and aperture-drag → receiver both dispatch the same controller placement command;
- a 14-logical-pixel gesture threshold preserves ordinary taps while preventing drag completion from emitting a second placement;
- an outside drop returns the same stable actor to the aperture without changing score, combo, or queue position;
- round completion and real timer expiry cancel or reject drag ownership;
- correct and incorrect placements preserve score/combo behavior;
- the right gearbox uses authored teeth, spokes, hubs, axles, fasteners, a fitted access plate, and slow linked rotation;
- the duplicate right bottle rack is absent; the recessed gearbox now forms a sparse service bay with a narrow pipe, gauge, valve wheel, clamps, and fitted access plate;
- a real 30-second timer expiry completes the round;
- 1920×1080 and 1024×640 remain overflow-free;
- destination labels and transient feedback remain readable at both contracts.

## Approved asset boundary used

- potion regions 1, 2, and 3;
- receiver regions 17, 18, and 19;
- regions 9 and 14 remain excluded;
- cleaned H5.48C sheet only;
- Kenney stylized timber and masonry;
- DeadKir hand-painted iron;
- ambientCG Metal008 as restrained brass detail;
- Luke.RUSTLTD illustrated parchment.

The source images are referenced through Vite URLs. No source image was modified or duplicated.

## SceneRig boundary

- `PotionRoomRig`
- `ConveyorRig`
- `InspectionApertureRig`
- `SortingStationRig`
- `PotionActorRig`
- `PotionQueuePresentation`
- `AlchemyLightingRig`

Containment uses local geometry masks at the inspection aperture and receiver interiors. Pointer zones are separate, larger interaction surfaces and do not double as clip geometry.

## Evidence index

- `captures/01-desktop-initial.png`
- `captures/02-desktop-selected.png`
- `captures/03-desktop-red-transit.png`
- `captures/04-desktop-red-accepted.png`
- `captures/05-desktop-blue-incorrect.png`
- `captures/06-desktop-round-complete.png`
- `captures/07-minimum-initial.png`
- `captures/08-minimum-red-accepted.png`
- `captures/09-minimum-timer-expired.png`
- `runtime-audit.json`
- `capture-live-evidence.mjs`

H6.6A additive-input and gearbox correction:

- `captures-h6-6a/01-desktop-initial-corrected-gearbox.png`
- `captures-h6-6a/02-minimum-initial-corrected-gearbox.png`
- `captures-h6-6a/03-gearbox-service-bay-crop.png`
- `captures-h6-6a/04-gearbox-depth-diagnostic.png`
- `captures-h6-6a/05-tap-correct-receiver.png`
- `captures-h6-6a/06-tap-wrong-receiver.png`
- `captures-h6-6a/07-drag-start.png`
- `captures-h6-6a/08-drag-hover-valid-receiver.png`
- `captures-h6-6a/09-drag-correct-contained.png`
- `captures-h6-6a/10-drag-wrong-combo-break.png`
- `captures-h6-6a/11-outside-drop-return.png`
- `captures-h6-6a/12-actor-continuity-diagnostic.png`
- `captures-h6-6a/13-mixed-input-round-complete.png`
- `captures-h6-6a/14-timer-expiry-drag-disabled.png`
- `motion/h6-6a-tap-drag-gearbox-motion.webm`
- `h6-6a-runtime-audit.json`
- `h6-6a-drag-lifecycle-audit.json`
- `capture-h6-6a-evidence.mjs`

`runtime-audit.json` records the DOM HUD, round state, and every actor's owner, anchor, mask, visibility, position, scale, and depth at each audited state.

`h6-6a-runtime-audit.json` adds the gesture owner, tap/drag resolution log, gearbox/service-bay depth snapshot, gear angles, minimum-window correction proof, and timer-expiry cancellation. `h6-6a-drag-lifecycle-audit.json` follows `potion-2` through inspection, drag ownership, receiver hover, and accepted containment without recreating the actor.

## Deliberate exclusions

- no preview autoplay or deterministic demo authority in production;
- no evidence capture hooks in production;
- no particles;
- no shaders;
- no dynamic shadows;
- no audio work;
- no package or lockfile changes;
- no Potion Sorter reset/replay feature was invented in this lane.

## Final spatial authority

Left wing is botanicals and ingredient storage. Center is conveyor, inspection, and sorting authority. Right wing is machinery and service apparatus. The right wing must not regain a colorful bottle rack or duplicate storage board. Tap and drag are parallel presentation inputs into the same controller command path. SceneRig remains presentation architecture while simulation/controller remain gameplay authority. Composition C is the canonical live Potion Sorter spatial composition.
