# Tiny Goblin Academy H6.20C — Card Goblin Duel Hub-Native Table and Ledger Integration

**Status:** Implementation complete; automated validation passed; one verified external capture complete; Human Visual Review pending.

**Baseline commit:** `73911a85f8f955755515008ec18899293cce10b5` — `docs: rebaseline card goblin visual integration`

**Game:** Level 04 — Card Goblin Duel

**Lane:** Stage-first table correction, actual Tauri Hub containment, and first shared Hub Ledger publisher.

```yaml
h6_20ImplementationComplete: true
h6_20cTechnicalValidationPassed: true
h6_20cArchitectureTechnicalFoundationApproved: true
hubContainmentPassed: true
sharedLedgerIntegrationPassed: true
h6_20HumanVisualReviewPassed: false
finalStageVisualReviewPassed: false
gameplayBehaviorChanged: false
sharedHubLedgerContractImplemented: true
cardGoblinLedgerPublisherImplemented: true
diceDuelLedgerBackfillStarted: false
cardAssetsPromoted: false
uiTokensPromoted: false
tabletopSceneIntegrated: false
cardRigImplemented: false
particleRecipesImplemented: false
liveVfxIntegrated: false
```

## Why H6.20C Exists

H6.20 replaced the original three-column dashboard with a stage-first composition. H6.20A removed the rejected wizard and angry-card emoji placeholders and introduced an enchanted code-authored table. Human review then identified two remaining structural errors:

1. the implementation had been optimized for an unsupported `480×900` browser width even though the Academy Hub is laptop-first and cannot shrink that far;
2. the table still carried internal scaffolding and duplicate utilities that belong to the Hub shell.

H6.20C corrects those assumptions without removing the Academy masthead established by Levels 01–03.

## Preserved Academy Game Grammar

Card Goblin Duel keeps its embedded game-facing identity:

- `Tiny Goblin Academy · Level 04`;
- the large `Card Goblin Duel` title;
- the one-line subtitle `Read the hand. Plan the cycle. Bonk the Card Goblin.`

The Hub breadcrumb identifies the loaded runtime. The embedded masthead is the game face. They serve different purposes and are intentionally both present.

## Removed Duplicate and Provisional Surfaces

The embedded game no longer contains:

- Academy Help;
- Academy Dev;
- a permanent full causal ledger;
- player-facing `Opponent Bank` text;
- player-facing `Player Bank` text;
- player-facing `Resolution Seal` text;
- ordinary-mode anchor terminology;
- wizard or angry-card emoji actors;
- actor labels or actor-dependent tests;
- the giant diagonal construction X.

The engraved Academy seal remains as visual geometry. It is not labeled with implementation language.

## Final Table Structure

The playable runtime uses one contained table beneath the preserved masthead:

1. compact phase and instruction banner;
2. Card Goblin identity, HP, and status;
3. integrated next-card and discard wells;
4. central engraved card landing and resolution area;
5. compact current exchange feedback;
6. player HP and status;
7. semantic player hand docked into the lower table edge;
8. reachable terminal result and Reset Duel control.

The hand is not a separate dashboard beneath the board. It is part of the same bounded duel surface.

## Actual Supported Runtime Authority

The canonical Tauri window configuration is:

```text
default outer window: 1280×720
minimum outer window: 1024×640
```

The Hub top bar consumes part of that height. The resulting tested embedded game surfaces are:

```text
default runtime surface: 1280×660
minimum runtime surface: 1024×580
```

Fresh DOM geometry checks at both surfaces proved:

- document `scrollWidth <= clientWidth`;
- document `scrollHeight <= clientHeight`;
- masthead remains present;
- complete table remains inside the runtime surface;
- complete hand remains inside the runtime surface;
- all three card buttons remain fully visible and operable;
- no horizontal or vertical page scrolling is required.

No below-minimum layout is designed, tested, captured, or claimed. Browser behavior below the supported minimum is non-authoritative.

