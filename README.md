# AI Game Studio Ladder / Tiny Goblin Academy

A ten-level AI-directed game development curriculum proving that small playable loops can test agent usefulness through contracts, tests, browser evidence, and Human Review.

## Current Status
All ten v0.1 games reached Playtested / Human Review Passed.
No Released, Retired, Expanded, v0.2, Level 11, hub, or deployment work is implied.

## Game List

| Level | Game | Status | Core Lesson | Folder Path |
|---|---|---|---|---|
| 1 | Button Goblin Clicker | Playtested / Human Review Passed | Basic state-to-UI reactivity | `games/tier-1/01-button-goblin-clicker` |
| 2 | Potion Sorter | Playtested / Human Review Passed | Interactive matching and discrete state transitions | `games/tier-1/02-potion-sorter` |
| 3 | Dice Duel Tavern | Playtested / Human Review Passed | Simple turn-based dice math and causal feedback | `games/tier-1/03-dice-duel-tavern` |
| 4 | Card Goblin Duel | Playtested / Human Review Passed | State-machine phases | `games/tier-1/04-card-goblin-duel` |
| 5 | 10x10 Dungeon Key Run | Playtested / Human Review Passed | Spatial navigation and hazards | `games/tier-1/05-dungeon-key-run` |
| 6 | Tiny Farm Day | Playtested / Human Review Passed | Simulation over time | `games/tier-1/06-tiny-farm-day` |
| 7 | Pet Campfire | Playtested / Human Review Passed | Real-time simulation and continuous meters | `games/tier-1/07-pet-campfire` |
| 8 | One-Room Platformer | Playtested / Human Review Passed | Fixed-step physics simulation and collisions | `games/tier-1/08-one-room-platformer` |
| 9 | Top-Down Slime Quest | Playtested / Human Review Passed | 2D movement, states, and attack hitbox truth | `games/tier-1/09-top-down-slime-quest` |
| 10 | Mini Settlement Sim | Playtested / Human Review Passed | Multi-day survival simulation and decision loops | `games/tier-1/10-mini-settlement-sim` |

## Operating Model
Contract → Skill Lane → Implementation → Tests → Browser Evidence → Human Review → Lessons Learned.

## Repo Strategy
Single private monorepo for now.
Future hub/launcher may live under `hub/`.
Future scripts may live under `scripts/`.
Individual game repos are deferred.

## Key Docs
* `AI_GAME_STUDIO_PLAN.md`
* `LOOP_FIRST_PROTOCOL.md`
* `docs/TINY_GOBLIN_ACADEMY_LESSONS_SYNTHESIS.md`

## Non-Goals
* no release implied;
* no v0.2 implied;
* no Aether/Lorewell/DWOS expansion;
* no separate repos yet.
