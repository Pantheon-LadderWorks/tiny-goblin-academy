# Tiny Goblin Academy H5.100C — Stylized Fantasy Texture Pantry Addendum

## Status

Human Review Passed / Reusable Pantry Accepted / No Runtime Approval

## Purpose and Boundary

H5.100C adds a stylized-fantasy identity layer beside the accepted H5.100 neutral material pantry. It does not reopen, replace, or invalidate H5.100. It does not select Potion Sorter runtime materials, implement a room or SceneRig, author shaders, recolor sources, or register any texture for runtime use.

## Exact Accepted Downloads

1. **Kenney Retro Textures Fantasy 1.0** — original ZIP preserved unchanged; CC0; 115 texture files advertised; SHA-256 `46f30f2411dafa011f8e52e32d80be197f8ccfe1164818e664358ae6c78a38b9`.
2. **DeadKir Handpainted Tileable Textures 512x512** — the creator page's three original PNGs (`metal_plates.png`, `wooden.png`, `ooz_slime.png`) preserved unchanged; CC0.
3. **Luke.RUSTLTD Large Parchment Texture** — original 1920x1080 PNG preserved unchanged; CC0; SHA-256 `1a5864e3549355d83607b0dfd6a2093106b13df0a42227f17cb28bf488ab9207`.

Kenney is the primary fantasy construction vocabulary. DeadKir contributes genuinely painted dark metal, a second timber treatment, and a useful alchemical surface helper. Luke.RUSTLTD supplies the missing illustrated parchment field.

## Material Strategy

| Family | Existing realistic H5.100 | New stylized H5.100C | Intended hybrid use |
| --- | --- | --- | --- |
| Timber | WoodSiding008 / WoodFloor065B | Kenney planks and timber; DeadKir wood | Stylized structure with restrained real grain or wear |
| Masonry | Bricks089 / Bricks100 | Kenney brick, wall stone, rock, floor patterns | Chunky readable blocks with quiet real surface variation |
| Dark metal | Metal046B / Metal053C | DeadKir painted riveted plates | Painted silhouette and highlights with subtle real wear |
| Brass / bronze | Metal008 | No accepted stylized source | Use Metal008 intentionally on small focal accents for warm contrast and material pop; author surrounding shape, rivets, and edge language later |
| Parchment | Paper006 | Luke.RUSTLTD parchment | Illustrated field with optional subtle paper fiber |
| Grime / wear | SurfaceImperfections015 | Kenney dirt and damaged planks | Authored placement first; realistic overlay kept restrained |
| Magic | Kenney particle helpers | DeadKir ooze/slime field | Stylized liquid/residue with existing glow and smoke support |

## Research Decisions

- **Kenney Modular Dungeon Kit:** rejected for this pantry. Its downloadable image truth is a model color/palette atlas, not reusable stone or metal surface texture truth. Rendered previews remain non-assets.
- **Quaternius Ultimate Stylized Nature:** deferred. The public texture folder contains bark, leaves, grass, flowers, and rock maps; useful later, but it does not justify importing a model-first nature package for the alchemy-room core.
- **Quaternius Medieval Village MegaKit:** deferred. The source is CC0 and textured, but the free download is a large model-first pack rather than a bounded standalone material intake.
- **rubberduck 8 handpainted style textures:** valid CC0 and technically usable, but deferred after local audition because it overlaps the sharper accepted roster and would exceed the two-source exceptional hand-painted bound once parchment is included.
- **Stylized brass/bronze:** left as an honest source gap. No bounded, provenance-clean stylized candidate survived. H5.100 Metal008 is nevertheless an intentional hybrid accent: restrained use on gears, valve rims, fasteners, and mechanism focal points can add warm contrast and material pop without taking over the room's stylized identity.

## Governance Verdict

All accepted originals, selected extractions, licenses, metadata, hashes, classification records, and evidence belong to the reusable GlyphForge source pantry. Pantry acceptance does not imply Potion Sorter selection. H5.101 must audition these materials on neutral specimens before any runtime approval.

## Human Review Verdict

Human review approves the provenance-clean H5.100C sources for the reusable GlyphForge stylized-fantasy material pantry:

- Kenney Retro Textures Fantasy for primary fantasy construction candidates;
- DeadKir wood, riveted metal, and ooze for painted identity and alchemical support;
- Luke.RUSTLTD parchment for illustrated paper identity;
- Kenney dirt/wear helpers for authored placement and masks;
- H5.100 Metal008 as a restrained realistic brass focal accent for warm contrast and material pop.

The recorded Kenney Modular Dungeon rejection and Quaternius/model-first deferrals remain correct. Research and rendered previews remain evidence-only. Potion Sorter's active palette remains provisional until H5.101, and no source or material is runtime-approved by this review.
