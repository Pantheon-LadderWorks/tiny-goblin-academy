# H6.4A runtime typography audit

| Surface | Ownership | Material | Recipe / face | Size bounds | Acceptance observation | Result |
|---|---|---|---|---|---|---|
| Academy masthead title | Code-native | Dark shell | Cinzel 700 | up to 42px | Strong identity without dominating the playfield | Pass |
| HUD labels | Code-native | Dark cards | Outfit 600 | 12–18px | Legible at primary and minimum Tauri sizes | Pass |
| HUD values | Code-native | Dark cards | Outfit 700 | 18–28px | Clear but subordinate to gameplay | Pass |
| Action title | Code-native | Dark card | Cinzel 600 | 18–28px | Fits beside the play surface | Pass |
| Action description | Code-native | Dark card | Caudex 700 | minimum 17px | Readable; wraps without clipping | Pass |
| Region 30 label | Shared physical host | Paper | `badge-label-on-paper`; Outfit 600 | 12–15px | `ONE UPGRADE` fully visible in 160px host | Pass |
| Region 20 title | Shared physical host | Parchment in teal frame | `result-on-teal-frame`; Cinzel 700 | 22–38px | Full `ACADEMY GRADUATE!` visible above HUD | Pass |
| Region 20 body | Shared physical host | Parchment | `body-on-parchment`; Caudex 700 | 17–24px | Two-line body remains centered and readable | Pass |
| Region 20 footer | Shared physical host | Paper/parchment | `badge-label-on-paper`; Outfit 600 | 12–17px | Completion status clears protected lower border | Pass |

At `max-width: 1024px`, only the optional `.hint` is hidden. No required label, value, control, progress state, or completion text is removed.

Evidence basis: actual Tauri captures at the configured `1024×640` minimum content contract and on the `1920×1080` primary display. The older `760×700` harness is comparison-only.
