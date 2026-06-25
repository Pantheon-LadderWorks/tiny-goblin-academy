# AI Game Studio Ladder

> **Status:** Living planning document — no game implementation or repository scaffold is authorized by this document.
>
> **Purpose:** A reusable curriculum and operating protocol for directing AI agents through small, shippable games without confusing visible play, simulation, UI, asset work, and scope.

## 1. Operating Intent

This is a ten-game progression for learning how to direct AI-assisted game development from an idea to a verified playable loop. It is not a ranking of programming skill and it is not an assignment list for existing projects.

The ladder optimizes for one thing: the ability to give an agent a narrow, testable game contract and receive a visibly playable result. Each completed game should leave behind a small set of reusable decisions, prompts, and playtest evidence.

### Game Completion Badge

Every ladder game carries exactly one current status:

```text
Planned → Contract Approved → First Playable → Playtested → Released → Retired/Expanded
```

- **Planned:** The game is named but has no approved contract.
- **Contract Approved:** Its Playable Loop Contract is approved; implementation may begin only within that boundary.
- **First Playable:** The single approved v0.1 loop visibly boots and the main verb works.
- **Playtested:** Required browser evidence exists and the Human Review Gate has been passed.
- **Released:** A separately approved distribution/release action has occurred.
- **Retired/Expanded:** The game is deliberately archived or a new approved version/scope begins.

Each game must complete exactly one approved **v0.1 playable loop** before any v0.2 expansion or polish discussion. Do not pre-build future systems “just in case.”

### Non-goals

- Do not implement, expand, migrate, or reorganize existing projects through this ladder.
- Do not create game folders, repositories, submodules, package files, or prototypes until a specific game is separately approved.
- Do not treat a simulation log, CLI output, or headless test as a playable game.
- Do not add lore systems, accounts, multiplayer, procedural worlds, backends, content generators, or public release systems unless the current Playable Loop Contract explicitly requires them.

## 2. Default AI Game Studio Lane Map

| Skill | Use it for | Default status |
| --- | --- | --- |
| `game-studio` | Intake, genre/stack routing, and keeping implementation/UI/assets/QA coherent | Use at the start of every game request when the route is not already explicit. |
| `web-game-foundations` | Fantasy, verbs, core loop, engine selection, simulation/render/UI/input boundaries, save/debug policy | Mandatory before a playable build. |
| `phaser-2d-game` | Phaser + TypeScript + Vite 2D browser games, scenes, cameras, sprites, and thin renderer adapters | Default runtime for this ladder. |
| `game-ui-frontend` | DOM HUDs, menus, overlays, responsive layout, and protecting the playfield from dashboard chrome | Add when the game has meaningful HUD, menu, or text-heavy UI. |
| `sprite-pipeline` | Approved-frame-led 2D sprite generation, normalization, animation strips, and preview validation | Conditional: only for sprite-heavy games after visual direction is approved. |
| `game-playtest` | Browser smoke test, main-verb verification, screenshot evidence, HUD/playfield review, responsive QA | Mandatory before any claim of “done.” |
| `three-webgl-game` | Explicit 3D, plain TypeScript/Vite, imperative Three.js runtime control | Conditional: never a default escalation. |
| `react-three-fiber-game` | Explicit 3D inside an existing React app with shared React UI/app state | Conditional: only when React-hosted 3D is the actual fit. |
| `web-3d-asset-pipeline` | GLB/glTF cleanup, collision proxies, LODs, texture/compression, and runtime-ready 3D assets | Conditional: pair with an approved 3D route. |

### Default routing law

```text
2D browser game
  game-studio → web-game-foundations → phaser-2d-game
  → [game-ui-frontend when UI needs it]
  → [sprite-pipeline when approved sprite work needs it]
  → game-playtest

3D browser game — only when explicitly required
  game-studio → web-game-foundations → three-webgl-game OR react-three-fiber-game
  → web-3d-asset-pipeline → game-ui-frontend → game-playtest
```

The common architectural law is non-negotiable: **simulation owns serializable game state; the renderer shows that state; DOM handles text-heavy HUD and menus; renderer objects are never the source of truth.**

## 3. The Ten-Game Curriculum

### Level 1 — Button Goblin Clicker

