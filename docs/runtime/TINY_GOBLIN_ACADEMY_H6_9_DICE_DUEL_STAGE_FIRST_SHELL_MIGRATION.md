# Tiny Goblin Academy — H6.9 Dice Duel Tavern Stage-First Shell Migration

## Purpose

H6.9 removes Dice Duel Tavern's permanent three-column prototype dashboard and establishes the stage-first runtime composition required by the later DieRig and motion-choreography lanes.

This is a bounded shell migration and tavern scaffold, not the finished visual integration:

```text
The Academy shell stays.
The permanent status and combat-log rails leave.
HP, turn state, actions, and recent causality enter the stage.
Full combat history becomes contextual.
The stage becomes a warm tavern table instead of a black void.
The approved dice assets and DieRig remain deferred.
```

## Authority

This lane follows:

- `docs/runtime/TINY_GOBLIN_ACADEMY_H6_0_ACADEMY_SHELL_REFACTOR_AND_IN_GAME_HUD_PLAN.md`;
- `docs/runtime/TINY_GOBLIN_ACADEMY_H6_1_MINIMAL_RUNTIME_SHELL_CONTRACT.md`;
- `docs/runtime/TINY_GOBLIN_ACADEMY_H6_8_DICE_DUEL_BASELINE_AUDIT.md`;
- `docs/planning/implementation/2026-07-18-dice-duel-visual-integration-plan.md`;
- Kryssie's approved direction for a basic warm tavern scene with the duel played across a broad table.

## Runtime Composition

The migrated game uses one responsive stage:

```text
duel-stage
├── tavern-backdrop
│   └── warm wall, crooked house sign, beams, lamps, shelf, peg rack, and barrels
├── table-surface
│   ├── broad procedural timber table
│   ├── player dice cup and wager station
│   ├── opponent tankard and wager station
│   └── physical shared rolling tray and landing mark
├── duel-hud
│   ├── player HP
│   ├── turn / phase / committed roll
│   └── Goblin Brawler HP
├── Phaser motion surface
│   └── intentionally empty transparent pre-DieRig layer
├── compact causal feed
│   └── latest two simulation log entries
├── contextual History drawer
│   └── complete simulation log
└── action dock
    └── Roll d6, Attack, Heal, and Block
```

The retired permanent surfaces are:

- left turn/HP/status rail;
- right full-height combat-log rail;
- constrained center arena;
- duplicate dashboard framing around the game.

Their jobs were relocated rather than deleted.

## Human Review Correction

The first H6.9 evidence pass retained two large Phaser-drawn character circles and an oval battlefield line. Human review rejected those elements because Dice Duel does not need avatar or portrait placeholders and because they made the table read as an abstract dojo-like duel board.

The corrected composition:

- removes both character circles, their labels, and the looping battlefield oval;
- keeps player and Goblin Brawler authority in the compact HP plaques;
- uses one shared central rolling tray as the hero surface;
- gives the player side a dice cup and wager stack;
- gives the opponent side a tankard and rough wager stack;
- adds asymmetric tavern storytelling through a crooked hanging sign, mismatched shelf/peg-rack treatment, barrels, and uneven lantern placement;
- leaves the Phaser layer empty and ready for the later persistent DieRig.

This correction does not add a second die or imply separate player and opponent die actors. The game identity remains `One die. One brawler.`

## Tavern Scaffold Boundary

The warm tavern backdrop and broad timber table provide enough spatial truth to judge later dice motion. They are deliberately code-authored and provisional.

H6.9 does not:

- select or promote runtime dice crops;
- load the H5.32 cleaned Dice Duel sheet;
- create the six-face DieRig;
- animate, tween, spin, bounce, or settle a die;
- add particles or claim Card Goblin Duel's VFX curriculum lane;
- introduce final tavern textures, typography, props, or shared physical UI surfaces.

The central `HOUSE ROLL` tray is a protected future motion zone, not a finished dice apparatus.

## Gameplay Boundary

Unchanged:

- `src/simulation.ts` and its authority over HP, phase, roll, causal log, and outcome;
- the existing fixed v0.1 dice sequence;
- Roll → choose Attack, Heal, or Block → enemy response;
- damage, healing, block reduction, victory, and defeat behavior;
- terminal-state behavior.

H6.9 does not add true randomness. The human-approved visual-integration plan assigns the injectable authoritative d6 boundary to a later implementation lane. The shell consumes simulation truth as it exists today.

## Contextual History and Help

The stage shows only the latest two causal messages during ordinary play. The `History` control opens a bounded drawer containing the complete `state.log`; `Close` and Escape dismiss it.

The Academy Help registry now has a Dice Duel-specific `tga-03` entry covering:

- Roll d6;
- Attack;
- Heal;
- Block;
- the automatic enemy response;
- the temporary fixed v0.1 roll sequence.

