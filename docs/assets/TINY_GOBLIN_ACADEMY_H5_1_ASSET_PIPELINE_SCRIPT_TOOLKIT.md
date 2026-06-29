# Tiny Goblin Academy — H5.1 Reusable Asset Pipeline Script Toolkit

## 1. Purpose

H5.1 creates the initial reusable asset-pipeline script toolkit for Tiny Goblin Academy. The goal is to move from ad hoc one-off scripts toward a small, auditable toolkit with shared library helpers and type-specific lane scripts.

## 2. Human Review Context

H5.0 mapped the first shared asset domains, and H5.0B repaired the evidence layer after the original evidence images were rejected as insufficient. The repaired pass proved the next pressure point: asset handling needs reusable scripts, clear taxonomy, and lane-specific safety rules before deeper mapping or cleanup.

## 3. Why Dedicated Scripts Are Needed

Different asset types do not share the same safe path. A static UI icon sheet can often tolerate a fake-checkerboard cleanup pilot. An animation sheet cannot. A scene background should usually produce anchors, not sprite rectangles. A tile sheet needs tile/terrain rules, not character animation arrays.

Dedicated scripts keep those differences explicit.

## 4. Asset Taxonomy

Supported operational asset types:

- `background-stage`
- `scene-anchor-background`
- `ui-icon-sheet`
- `hub-icon-sheet`
- `hub-banner-source`
- `branding-icon-source`
- `static-prop-sheet`
- `tile-sheet`
- `terrain-sheet`
- `wall-boundary-sheet`
- `character-animation-sheet`
- `enemy-animation-sheet`
- `pet-animation-sheet`
- `fx-sheet`
- `mixed-sheet`
- `review-candidate`
- `derived-cleaned-sheet`
- `runtime-approved-sheet`

## 5. Pipeline Axes

Do not classify assets only by folder.
Every asset must be classified across five axes:
1. asset family
2. operational asset type
3. lifecycle state
4. required manifest contract
5. next safe pipeline action

Recommended per-asset row fields:

- repo path
- asset family
- operational type
- lifecycle state
- readiness state
- alpha state
- fake transparency risk
- required manifest type
- required evidence
- human review type
- runtime eligibility
- next safe action
- risk level

## 6. Script Toolkit Architecture

Initial scaffold:

```text
scripts/asset-pipeline/
  README.md
  pipeline-index.mjs
  smoke-check.mjs
  lib/
    asset-taxonomy.mjs
    evidence-utils.mjs
    image-metadata.mjs
    manifest-utils.mjs
    rect-utils.mjs
  lanes/
    animation-sheet.mjs
    fx-sheet.mjs
    hub-icon-sheet.mjs
    scene-anchor-background.mjs
    static-prop-sheet.mjs
    tile-terrain-sheet.mjs
    ui-icon-sheet.mjs
```

Existing cleanup script remains at `scripts/clean-fake-transparent-sheet.py` for this pass. H5.1 does not move existing scripts or break existing validators.

## 7. Shared Library Modules

- `asset-taxonomy.mjs`: allowed enums and lane profiles.
- `manifest-utils.mjs`: JSON read/write helpers and manifest validation helpers.
- `image-metadata.mjs`: lightweight file signature and dimension inspection for PNG/JPEG/GIF/WebP/BMP where simple.
- `evidence-utils.mjs`: evidence path and filename conventions.
- `rect-utils.mjs`: source-rectangle validation, bounds checking, and zero-rect draft placeholder detection.

## 8. Type-Specific Lane Scripts

Lane stubs are help-only in H5.1. They print responsibility, manifest contract, evidence requirements, human review gates, and forbidden actions.

Created lanes:

- `ui-icon-sheet`
- `hub-icon-sheet`
- `static-prop-sheet`
- `fx-sheet`
- `tile-terrain-sheet`
- `scene-anchor-background`
- `animation-sheet`

## 9. Manifest Contracts by Asset Type

- Region manifest: UI icons, hub icons, static props, FX candidates.
- Animation manifest: character, enemy, and pet animation sheets.
- Scene anchor manifest: backgrounds and playfields that need placement anchors.
- Tile/terrain manifest: tile sheets, terrain sheets, and wall-boundary sheets.
- Runtime asset registry: only after reviewed/approved assets exist.
- Candidate/review manifest: generated or draft manifests awaiting human review.

## 10. Evidence Outputs by Asset Type

- Static UI/icon/prop sheets: metadata sheet, alpha preview, dark preview, bbox overlay, contact sheet.
- FX sheets: metadata sheet, alpha/compression warning, dark preview when safe, before/after cleanup evidence only after pilot.
- Animation sheets: contact sheet, sequence-label evidence, alpha preview, pivot/baseline review, pilot crops before cleanup.
- Backgrounds: metadata sheet, scaled preview, anchor overlay, gameplay-readability review.
- Tiles/terrain: tile-grid overlay, adjacency preview, bounds validation, contact sheet.

## 11. Cleanup Policy

Fake-checkerboard cleanup is not a generic background remover.
It may be piloted on static UI/icon/prop sheets when the fake background is border-connected and evidence is generated.
It must not be batch-applied to animation sheets without pilot crops, contact sheets, alpha previews, and human review.

## 12. Animation Sheet Warning

Animation sheets require separate treatment. Their failure modes include damaged outlines, corrupted shadows, motion-smear holes, broken limbs, and the already-famous transparent kneecaps. Animation cleanup requires pilot crops, sequence labels, pivots/baselines, contact sheets, and human review before any bulk pass.

## 13. Scene Anchor / Background Policy

Background and scene-stage assets should not be sprite-detected by default. They should produce scene anchor manifests for gameplay lanes, prop locations, visual-safe zones, interaction points, and readability overlays.

## 14. Tile / Terrain Policy

Tiles, terrain, and walls need grid/adjacency validation. Their manifests should verify tile bounds, tile identity, collision intent, edge/corner compatibility, and whether the asset is top-down or side-view.

## 15. FX Sheet Policy

FX sheets can be deceptively risky. They may include glow, smoke, particles, gray dust, JPEG artifacts, and semi-transparent-looking edges that are actually opaque. FX cleanup should start with metadata and compression checks, then a small pilot if safe.

## 16. UI / HUD Sheet Policy

UI/HUD sheets are strong candidates for early region mapping because they are static, shared, and manifest-friendly. Cleanup still requires evidence because panels, glass, shadows, and outlines can be damaged by naive transparency removal.

## 17. Runtime Approval Policy

Source pantry sheets are not runtime truth. Derived cleaned previews are not runtime truth. Runtime usage requires reviewed/approved manifests, semantic region names, validation, evidence, and human review.

## 18. Non-Goals

- No source PNGs were modified.
- No pantry assets were overwritten.
- No game code was changed.
- No hub runtime code was changed.
- No runtime wiring occurred.
- No broad cleanup was run.
- No exhaustive asset mapping was attempted.
- Existing scripts were not moved.

## 19. Initial Scaffold Created

H5.1 creates the initial toolkit directory, shared library modules, lane help stubs, command index, smoke check, and asset manifest validator.

Validation commands:

```powershell
node scripts/validate-academy-manifest.mjs
node scripts/validate-hub-icon-regions.mjs
node scripts/validate-academy-asset-manifests.mjs
node scripts/asset-pipeline/smoke-check.mjs
```

## 20. Recommended Next Step

Recommended next category: **H5.2 — First Real Lane: UI/HUD Sheet Region Mapping + Evidence**.

UI/HUD is static, shared, manifest-friendly, and safer than moving directly into animation-sheet surgery.
