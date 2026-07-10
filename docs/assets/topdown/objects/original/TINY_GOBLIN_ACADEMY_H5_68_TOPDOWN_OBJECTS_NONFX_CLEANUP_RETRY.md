# Tiny Goblin Academy — H5.68 Topdown Objects Selective Non-FX Cleanup Retry

## Purpose

H5.68 retries Topdown Objects cleanup through the canonical H5.67 pipeline/provenance contract.

This pass supersedes H5.65 for Topdown Objects cleanup-candidate evaluation. H5.65 remains historical failed/limited exploratory evidence, but it is not promoted and should not be treated as the active cleanup candidate.

## Source

- Source sheet: `assets/academy/topdown/objects/tga-topdown-environment-objects-concept-v0.1.png`
- Reviewed region manifest: `manifests/academy.topdown.objects.regions.json`
- Derived output: `assets/academy/topdown/objects/derived/tga-topdown-objects-nonfx-cleaned-v0.1.png`
- Cleanup manifest: `manifests/academy.topdown.objects.nonfx-cleanup-candidate.json`
- Run log: `assets/academy/evidence/h5-68-topdown-objects-nonfx-cleanup-retry/pipeline-run-log.json`

## Important Source Finding

The source path declares a `.png` extension, but the file signature is `JPEG`.

That means H5.68 treats the sheet as a degraded fake-transparency source with JPEG compression artifacts. The candidate is still useful as draft evidence, but no region is runtime-approved.

## Method

Registered method:

```text
edge-connected-checker-cleanup
```

Method status:

```text
canonical-with-caution
```

The H5.68 implementation works per 128x128 grid cell and removes only candidate background pixels connected to the cell boundary. It uses the known blank cell as a background reference, but does not globally remove every pixel that resembles checkerboard. The goal is to avoid H5.65-style whole-sheet color chewing.

Final method parameters recorded in the manifest and run log:

```json
{
  "gray_sat_max": 0.18,
  "gray_min": 0.24,
  "gray_max": 0.9,
  "channel_delta_max": 0.09,
  "reference_distance_max": 0.34,
  "background_reference_region": 49,
  "edge_expansion_passes": 0,
  "edge_alpha": 160
}
```

## Region Handling

Candidate non-effect regions:

```text
52
```

Excluded effect/glow/fire/portal/smoke/slime/shadow regions:

```text
7, 9, 10, 17, 18, 47, 55, 57, 60, 61, 62
```

Blank transparent inventory region:

```text
49
```

Region 58, the spike trap, remains a visual-only cleanup candidate. H5.68 grants no damage, collision, placement, interaction, or runtime approval.

## Exclusion Policy

The excluded regions are not cleanup failures inside H5.68. They are intentionally routed away from this cleanup lane because soft effects and fake transparency are the worst fit for this method.

Future plan:

- torches, campfires, and braziers should be regenerated as base sprites without flame/glow;
- flame/glow/smoke/portal/slime/shadow visuals should be particles, FX sprites, or runtime effect layers;
- any regenerated assets must re-enter the normal asset workflow from intake onward.

## Evidence Created

Evidence folder:

`assets/academy/evidence/h5-68-topdown-objects-nonfx-cleanup-retry/`

Files:

- `topdown-objects-nonfx-cleaned-derived-sheet-preview.png`
- `topdown-objects-nonfx-cleaned-on-dark-preview.png`
- `topdown-objects-nonfx-before-after-contact-sheet.png`
- `topdown-objects-nonfx-mask-preview.png`
- `topdown-objects-nonfx-accepted-candidate-preview.png`
- `topdown-objects-excluded-effects-preview.png`
- `topdown-objects-nonfx-cleanup-table-preview.png`
- `topdown-objects-nonfx-mask-overlay.png`
- `pipeline-run-log.json`

The evidence intentionally exposes remaining artifacts and risky candidates for human review. This is not a promotion pass.

## Human Review Notes

H5.68 is a draft cleanup candidate and needs human/product review.

The candidate improves the pipeline boundary compared to H5.65:

- canonical CLI was used;
- registered method was used;
- run log was generated;
- manifest `pipelineRun` was generated;
- source hash and output hashes were recorded;
- effect regions were excluded instead of fake-approved.

However, the source is still degraded JPEG/checkerboard material. Some non-effect candidates may still show residue, edge speckling, or small detail damage. Human review should decide which regions are acceptable, which need exclusion, and whether the method is good enough for walls/terrain.

## Runtime Boundary

H5.68 approves none of the following:

- runtime use;
- placement;
- collision;
- interaction;
- pickup;
- loot;
- chest behavior;
- key behavior;
- portal teleport;
- light emission;
- flame animation;
- trap damage;
- slime hazard;
- pressure plate behavior;
- shadow/hole behavior.

All candidate regions remain `not-runtime-approved`.

## Non-Goals

- No source PNG/JPEG file modification.
- No game/runtime code changes.
- No terrain cleanup.
- No wall cleanup.
- No mixed playfield-pack salvage.
- No runtime atlas approval.
- No behavior approval.
- No human-review promotion.

## Validation Summary

Validation run:

```powershell
node scripts/asset-pipeline/cli.mjs --help
node scripts/asset-pipeline/cli.mjs list-cleanup-methods
node scripts/asset-pipeline/cli.mjs explain-provenance-contract
node scripts/asset-pipeline/cli.mjs validate-provenance
node scripts/asset-pipeline/validate-pipeline-provenance.mjs --legacy-ok
node scripts/asset-pipeline/smoke-check.mjs
node scripts/asset-pipeline/cli.mjs validate
```

Additional checks confirmed:

- cleanup manifest parses;
- cleanup manifest has `pipelineRun`;
- `pipeline-run-log.json` exists;
- source SHA256 is recorded;
- output SHA256 values are recorded;
- method is registered;
- `sourcePngModified` is false;
- `runtimeFilesModified` is false;
- excluded effect regions are not marked accepted;
- ordinary candidates remain `not-runtime-approved`;
- no source PNG/JPEG changed;
- no game/runtime files changed.

## Recommended Next Lane

H5.69 — Topdown Objects Non-FX Cleanup Human Review

After human review, continue carefully:

```text
H5.70 — Topdown Walls Selective Cleanup Candidate
H5.71 — Topdown Terrain Selective Cleanup Candidate
H5.72 — Topdown Effect/Base Sprite Regeneration Plan
```

## Tiny Doctrine

```text
Salvage ordinary props through provenance.
Do not clean fire like a barrel.
Do not promote artifacts just because the script ran.
```
