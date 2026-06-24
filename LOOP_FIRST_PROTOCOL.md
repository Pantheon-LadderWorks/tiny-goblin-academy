# Loop First Protocol

## Purpose

Use this protocol for every approved AI-directed game build. It protects the first visible, playable loop from scope drift, invisible simulation, dashboard UI, and premature polish.

## Status Scale

```text
Planned → Contract Approved → First Playable → Playtested → Released → Retired/Expanded
```

- **Planned:** named, but no approved contract.
- **Contract Approved:** Playable Loop Contract is approved; bounded implementation may start.
- **First Playable:** the single approved v0.1 loop visibly boots and its main verb works.
- **Playtested:** required browser evidence exists and Kryssie has passed the Human Review Gate.
- **Released:** separately approved release/distribution action completed.
- **Retired/Expanded:** deliberately archived, or a separately approved new scope begins.

## Workflow

1. Name the player fantasy and one primary player verb.
2. Complete and approve `PLAYABLE_LOOP_CONTRACT.md`.
3. Route the work through the smallest appropriate game-studio skill lane.
4. Before implementation, lock boundaries: simulation owns serializable state; renderer adapts that state; DOM owns text-heavy HUD, menus, and settings; input actions are explicit.
5. Build only one approved v0.1 playable loop.
6. Run `game-playtest` and record browser evidence in `PLAYTEST_REPORT.md`.
7. Pass the Human Review Gate: agents may report evidence, but Kryssie decides whether the result counts as playable/fun enough to advance.
8. Complete `RELEASE_CHECKLIST.md` to decide whether to stop, release, retire, or approve a bounded v0.2.

## Routing Defaults

```text
2D browser game
game-studio → web-game-foundations → phaser-2d-game
→ [game-ui-frontend when UI needs it]
→ [sprite-pipeline when approved sprite work needs it]
→ game-playtest

Explicit 3D browser game only
game-studio → web-game-foundations → three-webgl-game OR react-three-fiber-game
→ web-3d-asset-pipeline → game-ui-frontend → game-playtest
```

## Sacred v0.1 Rule

Every game completes exactly one approved v0.1 playable loop before v0.2 expansion or polish is discussed. No new content, systems, lore, enemy types, shops, backends, accounts, procedural generation, or engine changes “just in case.”

## Stop Conditions

Stop and report the owning boundary if:

- the browser does not visibly boot into an actionable state;
- the main verb is not playable;
- implementation adds systems outside the approved contract;
- UI becomes generic dashboard chrome instead of a game face;
- state exists only in logs/headless output rather than visibly on screen;
- renderer objects become the authoritative game state;
- an unapproved engine, 3D, backend, repository, or asset-pipeline change is required; or
- a completion claim lacks boot, main-verb, state-change, and outcome evidence.

## Level 4 Doctrine Additions

- Functional correctness and visual coherence are both required for First Playable.
- Preserve the Tiny Goblin Academy visual shell unless explicitly exempt.
- Failed Human Review means Correction Required, not Blocker.
- Correction Required is an executable implementation state.
- For mechanics with multi-step player choice, define explicit phases in the state machine.
- Do not open multiple surgeries at once; visual debt from previous levels may be noted but not mixed into the active level correction.