- **Game concept:** Bonk a goblin, earn coins, buy a single upgrade, defeat ten escalating goblins.
- **Core player verb:** Click/tap the goblin.
- **Playable loop:** Click → damage is visible → goblin falls → coins increase → buy upgrade → next goblin has more HP → victory at ten defeats.
- **AI-directing lesson:** One screen, one state loop, one clear feedback path. Learn to constrain an agent before it grows a Kingdom of Goblins Management Suite.
- **Default skill sequence:** `game-studio → web-game-foundations → phaser-2d-game → game-ui-frontend → game-playtest`.
- **Scope locks:** One screen; emoji/shapes or simple approved art only; no accounts, inventory, lore, backend, maps, multiplayer, procedural content, or more than one upgrade.
- **Definition of done:** A player can open the game, click the goblin, see HP change, earn coins, buy the upgrade, defeat ten goblins, and see a victory state.
- **Playtest evidence required:** Screenshot/video of boot state, damaged goblin state, purchased-upgrade state, and victory state; a short note confirming pointer input works at desktop and narrow viewport.

### Level 2 — Potion Sorter

- **Game concept:** Sort incoming potions onto the correct shelf before time expires; correct streaks create a score combo.
- **Core player verb:** Drag/drop or tap-select a potion into a destination.
- **Playable loop:** Identify potion → place it → immediate correct/incorrect feedback → combo/timer updates → complete a short round.
- **AI-directing lesson:** Explicit input mapping and feedback clarity. A new interaction mechanic gets one bounded loop, not a retail alchemy simulator.
- **Default skill sequence:** `game-studio → web-game-foundations → phaser-2d-game → game-ui-frontend → game-playtest`.
- **Scope locks:** Three potion types maximum; one round; no crafting tree, ingredient system, shop, story, or mobile release work. Drag/drop may be replaced by tap-select if cross-browser input becomes the blocker.
- **Definition of done:** A player can reliably make a correct and incorrect placement, understand both outcomes, finish one timed round, and see final score/combo.
- **Playtest evidence required:** Screenshot/video of a correct sort, incorrect sort, timer state, and round result; test pointer and touch-emulation behavior.

### Level 3 — Dice Duel Tavern

- **Game concept:** A compact turn-based duel: roll dice, choose attack/heal/block, defeat one opponent.
- **Core player verb:** Choose a turn action after a roll.
- **Playable loop:** Start turn → roll → choose action → resolve player/enemy state → enemy responds → repeat until win/loss.
- **AI-directing lesson:** Make turns, state transitions, and enemy responses visible and deterministic enough to test.
- **Default skill sequence:** `game-studio → web-game-foundations → phaser-2d-game → game-ui-frontend → game-playtest`.
- **Scope locks:** One opponent archetype; three actions; no deckbuilder, tavern hub, party system, factions, procedural encounters, account, or progression beyond the duel.
- **Definition of done:** Player can understand whose turn it is, roll, choose all three actions, see the enemy response, and reach a readable win and loss state.
- **Playtest evidence required:** Captures of player turn, enemy turn, a block/heal resolution, win, and loss; a short written test script with expected HP changes.

### Level 4 — Card Goblin Duel

- **Game concept:** Draw a tiny hand of cards, play one against a goblin, observe a readable enemy response, win or lose.
- **Core player verb:** Choose and play a card.
- **Playable loop:** Draw → inspect hand → play one card → resolve effects → enemy responds → redraw/continue → win/loss.
- **AI-directing lesson:** Contain richer state without multiplying content. The agent must build a card loop, not invent eighty-seven cards and five missing tavern factions.
- **Default skill sequence:** `game-studio → web-game-foundations → phaser-2d-game → game-ui-frontend → game-playtest`.
- **Scope locks:** Six cards maximum, one enemy, no collection, rarity, pack-opening, meta progression, deck editor, online play, or narrative campaign.
- **Definition of done:** Player can draw, inspect, play each card type, see effect resolution, and reach win/loss with no ambiguous hand or turn state.
- **Playtest evidence required:** Captures of draw, each card effect, enemy response, win, and loss; verify the card UI does not obscure the playfield or critical state.

### Level 5 — 10×10 Dungeon Key Run

