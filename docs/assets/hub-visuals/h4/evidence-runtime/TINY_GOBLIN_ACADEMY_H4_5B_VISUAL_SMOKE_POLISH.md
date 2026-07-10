# Tiny Goblin Academy — H4.5B Visual Smoke Polish

## Task Name
H4.5B — Visual Smoke Polish After Banner + Boot Integration

## Baseline
* **Baseline Commit SHA:** `8e7bb2f feat: integrate hub banner and boot hero`

## Visual Smoke Issues Found
* The header was too tall, crowding the dashboard game grid.
* The banner frame showed an unsightly black/dark gap around the edges of the image.
* Stale developer scaffolding text (`Glyphforge Games (Draft)`, `Workspace install complete`) cluttered the right side.
* The diagnostic ping button felt random, floating in the center.
* Boot screen text collided with the central Glyphforge logo at default/smaller window sizes.
* The default Tauri window size was too cramped (800x600).
* The dashboard showed too much repeated catalog metadata on each game card.

## Header Polish Summary
* Reduced `.hub-header` padding to make it more vertically compact.
* Kept the banner frame but cropped/zoomed the banner slightly inside the container (`transform: scale(1.04)`, `overflow: hidden`) to eliminate the dark edge gap.
* Cleaned up the right-side header, removing stale `CreditsPanel` text.
* Moved the diagnostic Ping Tauri Bridge button to a compact right-side status pill group that shows `Backend: Ping` or `Backend: Connected` cleanly.

## Boot Polish Summary
* Reworked the Layout C overlay styling for `.boot-overlay-c`. Instead of centering the title absolutely, it is now placed at the top via `justify-content: space-between` with padding.
* Status and skip buttons remain safely anchored at the bottom.
* Added a subtle gradient scrim and blurred text background to ensure readability over the artwork without obscuring the central logo.
* Both default window size and 1920x1080 now display without text collisions.

## Tauri Window Config Summary
* Modified `hub/src-tauri/tauri.conf.json` to improve the default boot and dashboard experience.
* Changed default size to `1280x720` (from `800x600`).
* Added `minWidth: 1024` and `minHeight: 640` to prevent catastrophic breakage on launch.

## Files Changed
* `hub/src/components/HubShell.tsx`
* `hub/src/styles/hub.css`
* `hub/src-tauri/tauri.conf.json`
* (Documentation updates)

## Explicit Non-Goals
* No source image pixels modified or compressed.
* No game code or per-game loading screens modified.
* No CodeCraft Native files touched.
* Did not overhaul or redesign the game cards (only documented future direction).
* Did not force fullscreen or kiosk mode.
* Did not touch retained audit artifacts.

## Visual Smoke Checklist
* [ ] Main app boot opens at a reasonable default size (1280x720).
* [ ] Boot screen has no text-on-text collision with the artwork.
* [ ] Boot title/status are readable with a subtle scrim.
* [ ] Boot skip button is visible and usable.
* [ ] Hub header is more compact vertically.
* [ ] Banner plaque looks intentional and black edge gap is eliminated via CSS scaling.
* [ ] Stale dev text is gone from the header.
* [ ] Ping/backend status is intentionally placed as a right-side pill.
* [ ] Game grid has more vertical room.

## Hub Surface Contract & Known Follow-Up Items
The dashboard must land on a coherent launcher surface where primary choices are visible without hunting. The dashboard should avoid scrolling, delegating verbose metadata and scrolling to the details modal.

* **Future H4.6 — Hub Surface Contract + Compact Game Card / Details Refinement Plan**: The current game cards contain too much repeated metadata. Future iterations should simplify cards to large icon/art, minimal subtext (e.g. `Level 1 • Clicker`), and basic status, moving verbose data to the details modal.
* **Future laptop/small-screen dashboard fit pass**: Small screens need responsive dashboard planning to ensure fit without crowding.
* **Future per-game loading screen asset pass**.
* **Future hub visual shell modular component plan**.
* **Future optional micro-favicon polish**.