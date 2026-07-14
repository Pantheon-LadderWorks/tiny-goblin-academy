# H6.4A shared-surface usage matrix

| Region | Intended role | Actual use | Scale policy | Primary display | Minimum Tauri window | Overflow | Protected zones | Verdict |
|---|---|---|---|---|---|---|---|---|
| 5 — Long dark panel | Four-card HUD candidate | None; HUD stays code-native | Would require uniform contain | One label/value pair fits | Four instances crowd actor/name lanes | Avoided | Outer border | Rejected |
| 20 — Large teal frame | Victory/result | Title + body + footer | Uniform contain, no stretch | Natural 665×401 | Uniform fit in the 1024×640 Tauri composition | None | Frame border/corners | Used |
| 30 — Small paper label | One short label | `ONE UPGRADE` only | Uniform contain, no stretch | 160×73.08 host | 160×73.08 host | None | Paper edge/corner shading | Constrained |

## Code-native baseline versus hybrid result

| Surface | Code-native baseline | H6.4A hybrid | Reason |
|---|---|---|---|
| HUD | Four status cards | Unchanged, with canonical type caps | Region 5 does not support four live values without crowding. |
| Victory | Generic dark result card | Region 20 frame plus independent live text | Exact title/body/footer role match and stronger completion identity. |
| Bonk card | Entirely code-native | Code-owned card with Region 30 label accent | The bounded accent fits while control and dynamic state remain code-owned. |

Primary anchors: `tauri/primary-1920x1080/01-initial.jpg` and `tauri/primary-1920x1080/07-victory.jpg`.

Minimum full-state run: `tauri/minimum-1024x640/01-initial.jpg` through `07-victory.jpg`.
