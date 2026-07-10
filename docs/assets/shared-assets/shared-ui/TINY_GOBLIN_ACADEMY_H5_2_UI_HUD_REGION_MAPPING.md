# Tiny Goblin Academy — H5.2 UI/HUD Sheet Region Mapping + Evidence

## 1. Purpose

H5.2 is the first real type-specific asset lane pass after the H5.1 toolkit scaffold. It maps obvious UI/HUD sheet regions into named draft-review source rectangles and creates reviewable evidence.

H5.2 maps UI/HUD regions for review. It does not approve runtime usage.
The original pantry PNG remains the source asset and is unchanged.
The cleaned preview is a derived review artifact, not runtime truth.
No UI/HUD asset may be wired into a game until its region is reviewed and runtime-approved.

## 2. Human Review Context

H5.0B repaired the evidence standard after the first shared asset evidence was rejected as insufficient. H5.1 added a reusable asset-pipeline scaffold and established type-specific lanes. H5.2 applies that discipline to the safest first real lane: a static shared UI/HUD sheet.

## 3. Source Sheet

- Source sheet: `assets/academy/ui/tga-ui-hud-sheet-v0.1.png`
- Dimensions: 2816x1536
- Format/mode: PNG / RGBA
- Alpha status: alpha present but fully opaque in the pantry source
- Domain: `ui-hud`

## 4. Derived Cleanup Preview Status

- Derived cleanup preview: `assets/academy/derived-cleaned/ui/tga-ui-hud-sheet-cleaned-preview-v0.1.png`
- Cleanup status: `preview-generated`
- Human review required: yes
- Runtime status: not approved

The derived preview was used for contact-sheet readability. Source rectangles remain defined against the original source sheet coordinate system.

## 5. Mapping Scope

H5.2 maps 34 obvious, non-overlapping UI/HUD regions. The pass intentionally avoids exhaustive mapping, OCR, runtime wiring, and approval-state promotion.

Mapped examples include:

- long panels
- round buttons
- currency/time/status icons
- badges
- progress bars
- frames
- speech/dialogue panels
- play/navigation/settings/info/close/reset controls
- labels and dividers

## 6. Region Naming Convention

Region IDs follow:

```text
ui-hud.<category>.<short-name>
```

Examples from this pass:

- `ui-hud.pill-panel.long-teal`
- `ui-hud.round-button.gold-star`
- `ui-hud.progress-bar.green`
- `ui-hud.frame-large.teal`
- `ui-hud.dialogue-panel.feather-scroll`

## 7. Region Categories

Categories used in H5.2:

- `pill-panel`
- `round-button`
- `dark-panel`
- `icon-button`
- `currency-icon`
- `time-icon`
- `shield-icon`
- `lock-badge`
- `check-badge`
- `crystal-icon`
- `damage-tile`
- `progress-bar`
- `star-rating`
- `frame-small`
- `frame-medium`
- `frame-large`
- `speech-bubble`
- `dialogue-panel`
- `play-control`
- `navigation-control`
- `settings-control`
- `info-control`
- `close-control`
- `reset-control`
- `paper-label`
- `divider`
- `status-panel`

Every region uses:

- `usage: "draft-review"`
- `reviewStatus: "needs-human-review"`

No region is marked approved, runtime-approved, or integrated.

## 8. Manifest Update Summary

Updated manifest:

- `manifests/academy.ui-hud.regions.json`

The manifest remains `status: "draft"` and keeps:

- `domain: "ui-hud"`
- `sourceSheet: "assets/academy/ui/tga-ui-hud-sheet-v0.1.png"`
- `derivedSheet: "assets/academy/derived-cleaned/ui/tga-ui-hud-sheet-cleaned-preview-v0.1.png"`
- `transparency.cleanupStatus: "preview-generated"`
- `transparency.humanReviewRequired: true`

The previous placeholder regions were replaced with 34 draft-review mapped regions.

## 9. Evidence Files Created

Created under `assets/academy/evidence/h5-2/`:

- `ui-hud-numbered-contact-sheet.png`
- `ui-hud-bbox-overlay.png`
- `ui-hud-region-table-preview.png`

The contact sheet shows each mapped crop on a dark background. The bbox overlay shows index-labeled source rectangles over the source sheet. The table preview lists index, ID, category, sourceRect, usage, review status, and label.

## 10. Validator Results

Validation commands for this pass:

```powershell
node scripts/validate-academy-manifest.mjs
node scripts/validate-hub-icon-regions.mjs
node scripts/validate-academy-asset-manifests.mjs
node scripts/asset-pipeline/smoke-check.mjs
```

See the H5.2 handoff for exact command output.

## 11. Non-Goals

- No original source PNG was modified.
- No pantry asset was overwritten.
- No game code was changed.
- No hub runtime code was changed.
- No Tauri configuration was changed.
- No runtime asset wiring occurred.
- No animation sheets were processed.
- No broad cleanup was run.
- No UI/HUD region was runtime-approved.

## 12. Human Review Checklist

- [ ] Review `ui-hud-numbered-contact-sheet.png` for crop accuracy and naming sanity.
- [ ] Review `ui-hud-bbox-overlay.png` to confirm source rectangles match intended UI elements.
- [ ] Review `ui-hud-region-table-preview.png` for ID/category/sourceRect consistency.
- [ ] Decide whether any draft-review rectangles need padding adjustments before promotion.
- [ ] Keep manifest status draft until human review approves the mapped regions.

## 13. Recommended Next Step

Recommended next category: **H5.3 — Shared Core Region Mapping + Evidence**.

Shared Core should follow the same draft-review pattern: mapped sourceRect regions, visible bbox overlay, numbered contact sheet, table preview, and no runtime wiring.
