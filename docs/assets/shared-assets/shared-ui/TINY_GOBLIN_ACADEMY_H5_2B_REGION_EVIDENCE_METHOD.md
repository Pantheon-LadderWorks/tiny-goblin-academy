# Tiny Goblin Academy — H5.2B Region Evidence Method Canonization + Legacy Census Ingestion

## 1. Purpose

H5.2B canonizes the accepted H5.2 region-evidence method as the reusable standard for future region-manifest lanes. It also ingests the old root-level asset census/cartography files as legacy/reference tooling so they are no longer loose untracked artifacts.

## 2. Human Review Context

H5.2 produced the first useful region-mapping evidence: a bbox overlay, numbered contact sheet, and table preview that stayed synchronized with the draft UI/HUD manifest. Human review accepted this as the standard, with added notes that semantic verification and grouped-vs-distinct asset decisions must be explicit before runtime promotion.

## 3. Accepted H5.2 Evidence Pattern

Accepted H5.2 evidence files:

- `assets/academy/evidence/h5-2/ui-hud-bbox-overlay.png`
- `assets/academy/evidence/h5-2/ui-hud-numbered-contact-sheet.png`
- `assets/academy/evidence/h5-2/ui-hud-region-table-preview.png`

These files show the same region set three ways: source rectangles over the sheet, actual cropped assets, and structured manifest metadata.

## 4. Why This Method Works

The bbox overlay is the correction mechanism. In H5.2 it exposed an overly tight crystal/shard region before commit, allowing the sourceRect to be corrected before the manifest became trusted.

The contact sheet is the semantic review mechanism. It makes labels, categories, and grouping decisions visible instead of burying them in JSON.

The table preview is the manifest-audit mechanism. It makes ID, category, sourceRect, usage, and reviewStatus readable without opening the JSON manually.

## 5. Required Evidence Trio

A mapped region manifest is not reviewable unless it has synchronized evidence:
1. bbox overlay over the source sheet;
2. numbered contact sheet of the mapped crops;
3. region table preview showing id, category, sourceRect, usage, and reviewStatus.

## 6. Index Synchronization Rule

Every region index must match across the bbox overlay, contact sheet, and table preview. If index numbers drift, the evidence is rejected until regenerated.

## 7. SourceRect Review Rule

Source rectangles must not be trusted without overlay review. A sourceRect can pass JSON validation while still being visually wrong, too tight, too broad, or attached to the wrong visual asset.

## 8. Semantic Verification Rule

A correct sourceRect is not enough. Each mapped region must also pass semantic verification: the label, category, and description must match the actual crop shown in the contact sheet.

## 9. Unique Image / Grouped Region Rule

Each visually distinct asset should be mapped as a separate region unless there is a clear intentional reason to treat it as a grouped UI element. Grouped regions must say so in notes.

The H5.2 three-star rating region may be intentionally grouped or may need to be split into three individual star regions. This remains a human-review item before runtime approval.

## 10. Draft Review / Runtime Approval Boundary

Evidence may prove that rectangles are reviewable.
Evidence does not approve runtime use.
Runtime approval requires a separate human review and promotion step.

## 11. Legacy Census Tool Ingestion

The old root-level asset census files were formally ingested as legacy/reference tooling so they are no longer loose untracked artifacts. They are not active runtime manifest truth.

Ingested files:

- `scripts/asset-pipeline/legacy/analyze-assets-legacy.py`
- `scripts/asset-pipeline/legacy/generate-cartography-report-legacy.py`
- `docs/assets/archive/metadata_dump.legacy-h4-census.json`

Classification:

- `analyze_assets.py` became a legacy census source script.
- `generate_report.py` became a legacy report/cartography source script.
- `metadata_dump.json` became an archived generated H4 census snapshot.

These tools overlap with H5.1 metadata/taxonomy ideas but are not default validation tools and should not be treated as current manifest truth.

## 12. Reusable Generator Summary

Created:

- `scripts/asset-pipeline/make-region-evidence.py`

The generator reads a region manifest, loads the source sheet, uses the derived sheet for contact crops when available, validates region IDs/sourceRects, and emits deterministic evidence filenames:

- `<domain>-bbox-overlay.png`
- `<domain>-numbered-contact-sheet.png`
- `<domain>-region-table-preview.png`

H5.2B test output:

- `assets/academy/evidence/h5-2b/ui-hud-bbox-overlay.png`
- `assets/academy/evidence/h5-2b/ui-hud-numbered-contact-sheet.png`
- `assets/academy/evidence/h5-2b/ui-hud-region-table-preview.png`

The generator is Python/Pillow-based because Pillow is already available in the working environment and no new image dependency was needed.

## 13. Toolkit Updates

Updated toolkit and asset-system docs to record:

- the required evidence trio;
- index synchronization;
- sourceRect overlay review;
- semantic verification;
- unique-vs-grouped asset review;
- draft-review evidence boundaries;
- the Python evidence generator;
- legacy census tool ingestion.

## 14. Validator Results

Validation commands for this pass:

```powershell
node scripts/validate-academy-manifest.mjs
node scripts/validate-hub-icon-regions.mjs
node scripts/validate-academy-asset-manifests.mjs
node scripts/asset-pipeline/smoke-check.mjs
python scripts/asset-pipeline/make-region-evidence.py --help
python scripts/asset-pipeline/make-region-evidence.py --manifest manifests/academy.ui-hud.regions.json --out assets/academy/evidence/h5-2b
```

See the H5.2B handoff for exact command output.

## 15. Non-Goals

- No source PNGs were modified.
- No pantry assets were overwritten.
- No game code was changed.
- No hub runtime code was changed.
- No Tauri configuration was changed.
- No runtime asset wiring occurred.
- No manifest was marked approved.
- No region was marked runtime-approved.
- Shared Core was not remapped in this pass.
- Shared FX remained quarantined for a later recovery decision.

## 16. Human Review Checklist

- [ ] Confirm H5.2B generated evidence remains readable enough for future lanes.
- [ ] Confirm semantic verification belongs in every region-review pass.
- [ ] Decide later whether `ui-hud.star-rating.three-gold` should stay grouped or split into three separate star regions.
- [ ] Decide later whether any legacy census logic should be modernized into active H5 toolkit modules.
- [ ] Keep legacy census tools out of default validation unless explicitly approved.

## 17. Recommended Next Step

Recommended next category: **H5.3 — Shared Core Region Mapping + Evidence**.

Shared Core should use `scripts/asset-pipeline/make-region-evidence.py` instead of hand-rolled evidence generation.
