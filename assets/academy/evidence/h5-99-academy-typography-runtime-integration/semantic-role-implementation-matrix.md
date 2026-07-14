# H5.99 Semantic Role Implementation Matrix

| Semantic role | Canonical face | Hub | Button DOM | Button Phaser | Live result |
| --- | --- | --- | --- | --- | --- |
| `academy-title` | Cinzel Decorative 700 | Boot identity | — | — | Loaded; one-line fit. |
| `game-title` | Cinzel 700 | Runtime title and game detail title | Main game title | — | Loaded; detail title wraps at a word boundary. |
| `panel-heading` | Cinzel 600 | Detail and Help/Ledger/Dev headings | Bonk Stick | Encounter label | Loaded; no clipping. |
| `body-instruction` | Caudex 700 | Game detail, Help, Ledger, Dev body | Objective, upgrade copy, victory sentence | — | Loaded and readable at 17-20px on long Hub copy; no alternate required. |
| `compact-label` | Outfit 600 | Launcher labels, badges, shell buttons, Dev field labels | Eyebrow, HUD labels, upgrade kicker/button | — | Loaded; state colors remain component-owned. |
| `data-value` | Atkinson Hyperlegible 700 | Counts, levels, modal numeric values | HUD values | HP display | Loaded; tabular critical values remain stable. |
| `result-state` | Cinzel 700 | — | Victory heading | Bonk feedback | Loaded; edge protection passes on dark/busy surfaces. |
| `debug-information` | Fira Code 400 | Runtime URL, source/status truth, Dev values | No player-facing debug text exists | — | Loaded; remains dev-only. |
| `optional-game-accent` | Macondo 400 | — | Bottom instruction/hint | — | Loaded; restricted to brief flavor copy. |
| `dialogue-title` | Cinzel 600 | Not present | Not present | Not present | Canonical default remains registered and unwired. |
| `dialogue-speech` | Caudex 700 | Not present | Not present | Not present | Canonical default remains registered and unwired. |

DOM/CSS and Phaser parity preserves semantic family, weight, hierarchy, fallback class, contrast/edge policy, and recipe identity. Pixel identity is intentionally not required.
