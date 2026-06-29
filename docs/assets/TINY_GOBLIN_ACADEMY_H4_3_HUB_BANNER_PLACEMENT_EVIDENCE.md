# Tiny Goblin Academy — H4.3 Hub Banner Placement Evidence

## Task Name

H4.3 — Main Hub Banner Placement + Responsive Preview Evidence

## Status

Complete. Evidence images generated to preview responsive integration of the source banner into the hub header.

## Baseline

| Field | Value |
| --- | --- |
| Baseline commit | `9c20092 feat: complete app icon web surfaces` |
| Prior milestone | H4.2C Complete App Icon Web / ICO / SVG Surface Audit |
| Retained audit artifacts | `analyze_assets.py`, `generate_report.py`, `metadata_dump.json` (untracked, untouched) |

---

## Source Banner Verification

Target: `assets/academy/hub/banner/tga-hub-banner-source-v0.1.png`
*   **Format:** PNG (RGBA)
*   **Dimensions:** 555x257
*   **File Size:** 251.5 KB
*   **Alpha Channel:** Available
*   **Observations:** Verified as the correct TGA scroll banner, distinct from the campfire or glyphforge boot screens. No modifications were made to the source banner file.

---

## Tooling Used

A local tooling audit confirmed the presence of:
*   Python 3.13.7
*   Pillow 11.3.0

Because Pillow was available, it was used via a temporary python script to composite the evidence mocks without modifying the React codebase or requiring a full Vite server launch.

---

## Current Hub Header Target

The target replacement zone is the top-left area in the hub shell, specifically:
```tsx
<h1 className="hub-title">Tiny Goblin Academy</h1>
```
The goal is to replace this text DOM node with the responsive banner graphic while leaving the tagline and tier-summary text elements as pure DOM.

---

## Method Used for Evidence Mocks

A temporary python script (`generate_evidence.py`, removed before staging) utilized Pillow to:
1. Draw a mock header background using exact CSS hex codes from `hub/src/styles/hub.css`.
2. Composite a dynamically resized banner representing responsive placement.
3. Stub the tagline, badge, and right-side credits panel to verify they do not overlap.

---

## Evidence Files Generated

### Placement Mocks (Responsive Widths)
*   `assets/academy/hub/banner/evidence/h4-3/tga-banner-header-placement-1280.png`
*   `assets/academy/hub/banner/evidence/h4-3/tga-banner-header-placement-1600.png`
*   `assets/academy/hub/banner/evidence/h4-3/tga-banner-header-placement-1920.png`

### Standalone Previews
*   `assets/academy/hub/banner/evidence/h4-3/tga-banner-dark-background-preview.png`
*   `assets/academy/hub/banner/evidence/h4-3/tga-banner-light-background-preview.png`
*   `assets/academy/hub/banner/evidence/h4-3/tga-banner-scale-preview-sheet.png`

---

## Responsive Placement Observations

*   At maximum native size (555px wide), the banner demands a substantial header height (approx. 257px), which might feel large for a dashboard hub depending on the grid layout below.
*   At reduced widths (e.g., 280px or 340px), the text inside the banner remains adequately legible while leaving generous breathing room for the tagline and right-side credits.
*   The placement confirms the banner should be subject to a `max-width` constraint (or width percentage) in CSS rather than hardcoded to 555px to prevent pushing the game roster too far down on smaller displays (like 1280x720).

---

## Draft Hub Identity Manifest

A draft manifest was created to track the banner's state.
**Path:** `manifests/hub.identity-assets.json`

---

## Runtime Eligibility Status

> The H4.3 banner evidence is not runtime wiring. The banner remains not-runtime-approved until Kryssie + Mega review the placement evidence and approve a specific integration target.

---

## Review Checklist

*   [ ] Banner is readable at 1280 width
*   [ ] Banner is readable at 1600 width
*   [ ] Banner is readable at 1920 width
*   [ ] Banner does not overpower the header
*   [ ] Subtitle/status DOM text still has a clear home
*   [ ] Right-side Glyphforge/status block remains coherent
*   [ ] Game grid is not visually crowded by the header
*   [ ] Native 555px banner scale is acceptable or a display max-width is chosen
*   [ ] Human review approves banner placement direction

---

## Explicit Non-Goals Achieved

*   **Source banner unmodified:** The `v0.1` source file remains exactly as it was.
*   **No runtime assets created:** The evidence files are stored in an `evidence/` directory, distinct from a runtime `derived/` directory.
*   **No hub code changed:** `HubShell.tsx` and `hub.css` are completely untouched.
*   **No game code or boot screens changed:** Scope strictly constrained to the banner.
*   **No packaged build:** Tauri dev/build was not executed.
*   **No dependencies added:** Only pre-installed Python tooling used.
*   **Retained audit artifacts untouched:** Verified safely ignored.
*   **CodeCraft Native untouched:** Completely ignored.

---

## Next Recommended Task

**H4.4 — Main Glyphforge Boot Surface Modernization Plan** (or banner integration execution, depending on Mega's preference).