- **Game concept:** Traverse a compact grid, get a key, avoid or outmaneuver one enemy, open the exit.
- **Core player verb:** Move tile by tile.
- **Playable loop:** Move → spatial state updates → collect key → avoid enemy → unlock exit → win or get caught/reset.
- **AI-directing lesson:** Represent space, collision, objective state, and a simple enemy without action physics.
- **Default skill sequence:** `game-studio → web-game-foundations → phaser-2d-game → game-ui-frontend → game-playtest`.
- **Scope locks:** One 10×10 map; one key; one exit; one enemy behavior; no procedural generation, inventory, combat system, multi-floor dungeon, overworld, or quest log.
- **Definition of done:** Player can move with a documented input map, collect the key, trigger enemy danger, unlock the exit, and reset after failure.
- **Playtest evidence required:** Captures of initial grid, key acquired, danger/failure, exit locked, exit unlocked, and success; verify keyboard input plus a narrow-screen control strategy.

### Level 6 — Tiny Farm Day

- **Game concept:** Plant, water, harvest, sell, and buy one plot upgrade during a compact in-game day.
- **Core player verb:** Choose a plot action.
- **Playable loop:** Plant → water → time advances → harvest → sell → upgrade one plot → end day.
- **AI-directing lesson:** Introduce timer/tick behavior, visible progression, and a small serializable save boundary.
- **Default skill sequence:** `game-studio → web-game-foundations → phaser-2d-game → game-ui-frontend → game-playtest`.
- **Scope locks:** One crop, three plots, one day, one upgrade, no weather, NPC schedules, breeding, crafting, real-time calendar, economy simulation, or content expansion.
- **Definition of done:** Player can complete a full crop cycle, see time and plot states, sell harvest, buy the one upgrade, and restore a deliberately small saved simulation state if save/load is included.
- **Playtest evidence required:** Captures of every crop state, sale, upgrade, day end, and save/load restoration when enabled; verify no state lives only in console output.

### Level 7 — Pet Campfire

- **Game concept:** Care for a companion through feed, pet, train, and rest actions that visibly alter its mood during one session.
- **Core player verb:** Choose a care action.
- **Playable loop:** Observe mood/need → select action → companion reaction and values change → choose next action → reach a short “good campfire” end state.
- **AI-directing lesson:** Persistent-feeling personality can stay small, observable, and bounded. Mood is an explicit system, not metaphysics smuggled in under a blanket.
- **Default skill sequence:** `game-studio → web-game-foundations → phaser-2d-game → game-ui-frontend → [sprite-pipeline if approved animation is needed] → game-playtest`.
- **Scope locks:** One companion; four actions; three visible mood indicators; one session/day; no LLM dialogue, relationship graph, genetics, open world, accounts, or long-term life simulation.
- **Definition of done:** Every care action has a visible, consistent consequence; player can improve or worsen mood and reach a clear session result.
- **Playtest evidence required:** Captures of each action/reaction, low mood, improved mood, and session end; verify that companion state is visible on screen and survives only as far as the contract says.

### Level 8 — One-Room Platformer

- **Game concept:** Run and jump through one hand-authored room, collect a few items, avoid hazards, reach a door.
- **Core player verb:** Move and jump.
- **Playable loop:** Navigate → jump/land → collect → avoid hazard → reach door → retry after failure.
- **AI-directing lesson:** Tune feel through precise feedback rather than expanding content. Physics, camera, controls, and failure recovery must be observable.
- **Default skill sequence:** `game-studio → web-game-foundations → phaser-2d-game → game-ui-frontend → [sprite-pipeline if approved animation is needed] → game-playtest`.
- **Scope locks:** One room; one movement set; three hazards maximum; no combat, enemies, multiple levels, procedural generation, character select, story, or level editor.
- **Definition of done:** Movement/jump are responsive, hazards reset cleanly, collectibles register, door completion works, and the room can be completed without hidden debug steps.
- **Playtest evidence required:** Video/screenshot evidence of movement, jump, hazard/reset, collection, completion; verify desktop keyboard and a stated mobile decision rather than pretending mobile works.

### Level 9 — Top-Down Slime Quest

