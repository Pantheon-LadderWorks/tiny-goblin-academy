# Tiny Goblin Academy H4.7 — Console-Style Launcher Mock Evidence

## 1. Purpose
This document provides static visual evidence for Candidate C (Console-Style Selected Feature + Horizontal Shelf), validating the new hub surface contract established in H4.6. This allows us to visually test the design across different target viewports before writing runtime React/CSS code.

## 2. Baseline
This pass builds directly on the layout canonized in:
`944ac3a docs: add hub surface scaling contract`

H4.7 is preparing for possible H4.8 implementation, but **does not approve implementation by itself**.

## 3. Human Review Context
**CRITICAL DOCTRINE:**
* H4.7 does not implement runtime layout.
* H4.7 creates static visual evidence only.
* Candidate C remains subject to human review.
* The hub should feel like a full-screen launcher surface, not a web dashboard.
* Controlled shelf scrolling is acceptable; random page/document scrolling is not the target.
* Verbose metadata belongs in the selected-game feature panel and details overlay, not on every card.

## 4. Inputs Used
The following existing assets were used to generate the composite mocks:
* `assets/academy/hub/banner/tga-hub-banner-source-v0.1.png`
* `assets/academy/hub/tga-hub-game-icons-sheet-concept-v0.1.png`
* Pillow library for python-based compositing.

Note: A Glyphforge Games seal placeholder was used to represent the compact studio identity until an official asset is ingested from the Pantheon repo.

## 5. Candidate C Mock Direction
The mock maps out the new spatial relationships:
1. **Top Rail:** Compact Studio Identity (Glyphforge) + Developer/Backend Status.
2. **Masthead:** Tiny Goblin Academy product identity (Banner/Plaque).
3. **Center Focus:** Selected-game feature panel (Title, Summary, Launch/Details/Options actions).
4. **Bottom Shelf:** Horizontal game shelf grouped by Tier, supporting controlled horizontal scrolling.

## 6. Generated Evidence
All generated mock files are located in `assets/academy/hub/evidence/h4-7/`:
* `tga-console-launcher-candidate-c-1280x720.png`
* `tga-console-launcher-candidate-c-1366x768.png`
* `tga-console-launcher-candidate-c-1600x900.png`
* `tga-console-launcher-candidate-c-1920x1080.png`
* `tga-console-launcher-candidate-c-scale-sheet.png`
* `tga-hub-layout-candidate-comparison-sheet.png`

## 7. Viewport Findings
* **1280x720 (Minimum Target):** The layout is dense but functional. The shelf fits 3-4 cards comfortably, and the selected feature panel commands the necessary vertical space without triggering full-page scroll.
* **1366x768 (Laptop Target):** Breathes noticeably better than 720p.
* **1600x900 & 1920x1080 (Desktop Targets):** Expansive and highly premium. The horizontal shelf can expose 5+ cards naturally, and the feature panel feels prominent and cinematic.

## 8. Card / Feature Panel Findings
Moving verbose text off the individual cards and into the centralized feature panel is highly effective. The cards themselves can remain purely visual (game icons), functioning strictly as navigational targets.

## 9. Identity Findings
The layout successfully preserves the hierarchy: Glyphforge Games acts as the overarching publisher/studio at the top edge, while Tiny Goblin Academy holds the primary masthead product weight.

## 10. Future Layer Findings
Subtle reservations for "Install/Update", "Account", and "Ledger" demonstrate that the layout will not break when these states are introduced. They can live organically below or beside the primary action cluster without crowding the dev-mode "Launch" intent.

## 11. Non-Goals
* No React components were written.
* No Tauri configurations were modified.
* No game logic was altered.

## 12. Human Review Checklist
- [ ] Is Candidate C plausible at 1280x720?
- [ ] Does 1366x768 remain comfortable?
- [ ] Does 1920x1080 breathe?
- [ ] Does the selected-feature panel make card text reduction plausible?
- [ ] Does the mock preserve Glyphforge/TGA identity hierarchy?
- [ ] Does it reserve room for Options without implementing options?
- [ ] Does it avoid looking like a web dashboard?

## 13. Recommended Next Step
Review the generated mocks. If the spacing and layout direction are approved, we will proceed to **H4.8 — First Static Sheet Evidence Tooling Pilot** or implementation of the layout structure in React/CSS.
