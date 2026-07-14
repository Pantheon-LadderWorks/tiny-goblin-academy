# H6.4A — Button Goblin shared host surfaces and material typography

Status: implemented, validated, and ready for human visual review. The work remains unstaged and uncommitted.

## Runtime result

Button Goblin keeps its game-owned HUD and Bonk card while using two reviewed Academy surfaces where physical material adds real value:

- Region 20, `ui-hud.frame-large.teal`, hosts the victory title, body, and footer.
- Region 30, `ui-hud.paper-label.small`, hosts only `ONE UPGRADE` inside the game-owned Bonk card.
- Region 5, `ui-hud.dark-panel.long`, remains rejected for the four-card HUD. Four copies would crowd the actor and encounter lanes, and one copy cannot represent four live values within its reviewed label/value contract.

All hosted text remains independent DOM text. Both physical assets use uniform contain scaling without stretching, preserve their protected borders, and fall back to code-native Academy surfaces if an image cannot load.

## Desktop contract

`hub/src-tauri/tauri.conf.json` is the authority for the desktop window:

- default Tauri content size: `1280×720`
- minimum Tauri content size: `1024×640`
- resizable: `true`
- primary review display: `1920×1080`

There is no separate fixed embedded-game minimum. The out-of-process iframe fluidly fills the shell's remaining content area. Actual Windows Graphics Capture evidence records a `1026×672` outer window at the configured `1024×640` minimum content size, and a `1920×1032` maximized client capture on the `1920×1080` primary display after Windows title-bar/taskbar reservation.

The previous `760×700` capture harness was useful exploratory evidence, but it is not a product acceptance contract and is retained only in `before-h6-4a/`.

## Material-aware type recipes

| Surface | Slot | Recipe | Face | Runtime range | Fit result |
|---|---|---|---|---|---|
| Region 30 paper label | label | `badge-label-on-paper` | Outfit 600 | `12–15px` | Full `ONE UPGRADE` label at a 160px host width; no clipping |
| Region 20 teal frame | title | `result-on-teal-frame` | Cinzel 700 | `22–38px` | Centered in the quiet upper parchment lane |
| Region 20 teal frame | body | `body-on-parchment` | Caudex 700 | `17–24px` | Strong readable body with deliberate line height |
| Region 20 teal frame | footer | `badge-label-on-paper` | Outfit 600 | `12–17px` | Readable completion status above the protected border |

The game title is capped at `42px`, HUD values at `28px`, and HUD labels at `18px`. These remain code-owned because the reviewed sheet does not contain a surface that honestly supports their live density. At the minimum desktop width only the optional flavor hint is hidden; progression, status, purchase, and completion information remain visible.

The victory surface is explicitly elevated above the HUD while active. This corrects the minimum-window overlap that previously obscured `ACADEMY GRADUATE!` without changing controller state or result timing.

## Evidence and boundaries

Runtime evidence now lives with the game:

`games/tier-1/01-button-goblin-clicker/evidence/h6-4-button-goblin-shared-host-surface-runtime`

The minimum Tauri set contains all seven required states. Primary-display evidence provides clean initial and victory anchors. The evidence README, runtime assertions, usage matrix, typography audit, and before/after comparison describe the exact capture contract.

No controller, simulation, gameplay value, goblin rig, hit area, animation, background, shell, Rust/Tauri configuration, package, lockfile, or source sheet changed.
