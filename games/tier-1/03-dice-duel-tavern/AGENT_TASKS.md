# Agent Task Prompt — Dice Duel Tavern v0.1

> **Current status:** Planning only. This is a future bounded implementation prompt, not permission to create code, scaffolding, or dependencies.

When Kryssie explicitly authorizes implementation, implement only the approved Playable Loop Contract for **Dice Duel Tavern v0.1**.

## Required skill lane

`game-studio → web-game-foundations → phaser-2d-game → game-ui-frontend → game-playtest`

## Authorized scope

- **Player fantasy:** Win one compact tavern duel against the Goblin Brawler through clear dice-driven choices.
- **Primary verb:** Choose Attack, Heal, or Block after one roll.
- **Loop:** Start turn → roll → action → visibly resolve state → enemy response → repeat → win/loss.
- **Definition of done:** A player understands every turn and can reach one clear victory or defeat.

## Required architecture

- Simulation owns HP, phases, dice, action availability, Block state, combat log entries, enemy response, and win/loss state.
- Phaser renders state; it does not own combat truth.
- DOM handles the turn banner, controls, combat log, and text-heavy state.
- Input mapping remains explicit: `roll`, `attack`, `heal`, `block`.
- Combat log entries must describe cause and effect for every roll, action, and enemy response.
- Roll one d6 once per player turn. Attack/heal use the roll value; Block reduces only the next deterministic Goblin Brawler attack by that roll, never below zero.

## Forbidden expansions

- No tavern hub, party, factions, deckbuilder, equipment, leveling, procedural encounters, story campaign, inventory, quests, multiplayer, backend, accounts, save system, release work, expanded RPG systems, crits, stamina, elemental dice, dice upgrades, randomness tables, or enemy abilities.
- No new repository, submodule, release pipeline, asset pipeline, package architecture, 3D route, or alternate engine.
- No dashboard-style UI or combat state that lives only inside visual effects.
- No v0.2 discussion until the v0.1 loop has passed Kryssie’s Human Review Gate.

## Stop and report immediately if

- the browser does not visibly boot into an actionable duel screen;
- the current turn, roll result, or action outcome is ambiguous;
- enemy response or Block reduction is not visibly explained;
- a system outside this contract is required; or
- the proposed work changes the approved skill lane.

## Completion evidence

Before claiming the contract is satisfied, use `game-playtest` and record:

1. boot and player-turn evidence;
2. rolled state and each player-action outcome;
3. enemy-response and Block-reduction evidence;
4. victory and defeat evidence; and
5. turn-clarity findings in `evidence/playtest-notes/` and `PLAYTEST_REPORT.md`.

Kryssie, not the agent, decides whether the game advances to Playtested.
