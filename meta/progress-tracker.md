# Progress Tracker

## Overall Completion Summary
All 10 games from the initial Tier 1 ladder have successfully reached the "Playtested / Human Review Passed" stage. The foundational curriculum has been proven functional and effective.

## Game Tracker

| Level | Title | Folder Path | Status | Tests Status | Evidence Status | Human Review Status | Primary Lesson | Notable Correction/Drift |
|---|---|---|---|---|---|---|---|---|
| 1 | Button Goblin Clicker | `games/tier-1/01-button-goblin-clicker` (Source Missing) | Playtested / Human Review Passed (Historical) | Unknown | Captured (Assumed) | Passed | Basic state-to-UI reactivity | Source lost in refactor. Restoration deferred pending hub/package architecture. |
| 2 | Potion Sorter | `games/tier-1/02-potion-sorter` | Playtested / Human Review Passed | Unknown | Captured (Assumed) | Passed | Interactive matching and discrete state transitions | Enforced correct visual output for correct states |
| 3 | Dice Duel Tavern | `games/tier-1/03-dice-duel-tavern` | Playtested / Human Review Passed | Unknown | Incomplete/Not run | Passed | Simple turn-based dice math and causal feedback | Clarifying duel bounds without expanding into RPG engine |
| 4 | Card Goblin Duel | `games/tier-1/04-card-goblin-duel` | Playtested / Human Review Passed | Passed | Captured | Passed | State-machine phases | Failed spike initially rendered debug-page UI, caught in review |
| 5 | 10x10 Dungeon Key Run | `games/tier-1/05-dungeon-key-run` | Playtested / Human Review Passed | Passed | Captured | Passed | Spatial navigation and hazards | Hazard irrelevance initially (was easily bypassed) |
| 6 | Tiny Farm Day | `games/tier-1/06-tiny-farm-day` | Playtested / Human Review Passed | Passed | Captured | Passed | Simulation over time | "Wait" verb replaced with action-driven ticks |
| 7 | Pet Campfire | `games/tier-1/07-pet-campfire` | Playtested / Human Review Passed | Passed | Captured | Passed | Real-time simulation and continuous meters | Browser timers tried to own game truth; separated successfully |
| 8 | One-Room Platformer | `games/tier-1/08-one-room-platformer` | Playtested / Human Review Passed | Passed | Pending | Passed | Fixed-step physics simulation and collisions | Math/collision ambiguity required exact top-left coordinate contracts |
| 9 | Top-Down Slime Quest | `games/tier-1/09-top-down-slime-quest` | Playtested / Human Review Passed | Passed | Captured | Passed | 2D movement, states, and attack hitbox truth | Platformer ghosts copied from Level 8; visual shell regression occurred |
| 10 | Mini Settlement Sim | `games/tier-1/10-mini-settlement-sim` | Playtested / Human Review Passed | Passed | Captured | Passed | Multi-day survival simulation and decision loops | "Zombie economics" risk detected in planning |

## Next Recommended Non-Code Archive Tasks
- Refine reusable contract template from the 10 levels
- Create model/agent benchmark rubric
- Create visual shell checklist
- Standardize capture script
- Formal postmortem/case study

## Future Phase Candidates (NOT STARTED)
- Tauri-based Hub/Launcher (`hub/`)
- Butler/Itch deployment pipeline (`scripts/`)
- Tier 2 (v0.2 enhancements / new game types)