- **Game concept:** Explore a compact room, swing a weapon, defeat slimes, collect a key/pickup, open a gate.
- **Core player verb:** Move and attack.
- **Playable loop:** Explore → target/attack → defeat slime → collect pickup → unlock gate → finish or reset on defeat.
- **AI-directing lesson:** Combine movement, combat, pickups, animation, and goals without allowing a “tiny Zelda” request to become a whole kingdom.
- **Default skill sequence:** `game-studio → web-game-foundations → phaser-2d-game → game-ui-frontend → sprite-pipeline → game-playtest`.
- **Scope locks:** One room, one weapon action, one slime type, three enemies maximum, one gate; no inventory, equipment stats, quest chain, overworld, bosses, procedural rooms, or save system.
- **Definition of done:** Player can move, attack, defeat each slime, collect the required pickup, open the gate, and understand damage/death feedback.
- **Playtest evidence required:** Captures/video of attack hit, enemy defeat, player damage/death, pickup, gate unlock, completion; screenshot review for sprite alignment and HUD obstruction.

### Level 10 — Mini Settlement Sim

- **Game concept:** Run a visible ten-day settlement where a few citizens consume, gather/build, react to shortages, and either survive or fail.
- **Core player verb:** Set a simple daily priority or assign a limited action.
- **Playable loop:** Review visible settlement state → set priority → advance day/ticks → citizens act → resources/events update on screen → adapt → survive ten days or fail.
- **AI-directing lesson:** Build a simulation whose rules, tick state, and outcomes are visibly playable—not an impressive headless engine emitting logs into a void.
- **Default skill sequence:** `game-studio → web-game-foundations → phaser-2d-game → game-ui-frontend → [sprite-pipeline only if residents need approved sprite animation] → game-playtest`.
- **Scope locks:** Three citizens maximum; three resource types; one screen/settlement; ten days; a tiny event set; no procedural world, LLM agents, infinite simulation, multiplayer, deep crafting, diplomacy, or adaptation into Aether/Lorewell/DWOS.
- **Definition of done:** The player can see each day advance, understand citizen actions and resource changes, make a meaningful priority decision, encounter a failure state, and survive ten days in at least one test path.
- **Playtest evidence required:** Captures of day one, a visible citizen action, resource change, an event/shortage, a player decision, failure, and ten-day survival; include a reproducible seed or scripted scenario for each path.

## 4. Loop First Protocol

Use this exact sequence for every approved ladder game.

1. **Name the game fantasy and primary player verb.** One sentence each.
2. **Write a Playable Loop Contract.** It defines the only authorized loop, states, scope locks, and evidence.
3. **Route the work.** Start with `game-studio` when uncertain; load `web-game-foundations` before implementation; select the narrowest runtime specialist.
4. **Lock state boundaries.** Simulation owns entities, turns, timers, collisions, objectives, progression, and saveable state. Renderer adapts it into view. UI presents controls and text.
5. **Build only the first playable loop.** Do not add polish systems while boot, verb, feedback, and completion/failure are unverified.
6. **Run the playtest gate.** Use `game-playtest` with browser evidence, not only code review or console output.
7. **Pass the Human Review Gate.** An agent may present evidence and report the contract as satisfied; Kryssie decides whether the result actually counts as playable and fun enough to advance from Playtested.
8. **Record the result.** Save the completed contract, agent task prompt, playtest report, decision, and lesson only after the game is visibly playable and human-reviewed.
9. **Choose deliberately:** stop, release, make the next ladder game, or approve a bounded v0.2 expansion. No automatic “Phase 2.”

## 5. Stop Conditions — Agent Drift Kill Switches

Stop implementation and report the blocker immediately if any of these become true:

1. **No visible boot:** the game does not render a useful first actionable state in the browser.
2. **No playable main verb:** the contract’s central input cannot be performed and observed.
3. **Contract breach:** implementation begins adding systems not authorized by the Playable Loop Contract.
4. **Dashboard face:** UI becomes generic app/dashboard chrome instead of a game-facing interface that protects the playfield.
5. **Invisible state:** game truth exists only in logs, a database, terminal output, tests, or headless simulation and is not visibly represented to the player.
6. **Renderer-owned truth:** sprites, scene objects, React components, or canvas callbacks become the authoritative game state.
7. **Unapproved route change:** work switches to 3D, another engine, backend services, a new repo, or a new asset pipeline without an explicit decision.
8. **Evidence gap:** a claimed completed loop has no browser playtest evidence for boot, main verb, state change, and result.

