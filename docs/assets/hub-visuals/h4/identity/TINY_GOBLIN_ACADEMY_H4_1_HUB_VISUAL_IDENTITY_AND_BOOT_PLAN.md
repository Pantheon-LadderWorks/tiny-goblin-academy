# Tiny Goblin Academy — H4.1 Hub Visual Identity + Main Boot Asset Plan

## Task Name

H4.1 — Hub Visual Identity + Main Boot Asset Plan

## Status

Planning only. No pixels modified. No assets wired. No outputs created.

## Baseline

| Field | Value |
| --- | --- |
| Baseline commit | `11f4905 fix: correct swapped academy source assets` |
| Prior milestone | H4.0 Operational Asset Cartography (complete, counts reconciled) |
| Prior correction | H4.0E — swapped icon source / campfire background corrected |
| Retained audit artifacts | `analyze_assets.py`, `generate_report.py`, `metadata_dump.json` (untracked, untouched) |

---

## Doctrine Confirmation

Active doctrine from `TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md`, `TINY_GOBLIN_ACADEMY_HUB_ASSET_PLAN.md`, and `PANTHEON_PRODUCT_BOOT_EXPERIENCE_STANDARD.md`:

- **Source assets are not runtime assets.** No image is wired before manifest / evidence / human review is complete.
- **No direct sheet-to-hub wiring.** Manifests must exist first.
- **Hub identity must be modular**, not one giant baked dashboard image.
- **Favicon/app icon export is a distinct pipeline** from banner placement.
- **Hub banner placement is a distinct pipeline** from hub visual shell.
- **The main boot splash is a distinct visual surface** from the in-hub header.
- **Per-game loading/launch screens are a future separate pipeline.** They are acknowledged here but explicitly deferred.
- **The hub game icon sheet is already in runtime use** and backed by `manifests/hub.icon-regions.json`.
- **Pantheon Boot Standard requires:** maker mark -> product title -> status/loading phrase -> transition. No raw dashboard spawn. No sudden white screen.
- **Retained audit scripts remain untouched** and must not be staged or deleted.

---

## Source Asset Verification

### Assets inspected manually (read-only):

| Asset | Path | Dimensions | Size | Mode |
| --- | --- | --- | --- | --- |
| TGA App Icon / Favicon Source | `assets/academy/branding/icon-source/tga-icon-source-v0.1.png` | 2048x2048 | ~5.5 MB | RGBA |
| Hub Banner Source | `assets/academy/hub/banner/tga-hub-banner-source-v0.1.png` | 555x257 | ~0.2 MB | RGBA |
| Glyphforge Boot Splash Concept | `assets/studio/glyphforge-games/glyphforge-games-boot-splash-concept.png` | 2752x1536 | ~6.9 MB | RGBA |
| Hub Game Icons (in-use transparent) | `assets/academy/hub/derived/tga-hub-game-icons-transparent-v0.1.png` | 768x1376 | ~1.4 MB | RGBA |
| Pet Campfire Background | `assets/academy/games/pet-campfire/backgrounds/tga-pet-campfire-background-source-v0.1.png` | 2816x1536 | ~6.6 MB | RGBA |

### Visual confirmation:

1. **`tga-icon-source-v0.1.png`** — Square parchment-background TGA lettermark (gold "TGA" with vine and gear motif). Correct branding-icon-source. H4.0E confirmed.
2. **`tga-hub-banner-source-v0.1.png`** — Horizontal scroll banner reading "Tiny Goblin Academy" with gear/vine border. Small source (555x257). Intended to replace the current top-left title text in the hub header.
3. **`glyphforge-games-boot-splash-concept.png`** — Wide-format (2752x1536) dark/teal studio sigil with "Glyphforge Games" logotype. Full composition already structured as a hero visual — dark field, centered sigil, large logotype text below. Suitable for full-screen boot treatment.
4. **`tga-hub-game-icons-transparent-v0.1.png`** — Transparent-background icon sheet with all 10 game medallions (rounded scroll-banner frames). Already in runtime use via `hub.icon-regions.json`. Backed by validator.
5. **`tga-pet-campfire-background-source-v0.1.png`** — Forest campfire scene (landscape). Out of scope for H4.1.

---

## Current Hub Visual State

From the provided main hub screenshot:

- Window title bar: "Tiny Goblin Academy"
- Top-left heading: `Tiny Goblin Academy` as DOM text (yellow/gold, large)
- Subtitle: "Tier 1 Dashboard Catalog (Read-Only)"
- Status badges: progress, source availability, mode
- Right-side info block: "Glyphforge Games (Draft)" as DOM text
- Game grid: 5x2, gold-border cards, each using the transparent hub icon sheet via region-manifest slice
- All 10 game cards present with status badges

