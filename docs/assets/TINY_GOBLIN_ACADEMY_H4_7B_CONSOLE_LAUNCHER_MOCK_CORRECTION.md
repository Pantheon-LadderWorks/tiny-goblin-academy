# Tiny Goblin Academy — H4.7B: Console Launcher Mock Correction / Evidence Pass

**Status:** EVIDENCE ARCHIVED — Human review chose not to implement any candidate immediately  
**Date:** 2026-06-29  
**Follows:** H4.7 (Candidate C horizontal shelf — REJECTED as programmer wireframe/placeholder)  
**Precedes:** H4.8 (Grid preservation + practical header/card compression — NOT a candidate implementation)

> **H4.8 Review Note:** Human review chose not to implement any H4.7B candidate immediately. H4.8 preserves the current grid and focuses on practical header/card compression.


---

## Why H4.7 Was Rejected

H4.7 produced a single-row horizontal strip of icon thumbnails with no visual hierarchy, no selection state, no tier structure, and no sense of a modern launcher. The verdict from human review:

> "He made a literal wireframe-programmer mock and then declared it 'highly viable.' That is the exact failure mode we were trying to prevent."

Key failures:
- Single-row strip looked barren and placeholder-like
- Icons were misaligned (wrong sheet region mapping)
- No coming-soon tier scaffolding
- No global options placement study
- No feature panel option explored

---

## H4.7B Objectives

1. Generate **three distinct corrected layout candidates** with proper icon rendering
2. Use **`manifests/hub.icon-regions.json`** for all icon crops — no guessing, no column math
3. Document **Global Launcher Options** placement (not per-card actions)
4. Include Tier 2 "Coming Soon" scaffolding in all candidates
5. No candidate is pre-approved — human review decides direction

---

## Icon Source Correction

**Previous error:** Attempts to slice the icon sheet using uniform column/row grid math,  
which either hit the ribbon-label region or the checkerboard background padding.

**Fix:** All icons loaded from `manifests/hub.icon-regions.json` `sourceRect` coordinates —  
the exact pixel bounding boxes mapped during H4.2C, pointing into  
`assets/academy/hub/tga-hub-game-icons-sheet-concept-v0.1.png`.

Each `sourceRect` is:
```
{ x, y, w, h }  — exact pixel region of the medallion+ribbon art
```

Icons are square-padded from the sourceRect bounding box, then resized per card.

---

## Candidates Generated

### Candidate A — Polished 5×2 Grid

- Preserves the current grid layout concept
- Premium dark launcher aesthetic with gold/teal accent system
- All 10 Tier 1 games visible at once, no scrolling required
- Selected game (Button Goblin Clicker) has gold border + Launch button
- Global "Launcher Options" pill at top-right — **not** per-card
- Tier 2 reserved as footer text
- Lowest implementation risk — closest to current runtime structure

**Evidence files:**
- `assets/academy/hub/evidence/h4-7b/tga-h47b-candidate-a-grid-1280x720.png`
- `assets/academy/hub/evidence/h4-7b/tga-h47b-candidate-a-grid-1366x768.png`
- `assets/academy/hub/evidence/h4-7b/tga-h47b-candidate-a-grid-1920x1080.png`

---

### Candidate B — Multi-Row Console Shelves

- Tier 1 Row 1 + Tier 1 Row 2 on separate labelled shelf rows
- Tier 2 "Coming Soon" shelf always visible below
- Closest to Xbox/PlayStation console dash shelf model
- Horizontal scroll affordance (`>`) per shelf row
- No feature panel; cards carry all info
- Global "Launcher Options" pill at top-right
- Medium implementation effort

**Evidence files:**
- `assets/academy/hub/evidence/h4-7b/tga-h47b-candidate-b-multi-shelf-1280x720.png`
- `assets/academy/hub/evidence/h4-7b/tga-h47b-candidate-b-multi-shelf-1366x768.png`
- `assets/academy/hub/evidence/h4-7b/tga-h47b-candidate-b-multi-shelf-1920x1080.png`

---

### Candidate C — Hybrid Feature Panel + Tier Shelves

- Left panel (~40% width): Academy banner + selected game feature area
  - Large icon, title, lesson metadata, description
  - "Launch Dev Game" + "Details" action buttons
  - **"Launcher Options" button** — global app settings, NOT per-game
  - `[Account]  [Ledger reserved]` placeholders
- Right panel (~60% width): Multi-row tier shelves
  - Tier 1 Row 1 shelf
  - Tier 1 Row 2 shelf
  - Tier 2 Expansion (Coming Soon) shelf
- Most modern launcher feel; highest layout complexity
- Room for Butler/update state in left panel future pass

**Evidence files:**
- `assets/academy/hub/evidence/h4-7b/tga-h47b-candidate-c-hybrid-shelves-1280x720.png`
- `assets/academy/hub/evidence/h4-7b/tga-h47b-candidate-c-hybrid-shelves-1366x768.png`
- `assets/academy/hub/evidence/h4-7b/tga-h47b-candidate-c-hybrid-shelves-1920x1080.png`

---

## Supporting Sheets

### Layout Correction Comparison Sheet
`assets/academy/hub/evidence/h4-7b/tga-h47b-layout-correction-comparison-sheet.png`

All three candidates side-by-side with thumbnail previews and feature notes.

### Global Options Placement Study
`assets/academy/hub/evidence/h4-7b/tga-h47b-global-options-placement-sheet.png`

Three placement models studied:
- **Top-Right Gear / Status Cluster** — compact pill in header rail, expands to overlay
- **Side Rail Utility Strip** — narrow persistent strip, icon + label
- **Bottom Command Bar** — full-width bottom bar with grouped global actions

Menu items documented:
- Launcher Options
- Key Bindings
- Audio
- Display / Graphics
- Accessibility
- Diagnostics / Logs
- Developer Runtime Settings
- Account / Profile (future)

**Doctrine clarification:** "Options" = **global launcher/app settings**.  
Not per-game card action buttons. Per-game actions belong in the feature panel or card click.

---

## Hub Asset Files Used

| Asset | Path |
|-------|------|
| Source icon sheet | `assets/academy/hub/tga-hub-game-icons-sheet-concept-v0.1.png` |
| Icon regions manifest | `manifests/hub.icon-regions.json` |
| Banner source | `assets/academy/hub/banner/tga-hub-banner-source-v0.1.png` |

---

## Current Runtime State

Hub runtime remains on **H4.5B** (banner + boot integration).  
Files NOT modified in H4.7B:
- `hub/src/HubShell.tsx`
- `hub/src/hub.css`
- `hub/src-tauri/tauri.conf.json`

No runtime changes until a candidate is reviewed and approved.

---

## Review Gate

- [ ] Human reviews all three candidates (A, B, C)
- [ ] Human selects direction or requests iteration
- [ ] Human approves implementation direction for H4.8
- [ ] H4.8 implements approved layout in runtime

**DO NOT implement any layout direction based on this evidence pass alone.**