The correct response to a stop condition is: state the observed failure, identify the owning boundary, preserve useful evidence, and request a focused next decision. Do not paper it over with new features.

## Visible Ledger Rule

For any ladder game with computed state, hidden state, turns, resources, combat, timers, AI behavior, or simulation ticks, expose a visible causal trace appropriate to the genre: a combat log, event feed, action ledger, day report, or equivalent.

The ledger makes state transitions reviewable by the player without opening dev tools. It must explain what changed and why. Keep it compact, readable, and tied to the active play loop—not as permanent dashboard clutter.

Apply this especially to Levels 3–10:

- Card Goblin Duel: card/effect and enemy-response log.
- Dungeon Key Run: movement, key, danger, and exit-state feedback.
- Tiny Farm Day: plot/action/day report.
- Pet Campfire: care action and mood-change trace.
- Mini Settlement Sim: visible tick/event ledger.

## Pasted Handoff Execution Rule

A pasted MEGA/Council handoff is approved executable scope unless Kryssie explicitly frames it as discussion first.

## Implementation Turn Silence Rule

During an approved implementation turn, continue autonomously through the bounded ritual. Return only for a true blocker or completed handoff; use commentary only for useful live tool updates, never as ceremonial bookmarks.

No ceremonial bookmarks. No stopping after skill loading or red tests. The implementation turn ends at blocker or bonk.

## Level 4 Doctrine Additions

- Functional correctness and visual coherence are both required for First Playable.
- Preserve the Tiny Goblin Academy visual shell unless explicitly exempt.
- Failed Human Review means Correction Required, not Blocker.
- Correction Required is an executable implementation state.
- For mechanics with multi-step player choice, define explicit phases in the state machine.
- Do not open multiple surgeries at once; visual debt from previous levels may be noted but not mixed into the active level correction.

## 6. Copyable Playable Loop Contract

```md
# Playable Loop Contract — <game name>

## Status
Planning / Approved for implementation / Playtested / Complete

## Player fantasy
<One sentence.>

## Primary player verb
<One action the player repeatedly performs.>

## First playable loop
<Input> → <visible immediate feedback> → <state change> → <next meaningful choice or completion>

## Start state
<What is on screen and actionable immediately after boot?>

## Success and failure
- Success: <observable condition>
- Failure/reset: <observable condition and recovery>

## Bounded content
- <limit 1>
- <limit 2>
- <limit 3>

## Explicit exclusions
- No <system that would expand scope>.
- No <system that would expand scope>.
- No <system that would expand scope>.

## Architecture boundaries
- Simulation owns: <serializable state>
- Renderer owns: <visual adaptation only>
- DOM UI owns: <HUD/menu/text controls>
- Input actions: <named actions>

## Default skill lane
`game-studio → web-game-foundations → <runtime skill> → <conditional UI/assets skill> → game-playtest`

## Definition of done
<A player can ...>

## Required playtest evidence
- <boot evidence>
- <main-verb evidence>
- <state-change evidence>
- <success/failure evidence>

## Stop conditions specific to this game
- <condition>
- <condition>
```

## 7. Copyable Agent Task Prompt

```md
You are implementing only the approved Playable Loop Contract for **<game name>**.

First load/use these game-studio skills in order:
`game-studio → web-game-foundations → <runtime skill> → <conditional skill(s)> → game-playtest`.

## Authorized scope
- Player fantasy: <one sentence>
- Primary verb: <one action>
- Loop: <input → visible feedback → state change → result>
- Definition of done: <testable outcome>

## Required architecture
- Simulation state is separate from renderer objects.
- Renderer/canvas shows simulation state; it does not own game truth.
- Use DOM for text-heavy HUD, menus, and settings.
- Keep input mapping explicit.
- Use stable asset manifest keys if assets are introduced.

## Forbidden expansions
- Do not add systems, lore, content, backend, account, multiplayer, procedural generation, or new game modes outside the contract.
- Do not create a new repository, submodule, release pipeline, or package architecture unless separately approved.
- Do not switch to 3D or another engine without explicit approval.
- Do not turn the interface into a generic dashboard or obscure the playfield with persistent panels.

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
```

## 8. Existing Project Calibration — Not Curriculum

The projects below stay outside the ladder. Their placement is only a complexity landmark for planning and scope discipline.

