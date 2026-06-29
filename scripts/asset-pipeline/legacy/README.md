# Legacy Asset Census / Cartography Tools

This folder contains H4-era asset census/cartography tools that were previously loose, untracked files at the repository root.

Ingested files:

- `analyze-assets-legacy.py` — legacy image metadata census over `assets/`.
- `generate-cartography-report-legacy.py` — legacy operational cartography report generator using the metadata dump.
- `../../docs/assets/archive/metadata_dump.legacy-h4-census.json` — archived generated census output snapshot.

These files are retained for reference during the H5 asset pipeline migration. They are not the active source of truth for runtime manifests, current review status, or asset approval.

Future salvage candidates:

- metadata inspection patterns;
- alpha-channel range checks;
- broad operational taxonomy examples;
- census/report output shape.

Do not run these as part of default validation without explicit approval. The active H5 pipeline lives in `scripts/asset-pipeline/` and current manifest truth lives under `manifests/`.
