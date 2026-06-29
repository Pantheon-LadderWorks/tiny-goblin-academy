# Tiny Goblin Academy — H5.0 Shared Asset Domain Mapping + Checkerboard Cleanup Pipeline Audit

## 1. Purpose
This pass establishes the initial mapping and analysis pipeline for three shared asset domains: `shared-core`, `shared-fx`, and `ui`. It evaluates the transparency integrity of the raw concept sheets, documents the existing mature checkerboard cleanup tools, and proposes draft mapping manifests for these assets before any slicing, animation, or runtime implementation occurs.

## 2. Human Review Context
H4.8 stabilized the Tiny Goblin Academy hub layout (grid preservation). H5.0 shifts focus back to the core asset pipeline, beginning with the shared domains that must serve as foundation before animation logic.

> **H5.0B Review Update:** Human/Codex review rejected the original H5.0 evidence images as insufficient. H5.0B repairs the evidence layer and pilots checkerboard cleanup on derived copies only.

## 3. Source Sheets
- `assets/academy/shared-core/tga-shared-core-sheet-v0.1.png` (2816x1536, RGBA, Fully opaque baked checkerboard)
- `assets/academy/shared-fx/tga-shared-fx-feedback-sheet-concept-v0.1.png` (1024x1024, JPEG, RGB, No alpha channel)
- `assets/academy/ui/tga-ui-hud-sheet-v0.1.png` (2816x1536, RGBA, Fully opaque baked checkerboard)

> **CRITICAL DISCOVERY**: The `shared-fx` sheet is a JPEG with a `.png` extension and has no alpha channel.

## 4. Domain Classification
- **Shared Core**: Shared props, pickups, objects, utility icons.
- **Shared FX**: Shared feedback, effects, event visuals.
- **UI / HUD**: HUD panels, buttons, frames, badges, bars, dialogue/speech panels.

## 5. Existing Transparency / Checkerboard Cleanup Findings
- **Tool Name**: `scripts/clean-fake-transparent-sheet.py`
- **Algorithm**: Full-sheet border-connected low-saturation gray flood fill to alpha.
- **How it works**: By detecting low-saturation gray-like pixels starting strictly from the image perimeter, it removes the background without global destruction, preserving any intentional grays deeper within the artwork.
- **Input Assumptions**: Expects the fake transparent checkerboard to be connected to the image borders and the target pixels to be low-saturation gray-like. Produces true RGBA alpha.

## 6. Cleanup Risk Assessment
- **Shared Core (PNG)**: Medium Risk. Isolated prop sheets are generally safe for border-connected flood fill, provided they do not have overlapping drop shadows that bleed into the checkerboard.
- **Shared FX (JPEG)**: High Risk / Action Required. Since this is a JPEG without an alpha channel, standard PNG flood-fill scripts will not function as expected due to compression artifacts. It needs conversion, or a different keying approach (like a luma key or a specific script modification).
- **UI / HUD (PNG)**: Low/Medium Risk. UI panels are usually opaque, but semi-transparent glass or drop shadows might be damaged. Pilot testing is required.

## 7. Proposed Derived Asset Policy
The original pantry PNGs are source assets and must not be overwritten.
Any transparency cleanup outputs are derived assets.
Derived cleaned sheets require evidence and human review before runtime approval.
No asset may be wired into a game until its region manifest exists and validates.

All derived assets will be stored in `assets/academy/derived-cleaned/<domain>/`.

## 8. Proposed Manifest Family
- `manifests/academy.shared-core.regions.json` (draft)
- `manifests/academy.shared-fx.regions.json` (draft)
- `manifests/academy.ui-hud.regions.json` (draft)

## 9. Shared Core Domain Map
Draft manifest created with `usage: "draft-placeholder"`.
Categories: utility, icon, currency.
Pending exact coordinate mapping.

## 10. Shared FX Domain Map
Draft manifest created with `usage: "draft-placeholder"`.
Categories: effect.
Pending exact coordinate mapping and JPEG artifact/transparency resolution.

## 11. UI / HUD Domain Map
Draft manifest created with `usage: "draft-placeholder"`.
Categories: ui.
Pending exact coordinate mapping.

## 12. Naming Conventions
- Domains: `shared-core`, `shared-fx`, `ui-hud`
- Manifests: `academy.<domain>.regions.json`
- Region IDs: `<domain>.<object_name>`

## 13. Validator Strategy
A dedicated validator (`scripts/validate-academy-shared-asset-regions.mjs`) has been written to enforce manifest contracts for these three domains. It verifies schema rules, file existence, and uniqueness without modifying unrelated manifests.

## 14. Non-Goals
- Full exhaustive sprite mapping in this pass.
- Running the actual automated cleanup tool.
- Replacing source assets.
- Wiring assets to game code or hub runtime.

## 15. Human Review Checklist
- [ ] Treat original `assets/academy/evidence/h5-0/` images as retained but insufficient evidence.
- [ ] Review H5.0B replacement evidence under `assets/academy/evidence/h5-0b/`.
- [ ] Review risk assessment for `shared-fx` being a JPEG/RGB source with no alpha.
- [ ] Confirm derived asset directory structure (`assets/academy/derived-cleaned/`).
- [ ] Confirm draft placeholders in manifests.

## 16. Recommended Next Step
- **H5.1 — Reusable Asset Pipeline Script Toolkit Plan + Initial Scaffold**: Turn the cleanup/evidence pattern into reusable type-specific asset pipeline scripts before deeper region mapping.