| Existing project / idea | Rough comparison | Calibration note |
| --- | --- | --- |
| Snowball Fight Simulator | Levels 3–4 | Deterministic/turn-based duel logic and stateful narrative reporting; beyond Dice Duel once mature. |
| Dungeon Map MLP | Levels 5–6 | Progression/map UI complexity exceeds a basic grid run; the visible game face remains a distinct concern. |
| `/buddy` companion concept | Levels 7–8 add-on | Companion state and reaction layer; only borrow the bounded-care lesson, not the existing project. |
| Aether | Level 10+ | A living-world substrate/engine pattern, not a ladder game; do not expand it through this curriculum. |
| Lorewell | Level 10+ experimental | Narrative simulation territory beyond the ladder’s deliberately tiny settlement sim. |
| DWOS / Shinshi Field | Levels 12–15 | Mobile, collection, bonding, evolution, and public/private asset complexity; explicitly crown-project terrain. |
| Cosmogenesis | Ingredient / law kernel | Not a game loop; potentially informs future systems but is not an assignment here. |

## 9. Planned Repository and Directory Architecture

The plan belongs under its own future meta-repository container, not directly in the game-development root:

`ai-game-studio-ladder/`

**Current filesystem state:** only this container and `AI_GAME_STUDIO_PLAN.md` are authorized/created. Everything below is a proposed structure for a later approved scaffold step.

```text
ai-game-studio-ladder/
├── README.md
├── AI_GAME_STUDIO_PLAN.md
├── LOOP_FIRST_PROTOCOL.md
├── templates/
│   ├── PLAYABLE_LOOP_CONTRACT.md
│   ├── AGENT_TASK_PROMPT.md
│   ├── PLAYTEST_REPORT.md
│   └── RELEASE_CHECKLIST.md
├── games/
│   ├── 01-button-goblin-clicker/
│   ├── 02-potion-sorter/
│   ├── 03-dice-duel-tavern/
│   ├── 04-card-goblin-duel/
│   ├── 05-dungeon-key-run/
│   ├── 06-tiny-farm-day/
│   ├── 07-pet-campfire/
│   ├── 08-one-room-platformer/
│   ├── 09-top-down-slime-quest/
│   └── 10-mini-settlement-sim/
├── docs/
│   ├── plugin-lane-map.md
│   ├── existing-project-calibration.md
│   ├── ai-agent-guardrails.md
│   └── release-strategy.md
└── meta/
    ├── progress-tracker.md
    ├── decisions.md
    └── lessons-learned.md
```

### Per-game folder shape — proposed default

```text
games/NN-game-name/
├── README.md
├── PLAYABLE_LOOP_CONTRACT.md
├── AGENT_TASKS.md
├── PLAYTEST_REPORT.md
├── RELEASE_CHECKLIST.md
├── evidence/
│   ├── screenshots/
│   ├── videos/
│   └── playtest-notes/
├── src/
├── public/
└── builds/
```

Add `assets/` only when the approved game has art/audio/sprite needs. Add `docs/` only when the game has enough decisions or test cases to justify it. Do not create these directories preemptively.

### Repository strategy

1. `ai-game-studio-ladder` may become one standalone meta-repository after explicit approval.
2. Each ladder game begins as an ordinary folder inside that repository.
3. A game may graduate to its own repository—and become a linked submodule—only after it has a verified playable loop and a concrete release/maintenance reason.
4. Do not make submodules at the start. They add coordination overhead before they add value.
5. Existing projects remain external to this repository and are referenced only by the calibration section/documents.

## 10. Recommended First Run

Start with **Level 1: Button Goblin Clicker**.

It is the fastest reliable test of the whole operating protocol: one screen, one verb, visible feedback, compact progression, obvious completion, and no asset or physics dependency. Its success criterion is not “a polished game.” It is proof that the contract → skill lane → visible loop → playtest-evidence chain works without scope escape.

## 11. Assumptions to Revisit Deliberately

- The ladder is browser-first and 2D Phaser-first because that is the strongest available plugin path today.
- A game receives a 3D route only for a gameplay need, not because 3D seems more impressive.
- Individual game implementation, repo initialization, folder scaffolding, asset generation, and release are separate approvals.
- Templates may later be split into their proposed files, but this plan remains the current single source for their initial text.