## Gameplay Authority Remains Frozen

`games/tier-1/04-card-goblin-duel/H6_20_BEHAVIOR_BASELINE.json` records the H6.19A gameplay baseline.

The unchanged simulation remains authoritative for:

- player HP `10` and enemy HP `12`;
- hand size `3`;
- initial hand Strike, Guard, Mend;
- initial queue Spark, Stun, Heavy Bonk;
- phases `PlayerAction`, `SparkChoice`, and `Terminal`;
- every card effect;
- enemy response order;
- Spark replacement choice;
- skip-draw behavior;
- victory and defeat locks;
- reset through `createGame()`.

No simulation source or original simulation test changed.

## Shared Hub Ledger Integration

H6.20C completes the first live use of the Hub Ledger surface.

```text
simulation transition
→ Card Goblin ledger adapter
→ shared Academy ledger contract
→ Hub projection
→ Hub Ledger overlay
```

The shared contract lives at:

```text
contracts/academy-ledger.ts
```

The full architecture and future adoption rules are recorded in:

```text
docs/runtime/TINY_GOBLIN_ACADEMY_SHARED_LEDGER_CONTRACT.md
```

### Card Goblin publishes

- new duel;
- card selected;
- card effect committed;
- Guard or Stun applied;
- Spark replacement requested;
- Spark replacement selected;
- enemy response;
- skipped draw;
- victory or defeat;
- reset into a new run.

### Hub projection guarantees

- active-iframe and active-game validation;
- deterministic ordering by `sequence`;
- deduplication by `eventId` and sequence;
- replacement on a new `runId`;
- snapshot request after iframe load or reconnection;
- no gameplay calculation or authority.

A live parent/iframe proof produced one Guard exchange as:

```text
1 run.started
2 card.selected
3 card.effect
4 status.applied
5 enemy.response
```

A later Hub snapshot request restored the same run and ordered history.

The embedded game retains only current resolution feedback. It does not maintain a second complete ledger.

## Dice Duel Backfill Boundary

Dice Duel Tavern also needs the shared ledger because its earlier combat history was reduced to `Last Exchange` plus a local History control during its visual pass.

Dice is not modified by H6.20C. After Card Goblin Duel completes Human Review, a separate bounded lane may:

- publish roll, action, resolution, opponent response, HP, and terminal receipts;
- preserve compact `Last Exchange` feedback;
- remove or redirect the local History control;
- avoid all visual, DieRig, probability, mechanic, and curriculum changes.

## DOM, Phaser, and Hub Ownership

### Simulation owns

- cards, hand, queue, legality, phases, damage, healing, statuses, enemy responses, and terminal truth.

### Embedded DOM owns

- semantic card buttons;
- pointer and keyboard input;
- visible focus;
- phase, HP, wells, immediate result, hand, terminal copy, and reset;
- responsive containment and anchor elements.

### Phaser owns

- lacquered table presentation;
- engraved seal and restrained inlays;
- read-only geometry derived from DOM anchors;
- explicit development-only anchor markers.

### Hub owns

- Ledger, Help, Dev, and Close controls;
- full ordered ledger presentation;
- ledger validation, projection, and reconnection request behavior.

## Anchor Contract

The named presentation anchors remain available:

- `deck`;
- `hand-slot-0`, `hand-slot-1`, and `hand-slot-2` when present;
- `played-card`;
- `resolution-center`;
- `enemy-center`;
- `enemy-impact`;
- `player-center`;
- `player-impact`;
- `discard`;
- `phase-banner`.

The bridge converts DOM viewport rectangles into canvas-local coordinates, recalculates after reflow, coalesces updates, rejects missing required or duplicate identities, freezes snapshots, and never feeds coordinates into simulation state.

Debug markers require explicit `?anchors=1` or `?anchors=true`. Ordinary gameplay leaves anchors invisible.

## Future Card-VFX Accommodation

