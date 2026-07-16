# Tiny Goblin Academy H5.102A — Potion Sorter Runtime Material and Containment Preparation Correction

## Status

Human Review Passed / Runtime Preparation Approved / Runtime Assets Not Approved / Preview-Only H6 SceneRig Ready

## Purpose and Boundary

H5.102 converts the approved H5.101 visual direction into machine-readable preparation contracts for a later Potion Sorter SceneRig. It resolves the exact material files, exact H5.48C atlas frames, actor/holder ownership, containment hierarchy, and interaction geometry before runtime construction begins. The proof harness is evidence-only Phaser code and does not modify the game.

H5.102A preserves that architecture and corrects the rejected first visual-proof pass. The material inventory now uses four readable columns at 1600×900 plus two logical-column plates at 1024×640, with live overflow and collision audits. Region 23 remains a prepared optional prop but is no longer the primary deep-containment example.

## Prepared Material Vocabulary

Eighteen direct local source bindings cover primary stylized timber, masonry, painted iron, parchment, wear, glow, steam, spark, dust, and ooze roles plus constrained realistic support. Metal008 remains limited to focal brass hubs, rims, valves, fittings, and fasteners. No derivative texture was required, no source pixel changed, and every binding remains `runtimeApproved: false`.

## H5.48C Skin Registry

The registry frames all 32 regions directly from:

`assets/academy/games/potion-sorter/derived/tga-potion-sorter-cleaned-regenerated-v0.2.png`

Thirty regions are prepared for later use. The H5.49 hard denials remain reference-only and cannot be selected:

- `potion-sorter.glowing-green-potion` (region 9);
- `potion-sorter.gold-sparkle-potion` (region 14).

Red, blue, and green potion skins are initial prepared defaults; other accepted potions and props remain registered alternates or optional candidates. Framing the cleaned atlas preserves one source of truth and avoids duplicating 30 isolated PNG files.

## Ownership Contract

`PotionActorRig` will own presentation concerns only: skin selection, anchor, scale, depth, tint, presentation state, optional glow sockets, presentation bounds, and a reference to interaction geometry. It will not own simulation truth.

Each holder owns its back surface, potion anchor, optional geometry clip, foreground lip/rail, label anchor, FX anchor, visible bounds, mask bounds, interaction bounds, and sorting/drop bounds. Holder-local ownership keeps containment aligned during later responsive composition.

## Containment Hierarchy

1. **Depth layering first.** A back plate, complete potion sprite, and foreground lip/rail solve shallow cradles and crossings without clipping source pixels.
2. **Holder-local geometry mask second.** Rounded or aperture geometry clips deep bins and machine openings while transforming with the holder.
3. **Authored alpha mask only when demonstrated.** No alpha mask is fabricated merely because a painted opening is irregular.

The H5.48C red sorter slot was explicitly tested. Its painted frame supplies the irregular edge language and simple local geometry supplies functional clipping, so an authored alpha mask is not justified at this gate.

## Corrected Containment Evidence

The primary receiving proof now uses regions 17, 18, and 19 as red, blue, and green destination identity faces. A bounded code-authored cavity, consistent bottle anchor, invisible holder-local geometry mask, and lower foreground lip form the receiving rig without generating new art or splitting the intact slot sprites. Separate evidence shows approach, partial entry, and accepted seating; the four-slot organizer is not used.

Presentation sheets contain no visible mask primitive. Debug sheets expose the same geometry through thin labeled contours. The machine aperture now provides approach, partial, and exit states using one aligned local clip contract and an independent interaction envelope. Cradle and rail proofs retain depth-layering-only behavior with smaller bottles and lower-body occlusion.

## Interaction Finding

Visible bounds, mask bounds, interaction bounds, and sorting/drop bounds are four separate contracts. The browser proof clicks outside the visible bottle rectangle but inside its generous interaction rectangle and records the event successfully. Visual containment must never make a partially hidden potion difficult to select.

## Evidence and Gate

The reproducible evidence packet is:

`assets/academy/evidence/h5-102-potion-sorter-runtime-material-containment-preparation/`

It contains four planning manifests, generated inventories/contracts, a Phaser proof harness using the real cleaned atlas, nineteen current captures at the required evidence sizes, interaction and evidence-layout proofs, generator/capture tools, and a strengthened machine-readable validator. Superseded first-pass capture names are removed rather than left falsely authoritative.

H5.102A human review passed. Runtime preparation is approved, while every material and skin remains not runtime-approved. The separately bounded preview-only H6 SceneRig lane is ready; no room, conveyor SceneRig, gameplay change, emitter, shader, package/lock change, or runtime registry wiring belongs to this packet.