Diagnostics remain owned by the Academy Dev surface. No permanent diagnostic panel was added to the game.

## Responsive Contract

Automated evidence covers:

- primary desktop: 1920×1080;
- supported minimum desktop: 1024×640.

Measured at both contracts:

- document width equals viewport width;
- document height equals viewport height;
- body width and height equal the viewport;
- the stage remains completely inside the viewport;
- HP, phase, recent history, and all four action controls remain visible;
- no permanent side rail returns.

Measured stage bounds:

| Viewport | Stage bounds |
| --- | --- |
| 1024×640 | x 8–1016, y 76–632 |
| 1920×1080 | x 12–1908, y 121–1068 |

Measured shared-tray bounds:

| Viewport | Tray bounds |
| --- | --- |
| 1024×640 | x 275–749, y 310–448 |
| 1920×1080 | x 606–1314, y 522–879 |

## Evidence

Evidence shelf:

`games/tier-1/03-dice-duel-tavern/evidence/h6-9-stage-first-shell-migration/`

Captured states:

- initial state at 1024×640 and 1920×1080;
- rolled/action-choice state at both desktop contracts;
- Attack plus enemy response;
- Heal plus enemy response;
- Block plus reduced enemy damage;
- expanded full combat history;
- victory;
- deterministic defeat at the minimum desktop contract;
- one continuous interaction video.

The capture script asserts terminal outcomes and closes its browser. Research or source-sheet imagery is not duplicated into this runtime shelf.

## Validation

Completed before human review:

- Dice Duel tests: 9/9 passed across 2 files;
- Dice Duel TypeScript and production build: passed;
- Hub TypeScript no-emit: passed;
- Hub production build: passed;
- `cargo check` from `hub/src-tauri`: passed;
- Academy game manifest validation: passed for all 10 games;
- Hub icon manifest validation: passed for all 10 games;
- asset-pipeline provenance validation: passed in `legacy-ok` mode with the known pre-H5.67 warnings;
- asset-pipeline smoke check: passed;
- 1024×640 and 1920×1080 overflow/visibility metrics: passed;
- changed JSON parse: passed with no changed JSON files;
- strict UTF-8, control-character, mojibake, and trailing-whitespace checks: passed;
- `git diff --check`: passed;
- listener and temporary runtime-log cleanup: passed.

The Dice Duel production build retains Phaser's existing large-chunk warning. The Hub build retains its existing Tauri API mixed static/dynamic import warning. Neither warning was introduced as a correctness failure by H6.9.

No package, lockfile, simulation, manifest, Academy source-image, or unrelated-game change is present.

## Evidence Limitation

The direct game evidence is complete for the migrated stage. Live Academy-shell screenshots of Help, Dev, Hub launch, and Return remain pending because the current packaged Tauri executable predates this H6.9 source change, and this lane does not authorize a heavyweight package rebuild merely to manufacture screenshots.

The Hub source contract and build are validation targets in this lane. Live outer-shell evidence must be captured from a refreshed Tauri runtime before H6.9 is committed or declared human-approved.

## Review State

- stage-first migration implemented: `true`
- warm tavern/table scaffold implemented: `true`
- compact recent history implemented: `true`
- contextual full history implemented: `true`
- Dice Duel-specific Help source implemented: `true`
- gameplay authority changed: `false`
- fixed v0.1 roll sequence changed: `false`
- dice assets runtime-promoted: `false`
- DieRig or motion choreography implemented: `false`
- final tavern art implemented: `false`
- human visual review: `passed`
- staging/commit: `authorized by H6.9A closure handoff`

## H6.9A Human Review Closure

Human review approved the corrected stage-first tavern composition without further decoration:

- `humanReviewPassed: true`
- `stageFirstShellApproved: true`
- `tavernScaffoldApproved: true`
- `characterPlaceholdersRemoved: true`
- `sharedRollingTrayApproved: true`
- `compactCombatantIdentityApproved: true`
- `combatHistoryTreatmentApproved: true`
- `gameplayAuthorityPreserved: true`
- `fixedV01RollSequencePreserved: true`
- `dieRigIntegrated: false`
- `runtimeRandomD6Integrated: false`
- `diceAssetsRuntimePromoted: false`
- `finalMaterialPolishComplete: false`

The approved scene remains a structural tavern scaffold, not final tavern art. Its deliberate wall and tray negative space is reserved for H6.10 DieRig construction and later typography/material finishing.

## Next Lane After Approval

After H6.9 visual and outer-shell evidence approval, proceed to H6.10: promote only the approved flat dice faces needed by one persistent six-face DieRig and build the bounded motion laboratory. Do not treat the H5 angled/tumbling dice candidates as animation frames.