H6.20C preserves the approved future runway without implementing it:

```text
H6.20C reserves table geometry, negative space, anchors, and z-order.
H6.21 may prove accessible DOM CardRig → transient Phaser CardEcho.
H6.22 may treat CardEcho/card-derived sprites as ParticleRecipe ingredients.
```

No CardRig, CardEcho, particle, projectile, trail, orbital, burst, scatter, rain, dissolve, debris, or shader implementation exists in this lane.

## Automated Coverage

Current focused coverage totals **45 passing tests**:

- 9 simulation tests;
- 9 anchor geometry and contract tests;
- 6 behavior-baseline tests;
- 6 semantic card-view tests;
- 7 Hub-native stage-shell tests;
- 8 shared ledger contract and projection tests.

Card Goblin production TypeScript/Vite build passes with only the existing nonfatal Phaser chunk-size warning.

Hub production TypeScript/Vite build passes with only the existing Tauri API static/dynamic import warning.

## Protected Boundaries

H6.20C does not:

- promote or modify Card Goblin card-frame assets;
- promote or modify Card Goblin UI-token assets;
- modify package manifests or lockfiles;
- alter gameplay simulation or probability;
- touch Dice Duel Tavern runtime source;
- touch One-Room Platformer;
- begin H6.21 or H6.22;
- stage, commit, or push.

Protected hashes remain validation requirements:

```text
card frames: 4164decf68fd86bf1cdd3680a5318aeb912edb66a25ca463dde9bd8e26a4d486
UI tokens:  db06cb5f7403fe8eb412d205d112a6f74dabcfa0157d2d336ea96de9a7b1ba88
```

## External Evidence

Exactly one H6.20C capture attempt completed successfully:

```text
D:\Projects\Active\Tiny-Goblin-Academy\Evidence\
  level-04-card-goblin-duel\
    h6-20-stage-first-table-shell\
      capture-20260721t234049z-p8864\
```

Selected portable manifest:

```text
docs/evidence/external-runs/level-04-card-goblin-duel/
  h6-20-stage-first-table-shell/
    capture-20260721t234049z-p8864.json
```

The run contains:

- 9 PNG stills;
- `technical-review.json`;
- 10 manifested payload files;
- 2,342,899 manifested payload bytes;
- one external manifest;
- one selected portable repository manifest.

Repository and independent verification both passed:

- all payload byte sizes match;
- all payload SHA-256 values match;
- portable and external public manifest fields match;
- all 10 recorded states satisfy containment assertions;
- default and minimum supported runtime surfaces are recorded;
- console errors: `0`;
- ledger snapshot sequences: `1, 2, 3, 4, 5`;
- `agentReviewPassed: false`;
- `humanReviewPassed: false`.

The executing agent did not open or inspect any PNG and did not perform a visual tweak/recapture loop.

Earlier H6.20/H6.20A external runs remain preserved on `D:` as historical attempts. Their repository-side portable manifests are superseded; only the H6.20C selected manifest remains in the working tree.

## Review State

Implementation and automated validation are complete. One verified external capture is ready for Human Review.

No visual approval is claimed. Human Visual Review remains pending.

## H6.20D Tabletop and Functional Card Preview (Uncommitted)

H6.20D integrates the H5.103 tabletop as one unsliced scene plate and uses the H5.39 green, teal, and tan front-frame crops as decorative chrome behind runtime DOM icon, title, body, action-state, focus, and button semantics. The old boxed hand footer is replaced by a shallow lower staging dock; full-height cards rise upward from that origin rail. Simulation, phase ownership, ledger behavior, reset behavior, and future H6.21/H6.22 boundaries remain unchanged.

Focused validation now covers **50 passing tests** plus the Card Goblin production build. The build emits the unchanged tabletop and card-frame images through Vite; no source or derived image was edited.

Exactly one bounded H6.20D external run completed:

