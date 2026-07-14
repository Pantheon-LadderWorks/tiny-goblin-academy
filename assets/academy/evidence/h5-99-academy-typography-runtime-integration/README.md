# H5.99 Academy Typography Runtime Integration Evidence

This directory is live runtime evidence for the Academy Hub and Button Goblin Clicker. It is not a static typography laboratory.

## Hub screenshots

| File | Proof |
| --- | --- |
| `hub/00-hub-boot-academy-title.png` | Live Academy boot identity using `academy-title`. |
| `hub/01-hub-desktop.png` | Desktop launcher typography. |
| `hub/02-hub-narrow.png` | Tauri minimum-window `1024x640` launcher proof; no horizontal overflow. |
| `hub/03-hub-help.png` | Help overlay and embedded live Button runtime. |
| `hub/04-hub-ledger.png` | Ledger overlay. |
| `hub/05-hub-dev.png` | Dev overlay with Fira Code diagnostics. |
| `hub/06-hub-production-dev-hidden.png` | Production-mode detail surface scrolled to the production action block; developer actions are absent. |

The production proof uses a browser-side fixture at the existing Tauri invoke boundary. It changes no Hub runtime code and exercises the real `HubShell` and `GameDetailPanel` production branch.

## Button Goblin screenshots

| File | Proof |
| --- | --- |
| `button-goblin/01-button-desktop-initial.png` | Desktop initial state. |
| `button-goblin/02-button-desktop-bonk-feedback.png` | Live Phaser Bonk feedback. |
| `button-goblin/03-button-upgrade-available.png` | Three-coin upgrade availability. |
| `button-goblin/04-button-upgrade-purchased.png` | Purchased state and Bonk Power 2. |
| `button-goblin/05-button-later-stronger-goblin.png` | Goblin 6 with stronger HP. |
| `button-goblin/06-button-victory.png` | Goblin 10 defeated and Academy Graduate result. |
| `button-goblin/07a-button-narrow-initial.png` | Narrow initial layout. |
| `button-goblin/07b-button-narrow-active-bonk.png` | Narrow active/Bonk state. |
| `button-goblin/08-button-busy-cavern-readability.png` | Critical labels and values on the real cavern surface. |

## Machine-readable proof

- `computed-style-font-load-evidence.json`: 213 DOM/CSS samples with semantic role, family, weight, size, line height, loaded face status, box metrics, and clipping result.
- `runtime-assertions.json`: font readiness results, actual Phaser recipe/style objects, production gating counts, Tauri minimum-window fit, final gameplay state, and external-request audit.
- `semantic-role-implementation-matrix.md`: concise role-to-surface and renderer matrix.

Observed result: zero unloaded inspected faces, zero clipping findings, zero minimum-window horizontal overflow, and zero external font/asset requests.