**Gap identified:** The top-left title is pure DOM text. The banner source (`tga-hub-banner-source-v0.1.png`) exists and is the correct replacement target, but has not been placed yet.

---

## Current Boot Visual State

From the provided boot splash screenshot:

- Background: dark with subtle dot/grid texture
- **Glyphforge Games boot splash image** rendered in a **constrained rectangular viewport** (approximately 430x230px frame), positioned in the upper half of the window
- Below the image: `GLYPHFORGE GAMES (DRAFT)` in small caps DOM text
- Below that: **"Tiny Goblin Academy"** in large gold DOM text
- Below that: **"Opening the Academy..."** loading status text
- Bottom: **Skip** button

**Current state satisfies the Pantheon Boot Standard structurally** (maker mark -> product title -> status phrase -> skip). However, the visual treatment is a draft:

- The boot image is constrained to a small inset frame, not a full-window hero.
- The background around it is the raw app background with a dot texture.
- This is not the final desired treatment.

**Per-game launch screen:** Shows game title + DEV MODE badge + Launch Status box. Functional draft. **Not in scope for H4.1.**

---

## Hub Visual Identity Surfaces — Classification

### Surface 1 — Main App Boot Surface

| Field | Value |
| --- | --- |
| Current asset | `assets/studio/glyphforge-games/glyphforge-games-boot-splash-concept.png` |
| Current implementation | Constrained inset image frame above text (draft) |
| Current component | `hub/src/components/BootScreen.tsx` |
| Desired direction | **Full-screen hero treatment** |
| Implementation notes | Image fills the window; text/status overlaid on top; not a small framed image above text |
| Boot standard compliance | Structurally passes. Visually draft. |
| Runtime eligibility | Draft in use. Not production-final until full-screen treatment reviewed. |
| Future manifest target | `manifests/boot.identity-assets.json` |

**Design Direction Note (from Kryssie):**
The boot splash should feel like a modern game studio boot screen — the image is the entire visual field, text is overlaid over it, not laid out below it as a separate DOM block. The Glyphforge image already has the right composition (dark field, centered sigil, large logotype area). The implementation needs to fill the window instead of constraining the image to a viewport rectangle.

### Surface 2 — Main Hub Header (Banner Zone)

| Field | Value |
| --- | --- |
| Current asset | None wired. DOM text title in place. |
| Target asset | `assets/academy/hub/banner/tga-hub-banner-source-v0.1.png` (555x257, ~0.2 MB) |
| Desired direction | Banner image replaces the top-left "Tiny Goblin Academy" DOM title text |
| Notes | Subtitle, status badges, and other DOM text may remain around/below the banner |
| Notes | Banner must remain responsive — not a giant baked header |
| Notes | Source is small (555x257); upscaling behavior and display size decided at H4.3 |
| Runtime eligibility | Not eligible until H4.3 responsive preview / review passes |
| Future manifest target | `manifests/hub.identity-assets.json` |

### Surface 3 — Hub Game Icon Sheet (Already in Use)

| Field | Value |
| --- | --- |
| Current asset | `assets/academy/hub/derived/tga-hub-game-icons-transparent-v0.1.png` |
| Current manifest | `manifests/hub.icon-regions.json` |
| Current validator | `scripts/validate-hub-icon-regions.mjs` |
| Implementation state | **In runtime use.** All 10 games mapped. Validator passes. |
| Notes | Live hub identity asset. Must not be disrupted by future hub shell passes. |
| Runtime eligibility | **Already eligible and in use.** |
| Next safe action | Preserve; future hub shell planning must respect this surface. |

### Surface 4 — App Icon / Favicon (Not Yet Exported)

| Field | Value |
| --- | --- |
| Current source asset | `assets/academy/branding/icon-source/tga-icon-source-v0.1.png` (2048x2048) |
| Current state | Registered source. No exports created. |
| Future exports | App icon, favicon, platform icon sizes |
| Tauri target | `.ico` for Windows (16, 32, 48, 64, 128, 256 px) |
| Runtime eligibility | Not eligible until exports generated, reviewed, and registered |
| Future manifest target | `manifests/favicon.exports.json` |

### Surface 5 — Per-Game Launch / Loading Screen

| Field | Value |
| --- | --- |
| Current state | Basic functional draft |
| Scope | **Out of scope for H4.1.** |
| Action | Documented here as future-scope only. Do not change. |

