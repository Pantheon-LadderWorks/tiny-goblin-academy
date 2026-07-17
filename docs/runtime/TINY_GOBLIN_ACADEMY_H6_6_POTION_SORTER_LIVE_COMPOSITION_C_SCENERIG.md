# Tiny Goblin Academy H6.6 — Potion Sorter Live Composition C SceneRig Integration

## Status

Implementation, automated QA, and human visual review are complete. Composition C is production-integrated and runtime-approved. H6.6B authorizes local closure and commit.

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

Final spatial authority is intentionally asymmetric: left wing is botanicals and ingredient storage; center is conveyor, inspection, and sorting authority; right wing is machinery and service apparatus. The right wing must not regain a colorful bottle rack or duplicate storage board. Tap and drag remain parallel presentation inputs into the same controller command path. SceneRig remains presentation architecture; simulation and controller remain gameplay authority. Composition C is the canonical live Potion Sorter spatial composition.

## Objective

Replace Potion Sorter's H6.5 placeholder playfield with the approved Composition C hybrid alchemy station while preserving the stage-first shell and the original tap-potion → tap-receiver game. H6.6A adds aperture-drag → receiver as a second presentation input without replacing the tap path.

## Authority boundary

The live scene is an adapter over `RoundController`. It does not score, advance the round, resolve correctness, own time, or manufacture a demo sequence.

The only simulation extension is presentation-facing identity:

- `activePotionId` identifies the current stable bottle entity;
- `upcomingPotions` exposes the authoritative remaining queue.

Potion type order, 30-second duration, correct score, combo behavior, incorrect combo reset, and completion rules are unchanged.

## Implementation

The live SceneRig is split by responsibility under `games/tier-1/02-potion-sorter/src/scene-rig/`:

- `config.ts` — logical stage, perspective anchors, approved assets, frame bindings, destination mapping;
- `environment-rigs.ts` — room construction and restrained code-authored lighting;
- `machine-rigs.ts` — conveyor, inspection aperture, receivers, local geometry masks, independent hit zones;
- `potion-rigs.ts` — stable actor roots, queue projection, continuity snapshots, and controller-triggered movement.
- `drag-interaction.ts` — pointer ownership and the 14-logical-pixel tap/drag gesture threshold, independent of simulation rules.

`PotionScene` preloads the source assets, registers approved sheet frames, constructs the rigs, buffers controller publication during a movement handoff, and resynchronizes the live presentation after the same actor settles. Tap and drag release both route through `RoundController.placePotion`; scoring, correctness, combo, progression, and completion remain controller/simulation authority.

The active bottle itself owns drag presentation. No clone or receiver-local replacement is created. Leaving the aperture clears only its aperture-local mask; entering a receiver applies that receiver's local mask. An outside drop restores the same actor to the inspection anchor without consuming it. Pointer ownership blocks additional pointers and is cancelled when the round completes or the timer expires.

The right-wing gearbox is now split into rear housing, mechanism, housing, and sparse service-detail depths. Authored gear teeth, spokes, hubs, axle caps, brackets, and fasteners replace the earlier flat disks, while the raw-looking square is now a fitted maintenance plate. The duplicate Tools bottle rack was removed after visual review because it repeated the Botanicals shelf and obscured the gear silhouettes. A narrow brass conduit, pressure gauge, valve wheel, and pipe clamps now finish the service bay without adding another storage rectangle. Gear motion is slow, linked, and disabled under reduced motion.

## Material and asset use

Primary identity uses the approved stylized fantasy materials. Realistic Metal008 brass remains a limited focal accent. Potion and receiver art comes from the cleaned H5.48C sheet using regions 1–3 and 17–19. Denied regions 9 and 14 are absent from production configuration.

## Responsive strategy

The room retains the approved 1600×900 logical composition. A uniform fill scale and optical camera center preserve the conveyor, aperture, queue, destinations, HUD, and instructions. Decorative room edges carry the crop. The final camera correction moved the optical center downward enough to retain all three receiver nameplates at 1920×1080 without changing Composition C.

## Gameplay and motion verification

Automated browser QA covers:

- initial queue;
- selection feedback;
- red bottle visible in transit;
- correct red containment and queue advance;
- intentionally incorrect blue-to-green placement and combo reset;
- completion after all six bottle entities resolve;
- minimum-window initial and correct states;
- actual 30-second timer expiry.

H6.6A browser QA additionally covers:

- tap-correct and tap-wrong outcomes through the retained input path;
- drag start and restrained receiver hover feedback;
- correct and wrong drag resolution exactly once;
- outside-drop return with no queue/score/combo mutation;
- stable actor continuity through inspection → drag → hover → containment;
- mixed tap/drag round completion;
- a drag already in progress becoming inert at real timer expiry;
- corrected sparse gearbox/service-bay composition at 1920×1080 and 1024×640;
- reduced-motion suppression of continuous gear rotation;
- a 41.36-second real-runtime motion recording covering both input paths.

The evidence audit records stable actor IDs across these transitions. No travelling actor is swapped for a receiver-local replica.

## Deferred work

This lane does not add reset/replay, audio, particles, shaders, dynamic shadows, or new production assets. Those remain separate decisions.

## Evidence

`games/tier-1/02-potion-sorter/evidence/h6-6-live-composition-c-scenerig/`
