# Tiny Goblin Academy — H5.38 Functional Surface Slot Mapping + Card Frame Pilot

## Purpose

H5.38 introduces functional surface slot mapping and applies it first to the reviewed Card Goblin Duel card frames.

H5.38 introduces functional surface slot mapping. Region mapping identifies an asset; cleanup prepares a derived visual candidate; functional slot mapping defines where dynamic content may later belong inside the asset. This applies to card frames and also to UI/HUD panels, dialogue panels, speech bubbles, buttons, progress bars, badges, and other data-bearing surfaces. H5.38 does not approve runtime UI, render text into assets, create gameplay behavior, or wire Card Goblin Duel.

## Insight / Doctrine

Card frames and UI/HUD pieces are not just stickers. They are functional surfaces.

Region mapping tells us what an asset is. Functional slot mapping tells us where data, icons, text, badges, overlays, fills, and state markers may appear.

This is the same fractal as scene anchors:

```text
Scene anchors teach a background where things belong.
Functional slots teach a UI/card surface where data belongs.
```

## Relationship To H5.34-H5.37

H5.34 mapped the Card Goblin Duel card-frame regions.

H5.35 accepted the 32 mapped regions for draft cleanup/planning use.

H5.36 created a derived transparent cleanup candidate.

H5.37 accepted the cleanup candidate for draft pipeline use.

H5.38 now adds an internal-use planning layer on top of those reviewed assets.

## Functional Surface Pattern

The pattern is:

```text
region mapping
→ cleanup candidate
→ functional slots
→ future runtime integration
```

Functional slots are semantic planning records. They use relative rectangles inside each surface. They do not approve runtime coordinates.

## Card Frame Slot Pilot

Created pilot manifest:

`manifests/academy.card-goblin-duel.card-frames.functional-slots.json`

Pilot scope:

- 32 card-frame functional surfaces;
- 122 draft functional slots;
- blank/overlay-ready card surfaces;
- front card frames;
- highlighted states;
- disabled/locked states;
- card backs;
- deck stack/fanned backs;
- board slots and card slots;
- open frames.

Common slot candidates include:

- title slots;
- art/icon slots;
- body text slots;
- cost/value badge slots;
- status overlay slots;
- selection/highlight zones;
- disabled overlay zones;
- locked state zones;
- empty drop zones;
- board occupancy zones;
- deck count badge zones.

All slots remain `draft-review` and `needs-human-review`.

## Fit / Overflow Note

Overflow risk is now part of the slot doctrine.

If dynamic content does not fit a card or UI surface, future layout planning may scale the card/surface instance up within the available view or playfield budget. Scaling up is a valid design option when it improves readability, but H5.38 does not approve runtime scaling values.

Other future fit responses may include content scale-down, text wrapping, truncation, reduced content density, or choosing a larger surface variant.

## UI/HUD Future Target Note

The UI/HUD sheet should receive this same treatment later.

Future functional slot mapping should apply to:

- HUD panels;
- dialogue panels;
- speech bubbles;
- buttons;
- progress bars;
- badges;
- status panels;
- quest/shop/resource panels.

Those surfaces should not be treated merely as stickers once they start carrying dynamic information.

## Evidence Created

Created evidence folder:

`assets/academy/evidence/h5-38-card-goblin-duel-functional-slots/`

Evidence files:

- `card-frame-functional-slot-overlay.png`
- `card-frame-functional-slot-contact-sheet.png`
- `card-frame-functional-slot-table-preview.png`
- `functional-surface-pattern-preview.png`

Evidence is labeled as draft functional slot mapping. It does not approve runtime UI or game wiring.

## Non-Goals

H5.38 does not:

- create runtime UI;
- create card gameplay;
- render text into assets;
- modify source images;
- modify cleaned candidate images;
- process the Card Goblin Duel UI/tokens sheet;
- process the UI/HUD sheet;
- wire game code;
- approve runtime layout;
- approve runtime scaling values.

## Human/Product Review Notes

Human review should check:

- whether slot locations make visual sense for each card-frame type;
- whether blank/overlay-ready card surfaces preserve enough body/text space;
- whether front frames use their portrait/banner/body areas sensibly;
- whether card backs avoid implying front-face text behavior;
- whether board/card slots correctly act as occupancy/drop-zone surfaces;
- whether fit/overflow guidance should allow bounded scale-up as a future design response.

## Recommended Next Step

Recommended next lane:

```text
H5.39 — Card Frame Functional Slot Human Review
```

Alternative:

```text
H5.39 — Card Goblin Duel UI/Tokens Sheet Intake + Region Mapping
```
