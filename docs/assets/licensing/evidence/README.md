# Asset License Audit Evidence

This folder contains small, public-safe audit mechanics and results only.

- `audit-baseline.json` records repository and root-license hashes.
- `build_asset_exposure_inventory.py` deterministically inventories current asset payloads and attaches H5/H6 evidence only as provenance references.
- `test_asset_exposure_inventory.py` protects reference-category separation and the fail-closed global tracked-media sentinel.
- `validation-report.json` records the final non-mutating validation result.

The audit does not copy source/license web pages that are already preserved beside their source packs. It does not duplicate heavy screenshots, contact sheets, recordings, or external evidence into this folder.
