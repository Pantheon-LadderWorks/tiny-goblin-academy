# Tiny Goblin Academy — H5.57 Shared FX / Feedback Sheet Deferred Decision

## Purpose

H5.57 records a docs-only deferral decision for the Shared FX / Feedback concept sheet.

This pass does not map, clean, derive, or runtime-wire the sheet.

## Source Candidate

- Source: `assets/academy/shared-fx/tga-shared-fx-feedback-sheet-concept-v0.1.png`
- Dimensions: `1024x1024`
- Mode: `RGB`
- Alpha finding: no alpha channel
- Current role: shared FX / feedback concept reference

## Decision

The Shared FX / Feedback sheet is deferred as a cleanup/runtime source.

Current policy:

- cleanup status: deferred
- source role: reference-only / concept-only
- replacement path: particle-first where practical
- fallback path: regenerate specific needed sprite FX as true-alpha one-offs
- runtime eligibility: not-runtime-approved

## Reason Cleanup Was Deferred

This sheet contains the exact asset types most likely to fail fake-checker cleanup:

- glows
- smoke
- dust
- fire
- sparkles
- rain
- clouds
- light blooms
- magic rings
- streaks
- bursts
- translucent-looking soft edges

Because the source is RGB with no alpha, the fake checkerboard/background is baked into the soft FX edges. Based on prior H5 cleanup experience, broad cleanup would likely retain checkerboard ghosts, damage soft edges, or produce assets worse than particle/procedural equivalents.

## Future Replacement Policy

Shared FX should be particle-first where practical.

If a game later needs a specific sprite FX:

1. Regenerate or export that FX as a true-alpha asset.
2. Run it through the normal asset workflow from intake onward.
3. Keep runtime, animation, particle, and gameplay approval separate.

The current concept sheet may remain useful as visual reference for effect families and future prompt direction, but it should not be treated as a cleaned runtime atlas.

## Runtime Boundary

H5.57 does not approve:

- runtime FX assets
- animation timing
- particle implementation
- gameplay feedback behavior
- shared runtime wiring
- derived cleanup candidates
- region manifests

## Non-Goals

- No source PNG modification.
- No region mapping.
- No sourceRects.
- No cleanup candidate.
- No derived PNGs.
- No evidence PNGs.
- No runtime/game code changes.
- No Shared FX runtime integration.
- No Top-Down Slime Quest processing.

## Recommended Next Lane

Wait for Kryssie’s next image/source sheet.

Suggested current routing from the active handoff:

H5.58 — Top-Down Slime Quest Source Inventory + Lane Routing

## Tiny Law

FX made of smoke, glow, sparkle, and lies should not be cleaned like barrels.

Use particles first. Regenerate only what earns its keep.
