# Tiny Goblin Academy — H5.34 Card Goblin Duel Card Frames Region Mapping

## Purpose

H5.34 opens the Card Goblin Duel card-frame lane with source inspection, draft semantic region mapping, and review evidence.

This pass maps only:

`assets/academy/games/card-goblin-duel/tga-card-goblin-duel-card-frames-concept-v0.1.png`

The Card Goblin Duel UI/tokens sheet is intentionally out of scope for this pass.

## Source Sheet Inspection

Source metadata:

- Dimensions: `1024x1024`
- Mode: `RGB`
- Alpha: none
- Transparency status: baked checkerboard / fake transparency
- Source PNG status: untouched

The sheet is visually arranged as four rows of card-frame/card-surface material with eight columns per row. Region boundaries were mapped around visible card/frame silhouettes rather than treating every visual slot as a perfect runtime-ready atlas cell.

## Region Mapping Summary

H5.34 created:

`manifests/academy.card-goblin-duel.card-frames.regions.json`

Mapped draft regions: 32

Category breakdown:

- `empty-card-surface`: 1
- `card-front-frame`: 7
- `highlighted-card-state`: 3
- `disabled-card-state`: 1
- `card-back`: 9
- `board-slot`: 4
- `card-slot`: 2
- `overlay-ready-card-surface`: 5

All regions remain:

- `status: draft`
- `usage: draft-review`
- `reviewStatus: needs-human-review`
- `runtimeEligibility: not-runtime-approved`

## Semantic Groups

The mapped sheet includes:

- blank card surfaces for future overlay/composition use;
- front card frames with banner/nameplate areas;
- highlighted and disabled card-state candidates;
- card backs, deck stack, and fanned card-back candidates;
- board and card-slot placement surfaces;
- open frame / overlay-ready card surfaces.

These are semantic discovery regions, not runtime-approved UI components.

## Cleanup Recommendation

The source image is RGB with no alpha channel, and the visible checkerboard is baked into the pixels.

Recommended next processing step after human review:

```text
H5.36 — Card Goblin Duel Card Frames Cleanup Candidate
```

Cleanup should be performed on a derived candidate only. The source PNG should remain untouched. The cleanup pass should preserve the interior parchment surfaces, glow states, open-frame holes, and fine border details carefully.

## Evidence Created

Evidence folder:

`assets/academy/evidence/h5-34-card-goblin-duel-card-frames-region-mapping/`

Created evidence:

- `card-goblin-duel-card-frames-bbox-overlay.png`
- `card-goblin-duel-card-frames-numbered-contact-sheet.png`
- `card-goblin-duel-card-frames-region-table-preview.png`
- `card-goblin-duel-card-frames-source-inspection-preview.png`

The evidence is for review and mapping verification only. It does not approve runtime use.

## Non-Goals

H5.34 does not:

- modify the source PNG;
- create a derived cleanup candidate;
- clean checkerboard backgrounds;
- process the Card Goblin Duel UI/tokens sheet;
- approve runtime use;
- wire Card Goblin Duel into game code;
- create card gameplay behavior;
- create animation manifests;
- process Potion Sorter, Farm/Settlement, Dungeon Platformer, Top-Down Slime Quest, or Shared FX;
- run Tauri, Rust, or Cargo.

## Human/Product Review Notes

Human review should check:

- whether each card/frame crop is correctly separated;
- whether blank surfaces and open frames are semantically useful as separate regions;
- whether card backs, deck stacks, and fanned cards should remain grouped as mapped;
- whether highlighted/disabled states are clear enough for future cleanup;
- whether any frame needs tighter sourceRect adjustment before cleanup.

The UI/tokens sheet should receive its own future lane because it contains different asset types and known baked text risk.

## Recommended Next Step

Recommended next lane:

```text
H5.35 — Card Goblin Duel Card Frames Region Human Review
```

Tiny verdict:

```text
The card frames are mapped.
The checkerboard is still fake.
The duel table does not get runtime cards yet.
```
