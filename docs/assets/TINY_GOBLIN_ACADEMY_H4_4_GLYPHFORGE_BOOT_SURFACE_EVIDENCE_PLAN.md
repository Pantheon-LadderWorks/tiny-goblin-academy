# Tiny Goblin Academy — H4.4 Glyphforge Boot Surface Evidence Plan

## Task Name

H4.4 — Main Glyphforge Boot Surface Modernization Evidence + Implementation Plan

## Status

Complete. Evidence images generated to preview responsive integration of the source boot asset into the main app boot experience. The integration is planned for a future combined runtime execution.

## Baseline

| Field | Value |
| --- | --- |
| Baseline commit | `414022a docs: add hub banner placement evidence` |
| Prior milestone | H4.3 Hub Banner Placement Evidence |
| Retained audit artifacts | `analyze_assets.py`, `generate_report.py`, `metadata_dump.json` (untracked, untouched) |

---

## Source Boot Asset Verification

Target: `assets/studio/glyphforge-games/glyphforge-games-boot-splash-concept.png`
*   **Format:** PNG (RGBA)
*   **Dimensions:** 2752x1536
*   **File Size:** 7.19 MB
*   **Alpha Channel:** Available
*   **Observations:** Verified as the correct concept splash for Glyphforge Games. Distinct from the scroll banner and per-game assets. Source image was strictly read and left completely unmodified.

---

## Tooling Used

A local tooling audit confirmed the presence of Python 3.13.7 and Pillow 11.3.0. A temporary Pillow script (`generate_boot_evidence.py`, removed before staging) was used to render composite images. No dependencies or binary changes were necessary.

---

## Current Boot Implementation Summary

Currently, `BootScreen.tsx` renders a smaller inset image above centered text, reading: "Glyphforge Games (Draft)", "Tiny Goblin Academy", "Opening the Academy...", and a Skip button. It feels like a functional placeholder rather than a modern hero experience.

## Desired Boot Design Direction

*   Full-screen image / hero treatment.
*   Image fills or strongly anchors the whole boot screen.
*   Text/status overlays on top of the image.
*   No small framed image sitting above text.
*   Applies only to the main app (per-game loading remains deferred).

---

## Evidence Files Generated

### Full-Screen Boot Mocks
*   `assets/studio/glyphforge-games/evidence/h4-4/glyphforge-boot-hero-1280x720.png`
*   `assets/studio/glyphforge-games/evidence/h4-4/glyphforge-boot-hero-1366x768.png`
*   `assets/studio/glyphforge-games/evidence/h4-4/glyphforge-boot-hero-1600x900.png`
*   `assets/studio/glyphforge-games/evidence/h4-4/glyphforge-boot-hero-1920x1080.png`

### Overlay Variation Sheet
*   `assets/studio/glyphforge-games/evidence/h4-4/glyphforge-boot-overlay-variation-sheet.png` (Compares Centered Lower, Bottom-Left, and Centered Title + Lower Status overlays)

---

## Responsive Viewport Observations

*   The source image aspect ratio is approx 1.79:1 (16:9 equivalent), scaling perfectly to standard desktop widescreen resolutions (1280x720, 1920x1080, etc.) without cropping or letterboxing.
*   As a full-screen hero image, it provides a much more immersive and polished feeling than the current inset approach.

## Overlay Placement Observations

*   **Centered Lower Overlay:** Keeps text contained and allows the main image to breathe, but can feel heavy at the bottom.
*   **Bottom-Left Overlay:** Has a classic PC game loader feel, looks very structured and intentional.
*   **Centered Title + Lower Status:** Balances the visual weight across the screen, placing the title higher up and the status/skip down below.
*   *Conclusion pending Human Review to select the preferred placement.*

---

## Draft Boot Identity Manifest

A draft manifest was created to track the boot surface.
**Path:** `manifests/boot.identity-assets.json`

---

## Implementation Plan for Future Combined Pass

**H4.5 — Hub Banner + Main Boot Runtime Integration**

To avoid repeatedly rebuilding Rust/Tauri for tiny visual changes, H4.5 will combine the live integration of both H4.3 (Hub Banner) and H4.4 (Boot Screen) into a single execution pass.

**H4.5 Objectives:**
1.  **Hub Banner Integration:** Replace the raw `Tiny Goblin Academy` text in `HubShell.tsx` with the `tga-hub-banner-source-v0.1.png`. 
    *   *Implementation Note (from Mega):* Apply a CSS frame/plaque treatment (`.hub-title-banner-frame`) to intentionally contrast the dark background of the banner with the app header background, preventing it from looking like a pasted picture.
2.  **Boot Screen Modernization:** Refactor `BootScreen.tsx` to utilize the approved hero layout and overlay placement based on the H4.4 evidence review.
3.  **Frontend Build Check:** Verify changes via standard `pnpm` linting/building.
4.  **Tauri Packaged Build:** Execute a single packaged Tauri build to verify the resulting app.exe.

---

## Runtime Eligibility Status

> The H4.4 boot evidence is not runtime wiring. The boot surface remains not-runtime-approved until Kryssie + Mega review the evidence and approve a specific implementation target.

---

## Review Checklist

*   [ ] 1280x720 boot mock reads clearly
*   [ ] 1366x768 boot mock reads clearly
*   [ ] 1600x900 boot mock reads clearly
*   [ ] 1920x1080 boot mock reads clearly
*   [ ] Hero image does not feel like an inset viewport
*   [ ] Overlay text/status is readable
*   [ ] Skip/minimal control placement is acceptable
*   [ ] Boot screen feels modern and intentional
*   [ ] Per-game loading screens remain deferred
*   [ ] Human review approves boot direction

---

## Explicit Non-Goals Achieved

*   **Source boot image unmodified:** The source asset was purely read.
*   **No runtime boot asset created:** Only mock evidence images were exported.
*   **No React/CSS modifications:** `BootScreen.tsx` and all hub code remain untouched.
*   **No game code or per-game changes:** Scope strictly isolated.
*   **No packaged build:** Tauri dev/build was not executed.
*   **No dependencies added:** Relied entirely on pre-installed tools.
*   **Retained audit artifacts untouched:** Left strictly alone.
*   **CodeCraft Native untouched:** Completely ignored.

---

## Next Recommended Task

**H4.5 — Hub Banner + Main Boot Runtime Integration**.