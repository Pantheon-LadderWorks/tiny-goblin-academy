# Tiny Goblin Academy H5.103 — Card Goblin Duel Tabletop Asset Ingestion and Region Mapping

## Status

- **Implementation status:** complete
- **Automated validation:** passed
- **Human review:** passed
- **Runtime eligibility:** not runtime-approved

## Purpose

H5.103 formally ingests the approved Card Goblin Duel tabletop illustration as one pristine Academy source scene and maps practical source-space regions for later stage, overlay, card-placement, and anchor planning.

This is an asset-intake and scene-anchor mapping lane. It does not integrate the image into Card Goblin Duel, alter gameplay, slice props, or establish exact runtime placement.

## Source Intake

Provided source:

```text
C:\Users\kryst\Downloads\ChatGPT Image Jul 21, 2026, 08_41_19 PM.png
```

Ingested Academy source:

```text
assets/academy/games/card-goblin-duel/backgrounds/
  tga-card-goblin-duel-tabletop-scene-v0.1.png
```

Verified facts:

```text
format:  PNG
mode:    RGB
size:    2172 x 724
bytes:   2,478,027
sha256:  e30d5ff2e6366056dbb8ebf944fd3f1b5b2d10af7dde0388d258d768ce8f67e3
alpha:   none
```

The provided source and ingested Academy copy have the same SHA-256 digest. No crop, resize, repaint, denoise, recolor, cleanup, or other pixel modification occurred.

## Lane Classification

The image is classified as:

```text
operationalType: scene-anchor-background
layout: single opaque composited tabletop scene
cleanupRequired: false
```

It is not classified as a sprite sheet. The authored props and inset wells remain part of the full scene composition and are not approved as automatically sliced production assets.

## Machine-Readable Records

Source intake record:

```text
manifests/academy/games/card-goblin-duel/
  academy.card-goblin-duel.tabletop-source-intake.json
```

Scene-region manifest:

```text
manifests/academy/games/card-goblin-duel/lineage/
  academy.card-goblin-duel.tabletop.regions.json
```

The mapping manifest contains 22 deterministic review regions.

## Mapped Region Summary

The map covers:

- full source-scene bounds;
- ornate outer table frame;
- central purple felt play surface;
- Tiny Goblin Academy center seal;
- played-card landing center;
- vertical duel travel lane;
- top opponent card well;
- left green deck well;
- right locked discard well;
- lower player staging band;
- lower symbolic overlay band;
- upper-left and upper-right negative-space overlay zones;
- left candle and hanging Academy banner;
- right goblin figurine, purple bottle, and gold token;
- lower-left book and goblin medallion;
- left and right outer wood/dressing zones;
- lower-right outer-wood reserve.

The original prompt proposed a lower-right chalk or goblin-doodle region. No distinct authored chalk or doodle is visible in the approved source. H5.103 records that area truthfully as an unillustrated outer-wood reserve rather than inventing source content.

## Mapping Semantics

Each region includes:

- deterministic ID;
- human-readable label;
- category and classification;
- source-space rectangle;
- source-space focal center where useful;
- planning-use semantics;
- human-review status;
- not-runtime-approved boundary;
- semantic notes.

The rectangles are review and planning intelligence tied to the source image. They are not exact Phaser coordinates, DOM layout values, card dimensions, collision geometry, or runtime placement approval.

Human review renamed Region 10 to `lower-player-staging-band`: it represents a CardEcho launch origin, player-impact/status staging area, and visual bridge toward the live DOM hand below the scene plate. It does not imply that the live hand is baked into the background.

Regions 7–9 and 14–19 remain placement/reference geometry within the full illustration. Their wells and props are not approved extracted sprites or independent runtime assets.

## Evidence

The generated PNG review evidence is stored externally on **The Void** under the configured evidence root:

```text
TGA_EVIDENCE_ROOT/assets/academy/evidence/
  h5-103-card-goblin-duel-tabletop-intake/
```

External binaries:

```text
card-goblin-duel-tabletop-bbox-overlay.png
card-goblin-duel-tabletop-numbered-contact-sheet.png
card-goblin-duel-tabletop-region-table-preview.png
```

Lightweight repository records:

```text
assets/academy/evidence/h5-103-card-goblin-duel-tabletop-intake/
  card-goblin-duel-tabletop-source-inspection.json
  external-evidence-manifest.json
  pipeline-run-log.json
```

The portable manifest records each external file's byte count and SHA-256 digest without embedding an absolute machine-local path. The synchronized overlay, numbered contact sheet, and table preview were generated through the canonical asset-pipeline CLI, and their indexes align with the machine-readable region manifest.

## Explicit Non-Goals

H5.103 does not:

- modify the source pixels;
- create a cleaned or normalized derivative;
- slice props, cards, wells, or decoration into sprites;
- integrate the scene into Phaser or DOM runtime;
- alter Card Goblin gameplay or simulation authority;
- modify Hub ledger behavior;
- approve exact card, deck, discard, status, or hand placement;
- promote the image as runtime truth;
- begin CardRig, CardEcho, particle, projectile, trail, or VFX work;
- modify Dice Duel Tavern or One-Room Platformer.

## Review Gate

Human Mapping Review: **PASS**.

The 22-region map is accepted as semantically useful planning geometry, including the central play surface, Academy seal, card travel and landing anchors, deck/discard/opponent wells, overlay-safe zones, prop exclusions, and outer dressing reserves. Region 22 truthfully records the unillustrated lower-right outer-wood reserve.

This review approves only the mapping for planning use. Runtime integration remains a separate H6 lane with its own containment, layering, accessibility, rollback, and visual-review requirements.

## Current Decision

The source is formally ingested, pristine, inventoried, mapped, and evidenced.

Human Mapping Review passed. The mapping is approved for planning use; no runtime approval is claimed.
