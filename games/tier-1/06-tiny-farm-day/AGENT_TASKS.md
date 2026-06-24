You are implementing only the approved Playable Loop Contract for **Tiny Farm Day**.

First load/use these game-studio skills in order:
`game-studio → web-game-foundations → phaser-2d-game → game-ui-frontend → game-playtest`

Additionally, you must use the following workflow skills:
- `test-driven-development`
- `systematic-debugging` (when behavior is wrong)
- `verification-before-completion`

## Authorized scope
- Player fantasy: Run a tiny farm, tending crops and making a small profit before the day ends.
- Primary verb: Choose a plot action (Plant, Water, Harvest) or global action (Sell, Upgrade, End Day).
- Loop: Plant → water → time advances → harvest → sell → buy one plot upgrade → end day.
- Economy: Start with 3 seeds, 0 crops, 0 coins. Grow crops (2 ticks each), harvest, sell for 2 coins each, buy 5 coin upgrade.
- Definition of done: A player can complete a full crop cycle across three plots, see time and plot states update, sell the harvest, buy the one upgrade, and end the day.

## Required tests
Your test suite must explicitly cover:
- initial state
- plant consumes seed
- cannot plant without seeds
- cannot plant on non-empty plot
- water changes dry planted plot to watered
- invalid water does not advance time
- watered crop grows after required ticks
- dry planted crop does not grow
- harvest adds crop and resets plot
- sell converts crops to coins
- upgrade requires enough coins
- end day before upgrade produces non-victory/defeat state
- end day after upgrade produces victory
- reset restores initial state
- terminal lock prevents state mutation after victory/defeat

## Required architecture
- Simulation state is separate from renderer objects.
- Renderer/canvas shows simulation state; it does not own game truth.
- Use DOM for text-heavy HUD, menus, and settings.
- Action ledger must display newest-first with historically preserved numbering.
- Keep input mapping explicit.

## Forbidden expansions
- Do not add systems, lore, content, backend, account, multiplayer, procedural generation, or new game modes outside the contract.
- Do not add weather, NPCs, enemies, hazards, multiple crops, crafting, expanded economy, real-time calendar, or save system.
- Do not create a new repository, submodule, release pipeline, or package architecture unless separately approved.

## Stop and report immediately if
- the browser does not visibly boot into an actionable state;
- the primary verb is not playable;
- state is visible only in logs/headless output;
- a request requires a system outside this contract; or
- the proposed implementation changes the approved skill lane.

## Completion evidence
Before claiming done, run the `game-playtest` lane and provide:
1. boot evidence;
2. main-verb evidence;
3. visible state-change evidence;
4. success/failure evidence;
5. concise findings and any remaining limitation.
