# H6.5 Potion Sorter Stage-First Shell Migration Evidence

## Review status

- implementation: complete
- human review: passed
- production SceneRig integrated: false
- Composition C remains the approved next-lane visual target

## What this packet proves

- permanent Time / Score / Combo side rail removed;
- permanent How To Play side rail removed;
- Time / Score / Combo relocated into the game stage;
- transient instruction and round result remain in-stage;
- existing PotionScene expands to the remaining iframe;
- Potion-specific objective, controls, and rules resolve through shared Help;
- select-potion → select-destination behavior remains operational;
- correct placement updates score and combo;
- all six correct placements complete the round at 60 points / ×6;
- 1920×1080 and 1024×640 remain overflow-free.

## Evidence index

- `captures/01-desktop-initial.png`
- `captures/02-desktop-selected.png`
- `captures/03-desktop-correct-placement.png`
- `captures/04-desktop-round-complete.png`
- `captures/05-minimum-initial.png`
- `captures/06-minimum-selected.png`
- `runtime-audit.json`
- `capture-stage-evidence.mjs`

## Deliberate visual boundary

The placeholder potion, shelves, and empty room are not proposed as the final visual result. They are the pre-existing live Phaser presentation shown inside the corrected shell.

The approved Composition C Hybrid SceneRig is not copied, partially integrated, or redesigned in this lane.

## Human review verdict

Passed. The migrated shell is the authoritative full-stage foundation for Composition C integration at both supported desktop contracts.
