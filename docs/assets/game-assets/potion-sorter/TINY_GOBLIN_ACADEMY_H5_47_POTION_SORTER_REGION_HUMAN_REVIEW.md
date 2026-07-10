# Tiny Goblin Academy - H5.47 Potion Sorter Region Human Review

## 1. Purpose

H5.47 records Kryssie's human/product review decision for the H5.46 Potion Sorter region mapping.

This is a metadata and review promotion pass only. It accepts the Potion Sorter region map for draft cleanup and planning use.

## 2. Review Input

Review input:

- H5.46 region mapping commit: `e2399f2 docs: map potion sorter regions`
- Region manifest: `manifests/academy.potion-sorter.regions.json`
- Source sheet: `assets/academy/games/potion-sorter/tga-potion-sorter-sheet-concept-v0.1.png`
- Source dimensions: 1408x768
- Regions represented: 32
- Provisional functional-surface candidates: 6

The source is RGBA but fully opaque; checkerboard/fake transparency finding is accepted.

## 3. Human Review Decision

H5.46 Human Review Passed.

The Potion Sorter region mapping is accepted for draft cleanup and planning use.

No region correction pass is needed.

## 4. Accepted Region Mapping

Accepted notes:

- 32 visible regions are accepted.
- Potion bottles, vial/flask, cork, potion liquid, sorter slots, status icons, reward tokens, crate/tray/bin/chest props, and FX/status pieces are mapped acceptably.
- 6 possible future functional-surface candidates are accepted as provisional metadata only.
- Baked labels/text-bearing surfaces are accepted as mapping regions, but should remain cleanup/review risks.
- Glows, smoke, spill/liquid edges, fire, sparkles, glass edges, and baked labels should retain cleanup-risk notes.
- Source is RGBA but alpha is fully opaque; checkerboard/fake transparency finding is accepted.
- Cleanup remains deferred.
- Runtime/game wiring remains deferred.

## 5. Functional Surface Candidate Boundary

The 6 functional-surface candidate flags remain provisional planning metadata only.

Sorter slots, tray/bin/chest-like surfaces, and other candidate surfaces are not runtime UI yet and do not receive functional slots in H5.47.

Later slot mapping may decide which candidate surfaces actually need internal layout semantics.

## 6. Cleanup / Transparency Boundary

Cleanup remains deferred.

Baked label/text-bearing regions remain cleanup/review risks. Glow, smoke, spill, liquid, fire, sparkle, glass, and label edges also remain cleanup-risk areas.

The RGBA-but-opaque/fake-transparency finding is accepted and should guide any later cleanup candidate pass.

## 7. Runtime Boundary

Runtime boundary retained:

- `runtimeEligibility: not-runtime-approved`
- no cleanup output approval;
- no functional slot mapping approval;
- no Potion Sorter gameplay sorting logic approval;
- no runtime placement approval;
- no Potion Sorter visual wiring approval.

H5.47 accepts the H5.46 Potion Sorter region mapping for draft cleanup and planning use only. This does not approve cleanup output, functional slot mapping, gameplay sorting logic, runtime placement, or Potion Sorter visual wiring.

## 8. Non-Goals

H5.47 did not:

- modify source PNGs;
- run cleanup;
- create derived cleaned assets;
- alter H5.46 evidence images;
- perform functional slot mapping;
- create Potion Sorter gameplay or sorting logic;
- wire Potion Sorter runtime visuals;
- process Farm or Settlement;
- process Dungeon Platformer;
- process Top-Down Slime Quest;
- touch Shared FX;
- run Tauri, Rust, or Cargo.

## 9. Recommended Next Step

Recommended next lane:

`H5.48 - Potion Sorter Cleanup Candidate`

The Potion Sorter region map may now enter cleanup school while runtime waits by the cauldron.
