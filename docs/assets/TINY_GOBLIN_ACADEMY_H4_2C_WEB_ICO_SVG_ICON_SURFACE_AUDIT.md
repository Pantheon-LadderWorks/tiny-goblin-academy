# Tiny Goblin Academy — H4.2C Web / ICO / SVG Icon Surface Audit

## Task Name

H4.2C — Complete App Icon Web / ICO / SVG Surface Audit

## Status

Complete. `.ico` generation was successfully executed using local tooling. Web SVG favicon was replaced with a wrapper embedding the approved PNG icon.

## Baseline

| Field | Value |
| --- | --- |
| Baseline commit | `83f4658 feat: integrate approved app icon candidates` |
| Prior milestone | H4.2B Tauri App Icon Integration |
| Retained audit artifacts | `analyze_assets.py`, `generate_report.py`, `metadata_dump.json` (untracked, untouched) |

---

## Tooling Audit Results

Before deciding tools were unavailable, a local toolchain check was run:
- Python 3.13.7 is available.
- Pillow 11.3.0 is available.
- `magick`, `inkscape`, `png2ico` were not found.

Because Pillow is already installed, it was safely used as the local tool to compile the `.ico` file.

> H4.2B was intentionally conservative about `.ico`/SVG work. H4.2C corrects that by auditing available local tooling first and using appropriate existing tools where safe.

---

## Approved PNG Input Verification

The following candidate files (generated in H4.2) were verified as present and valid:
`tga-icon-16.png`, `tga-icon-32.png`, `tga-icon-48.png`, `tga-icon-64.png`, `tga-icon-128.png`, `tga-icon-256.png`, `tga-icon-512.png`.

---

## ICO Candidate Status

An ICO file was successfully compiled using Python and the Pillow library:
*   **Candidate Path:** `assets/academy/branding/icon-exports/candidate/h4-2/tga-icon-candidate.ico`
*   **Contained Sizes:** 256, 128, 64, 48, 32, 16

**Tauri Integration:**
Because the tooling proved safe, and `hub/src-tauri/icons/icon.ico` was natively expected by Tauri, the newly generated `.ico` was copied over:
*   `tga-icon-candidate.ico` → `hub/src-tauri/icons/icon.ico`

---

## Web / SVG Surface Audit

### `hub/public/favicon.svg`
- **Audit Result:** Was a basic purple placeholder.
- **Action:** Replaced with an SVG wrapper that embeds the approved `tga-icon-256.png` candidate encoded as base64.
- **Status:** Replaced with approved TGA identity.

### `hub/public/icons.svg`
- **Audit Result:** Contained generic social media icons (`bluesky-icon`, `discord-icon`, `github-icon`, etc.).
- **Reference Findings:** A codebase search confirmed `icons.svg` is completely unreferenced in the frontend UI.
- **Action:** Left untouched to avoid accidental UI breaks and documented as obsolete.

---

## Manifest Changes

`manifests/favicon.exports.json` was updated:
*   Added `icoCandidate` referencing the new `.ico` candidate.
*   Added `webIconSurfaces` array tracking `favicon.svg` (replaced) and `icons.svg` (audited, unreferenced).

---

## Validation & Runtime Status

*   **Validators:** `validate-academy-manifest.mjs` and `validate-hub-icon-regions.mjs` both pass.
*   **Code Impact:** No hub or game runtime code was modified.
*   **Build Impact:** No packaged build was executed.

---

## Non-Goals Achieved

*   No PNG candidates were regenerated.
*   Source icon was entirely untouched.
*   No new icon art generation from scratch.
*   No runtime behavior changes were made.
*   No packaged build was executed.
*   No dependency packages were added.
*   The retained audit artifacts remain untouched and untracked.
*   CodeCraft Native remains untouched.

---

## Next Recommended Task

**H4.3 — Main Hub Banner Placement + Responsive Preview Evidence**.
The favicon/app icon lane is truly complete now.