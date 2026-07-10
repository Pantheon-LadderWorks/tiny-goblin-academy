# Tiny Goblin Academy — H5.0B Shared Asset Evidence Repair + Checkerboard Cleanup Pilot

## 1. Purpose

H5.0B repairs the shared asset evidence layer for the first shared/common asset domains and runs a conservative checkerboard-cleanup pilot on derived copies only.

## 2. H5.0 Human Review / Codex Review Verdict

H5.0 evidence images are rejected as insufficient evidence.
H5.0 domain/manifests may remain as draft planning artifacts if truthful.
H5.0B repairs the evidence layer and pilots cleanup only on derived copies.
No runtime asset wiring is approved by H5.0B.

## 3. H5.0 Evidence Problems

The original H5.0 evidence images under `assets/academy/evidence/h5-0/` are retained, but they should be treated as failed or insufficient evidence.

- `checkerboard-cleanup-risk-sheet.png` was a text card, not visual cleanup evidence.
- `shared-core-inspection.png`, `shared-fx-inspection.png`, and `ui-hud-inspection.png` were unlabeled crops.
- The H5.0 crops did not visibly prove dimensions, file format, image mode, alpha usability, source risk, cleanup status, or before/after cleanup behavior.
- The `shared-fx` crop was especially risky because it visually resembled a normal fake-transparent sheet while the source file is actually RGB/JPEG-format with no alpha.

## 4. Source Sheet Metadata Findings

| Domain | Source sheet | Dimensions | Format | Mode | Alpha finding | Cleanup status |
| --- | --- | ---: | --- | --- | --- | --- |
| Shared Core | `assets/academy/shared-core/tga-shared-core-sheet-v0.1.png` | 2816x1536 | PNG | RGBA | alpha present, range 255-255, fully opaque | preview generated |
| Shared FX | `assets/academy/shared-fx/tga-shared-fx-feedback-sheet-concept-v0.1.png` | 1024x1024 | JPEG | RGB | no alpha channel | deferred high-risk |
| UI / HUD | `assets/academy/ui/tga-ui-hud-sheet-v0.1.png` | 2816x1536 | PNG | RGBA | alpha present, range 255-255, fully opaque | preview generated |

## 5. Cleanup Script Findings

The cleanup script exists at `scripts/clean-fake-transparent-sheet.py`.

The cleanup script uses border-connected low-saturation gray flood fill. This is safer than deleting all gray pixels because it targets fake transparency connected to sheet borders. It is suitable for static icon/UI pilot testing, but it must not be blindly applied to animation sheets.

Confirmed behavior:

- Converts source images to RGBA for processing.
- Detects low-saturation gray-like pixels.
- Seeds flood fill from the image borders.
- Removes only border-connected checkerboard-like regions.
- Lightly feathers gray-like edge pixels.
- Writes a derived RGBA output.
- Writes a dark-background preview.
- Warns against blind use on animation sheets because gray details, shadows, outlines, and motion smear can be damaged.

## 6. Cleanup Pilot Results

Cleanup was run only on the safer static/shared sheets.

| Domain | Derived output | Dark preview | Script result |
| --- | --- | --- | --- |
| Shared Core | `assets/academy/derived-cleaned/shared-core/tga-shared-core-sheet-cleaned-preview-v0.1.png` | `assets/academy/evidence/h5-0b/shared-core-cleaned-dark-preview.png` | 2816x1536; 2,989,903 transparent pixels; 69.12% transparent; alpha range 0-255 |
| Shared FX | none | none | Deferred because the source is RGB/JPEG-format with no alpha and requires a separate cleanup strategy. |
| UI / HUD | `assets/academy/derived-cleaned/ui/tga-ui-hud-sheet-cleaned-preview-v0.1.png` | `assets/academy/evidence/h5-0b/ui-hud-cleaned-dark-preview.png` | 2816x1536; 2,407,090 transparent pixels; 55.65% transparent; alpha range 0-255 |

The script emitted a Pillow deprecation warning for `Image.fromarray(out, "RGBA")`; this did not block output generation.

## 7. Per-Sheet Risk Assessment

- **Shared Core:** Medium risk. Static props/icons are appropriate for a pilot, but gray props, shadows, and glow edges still require visual review.
- **Shared FX:** High risk. JPEG compression artifacts and no alpha channel make normal checkerboard cleanup unsafe without a dedicated strategy.
- **UI / HUD:** Low/Medium risk. Static UI surfaces are good pilot candidates, but semi-transparent glass, shadows, and frame edges still need human review.

## 8. Derived Output Policy

Original pantry PNGs are source assets and must not be overwritten.
Cleaned outputs are derived preview assets.
Derived cleaned previews require human review before any runtime approval.

## 9. Evidence Files Created

New H5.0B evidence lives under `assets/academy/evidence/h5-0b/`.

- `shared-core-metadata-inspection.png`
- `shared-fx-metadata-inspection.png`
- `ui-hud-metadata-inspection.png`
- `shared-core-cleaned-dark-preview.png`
- `ui-hud-cleaned-dark-preview.png`
- `shared-core-before-after-cleanup.png`
- `shared-fx-before-after-cleanup.png`
- `ui-hud-before-after-cleanup.png`

No `shared-fx-cleaned-dark-preview.png` was created because cleanup was deferred.

## 10. Manifest Update Summary

The three H5.0 shared manifests remain draft manifests.

- Shared Core now points to the derived cleaned preview and marks `cleanupStatus` as `preview-generated`.
- Shared FX remains without a derived sheet and marks `cleanupStatus` as `deferred-high-risk`.
- UI / HUD now points to the derived cleaned preview and marks `cleanupStatus` as `preview-generated`.
- All three require human review and are not runtime-approved.

## 11. Validator Results

Validation was run after the H5.0B changes:

- `node scripts/validate-academy-manifest.mjs`
- `node scripts/validate-hub-icon-regions.mjs`
- `node scripts/validate-academy-shared-asset-regions.mjs`

See the H5.0B handoff for exact command output.

## 12. Non-Goals

- No original source PNGs were modified.
- No game code was changed.
- No hub runtime code was changed.
- No Tauri configuration was changed.
- No runtime asset wiring occurred.
- No broad cleanup was run.
- No region mapping or exhaustive slicing was attempted.

## 13. Human Review Checklist

- [ ] Review `shared-core-before-after-cleanup.png` for damaged shadows, outlines, or gray details.
- [ ] Review `ui-hud-before-after-cleanup.png` for damaged panels, glass, and frame edges.
- [ ] Decide whether `shared-fx` needs regeneration, JPEG-aware keying, or a manual/semi-manual cleanup lane.
- [ ] Confirm whether derived cleaned previews may move from preview to reviewed status.
- [ ] Confirm that draft manifests remain draft until exact region mapping exists.

## 14. Recommended Next Step

Recommended next category: **H5.1 — Reusable Asset Pipeline Script Toolkit Plan + Initial Scaffold**.

The asset pipeline now needs reusable type-specific tooling so future passes do not depend on one-off scripts or unlabeled evidence crops.
