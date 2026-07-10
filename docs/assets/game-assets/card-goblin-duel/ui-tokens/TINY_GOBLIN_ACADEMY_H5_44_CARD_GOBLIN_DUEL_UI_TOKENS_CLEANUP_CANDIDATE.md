# Tiny Goblin Academy — H5.44 Card Goblin Duel UI/Tokens Cleanup Candidate

## 1. Purpose

H5.44 creates a derived transparent cleanup candidate for the reviewed Card Goblin Duel UI/tokens regions.

This pass removes the baked checkerboard-style source background from a derived copy only. It does not approve runtime UI, functional slot mapping, text rendering, gameplay behavior, or Card Goblin Duel wiring.

## 2. Source Inputs

Source sheet:

```text
assets/academy/games/card-goblin-duel/tga-card-goblin-duel-ui-tokens-concept-v0.1.png
```

Reviewed region manifest:

```text
manifests/academy.card-goblin-duel.ui-tokens.regions.json
```

Source metadata:

```text
dimensions: 1024x1024
source format: RGB / opaque concept sheet
alpha: none
finding: baked checkerboard-style background / fake transparency
```

## 3. Relationship To H5.41-H5.43

H5.41 created the first UI/tokens draft region mapping.

H5.42 corrected that mapping from 32 broad/paired regions into 48 individual visible asset regions, removed blank/no-asset regions, and repaired sourceRects with protective review padding.

H5.43 accepted the repaired 48-region map for draft cleanup and planning use. H5.44 uses that reviewed mapping as its source of truth.

## 4. Cleanup Method

H5.44 preserves the original 1024x1024 sheet layout in a derived RGBA PNG.

The cleanup method is conservative:

- each reviewed sourceRect is cropped from the source;
- only strict-neutral checkerboard/grid-like pixels connected to crop edges are made transparent;
- colored/desaturated UI surfaces are preserved;
- the cleaned crop is composited back into the same position on the derived sheet;
- H5.42/H5.43 sourceRects remain unchanged, including row 2 128x192 protective review bounds.

During evidence inspection, an earlier cleanup attempt over-cleaned the desaturated clock/time badge. The cleanup key was tightened before commit so the clock face remains preserved.

## 5. Derived Outputs

Derived cleaned sheet:

```text
assets/academy/games/card-goblin-duel/derived/tga-card-goblin-duel-ui-tokens-cleaned-v0.1.png
```

Cleanup candidate manifest:

```text
manifests/academy.card-goblin-duel.ui-tokens.cleanup-candidate.json
```

## 6. Cleanup Results

```text
regions processed: 48
functional-surface candidates preserved as metadata: 18
status: draft
reviewStatus: needs-human-review
runtimeEligibility: not-runtime-approved
```

Risk summary:

```text
high: 12
medium-high: 13
medium: 7
low: 16
```

## 7. Edge Risk Findings

High-risk cleanup review areas:

- effect icons with glows, sparkles, smoke, bursts, or swirl details;
- divider ornaments with thin strokes;
- the Active Turn marker because it is text-bearing;
- desaturated UI surfaces such as the clock/time badge.

Medium-high review areas:

- buttons;
- label surfaces;
- icon-button bubbles;
- laurel badges;
- click-surface candidates where borders and shadows define readability.

These are risk flags, not automatic failures.

## 8. Functional Surface Candidate Boundary

H5.44 preserves functional-surface candidate flags as planning metadata only.

H5.44 creates a derived transparent cleanup candidate for the reviewed Card Goblin Duel UI/tokens regions. The cleaned candidate remains draft-review only and is not runtime-approved. Functional-surface candidate flags remain planning metadata only; H5.44 does not perform functional slot mapping, render text into assets, create runtime UI, approve card gameplay behavior, or wire Card Goblin Duel.

## 9. Evidence Created

Evidence folder:

```text
assets/academy/evidence/h5-44-card-goblin-duel-ui-tokens-cleanup/
```

Evidence files:

```text
card-goblin-duel-ui-tokens-cleanup-before-after-contact-sheet.png
card-goblin-duel-ui-tokens-cleaned-derived-sheet-preview.png
card-goblin-duel-ui-tokens-cleanup-edge-risk-preview.png
card-goblin-duel-ui-tokens-cleanup-table-preview.png
card-goblin-duel-ui-tokens-functional-surface-cleanup-preview.png
```

Evidence labels state:

```text
draft cleanup candidate
source PNG untouched
not runtime-approved
no functional slot mapping
no text rendering
no game wiring
```

## 10. Non-Goals

This pass does not:

- modify the source PNG;
- alter H5.42/H5.43 mapping evidence;
- perform functional slot mapping;
- approve runtime UI;
- render text into assets;
- create card gameplay code;
- wire Card Goblin Duel runtime;
- modify card-frame manifests or images;
- process unrelated asset lanes.

## 11. Human/Product Review Notes

Human review should focus on:

- whether checkerboard leftovers remain around compact icons;
- whether glows, sparkles, smoke, dividers, and soft FX survived cleanup;
- whether the Active Turn baked text remains readable;
- whether button/label/badge surfaces preserved borders and shadows;
- whether row 2 cleanup looks acceptable with the 128x192 protective bounds.

The cleanup candidate is intentionally conservative. If a fragile FX asset still carries slight edge noise, review should decide whether that is acceptable, needs a small correction, or should be regenerated later.

## 12. Recommended Next Step

Recommended next lane:

```text
H5.45 — Card Goblin Duel UI/Tokens Cleanup Human Review + Promotion
```

Tiny cleanup law:

```text
The goblins are separated.
The fake void is removed from a copy.
Runtime still waits.
```