```text
D:\Projects\Active\Tiny-Goblin-Academy\Evidence\
  level-04-card-goblin-duel\
    h6-20d-tabletop-functional-card-preview\
      capture-20260722t042915z-p2892\
```

Selected portable manifest:

```text
docs/evidence/external-runs/level-04-card-goblin-duel/
  h6-20d-tabletop-functional-card-preview/
    capture-20260722t042915z-p2892.json
```

The run contains eight stills for default hand, keyboard focus, resolution, SparkChoice, victory, defeat, supported minimum, and explicit anchor debug. Both runtime surfaces have exact document containment and zero console errors. All runtime title/body slots fit. At the default `1280x660` runtime surface, cards display at `153.59x212.28` CSS pixels from `123x170` or `124x170` native crops (about `1.24x-1.25x`). At the minimum `1024x580` runtime surface, cards display at `138x190.72` CSS pixels (about `1.11x-1.12x`). `image-rendering: auto` is explicit; the ornament remains visually coherent at these bounded scales and runtime text/focus chrome remain resolution-independent.

Visual review found one blocking composition issue: the rising hand overlaps the lower resolution-copy/player-status strip in ordinary, resolution, SparkChoice, and terminal stills. Terminal outcome/reset controls themselves remain unblocked. Because the lane permits one evidence run and forbids an autonomous visual tuning loop, no post-capture correction or recapture was attempted.

The captures prove the exact browser runtime surfaces corresponding to the established Tauri content areas, but this H6.20D run did not capture a live Tauri outer window or Hub runtime-container measurement. Embedded-Tauri proof therefore remains pending and is not claimed.

H6.20D remains preview-only, unstaged, uncommitted, unpushed, and not visually approved. H6.21 did not begin.

## H6.20E Tabletop Dock Correction

H6.20E corrects the reviewed H6.20D composition without modifying or generating any image asset. The top status rail now consumes its own document-flow row above the tabletop. The tabletop plate and hand dock are stacked siblings with no border, rule, or geometry gap. The dock uses `--tabletop-dock-color: #1a1218`, sampled from the darkest plum in the approved source plate.

The result corridor remains fixed above the hand. Ordinary resolution copy, SparkChoice instructions, victory/defeat treatment, and Reset Duel remain clear of the Academy emblem and every card. The cards retain the approved runtime scale; dock height, rather than card shrinkage, provides the required containment.

Focused validation covers **53 passing tests** plus the Card Goblin production build. The production build emits the same approved tabletop and card-frame images; no source or derived image was edited.

The bounded H6.20E evidence run is:

```text
D:\Projects\Active\Tiny-Goblin-Academy\Evidence\
  level-04-card-goblin-duel\
    h6-20e-tabletop-dock-correction\
      capture-20260722t172225z-p11424\
```

Selected portable manifest:

```text
docs/evidence/external-runs/level-04-card-goblin-duel/
  h6-20e-tabletop-dock-correction/
    capture-20260722t172225z-p11424.json
```

The run records eight stills and nine measured states. Every state has exact document containment and zero console errors. Ledger snapshot sequences remain `1, 2, 3, 4, 5`. Resting card exposure ranges from `21.35%` to `22.27%`; focused exposure peaks at `25.10%`; resting dock containment is at least `77.73%`. Default cards remain about `153.59x212.28` CSS pixels and minimum-layout cards remain `138x190.72` CSS pixels with fitting runtime text.

Agent visual review passed across default, focus, resolution, SparkChoice, victory, defeat, supported minimum, and explicit anchor-debug stills. The rail is separate from the artwork, the result corridor remains legible, the cards do not crowd the center seal, and the dock reads as a seamless continuation beneath the table edge.

Kryssie explicitly authorized closure without another human review round. The evidence therefore records `agentReviewPassed: true` and leaves `humanReviewPassed: false`; no human visual approval is claimed. Live embedded-Tauri outer-window/container measurement remains pending and is not claimed.

H6.21 did not begin.
