# Tiny Goblin Academy H6.21B — Optical Typography and CardRig Motion

**Status:** Implementation complete; automated validation and replacement-2 external evidence passed; Human Visual Review passed.

**Baseline:** `a13717fb15509fe9128d7df784c155757234e12f`

**Game:** Level 04 — Card Goblin Duel

**Lane:** Optical card typography correction and preview-only deterministic CardRig motion laboratory.

```yaml
h6_21BImplementationComplete: true
h6_21BTechnicalValidationPassed: true
h6_21BHumanVisualReviewPassed: true
h6_21BLiveGameplayIntegrated: false
h6_22StartedDuringH6_21B: false
```

## CardRig authority

CardRig preserves each semantic DOM card as the accessible input surface while one typed presentation authority owns temporary motion state. It uses an injectable animation clock, deterministic route records, cancellation, cleanup, resize safety, fixture replacement safety, and full/reduced-motion selection.

The governed physical anchors are:

- `player-draw-origin`;
- `played-card-target`;
- `player-discard-target`;
- `hand-slot-0..2`.

The status rail is not a physical card-motion destination. The preview laboratory consumes injected presentation fixtures only and does not alter simulation rules, HP, queue order, Spark authority, terminal authority, or Hub Ledger behavior.

## Approved route grammar

- Initial and refill draws travel from the player draw pile into the exact hand slot.
- A played card travels from its hand slot to the central played-card target.
- The central played card then travels to the player discard well.
- Spark’s replacement card travels directly from its hand slot to the discard well.
- Spark refill cards travel from the draw pile to the exact vacated hand slots.
- Heavy Bonk preserves the skipped-draw vacancy instead of fabricating a refill.

Replacement-1 was technically complete but geographically rejected because card provenance and destination were wrong. Replacement-2 corrected those routes. The opening-card anchor race was also fixed so the first draw begins at the governed deck origin; final evidence measured a `0.00px` origin delta.

Full and reduced initial deal, hover and keyboard focus, normal commitment and refill, Heavy Bonk vacancy, Spark’s full sequence, terminal locking/reset, reset cancellation, and resize cancellation are approved. Terminal-card accessibility labels were corrected.

## Final evidence

External authority:

```text
D:\Projects\Active\Tiny-Goblin-Academy\Evidence\level-04-card-goblin-duel\
h6-21b-optical-typography-card-rig-motion-lab-replacement-2\
capture-20260724t204416z-p7568
```

Portable manifest:

```text
docs/evidence/external-runs/level-04-card-goblin-duel/
h6-21b-optical-typography-card-rig-motion-lab-replacement-2/
capture-20260724t204416z-p7568.json
```

Replacement-2 is the final H6.21B authority. Replacement-1 remains preserved as superseded evidence. The brief plain fixture bootstrap page at the beginning of the approved recording is classified as capture presentation noise, not a CardRig defect.

## Preserved boundaries

H6.21B does not integrate CardRig into live gameplay. It does not change simulation rules, card effects, card faces, icons, typography dimensions, tabletop artwork, Hub Ledger behavior, packages, lockfiles, audio, particles, shaders, or production structured-event authority.

H6.22 had not begun during H6.21B. H6.22A may begin only after this lane is committed, pushed, synchronized, and the working tree is clean.
