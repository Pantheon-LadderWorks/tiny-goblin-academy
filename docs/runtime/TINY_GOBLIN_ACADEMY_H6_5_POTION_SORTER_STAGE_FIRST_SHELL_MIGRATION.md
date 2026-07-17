# Tiny Goblin Academy — H6.5 Potion Sorter Stage-First Shell Migration

## Purpose

H6.5 migrates Potion Sorter out of its permanent three-column lesson dashboard and into the Academy's stage-first runtime composition.

This is Potion Sorter's equivalent of Button Goblin H6.2. It prepares the live game for the separately approved Composition C Hybrid SceneRig without integrating that SceneRig yet.

```text
Academy top bar stays.
The side rails leave.
Time, score, combo, and feedback enter the stage.
How To Play moves into shared Help.
The existing Phaser presentation remains temporary.
```

## Authority

This lane follows:

- `TINY_GOBLIN_ACADEMY_H6_0_ACADEMY_SHELL_REFACTOR_AND_IN_GAME_HUD_PLAN.md`
- `TINY_GOBLIN_ACADEMY_H6_1_MINIMAL_RUNTIME_SHELL_CONTRACT.md`
- `TINY_GOBLIN_ACADEMY_H6_2_BUTTON_GOBLIN_CLICKER_SHELL_MIGRATION.md`
- the human-approved H6 Potion Sorter Hybrid SceneRig preview

## Runtime Composition

The migrated game uses four layers:

```text
game-stage
├── hud-layer
│   └── time, score, combo
├── play-surface
│   └── existing PotionScene canvas
└── feedback-layer
    ├── current instruction / result feedback
    └── round-complete surface
```

The retired permanent surfaces are:

- left Time / Score / Combo rail;
- right How To Play rail;
- center-only constrained playfield column.

Their jobs were relocated rather than merely restyled.

## Shared Help Migration

The Academy shell now resolves Help content from the active `gameId`.

For `tga-02`, Help owns:

- the six-potion / 30-second objective;
- mouse and touch controls;
- select-potion-before-destination rule;
- matching-destination rule;
- scoring and combo behavior;
- wrong-destination behavior.

Other games retain a generic fallback. No iframe messaging or new runtime framework was introduced.

## Gameplay Boundary

Unchanged:

- `src/simulation.ts`;
- `src/controller.ts`;
- `src/potion-scene.ts`;
- six-potion order;
- click/tap potion selection;
- click/tap destination placement;
- score, combo, timer, and completion rules.

The stage migration does not add drag-and-drop and does not reinterpret the surviving click-select/click-destination loop.

## SceneRig Boundary

The approved Composition C Hybrid SceneRig remains the production visual target, but it is not integrated in H6.5.

The intentionally temporary live presentation still uses the existing code-drawn potion and destination placeholders. This separation ensures that later SceneRig defects cannot be confused with shell-migration defects.

## Responsive Contract

Evidence covers:

- primary desktop: 1920×1080;
- supported minimum desktop: 1024×640.

At both contracts:

- the document has no overflow;
- the stage claims the available iframe width;
- HUD remains inside the stage;
- instruction and result feedback remain in-stage;
- all three destination hit areas remain visible;
- no permanent side rail exists.

## Validation

Completed before human review:

- Potion Sorter tests: 10/10 passed;
- Potion Sorter production build: passed;
- Hub TypeScript no-emit: passed;
- Hub production build: passed;
- automated select, correct-placement, and complete-round browser flow: passed;
- 1920×1080 and 1024×640 viewport audit: passed;
- `git diff --check`: passed.

Vite continues to report the existing large Phaser chunk warning. No package or lockfile change was introduced.

## Review State

- shell migration implemented: `true`
- human review: `passed`
- production SceneRig integrated: `false`
- Composition C visual authority changed: `false`
- runtime gameplay authority changed: `false`

Human review accepted the full-stage shell at both supported desktop contracts. The temporary sparse Phaser presentation remains accepted only as the pre-SceneRig boundary.

## Next Lane After Approval

Integrate the approved Composition C Hybrid SceneRig into this expanded stage while preserving the H6.5 shell, shared Help behavior, controller boundary, simulation authority, and existing interaction contract.
