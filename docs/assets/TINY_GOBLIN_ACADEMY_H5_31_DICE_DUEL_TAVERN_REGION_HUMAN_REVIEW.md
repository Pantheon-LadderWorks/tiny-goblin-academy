# Tiny Goblin Academy — H5.31 Dice Duel Tavern Region Human Review + Roll Illusion Note

## Purpose

H5.31 records Kryssie's human/product review of the H5.30 Dice Duel Tavern region mapping and preserves a future code-driven dice roll illusion idea as planning metadata only.

H5.31 accepts the H5.30 Dice Duel Tavern region mapping for draft cleanup and planning use only. This does not approve runtime assets, dice roll implementation, animation timing, probability logic, gameplay behavior, or Dice Duel Tavern wiring. The future roll illusion note identifies candidate source regions for a later code-driven roll effect, but it is not an animation manifest or runtime plan.

## Review Input

Reviewed H5.30 inputs:

- `docs/assets/TINY_GOBLIN_ACADEMY_H5_30_DICE_DUEL_TAVERN_REGION_MAPPING.md`
- `manifests/academy.dice-duel-tavern.regions.json`
- `assets/academy/evidence/h5-30-dice-duel-tavern-region-mapping/`

The reviewed evidence included the bbox overlay, numbered contact sheet, region table preview, and source inspection preview.

## Human Review Decision

Decision:

```text
H5.30 Human Review Passed
```

No sourceRect correction pass is required.

The region manifest is now accepted for draft cleanup and planning use:

- `status: reviewed`
- `reviewStatus: human-review-passed`
- `pipelineUse: accepted-for-draft-cleanup-and-planning-use`
- `runtimeEligibility: not-runtime-approved`

## Accepted Region Mapping

Accepted region count: 64

Accepted category shape:

- dice faces: flat result/reveal faces 1-6;
- dice roll effects: tumbling, tilted, rolling, dust, smoke, spiral, and burst ingredients;
- feedback FX: sparkles, bursts, and impact/readability effects;
- duel tokens: shield, sword, hand, heal, scroll, heart, crossed swords, and related marker variants;
- tavern props: mug, candle, cup, trays, food plate;
- reward tokens: coins, pouch, medals, laurels;
- UI markers: reroll, parchment, warning symbols;
- background props: sign and table corner.

Individual regions remain draft sourceRect records. They are not runtime-approved assets.

## Cleanup Status

Cleanup remains deferred.

The Dice Duel Tavern source sheet is `1024x1024` RGB with no alpha and baked checkerboard / fake transparency. The source PNG remains untouched.

Recommended cleanup path:

```text
H5.31 reviewed mapping
↓
future derived cleanup candidate
↓
human review
↓
only then consider runtime visual integration
```

## Future Roll Illusion Planning Note

H5.31 records a future code-driven dice roll illusion candidate as draft planning metadata.

The idea:

```text
flat die faces 1-6
+
rolling / tumbling / tilted dice candidates
+
sparkle / dust / spiral / burst / smoke FX candidates
=
future code-driven roll illusion recipe
```

Potential future behavior:

- use flat die faces 1-6 as final reveal/result faces;
- use rolling, tumbling, tilted, glowing, paired, or clustered dice as throw/tumble illusion candidates;
- use sparkles, dust puffs, spiral effects, burst effects, or smoke wisps as optional feedback;
- let code fake the roll through face cycling, shake, bounce, rotation, and final reveal.

This remains a future planning note only. It is not an animation manifest, runtime implementation, probability model, or gameplay approval.

## Runtime Boundary

H5.31 does not approve:

- runtime dice roll implementation;
- animation timing;
- frame sequences;
- pivots, anchors, hitboxes, or collision logic;
- probability or gameplay logic;
- Phaser wiring;
- Dice Duel Tavern runtime visual integration;
- cleaned runtime assets.

## Non-Goals

H5.31 does not:

- modify the source PNG;
- run cleanup;
- create derived cleaned assets;
- create runtime roll code;
- create animation manifests;
- assign timing, pivots, hitboxes, or probability logic;
- change Dice Duel Tavern game code;
- process Card Goblin Duel;
- process Potion Sorter;
- process Farm/Settlement;
- process Dungeon Platformer;
- process Top-Down Slime Quest;
- touch Shared FX;
- run Tauri, Rust, or Cargo.

## Recommended Next Step

Recommended next lane:

H5.32 — Dice Duel Tavern Cleanup Candidate

Alternative future lane after cleanup/review:

Dice Duel Tavern Roll Illusion Candidate Plan

Tiny verdict:

```text
Dice sheet passed mapping.
Dice roll illusion idea preserved.
The die may wiggle later.
For now, the die stays in paperwork school.
```