---

## Design Direction Notes (Explicit)

1. **Hub is modular, not a wallpaper.** Banner, background plate, card frames, status badges, and icon regions are separate concerns.

2. **Banner replaces the top-left title text.** `tga-hub-banner-source-v0.1.png` replaces the large "Tiny Goblin Academy" DOM text in the hub header. Subtitles and status text remain DOM.

3. **Glyphforge boot needs full-screen hero treatment.** Image fills the entire window. Text/status is overlaid on top of the image. The asset already has the right composition. The change is in implementation, not asset regeneration.

4. **Per-game loading screens are acknowledged and deferred.** Future dedicated asset and implementation task.

5. **The hub game icon sheet is a live runtime asset.** It must remain respected and undisturbed by future hub shell plans.

---

## Per-Surface Contracts

### A. Main App Boot Surface

```
asset family:         Studio / Boot Assets
operational type:     boot-studio-art
lifecycle state:      partially applied draft
future manifest:      boot.identity-assets.json
future outputs:       approved full-screen boot contract, overlay rules, status-text position
required evidence:    full-window boot mock, text/status overlay mock, loading-state mock, legibility notes
required review:      visual-quality-review, boot-experience-review
runtime eligibility:  draft in use; not production-final until full-screen treatment reviewed
```

### B. Main Hub Header / Banner Zone

```
asset family:         Hub Banner
operational type:     hub-banner-source
lifecycle state:      registered source
future manifest:      hub.identity-assets.json
future outputs:       banner placement candidate, responsive header usage notes, safe-area guidance
required evidence:    header-placement mock, banner responsive preview at hub widths, dark-bg preview
required review:      banner-responsive-review, visual-quality-review
runtime eligibility:  not eligible until placement/review complete (H4.3)
```

### C. Hub Game Icon Sheet (Live)

```
asset family:         Hub Icons
operational type:     hub-icon-sheet / runtime-approved-sheet
lifecycle state:      reviewed / integrated
manifest:             manifests/hub.icon-regions.json (active)
runtime eligibility:  already in use — preserve and protect
```

### D. App Icon / Favicon Source

```
asset family:         Branding / Icon Source
operational type:     branding-icon-source
lifecycle state:      registered source
future manifest:      favicon.exports.json
future outputs:       app icon / favicon / platform icon sizes
required evidence:    favicon-size-preview-sheet, legibility at small sizes, dark/light bg preview
required review:      favicon-legibility-review, visual-quality-review
runtime eligibility:  not eligible until exports generated and reviewed (H4.2)
```

### E. Per-Game Launch / Loading Surfaces

```
lifecycle state:      future-scope
status:               current draft exists; implementation deferred
action:               do not design, implement, or generate anything in H4.1
```

---

## Proposed Manifest Strategy

Do not create manifests yet. Field definitions only.

### `manifests/hub.identity-assets.json` (future)

Purpose: Banner, hub header identity assets, approved hub-facing identity references.

Proposed fields:
- `schemaVersion` (string)
- `assetId` (string)
- `role` (string — banner-header, background-plate, section-divider, etc.)
- `sourcePath` (string)
- `derivedPath` (string or null)
- `lifecycleState` (string)
- `readinessState` (string[])
- `usageSurface` (string — hub-header, hub-background, hub-overlay, etc.)
- `requiredEvidence` (string[])
- `reviewStatus` (string)
- `notes` (string)

### `manifests/boot.identity-assets.json` (future)

Purpose: Main app boot surface, future per-game boot assets, overlay rules.

Proposed fields:
- `schemaVersion` (string)
- `assetId` (string)
- `bootLayer` (string — hub-boot, game-launch, in-game-preload)
- `sourcePath` (string)
- `lifecycleState` (string)
- `displayMode` (string — full-screen-hero, constrained, animated)
- `overlayRules` (object — titlePosition, statusPosition, textColor, etc.)
- `reviewStatus` (string)
- `notes` (string)

### `manifests/favicon.exports.json` (future)

Purpose: App icon / favicon export definitions and reviewed outputs.

Proposed fields:
- `schemaVersion` (string)
- `sourcePath` (string)
- `exportSetId` (string)
- `sizes` (number[] — 16, 32, 48, 64, 128, 256, 512)
- `formats` (string[] — png, ico, icns)
- `outputDirectory` (string)
- `evidencePath` (string or null)
- `reviewStatus` (string)
- `platformTargets` (string[] — windows, tauri, web-favicon, etc.)
- `notes` (string)

