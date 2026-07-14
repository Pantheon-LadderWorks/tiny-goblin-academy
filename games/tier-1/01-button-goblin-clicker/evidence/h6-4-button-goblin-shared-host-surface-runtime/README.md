# H6.4A runtime evidence

Actual Tauri/WebView2 evidence for Button Goblin's shared physical host surfaces and material-aware typography.

## Acceptance contracts

- Primary display: `1920×1080`; maximized Windows capture: `1920×1032` after desktop chrome reservation.
- Minimum Tauri content size: `1024×640`; actual outer-window capture: `1026×672` including Windows chrome.
- Default Tauri content size: `1280×720`.
- Embedded game: fluid iframe using the shell's remaining area; no independent fixed minimum.

## Evidence sets

`tauri/minimum-1024x640/` is the complete seven-state acceptance run:

1. `01-initial.jpg`
2. `02-bonk.jpg`
3. `03-upgrade-unavailable.jpg`
4. `04-upgrade-available.jpg`
5. `05-upgrade-purchased.jpg`
6. `06-later-goblin.jpg`
7. `07-victory.jpg`

`tauri/primary-1920x1080/` contains the clean primary-display anchors:

- `01-initial.jpg`
- `07-victory.jpg`

`before-h6-4a/` preserves the original H6.4 runtime run, including the exploratory `760×700` harness, solely for comparison and provenance. It is not the current desktop acceptance contract.

## Assertions

- Region 30 renders at a 160px host width and fully reads `ONE UPGRADE`.
- Region 20 shows its title, body, and footer above the protected frame border at both acceptance sizes.
- Victory overlays the HUD; the title is not obscured at minimum size.
- Only the optional flavor hint is removed at minimum width.
- All live controls, state values, interaction, and progression remain code-owned.
- Physical assets retain uniform contain scaling, protected edges, independent DOM text, and code-native fallbacks.

See `runtime-typography-audit.md`, `shared-surface-usage-matrix.md`, `material-typography-before-after.md`, and `runtime-assertions.json` for the auditable record.
