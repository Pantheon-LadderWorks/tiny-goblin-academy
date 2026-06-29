# Tiny Goblin Academy — H4.2 Favicon / App Icon Export Pipeline

## Task Name

H4.2 — Favicon / App Icon Export Pipeline

## Status

Candidate export generation and evidence pipeline. No pixels modified in the source. No runtime wiring performed.

## Baseline

| Field | Value |
| --- | --- |
| Baseline commit | `08b3e07 docs: add hub visual identity and boot plan` |
| Prior milestone | H4.1 Hub Visual Identity + Main Boot Asset Plan |
| Retained audit artifacts | `analyze_assets.py`, `generate_report.py`, `metadata_dump.json` (untracked, untouched) |

---

## Source Icon Verification

| Field | Value |
| --- | --- |
| Asset | TGA App Icon / Favicon Source |
| Path | `assets/academy/branding/icon-source/tga-icon-source-v0.1.png` |
| Dimensions | 2048x2048 |
| Format | Format32bppArgb (RGBA with alpha) |
| Size | ~5.5 MB |
| Correct Asset? | Yes, square TGA parchment lettermark |

---

## Export Method

The export pass was performed using a local C# script (invoked via PowerShell `Add-Type` running `System.Drawing.Image`) to prevent adding external dependencies to the workspace.

- **Interpolation Mode**: `HighQualityBicubic`
- **Smoothing Mode**: `HighQuality`
- **Pixel Offset Mode**: `HighQuality`
- **Compositing Quality**: `HighQuality`
- **Aspect Ratio**: Preserved (square to square).
- **Transparency**: Preserved.

---

## Candidate PNG Exports

**Output Directory**: `assets/academy/branding/icon-exports/candidate/h4-2/`

Generated files:
- `tga-icon-16.png`
- `tga-icon-32.png`
- `tga-icon-48.png`
- `tga-icon-64.png`
- `tga-icon-128.png`
- `tga-icon-256.png`
- `tga-icon-512.png`

---

## ICO Candidate Status

`ICO candidate not generated in H4.2 because no safe local tool was available without adding dependencies.`
Building a multi-size `.ico` file accurately requires dedicated libraries (like ImageMagick or a custom binary structure builder). The PNG candidates will serve as the source material for any automated bundler (like Tauri) or can be assembled into an `.ico` later once an approved path is established.

---

## Preview Evidence

**Evidence Directory**: `assets/academy/branding/icon-exports/evidence/h4-2/`

Generated files:
- `tga-icon-size-preview-sheet.png` — (Transparent background preview with sizes labeled)
- `tga-icon-dark-background-preview.png` — (Dark gray background preview for contrast testing)
- `tga-icon-light-background-preview.png` — (Light gray/white background preview for contrast testing)

These files allow for human review of legibility at tiny sizes, edge/transparency quality, and contrast against both light and dark backgrounds.

---

## Draft Manifest

**Manifest Path**: `manifests/favicon.exports.json`

A draft manifest was generated to formally map the candidate exports. It is currently marked with status `draft-candidate` and `reviewStatus: pending-human-review`.

---

## Review Checklist

**Reviewer: Kryssie**

```text
[ ] 16x16 is recognizable enough
[ ] 32x32 is readable enough
[ ] 48x48 works as small app icon
[ ] 64x64 works as medium app icon
[ ] 128x128 works as launcher/settings icon
[ ] 256x256 works as Windows icon candidate
[ ] 512x512 works as high-res app/store source
[ ] Dark background preview passes
[ ] Light background preview passes
[ ] Human review approves candidate export set
```

---

## Runtime Eligibility Status

**[UPDATE: H4.2B]** The H4.2 icon exports have been APPROVED by human review and integrated into Tauri targets.

> [!WARNING]
> The H4.2 icon exports are candidate assets only. They must not be wired into Tauri or web favicon targets until Kryssie approves the evidence.

---

## Non-Goals Achieved

- Source icon was not modified.
- No Tauri icon replacement occurred.
- No hub or game runtime code was changed.
- No packaged build was executed.
- No new dependency packages were added.
- The retained audit artifacts were completely ignored and remain untracked.
- CodeCraft Native was untouched.

---

## Next Recommended Task

**H4.2B — Favicon / App Icon Approval & Tauri Integration** (or regeneration request if candidates fail human review).
If approved, the next major pipeline is **H4.3 — Main Hub Banner Placement + Responsive Preview Evidence**.