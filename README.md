<p align="center">
  <img src="assets/readme-banner.png" alt="Tiny Goblin Academy" width="100%">
</p>

<h1 align="center">Tiny Goblin Academy</h1>
<p align="center">
  <em>10 tiny games. One serious AI-assisted learning ladder.</em>
</p>

## Overview

Tiny Goblin Academy is a playable archive of ten tiny AI-assisted game-development experiments. It is not a course where players learn by playing; rather, players play the output of the curriculum. Developers and builders can study this repository to understand the learning path, project contracts, testing strategies, visual evidence, and the Human Review workflow. 

This repository is a public, free, and open learning artifact serving as an evolving academy foundation, stewarded by Pantheon LadderWorks.

## Current Status

* **Tier 1 Historical Completion:** 10/10 Human Review Passed.
* **Current Source Availability:** Games 01–10 are accessible under `games/tier-1/`.
* **Current Level 1 Status:** Button Goblin Clicker is source-available, dev-runnable, and visually integrated with its cavern stage, `GoblinRig`, shared typography, and selective Academy UI surfaces.
* **Current Level 2 Status:** Potion Sorter is source-available, dev-runnable, and visually integrated with its approved Composition C alchemy `SceneRig`, hybrid material palette, containment/masking system, shared typography, and authored result surface.
* **Current Level 3 Status:** Dice Duel Tavern is source-available, dev-runnable, build-capable, and visually integrated with its Crooked Six stage, persistent six-face `DieRig`, authoritative Web Crypto d6, reduced motion, selective mapped assets, materials, and Academy typography.
* **Visual Integration Status:** Levels 1–3 have passed runtime/evidence/human visual review and have separate mechanical and visual learning records. The immediate next lane is evidence-size inventory and D-drive warehouse planning before Card Goblin Duel begins; Top-Down Slime Quest remains last or near-last because its animation, tile behavior, placement, collision, pathfinding, and map rules are more complex.

## What You Can Play / Study

This ladder contains 10 distinct, tightly scoped games. Each focuses on one small loop and one core lesson.

1. **Button Goblin Clicker** — The simplest reactive loop. *(Source Available / Visual Integration Passed)*
2. **Potion Sorter** — State validation and visual feedback. *(Source Available / Visual Integration Passed)*
3. **Dice Duel Tavern** — RNG authority, turn states, persistent motion, and causal presentation. *(Source Available / Visual Integration Passed / Curriculum Closed)*
4. **Card Goblin Duel** — Hidden state, card resolution, and UI sync. *(Source Available)*
5. **Dungeon Key Run** — Spatial movement, grid rules, and collision. *(Source Available)*
6. **Tiny Farm Day** — Progression over time and multi-stage state machines. *(Source Available)*
7. **Pet Campfire** — Degrading background systems and reactive maintenance. *(Source Available)*
8. **One-Room Platformer** — Real-time physics, gravity, and precise input. *(Source Available)*
9. **Top-Down Slime Quest** — Continuous 2D movement and real-time hitboxes. *(Source Available)*
10. **Mini Settlement Sim** — Multi-system balancing, daily progression, and resource scarcity. *(Source Available)*

## Why This Exists

This project tests a specific hypothesis: Can AI agents help build real, robust, and playable loops when strictly bounded by rigorous workflow rules? The Tiny Goblin Academy methodology forces development to be guided by:

* **Contracts:** Explicit, non-negotiable scopes.
* **Scope Locks:** Preventing feature creep before the core is proven.
* **Tests:** Code that proves the simulation logic independently of the DOM.
* **Browser Evidence:** Visual proof of gameplay states.
* **Human Review:** The ultimate quality gate.
* **Lessons Learned:** Documentation of agent friction and successes.

## Repository Structure

* `assets/` — Public branding assets, banners, and cover art.
* `docs/` — Core methodology documentation, incident reports, and architecture plans.
* `games/tier-1/` — The source code for the completed 10-game ladder.
* `meta/` — Progress tracking and historical state.
* `templates/` — The markdown templates used to guide the AI workflow (Contracts, Checklists, etc.).
* Governance docs: `LICENSE`, `CONTENT_LICENSE.md`, `CONTRIBUTING.md`, `CREDITS.md`.

## Licensing

Tiny Goblin Academy uses a split-license approach to keep the code open while protecting the project's creative identity:

* **Code:** [MIT License](LICENSE)
* **Docs, Curriculum, and Planning Notes:** [CC BY-NC 4.0](CONTENT_LICENSE.md) unless otherwise noted.
* **Art, Branding, and Visual Identity:** All Rights Reserved unless explicitly marked otherwise.

See [CONTENT_LICENSE.md](CONTENT_LICENSE.md) for full details on how the licenses apply.

## Development Notes

* **Package Manager:** Use `pnpm`, not `npm`.
* **Clean Commits:** Do not commit generated dependency folders (`node_modules`), `.vite`, or build outputs.
* **Architecture Shift:** The Tauri development hub and stage-first game shell are active. Levels 1–3 prove the current per-game visual-integration path while later levels remain development artifacts awaiting their own passes.
* **Artifact Philosophy:** The Academy preserves playable mechanical history, current visual runtimes, evidence, and lessons as separate authority layers. A source game becomes a reviewed runtime artifact through explicit per-game integration and human review.
* **Asset Shelf Note:** Current asset docs begin at `docs/assets/README.md`; current manifests begin at `manifests/README.md`.

## Roadmap

* [x] Public repo readiness complete.
* [x] README and branding pass.
* [x] Hub/runtime package architecture definition.
* [x] Tauri development hub and per-game launcher.
* [ ] itch.io free release path.
* [x] Level 1 source restoration under the Tier 1 roster.
* [x] Tier 1.5 visual asset pantry pass.
* [x] Button Goblin Clicker runtime visual integration.
* [x] Potion Sorter runtime visual integration.
* [x] Dice Duel Tavern runtime visual integration and curriculum closure.
* [ ] Future per-game learning guide pair before itch release.

### Future Learning Path Guides

Before the itch.io release, each game may receive two reconstructed companion documents based on its original contract, tasks, playtest evidence, and lessons:

* `LEARNER_GUIDE.md` — Designed for human coders/builders who want to follow the same learning path manually.
* `AGENT_BUILD_GUIDE.md` — Designed for someone’s AI assistant to follow or adapt the build path.

These guides will reconstruct the stage prompts, skill lanes, scope locks, tests, and optional variation knobs so builders can adapt the lesson without losing the original loop discipline.

## Credits

Tiny Goblin Academy is the product of human direction paired with AI orchestration. See [CREDITS.md](CREDITS.md) for full details on the collaborators and tools that built this academy.

***

*The loop boots. The goblin moves. The system remembers.*