### Existing manifest — preserve as-is:

`manifests/hub.icon-regions.json` — active manifest for hub game icon sheet region slicing. Do not merge into `hub.identity-assets.json`. Serves a different implemented function.

---

## Required Evidence Stack

### For App Icon / Favicon (H4.2):

- Source metadata JSON (dimensions, mode, alpha, file size)
- Favicon size preview sheet (all target sizes on one canvas)
- Individual previews: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256, 512x512
- Dark background preview
- Light/white background preview
- Windows `.ico` target notes (Tauri build)
- Human review checklist (legibility at small sizes, transparency correct)

### For Hub Banner Placement (H4.3):

- Source metadata JSON
- Header placement mock (banner in top-left header zone at actual hub layout)
- Banner responsive preview at likely hub display widths
- Dark-background preview
- Safe-area / crop notes (555x257 source — upscaling behavior, aspect ratio decisions)
- Human review checklist

### For Main App Boot Surface (H4.4):

- Source metadata JSON
- Full-window boot mock (boot image fills window, Tauri chrome only above)
- Text / status overlay mock (title and loading phrase overlaid on image)
- Loading-state mock
- Legibility notes (does TGA title text read over dark Glyphforge sigil zone?)
- Human review checklist

### For Per-Game Loading Surfaces:

- Future-scope only. Evidence family TBD.

---

## Human Review Gates

| Gate | Required Before |
| --- | --- |
| Favicon export evidence + legibility review | Any `.ico` / favicon used in Tauri build |
| Banner placement mock + responsive review | Banner image wired into hub header |
| Full-screen boot mock + overlay review | BootScreen.tsx updated from draft |
| Per-game loading review | Future task |

---

## Runtime Eligibility Summary

| Surface | Currently Eligible | Eligible After |
| --- | --- | --- |
| Hub game icon sheet | **Yes** (in use) | — |
| Boot splash (draft) | Draft in use | Full-screen treatment + review (H4.4) |
| Banner | No | H4.3 placement evidence + review |
| App icon / favicon | No | H4.2 export pipeline + review |
| Per-game loading screens | No | Future dedicated pass |

---

## Next H4.x Prompt Sequence

```
H4.2 — Favicon / App Icon Export Pipeline
         Generate sized exports, preview sheet, legibility evidence.
         Produce draft favicon.exports.json manifest.
         Human review before any Tauri icon target is updated.

H4.3 — Main Hub Banner Placement + Responsive Preview Evidence
         Mock the banner in the hub header zone at real hub widths.
         Produce placement evidence and safe-area notes.
         Human review before banner is wired.

H4.4 — Main Glyphforge Boot Surface Modernization Plan + Evidence
         Plan the full-screen boot hero treatment.
         Produce full-window mock and overlay composition notes.
         Human review before BootScreen.tsx is updated.

H4.5 — Hub Visual Shell Modular Component Plan
         Define background plate, trim, card frames, status badge system, dividers.
         Must reference live icon region system and not disturb it.
         Planning and evidence only — no implementation.

H4.6 — Hub Visual Shell Implementation
         Wire approved hub identity assets only.
         Modular: banner zone, background plate, card frame system, status badges.
         Not a single baked dashboard image.

H4.7 — Shared UI/HUD + Shared FX Pipeline Plan
         Plan the pipeline for the UI/HUD sheet and shared FX sheet.
         Evidence tooling, manifest draft, cleanup risk assessment.

H4.8 — First Static Sheet Evidence Tooling Pilot
         Run the evidence pipeline on one low-risk static sheet.
         Establish the reusable evidence / review workflow before animation sheets.

H4.9 — Character Animation Sheet Pipeline Plan
         Plan the full animation pipeline.
         Do not touch animation sheets until hub identity and static pipeline are proven.
```

**Ordering rules:**
- Do not jump to animation sheets before hub identity and evidence tooling passes are proven.
- Do not run batch cleanup on animation sheets without a pilot review.
- Hub visual shell must remain modular throughout.

---

## Non-Goals

The following were **not done** in H4.1 and must not be done without explicit planning:

- No image pixels modified.
- No crops, resizes, or compression applied.
- No derived assets created.
- No favicon exports created.
- No boot screen variants created.
- No banner previews created.
- No hub runtime code changed.
- No game code changed.
- No per-game loading screens changed.
- No runtime assets wired.
- No manifests created (field definitions only — no JSON files).
- No new scripts created.
- `analyze_assets.py`, `generate_report.py`, `metadata_dump.json` untouched.
- CodeCraft Native untouched.