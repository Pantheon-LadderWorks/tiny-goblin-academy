# Tiny Goblin Academy Asset Pipeline Toolkit

This folder contains reusable asset-pipeline helpers and lane scripts for Tiny Goblin Academy.

Rules:

- Never overwrite source pantry PNGs.
- Write generated outputs only to derived, evidence, candidate, or explicitly named review paths.
- Lane scripts are type-specific; do not treat animation sheets, UI sheets, FX sheets, and scene backgrounds as interchangeable.
- Validators must run before commit.
- Runtime wiring is out of scope for this toolkit scaffold.
- Existing cleanup scripts remain in their current locations until a later migration is explicitly approved.

Current external cleanup reference:

- `scripts/clean-fake-transparent-sheet.py`

Use `node scripts/asset-pipeline/pipeline-index.mjs --list` to list supported lane profiles.

## Region Evidence Standard

Every reviewable region manifest must have synchronized evidence:

1. bbox overlay over the source sheet;
2. numbered contact sheet of mapped crops;
3. region table preview with id, category, sourceRect, usage, and reviewStatus.

Indexes must match across all three outputs. SourceRects must not be trusted without overlay review, and labels/categories/descriptions must be semantically checked against the contact sheet.

Use:

```powershell
python scripts/asset-pipeline/make-region-evidence.py --manifest manifests/academy.ui-hud.regions.json --out assets/academy/evidence/h5-2b
```

The generated evidence is draft-review evidence only. It is not runtime approval.

Legacy H4 census/cartography tools are retained under `scripts/asset-pipeline/legacy/` for reference only.
