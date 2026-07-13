# H6.3C Embedded Tauri Review Evidence

Purpose: verify the live Button Goblin `GoblinRig` integration inside the real Tauri Academy shell, not only the direct browser route.

Valid evidence files:

- `tauri-embedded-00-academy-printwindow.png` — Academy launcher captured from the Tauri window.
- `tauri-embedded-01-button-goblin-idle.png` — embedded full-body goblin idle in the cavern stage.
- `tauri-embedded-02-hover.png` — embedded hover state.
- `tauri-embedded-03-bonk-minus-1.png` — embedded Bonk -1 state.
- `tauri-embedded-04-outside-click-check.png` — embedded outside-click check; state did not advance from an off-actor click.
- `tauri-embedded-05-defeat-transition.png` — embedded defeat transition evidence.
- `tauri-embedded-06-next-goblin-reset.png` — embedded next-goblin reset evidence.
- `tauri-embedded-07-upgrade-available-or-earned.png` — embedded upgrade availability / earned state evidence.
- `tauri-embedded-08-upgrade-purchased.png` — embedded upgrade purchased evidence.
- `tauri-embedded-09-bonk-minus-2-after-upgrade.png` — embedded Bonk -2 after upgrade evidence.
- `tauri-embedded-10-victory.png` — embedded victory state evidence.
- `tauri-embedded-14-close-game-return-to-academy.png` — Close Game returned to Academy and stopped the Button Goblin dev server.

Review notes:

- Kryssie live-observed the idle blink, occasional ear twitch, body breathing rhythm, hover scale, click scene jolt, and bonk reactions reading cleanly.
- Feet remain grounded on the cavern floor and above the foreground obstruction band.
- The actor rig remained readable in the Academy-embedded runtime.
- Help/Ledger/Dev overlays were already accepted in H6.2. H6.3C did not change the shell overlay implementation.
- Additional overlay capture attempts during H6.3C produced invalid tiny screenshots during operator cursor contention; those invalid files were discarded and are not counted as H6.3C evidence.

Runtime/process cleanup:

- After Close Game, the Button Goblin dev server listener on port 5101 was gone.
- After closing the Tauri app, no TGA-owned listener remained on ports 5101-5110 or 5173.
- No TGA-owned app, node, pnpm, cargo, or Vite process remained for this workspace.
