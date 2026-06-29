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
