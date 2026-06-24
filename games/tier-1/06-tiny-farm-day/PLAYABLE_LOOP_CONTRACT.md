# Playable Loop Contract — Tiny Farm Day

## Status
Badge: Contract Approved
Scale: Planned → Contract Approved → First Playable → Playtested → Released → Retired/Expanded
*(No First Playable, Playtested, Released, Retired, Expanded, v0.2, or human-review pass is implied. Awaiting implementation authorization.)*

## Player fantasy
Run a tiny farm, tending crops and making a small profit before the day ends.

## Primary player verb
Choose a plot action (Plant, Water, Harvest) or global action (Sell, Upgrade, End Day).

## First playable loop
Plant → water → time advances → harvest → sell → buy one plot upgrade → end day.

## Start state
- 3 plots, all state: `Empty`
- Seeds: 3
- Crops: 0
- Coins: 0
- Time: tick 0
- Upgrade: not purchased
- Day: active

## Plot states
- `Empty`
- `PlantedDry`
- `PlantedWatered`
- `Grown`
*(No withering, no crop death, no weeds, no hazards)*

## Action rules
- **Plant**: Allowed on `Empty` plot if Seeds > 0. Consumes 1 seed. Plot becomes `PlantedDry`.
- **Water**: Allowed on `PlantedDry` plot. Plot becomes `PlantedWatered`.
- **Time Advance**: After each valid player action, watered plots advance toward `Grown`.
- **Harvest**: Allowed on `Grown` plot. Plot becomes `Empty`. Crops +1.
- **Sell**: Sells all Crops for a fixed price (2 coins each).
- **Upgrade**: If Coins are sufficient (>= 5) and upgrade not purchased, spend fixed coins and mark upgrade purchased.
- **End Day**: If upgrade purchased, Victory. If upgrade not purchased, Defeat/Incomplete Day.
- **Reset**: Restores initial state.

## Economy & Growth numbers
- Crop sell price: 2 coins each.
- Upgrade cost: 5 coins.
- Each watered crop becomes `Grown` after 2 valid action ticks.
*(Since three crops sell for 6 coins total, the player must complete the three-plot crop cycle to afford the one 5-coin upgrade.)*

## Time behavior
- Time is discrete, not real-time.
- Each valid action advances the tick by 1 unless the game is terminal.
- Invalid actions do not advance time.
- Terminal states lock action controls except Reset.
- No multi-day calendar.

## Success and failure
- **Success**: End Day triggered while the plot upgrade is purchased.
- **Failure**: End Day triggered while the plot upgrade is not purchased.

## Architecture boundaries
- **Simulation owns**: Plots state, inventory, currency, ticks/time of day.
- **Renderer owns**: Visual adaptation of plots, crops, and currency.
- **DOM UI owns**: HUD for time, inventory, and action buttons.
- **Input actions**: Plant, Water, Harvest, Sell, Upgrade, End Day, Reset.

## UI/Ledger rules
- Action ledger must display newest-first, but the visible numbering must preserve historical step order (e.g., N. newest action ... 1. first action).
- Tiny Goblin Academy visual shell must be preserved.

## Default skill lane
`game-studio → web-game-foundations → phaser-2d-game → game-ui-frontend → game-playtest`

## Explicit exclusions
- No weather, NPCs, enemies, hazards, multiple crops, crafting, expanded economy, real-time calendar, backend, save system, v0.2, or release work.
