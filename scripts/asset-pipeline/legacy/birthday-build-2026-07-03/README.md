# Birthday Build 2026-07-03 One-Off Asset Scripts

This folder preserves one-off Antigravity/Codex spike scripts from the Level 8 Birthday Build asset cleanup and animation-evidence push.

The scripts were useful during the spike, but they are not the canonical H5 asset-pipeline entry points. They were archived here instead of deleted so their probing logic, thresholds, and recovery experiments remain inspectable.

Use current pipeline scripts first:

- `scripts/asset-pipeline/make-region-evidence.py`
- `scripts/asset-pipeline/make-animation-evidence.py`
- `scripts/asset-pipeline/rewrite-manifest.js`
- `scripts/asset-pipeline/pipeline-index.mjs`
- `scripts/asset-pipeline/smoke-check.mjs`

Archived scripts in this folder should only be used as read-only reference unless a later cleanup pass formally promotes one back into the active pipeline.
