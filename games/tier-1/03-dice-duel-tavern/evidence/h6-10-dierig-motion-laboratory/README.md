# H6.10 Persistent DieRig Motion Laboratory Evidence

This shelf proves one isolated Phaser `Mesh2D` DieRig against the reviewed Dice Duel flat-face authority. It is review evidence, not live-game integration or production approval.

## Captures

- `01-initial-*`: isolated laboratory at both supported desktop contracts.
- `02-settled-face-1-*` through `02-settled-face-6-*`: all six injected results at 1920×1080.
- `03-settled-face-*`: representative minimum-desktop results.
- `04-*` and `05-*`: moving and settled topology diagnostics.
- `06-six-face-contact-sheet.png`: one review plate for all six upper faces.

## Recordings

- `01-full-six-face-injected-results.webm`
- `02-persistent-actor-repeat-rolls.webm`
- `03-reduced-motion-representative-faces.webm`
- `04-full-vs-reduced-comparison.webm`
- `05-overlap-rejection-proof.webm`

## Telemetry

Machine-readable JSON covers full and reduced paths for faces 1, 4, and 6, repeated use of the same actor, and deterministic rejection of an overlapping request. Each representative record includes the requested result, actor ID, seed, exact scheduled phase spans, impact/completion counts, settled top face, final local position, final orientation, and total duration.

`capture-report.json` records browser console/page-error status. `capture-h6-10.mjs` regenerates the packet against the isolated lab at `http://127.0.0.1:4314/dierig-lab.html`.

Human motion review passed on 2026-07-19. The large laboratory die remains valid inspection evidence; H6.11 production integration must settle at approximately 70–75% of the laboratory scale, targeting roughly 22–27% of the live tray's inner width. No evidence recapture or laboratory resize is required.

```text
humanMotionReviewPassed: true
motionLaboratoryApproved: true
persistentActorApproved: true
sixFaceTopologyApproved: true
fullMotionApproved: true
reducedMotionApproved: true
injectedResultAuthorityApproved: true
concurrentRequestGuardApproved: true
laboratoryInspectionScaleApproved: true
productionScaleCorrectionRequired: true
productionIntegrationReady: true
productionIntegrated: false
runtimeRandomD6Integrated: false
liveGameplayChanged: false
```
