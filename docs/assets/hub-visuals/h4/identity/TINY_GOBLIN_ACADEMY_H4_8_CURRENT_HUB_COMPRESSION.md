# Tiny Goblin Academy — H4.8 Current Hub Compression / Grid Preservation Pass

**Status:** COMPLETE — Human visual smoke check required  
**Date:** 2026-06-29  
**Follows:** H4.7B (corrected mock evidence — evidence only, not implemented)  
**Precedes:** H4.9 (TBD)

---

## Purpose

Practical, targeted cleanup of the current Tiny Goblin Academy hub. No new layout architecture. The hub's existing 5×2 grid is preserved as-is. The goal is to reduce header footprint and move verbose audit metadata off the game card faces so the grid feels less like a CI dashboard and more like a launcher.

---

## Human Review Decision

H4.7 and H4.7B remain archived evidence only.  
No console shelf redesign is approved for runtime implementation right now.  
The current hub/grid structure is preserved for H4.8.  
H4.8 only compresses the current header and game cards.

---

## Baseline

| Item | Value |
|------|-------|
| Branch | main |
| Preceding commit | `191ffc9` |
| Runtime state before H4.8 | H4.5B (banner + boot integration) |
| Untracked audit artifacts | `analyze_assets.py`, `generate_report.py`, `metadata_dump.json` (retained) |

---

## Scope

Changes made in H4.8:

| File | Change |
|------|--------|
| `hub/src/components/GameCard.tsx` | Remove verbose badge stack, replace with single readiness signal |
| `hub/src/components/HubShell.tsx` | Add compact Glyphforge Games identity to header right |
| `hub/src/styles/hub.css` | Header, card, grid, and viewport padding compression |

**Not changed:**
- `GameDetailPanel.tsx` — all verbose metadata preserved in modal
- `GameRoster.tsx`, `SpriteFrame.tsx`, `hubIconRegions.ts` — untouched
- All manifests, game code, source images
- Boot screen, launch behavior, dev server commands

---

## Header Compression Summary

| Property | Before | After |
|----------|--------|-------|
| Header padding | `1rem 1.5rem` | `0.5rem 1rem` |
| Banner max-width | `340px` | `200px` |
| Banner scale | `1.04` | `1.02` |
| Banner frame padding | `4px` | `3px` |
| Header-left gap | `0.5rem` | `0.25rem` |
| Studio identity | absent from header | compact `Glyphforge Games` text label |

Header now occupies roughly half the previous vertical footprint while retaining all identity elements.

---

## Game Card Compression Summary

| Property | Before | After |
|----------|--------|-------|
| Card padding | `1rem` | `0.6rem` |
| Card gap | `0.75rem` | `0.4rem` |
| Card-frame height | `160px` | `120px` |
| Card-frame margin-bottom | `0.5rem` | `0.25rem` |
| Grid gap | `1.5rem` | `0.75rem` |
| Grid max-width | `1200px` | `1280px` |
| Hub-main padding | `2rem` | `1rem` |
| Badges on card face | 6–7 (Listed, Source Available, Workspace Member, Build, Dev Script, Static Entry Found, View Runtime Status) | **1** (single readiness signal) |

### Readiness Signal Mapping

| Condition | Label | Badge Color |
|-----------|-------|-------------|
| `restorationDeferred` | Restoration Deferred | Red |
| `devLaunchAvailable` or `playableMode === 'dev'` | Dev Ready | Blue |
| `sourceDirectoryExists` or `sourceAvailable` | Source Ready | Green |
| otherwise | Needs Setup | Default |

---

## Metadata Responsibility Split

Game cards should not behave like audit reports.  
Verbose metadata belongs in the details modal, not on every dashboard card.  
The card face should prioritize icon art, level identity, and one compact runtime/source readiness signal.

**Card face:** icon art + Level N + one readiness badge  
**Details modal (GameDetailPanel):** Listed, Workspace Member, Source Directory, Package.json, Node Modules, Dev Script, Build Script, Dist Exists, Static Entry, Build Status, Playable Mode, Dev actions, Production placeholders

---

## Validation Results

| Validator | Result |
|-----------|--------|
| `validate-academy-manifest.mjs` | See Task 9 output |
| `validate-hub-icon-regions.mjs` | See Task 9 output |
| Bell/control characters | None |
| Frontend build | See Task 9 output |
| Tauri packaged build | See Task 9 output |

---

## Human Visual Smoke Checklist

```
[ ] Header is noticeably shorter than H4.5B.
[ ] TGA banner remains legible (smaller but present).
[ ] Glyphforge Games identity visible as compact text in header right.
[ ] Developer/backend status pills remain visible.
[ ] Game cards no longer look like audit reports.
[ ] Each card shows only: icon art, Level N, one readiness pill.
[ ] Card icon art correctly mapped and aligned (SpriteFrame untouched).
[ ] Card grid is closer to contained at 1280x720.
[ ] 1366x768 feels less cramped.
[ ] 1920x1080 breathes.
[ ] Details modal still contains full verbose metadata.
[ ] Launch behavior still works.
[ ] Dev game runtime screen still works.
```

---

## Recommended Next Step

- Human smoke check: visual inspection of packaged Tauri app
- If approved: surface contract doc update (H4.9 or similar) noting current hub as canonical
- Deeper modernization (console-style launcher, options surface, Tier 2 scaffolding) deferred until direction is re-approved
