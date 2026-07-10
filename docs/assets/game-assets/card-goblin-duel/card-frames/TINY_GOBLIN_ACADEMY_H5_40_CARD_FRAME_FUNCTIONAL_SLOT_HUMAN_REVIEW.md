# Tiny Goblin Academy - H5.40 Card Frame Functional Slot Human Review

## 1. Purpose

H5.40 records Kryssie's human/product review decision for the corrected H5.39 Card Goblin Duel card-frame functional slot mapping.

This is a review and promotion metadata pass only. It accepts the corrected surface-type-aware slot semantics for draft planning use.

## 2. Review Input

Review input:

- H5.39 correction commit: `a996a1a docs: correct card frame functional slot mapping`
- Corrected manifest: `manifests/academy.card-goblin-duel.card-frames.functional-slots.json`
- Corrected evidence folder: `assets/academy/evidence/h5-39-card-goblin-duel-functional-slot-corrections/`
- Surfaces represented: 32
- Corrected draft slots represented: 116

H5.39 corrected the H5.38 pilot by replacing generic card-face slots on transparent/open frames with container and mount semantics.

## 3. Human Review Decision

H5.39 Human Review Passed.

The corrected Card Goblin Duel card-frame functional slot mapping is accepted for draft planning use.

No further correction pass is needed before moving to the next asset lane.

The accepted mapping remains not runtime-approved and does not authorize UI implementation or card gameplay wiring.

## 4. Accepted Corrected Slot Semantics

Accepted semantics:

- Solid blank/front card surfaces may own card-face content slots.
- Card backs use identity, locked, deck-count, and group-status zones.
- Board/card slots use drop, occupancy, and target-highlight zones.
- Transparent/open frames use child-card-mount, content-window, frame-decoration, and selection zones.
- Transparent/open frames should not receive title/body/art slots unless a solid content surface exists inside them.

## 5. Surface-Type Rules Confirmed

H5.40 confirms the H5.39 surface-type-aware rule set:

- card faces are content surfaces;
- card backs are identity surfaces;
- deck stacks and fanned backs are group or deck state surfaces;
- board/card slots are placement and occupancy surfaces;
- transparent/open frames are containers or mount surfaces.

H5.40 accepts the corrected H5.39 Card Goblin Duel functional slot mapping for draft planning use only. Functional slots define where dynamic content may later belong inside reviewed card-frame surfaces, but they do not approve runtime UI, exact layout implementation, text rendering, card gameplay, or Card Goblin Duel wiring.

## 6. Runtime Boundary

Runtime boundary retained:

- `runtimeEligibility: not-runtime-approved`
- `slotApproval: none`
- no runtime UI approval;
- no card gameplay approval;
- no exact runtime/global coordinates;
- no text rendering into assets;
- no visual integration approval.

The manifest status is promoted only to reviewed / human-review-passed for draft planning use.

## 7. Relationship To Future UI/HUD Slot Mapping

H5.40 makes the corrected H5.39 approach the reference pattern for future UI/HUD functional slot mapping.

Future UI/HUD surfaces should not be treated as generic stickers. Buttons, panels, progress bars, speech bubbles, status badges, and card frames should each receive surface-specific slot semantics.

The next UI/tokens lane should use this doctrine from the start instead of applying one generic slot template everywhere.

## 8. Non-Goals

H5.40 did not:

- change functional slot geometry;
- regenerate evidence;
- modify source PNGs;
- modify cleaned candidate images;
- process the Card Goblin Duel UI/tokens sheet;
- create runtime UI;
- render text into assets;
- create card gameplay code;
- approve runtime card layout.

## 9. Recommended Next Step

Recommended next lane:

`H5.41 - Card Goblin Duel UI/Tokens Sheet Intake + Region Mapping`

That lane should carry forward the H5.39/H5.40 doctrine: UI pieces are not just stickers. They are future functional surfaces with their own internal rules.
