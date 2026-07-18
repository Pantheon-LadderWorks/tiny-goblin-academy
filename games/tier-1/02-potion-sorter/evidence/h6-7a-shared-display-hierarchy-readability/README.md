# H6.7A Shared Display Hierarchy Readability

Status: **human visual review passed 2026-07-17**

## Review finding

The shared Cinzel display family was directionally correct, but the two most
important hierarchy roles were too delicate:

- game titles did not retain the strong dimensional shadow established by the
  earlier Button Goblin presentation;
- completion headings were undersized and low-contrast inside otherwise roomy
  certificate surfaces.

Because Potion Sorter and Button Goblin consume the same Academy typography
recipes, the correction was made at the shared token layer and verified in both
games.

## Correction

- `game-title` now uses Cinzel 800 with a restrained warm face and a crisp
  plum/dark two-step shadow.
- `result-state` now uses Cinzel 800, a larger responsive range, tighter
  tracking, a warm edge, and a crisp dark shadow.
- Potion Sorter and Button Goblin local styles no longer override those shared
  font-size, weight, tracking, color, stroke, or shadow decisions.
- The existing Potion Sorter result plaque and Button Goblin certificate
  geometry, placement, and responsive dimensions were preserved.

## Runtime proof

Both games were captured through their real browser runtimes at:

- primary desktop: `1920 x 1080`;
- minimum desktop: `1024 x 640`.

The capture audits confirm local Cinzel weight 800 loads successfully and both
shared recipes resolve at the expected computed sizes and shadows. Potion
Sorter also proves both success and timer-expiry result states; Button Goblin
proves its live victory state after the real bonk-and-upgrade loop.

## Evidence map

- `before/potion-sorter/` - pre-correction H6.7 Potion Sorter captures
- `before/button-goblin/` - approved H6.4 Button Goblin captures before the
  shared correction
- `after/potion-sorter/` - fresh primary/minimum gameplay and result captures
- `after/button-goblin/` - fresh primary/minimum gameplay and victory captures
- `comparisons/` - focused before/after title and result-heading plates
- `capture-button-evidence.mjs` - deterministic Button Goblin evidence runner

## Boundaries preserved

- no gameplay, controller, simulation, or scoring changes;
- no Potion Sorter SceneRig geometry changes;
- no result-plaque enlargement;
- no package or lockfile changes;
- no staging or commit in this review lane.

## Human review verdict

Passed without further tuning. The final hierarchy is approved as the shared
Academy display recipe for Button Goblin and Potion Sorter. The stronger title
weight and crisp plum shadow restore separation and authority; the result
heading is now the dominant plaque message without changing the approved
geometry. Runtime assets and unrelated H6.7 surfaces remain closed.
