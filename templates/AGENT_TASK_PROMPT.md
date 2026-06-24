# Agent Task Prompt — <game name>

You are implementing only the approved Playable Loop Contract for **<game name>**.

## Required skill lane

First load/use these game-studio skills in order:

`game-studio → web-game-foundations → <runtime skill> → <conditional skill(s)> → game-playtest`

## Authorized scope

- **Player fantasy:** <one sentence>
- **Primary verb:** <one action>
- **Loop:** <input → visible feedback → state change → result>
- **Definition of done:** <testable outcome>

## Required architecture

- Simulation state is separate from renderer objects.
- Renderer/canvas shows simulation state; it does not own game truth.
- Use DOM for text-heavy HUD, menus, and settings.
- Keep input mapping explicit.
- Use stable asset manifest keys if assets are introduced.

## Forbidden expansions

- Do not add systems, lore, content, backend, accounts, multiplayer, procedural generation, or new game modes outside the contract.
- Do not create a repository, submodule, release pipeline, or package architecture unless separately approved.
- Do not switch to 3D or another engine without explicit approval.
- Do not turn the interface into a generic dashboard or obscure the playfield with persistent panels.
- Do not discuss v0.2 until the approved v0.1 loop has passed the Human Review Gate.

## Stop and report immediately if

- the browser does not visibly boot into an actionable state;
- the primary verb is not playable;
- state is visible only in logs/headless output;
- a request requires a system outside this contract;
- the proposed implementation changes the approved skill lane; or
- you find yourself opening multiple surgeries at once (visual debt from previous levels may be noted but not mixed into active level correction).

## Core Doctrine Reminders

- Functional correctness and visual coherence are both required for First Playable. Preserve the Tiny Goblin Academy visual shell unless explicitly exempt.
- Failed Human Review means Correction Required, not Blocker. Correction Required is an executable implementation state.
- For mechanics with multi-step player choice, define explicit phases in the state machine.

## Completion evidence

Before claiming the contract is satisfied, use the `game-playtest` lane and provide:

1. boot evidence;
2. main-verb evidence;
3. visible state-change evidence;
4. success/failure evidence; and
5. concise findings and any remaining limitation.

Kryssie, not the agent, decides whether the game advances from Playtested.

