# Tiny Goblin Academy — H5.39 Card Frame Functional Slot Correction Pass

## 1. Purpose

H5.39 corrects the H5.38 Card Goblin Duel card-frame functional slot pilot before any human-review promotion.

The pass keeps the slot map in draft status while rationalizing which slots belong to which surface types.

## 2. Review Finding

Kryssie reviewed the H5.38 evidence and found that the pilot over-applied a generic card-face slot template to surfaces that should not own those slots.

The H5.38 doctrine was valid: a frame, panel, bubble, button, or card surface is not just a sticker. It is a surface with internal rules.

The correction is that not every surface has the same rules.

## 3. What Was Correct

H5.38 correctly established the functional-surface concept:

- surfaces can carry semantic slot zones;
- slots should use surface-relative percentage rectangles;
- text should not be rendered into source assets;
- runtime UI and gameplay wiring must remain separate;
- overflow and scale-up decisions need bounded future review.

The H5.38 evidence was useful as a first pilot and correctly demonstrated the need for a slot doctrine.

## 4. What Needed Correction

The first pilot assigned normal card-face slots to transparent/open frames.

That was the wrong semantic model. Transparent/open frames do not own title/body/art content unless a solid content surface exists inside them.

Corrected issue summary:

- transparent/open frames no longer receive title/body/art/cost card-face slots;
- card backs remain card-back identity surfaces;
- deck stacks and fanned backs remain deck/group surfaces;
- board/card slots remain drop/occupancy surfaces;
- solid card faces and front frames may keep content slots where visually sensible.

## 5. Surface-Type Slot Rules

Functional slot mapping must be surface-type aware. A solid card face, card back, deck stack, board slot, and transparent open frame do not all own the same internal content slots. Transparent frames and board slots are containers or mount surfaces; they should not receive title/body/art slots unless a solid content surface exists inside them. H5.39 corrects the draft slot map only and does not approve runtime UI or card gameplay wiring.

### A. Solid blank / overlay-ready card surfaces

Allowed draft slots:

- status-overlay-slot
- cost-or-value-badge-slot
- title-slot
- art-or-icon-slot
- body-text-slot
- selection-highlight-zone

### B. Front card frames with visible content structure

Allowed draft slots:

- status-overlay-slot
- cost-or-value-badge-slot
- portrait/art-or-icon-slot
- title-banner-slot
- body-text-slot
- selection-highlight-zone

### C. Card backs, deck stacks, and fanned card backs

Allowed draft slots:

- card-back-identity-zone
- locked-state-zone when visually applicable
- deck-count-badge-zone for deck stacks
- group-status-overlay-zone for fanned/grouped backs

### D. Board/card slots and highlighted empty slots

Allowed draft slots:

- empty-drop-zone
- occupied-card-zone / board-occupancy-zone
- valid-target-highlight-zone
- invalid-target-highlight-zone when useful
- selection-highlight-zone when highlighted

### E. Transparent/open frames

Allowed draft slots:

- child-card-mount-zone
- content-window-zone
- frame-decoration-zone
- selection-highlight-zone

These surfaces no longer receive title/body/art/cost slots.

## 6. Corrected Slot Results

- Surfaces mapped: 32
- H5.38 draft slot count: 122
- H5.39 corrected draft slot count: 116
- Corrected open-frame surfaces: 3
- Runtime approval: none
- Slot approval: none
- Review status: needs-human-review

Corrected surfaces:

1. `card-goblin-duel.card-frames.card-front-frame.gold-ornate-open-frame`
2. `card-goblin-duel.card-frames.card-front-frame.wood-open-card-frame`
3. `card-goblin-duel.card-frames.card-front-frame.corner-ornate-open-frame`

Each corrected open frame changed from six generic card-face slots to four frame/container slots:

- child-card-mount-zone
- content-window-zone
- frame-decoration-zone
- selection-highlight-zone

## 7. Evidence Created

Evidence folder:

`assets/academy/evidence/h5-39-card-goblin-duel-functional-slot-corrections/`

Evidence files:

- `card-frame-functional-slot-corrected-overlay.png`
- `card-frame-functional-slot-corrected-contact-sheet.png`
- `card-frame-functional-slot-corrected-table-preview.png`
- `functional-slot-correction-summary.png`

Evidence labels state that this is corrected draft functional slot mapping, not runtime UI, no text rendered into assets, no game wiring, and that transparent/open frames use mount/window slots rather than card-face text slots.

## 8. Runtime Boundary

H5.39 does not approve runtime UI.

H5.39 does not approve card gameplay wiring.

H5.39 does not approve global/runtime coordinates.

H5.39 preserves `status: draft`, `reviewStatus: needs-human-review`, `runtimeEligibility: not-runtime-approved`, and `slotApproval: none`.

## 9. Non-Goals

H5.39 did not:

- modify source PNGs;
- modify cleaned candidate images;
- process the Card Goblin Duel UI/tokens sheet;
- create runtime UI;
- render text into assets;
- create card gameplay code;
- approve runtime card layout.

## 10. Recommended Next Step

Recommended next lane:

`H5.40 — Card Frame Functional Slot Human Review`

H5.40 should review the corrected evidence and decide whether the draft surface-aware slot map is ready for promotion or requires another correction pass.
