# Tiny Goblin Academy — H5.79 Topdown Non-FX Objects Regenerated Cleanup Candidate

## Purpose

H5.79 creates a cleanup candidate for the regenerated Topdown Non-FX Objects source sheet.

This is a cleanup candidate lane only. It is not human approval, runtime approval, placement approval, collision approval, interaction approval, or game wiring.

## Relationship To H5.77 / H5.78

H5.77 mapped the regenerated non-FX object source as 64 contour-assisted variable-size regions.

H5.78 accepted those 64 regions for draft cleanup/planning use. H5.79 uses the H5.78-reviewed region manifest as the cleanup source of truth:

```text
manifests/academy.topdown.objects.nonfx-regenerated.regions.json
```

The old H5.68/H5.69 object cleanup remains historical/usable for its accepted set, but H5.79 is the regenerated non-FX cleanup candidate lane.

## Source

```text
assets/academy/topdown/objects/tga-topdown-environment-objects-nonfx-regenerated-v0.2.png
```

Source metadata:

- Format / mode: PNG / RGB
- Dimensions: `1254x1254`
- Alpha finding: no alpha channel
- Cleanup classification: RGB/fake-background cleanup source

The source is not true alpha. It has a bright low-saturation fake/checker/white background and therefore requires human review after cleanup.

## Cleanup Method

H5.79 uses the canonical asset pipeline CLI and registered cleanup method:

```text
node scripts/asset-pipeline/cli.mjs cleanup-candidate
method: edge-connected-checker-cleanup
methodStatus: canonical-with-caution
```

The cleanup operated per reviewed `sourceRect` and removed background-like pixels connected to each crop boundary. It did not use an inline cleanup script or an unregistered pixel method.

Method parameters are recorded in:

```text
assets/academy/evidence/h5-79-topdown-nonfx-objects-cleanup-candidate/pipeline-run-log.json
```

## Outputs

Derived cleanup sheet:

```text
assets/academy/topdown/objects/derived/tga-topdown-nonfx-objects-cleaned-v0.1.png
```

Cleanup manifest:

```text
manifests/academy.topdown.objects.nonfx-regenerated.cleanup-candidate.json
```

Manifest status:

- `status`: `draft`
- `reviewStatus`: `needs-human-review`
- `pipelineUse`: `draft-cleanup-candidate`
- `runtimeEligibility`: `not-runtime-approved`
- `candidateRegionCount`: `64`

## Risk / Review Notes

All 64 cleanup regions remain `needs-human-review`.

The on-dark preview shows the cleanup is mostly strong, but some hard-edged objects still show small light edge slivers or residue. H5.80 should review those visually and either accept, exclude, or request targeted correction. H5.79 intentionally prefers slight residue over damaged silhouettes.

Behavior-looking objects remain visual-only and behavior-deferred, including:

- chests
- trap visuals
- plates / markers / seal-like circles
- torch, brazier, and campfire bases
- banners, signs, shields, and plaques
- crates, barrels, wells, and container-like props

These labels do not approve gameplay behavior.

## Evidence Created

```text
assets/academy/evidence/h5-79-topdown-nonfx-objects-cleanup-candidate/topdown-nonfx-objects-cleaned-derived-sheet-preview.png
assets/academy/evidence/h5-79-topdown-nonfx-objects-cleanup-candidate/topdown-nonfx-objects-cleaned-on-dark-preview.png
assets/academy/evidence/h5-79-topdown-nonfx-objects-cleanup-candidate/topdown-nonfx-objects-before-after-contact-sheet.png
assets/academy/evidence/h5-79-topdown-nonfx-objects-cleanup-candidate/topdown-nonfx-objects-mask-preview.png
assets/academy/evidence/h5-79-topdown-nonfx-objects-cleanup-candidate/topdown-nonfx-objects-mask-overlay.png
assets/academy/evidence/h5-79-topdown-nonfx-objects-cleanup-candidate/topdown-nonfx-objects-cleanup-table-preview.png
assets/academy/evidence/h5-79-topdown-nonfx-objects-cleanup-candidate/topdown-nonfx-objects-risk-preview.png
assets/academy/evidence/h5-79-topdown-nonfx-objects-cleanup-candidate/pipeline-run-log.json
```

The canonical CLI also generated:

```text
assets/academy/evidence/h5-79-topdown-nonfx-objects-cleanup-candidate/topdown-nonfx-objects-candidate-preview.png
```

## Non-Goals

H5.79 does not:

- modify the source PNG;
- create human approval;
- approve runtime asset use;
- approve placement;
- approve collision;
- approve interaction;
- approve pickup or loot behavior;
- approve chest/key behavior;
- approve trap damage;
- approve pressure plate behavior;
- approve portal/teleport behavior;
- approve fire/light/glow behavior;
- approve obstacle behavior;
- wire any Top-Down Slime Quest runtime/game code;
- modify terrain, wall, future-floor, package, lock, or old object cleanup files.

## Recommended Next Step

```text
H5.80 — Topdown Non-FX Objects Regenerated Cleanup Human Review
```

H5.80 should review the on-dark preview, before/after contact sheet, mask evidence, risk preview, and table evidence before any cleanup candidate is promoted for draft use.
