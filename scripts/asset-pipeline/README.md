# Tiny Goblin Academy Asset Pipeline Toolkit

This folder contains the canonical reusable asset-pipeline command surface, helpers, and lane wrappers for Tiny Goblin Academy.

Rules:

- Never overwrite source pantry PNGs.
- Write generated outputs only to derived, evidence, candidate, or explicitly named review paths.
- Lane scripts are type-specific; do not treat animation sheets, UI sheets, FX sheets, and scene backgrounds as interchangeable.
- Validators must run before commit.
- Runtime wiring is out of scope for this toolkit scaffold.
- Asset operations should enter through `scripts/asset-pipeline/cli.mjs`.
- Cleanup methods must be registered in `lib/cleanup-method-registry.mjs`.
- Every future cleanup/mapping/evidence operation should write or preserve machine-readable provenance/run-log data.
- One-off cleanup scripts are not allowed as silent production methods. Weird edge cases must become registered experimental methods or be deferred.

Current external cleanup implementation wrapped by the CLI:

- `scripts/clean-fake-transparent-sheet.py`

Use the CLI:

```powershell
node scripts/asset-pipeline/cli.mjs --help
node scripts/asset-pipeline/cli.mjs list-lanes
node scripts/asset-pipeline/cli.mjs list-cleanup-methods
node scripts/asset-pipeline/cli.mjs inspect-source --source assets/academy/topdown/objects/tga-topdown-environment-objects-concept-v0.1.png
node scripts/asset-pipeline/cli.mjs make-evidence --manifest manifests/academy.ui-hud.regions.json --out assets/academy/evidence/h5-2b
node scripts/asset-pipeline/cli.mjs validate
```

`pipeline-index.mjs` remains as a compatibility wrapper for lane profile lookup, but `cli.mjs` is the canonical command surface.

## Region Evidence Standard

Every reviewable region manifest must have synchronized evidence:

1. bbox overlay over the source sheet;
2. numbered contact sheet of mapped crops;
3. region table preview with id, category, sourceRect, usage, and reviewStatus.

Indexes must match across all three outputs. SourceRects must not be trusted without overlay review, and labels/categories/descriptions must be semantically checked against the contact sheet.

Use:

```powershell
node scripts/asset-pipeline/cli.mjs make-evidence --manifest manifests/academy.ui-hud.regions.json --out assets/academy/evidence/h5-2b
```

The generator also supports the older Hub Icon source-region manifest shape at `manifests/hub.icon-regions.json` by normalizing it internally for evidence output.

The generated evidence is draft-review evidence only. It is not runtime approval.

`make-region-evidence.py` supports evidence review, but semantic correctness is still agent/human review work. A valid rectangle can still have a weak label, unclear category, unsafe grouping, or cleanup risk.

The future asset capability matrix is deferred until multiple domains are mapped. The current pipeline should keep mapping and evidence disciplined without pretending the complete pantry inventory is already known.

Legacy H4 census/cartography tools are retained under `scripts/asset-pipeline/legacy/` for reference only.

## Cleanup Method Registry

Registered cleanup methods:

- `alpha-pass-through` — canonical, implemented.
- `no-cleanup-reference-only` — canonical, implemented.
- `flood-fill-gray-background` — canonical with caution, implemented through `scripts/clean-fake-transparent-sheet.py`.
- `edge-connected-checker-cleanup` — canonical with caution, implemented as an alias of `flood-fill-gray-background`.
- `color-key-cleanup` — pilot-only, not canonical production cleanup.
- `grid-slice-only` — mapping-only, not a cleanup method.
- `blank-cell-reference-experimental` — H5.65 failure-case method, experimental / unsafe-default / not promotion-ready.
- `true-alpha-regenerated-source` — canonical, implemented as a provenance-preserving copy of regenerated true-alpha source into derived review space.

Future agents must not invent inline cleanup logic when a method is missing. They should either register an experimental method explicitly or defer the asset.

## Run Log Standard

Future evidence folders should include:

```text
pipeline-run-log.json
```

The run log records the tool path, command, method, method status, agent/session, git baseline, source path, source hash, output paths, output hashes, generated evidence, validation commands, warnings, and whether source/runtime files were modified.
