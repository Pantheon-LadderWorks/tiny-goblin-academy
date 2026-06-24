# Level 7: Pet Campfire

## Fantasy
Sit by a campfire with a tiny goblin pet. Watch its needs, feed it, and keep it happy so it doesn't run off into the woods. 

## Expected Mechanical Lesson
Transitioning from discrete action-driven ticks to **continuous variables (meters) and real-time state decay** (the Tamagotchi mechanic) using a pure deterministic tick function decoupled from browser time.

## Status
**Badge:** Playtested / Human Review Passed
**Scale:** Planned → Contract Approved → First Playable → Playtested → Released → Retired/Expanded
*(No Released, Retired, Expanded, v0.2, or release authorization is implied)*

## Final Accepted Implementation
* Tiny Goblin Academy visual shell preserved.
* Deterministic simulation core.
* Simulation exposes `tick(deltaSeconds)`, with v0.1 canonical `tick(1)`.
* Simulation does not use `Date.now()`, `setInterval`, browser timers, or Phaser frame time internally.
* UI/browser drives `tick(1)`, but simulation owns game truth.
* Hunger starts at 100.
* Happiness starts at 100.
* SurvivalTime starts at 0.
* Feed restores Hunger and sets Pet Status to `Eating`.
* Play restores Happiness and sets Pet Status to `Playing`.
* tick returns `Eating`/`Playing` to `Idle` unless terminal.
* Hunger/Happiness decay per tick.
* Defeat occurs when Hunger <= 0 or Happiness <= 0.
* Defeat sets Pet Status to `RanAway`.
* Victory occurs when SurvivalTime >= 60.
* Victory sets Pet Status to `Sleeping`.
* Terminal states lock Feed/Play/tick mutation except Reset.
* Reset restores initial state.
* Action ledger displays newest-first with historically correct numbering.
* Contract tests passed.
* Browser playtest evidence captured for boot, degraded, recovered, defeat, and victory states.
