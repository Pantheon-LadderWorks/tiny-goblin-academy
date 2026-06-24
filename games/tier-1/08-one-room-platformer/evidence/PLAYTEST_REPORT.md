# Playtest Report: Level 8 (One-Room Platformer)

## Overview
Automated playtesting was successfully conducted using Playwright to interact with the game via standard DOM inputs. The playtest verified the deterministic `tick` loop, correct terminal states (Defeat and Victory), and proper handling of jump physics through AABB resolution.

## Verification Scenarios

### Scenario 1: Spikes Defeat
- **Action**: Player ran right without jumping.
- **Expected Result**: Player falls into the spike pit (`x=395`), state transitions to `Defeat`, terminal lock prevents further movement.
- **Actual Result**: `runStatus` correctly transitioned to `Defeat`. The Ledger correctly logged the final terminal state.
- **Evidence**: `03-defeat.png`

### Scenario 2: Platforming Victory
- **Action**: Player ran right, jumped at `x=130` to land on Platform 1, jumped again at `x=360` to clear the spike pit and land on Platform 2, then ran to the Goal (`x=700`).
- **Expected Result**: Player successfully navigates the platforms. Upon touching the Goal, state transitions to `Victory`, terminal lock prevents further movement.
- **Actual Result**: `runStatus` correctly transitioned to `Victory`. The player did not tunnel through platforms or hit their head due to correct H/V separation.
- **Evidence**: `04-victory.png`

## Observations
- **Fixed Timestep**: The simulation successfully relied on a pure `tick` with a fixed `1/60` timestep, detached from browser rendering variance.
- **Collision Order**: Checking horizontal collision before vertical collision correctly prevented jitter and tunneling when the player hit platform edges. Jump timing had to be precise due to AABB resolution (hitting a platform's side instantly halts horizontal momentum).

## Conclusion
The v0.1 Playable Loop Contract has been met. The physics engine is completely deterministic and testable.
