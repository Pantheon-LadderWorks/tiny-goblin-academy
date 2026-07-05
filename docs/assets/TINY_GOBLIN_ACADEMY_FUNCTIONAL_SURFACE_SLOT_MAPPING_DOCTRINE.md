# Tiny Goblin Academy — Functional Surface Slot Mapping Doctrine

## Purpose

Functional surface slot mapping defines how a cleaned visual asset may later hold dynamic content.

Region mapping identifies assets. Cleanup makes assets visually usable. Functional slot mapping defines where dynamic content belongs.

## Core Distinction

Region mapping answers:

```text
What is this asset?
```

Functional slot mapping answers:

```text
How can this asset be used as a surface?
Where may text, icons, badges, art, fills, overlays, and states belong?
```

Example:

```text
Region mapping:
This is a speech bubble.

Functional slot mapping:
This speech bubble has a text-safe area, icon corner, tail direction, padding, and overflow risk.
```

## Functional Surface Types

Functional surfaces include:

- card frames;
- card backs when used as state surfaces;
- HUD panels;
- dialogue panels;
- speech bubbles;
- status panels;
- buttons;
- progress bars;
- badges;
- tokens;
- shop/resource panels;
- quest/status cards.

These are not merely stickers. They are assets with internal rules.

## Relationship To Scene Anchors

This is the same pattern as scene anchors, but inside an asset instead of across a background.

```text
Scene anchors teach a background where things belong.
Functional slots teach a UI/card surface where data belongs.
```

Both patterns should be:

- semantic;
- reviewable;
- evidence-backed;
- reusable;
- separated from runtime approval.

## Slot Types

Slot manifests may define:

- text-safe areas;
- icon-safe areas;
- art/image areas;
- badge areas;
- overlay zones;
- disabled-state zones;
- locked-state zones;
- selection/highlight zones;
- progress-fill zones;
- click/tap zones;
- padding and overflow risks.

Slots should be semantic, not hardcoded runtime coordinates.

## Relative Rectangles

Functional slots should use relative rectangles inside a source surface:

```json
{
  "xPct": 0.1,
  "yPct": 0.1,
  "wPct": 0.8,
  "hPct": 0.2
}
```

These percentages describe the slot inside the mapped surface bounds. They are not global runtime coordinates.

## Fit / Overflow Policy

Overflow risk is part of functional surface mapping.

When content does not fit a slot, future layout planning may consider:

- scaling the card/surface instance up within the available view or playfield budget;
- scaling content down;
- wrapping text;
- truncating with ellipsis;
- reducing content density;
- choosing a larger surface variant.

Scaling a surface up is valid when it improves readability, but it must be bounded by the overall view, mobile layout, and gameplay readability. Functional slot mapping may record this as a fit option, but it does not approve runtime scaling values.

## Runtime Boundary

Functional slot mapping does not approve:

- runtime UI wiring;
- runtime coordinates;
- text rendering into assets;
- game behavior;
- card gameplay;
- interaction logic;
- hitboxes;
- click/tap handling.

Runtime still needs a separate integration lane.

## Tiny Doctrine

```text
A frame is not a sticker.
A panel is not a sticker.
A functional surface is an asset with internal rules.
```
