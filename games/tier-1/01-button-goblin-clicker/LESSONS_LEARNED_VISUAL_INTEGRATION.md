# Button Goblin Clicker — Visual Integration Lessons Learned

## Record identity

**Curriculum pass:** Post-playable visual and runtime integration<br>
**Level:** 1 — Button Goblin Clicker<br>
**Closure lane:** H6.4B<br>
**Runtime baseline entering this record:** restored v0.1, Human Review Passed<br>
**Visual/runtime closure commit:** `ef903b1` (`feat: integrate button goblin shared ui surfaces`)

This is Button Goblin's second learning record. It does not replace or rewrite the mechanical-era `LESSONS_LEARNED.md`. The recovered first record explains how the playable loop was learned; this record explains how that mechanically complete loop became a coherent Academy runtime without surrendering simulation authority.

## Inherited mechanical baseline

The surviving Academy synthesis records Level 1's original lesson as basic state-to-UI reactivity and its verified lesson as binding state and UI cleanly from the start. The visual pass inherited these rules:

- simulation owns HP, coins, damage, progression, and victory;
- renderers display truth but do not own it;
- the authorized loop stays bounded;
- automated tests, runtime evidence, and human review prove different kinds of correctness.

Everything below changed presentation around that baseline. It did not redefine the loop.

## Phase 1 — Academy shell inheritance and stage-first migration

### Starting understanding

Button Goblin had a restored, review-passed Academy page shell, but its permanent three-column dashboard treated the playfield as one panel among several. The Academy also had an evolving Tauri development host whose runtime controls, lifecycle, and embedded viewport had to remain separate from game state.

### Intended lesson

Learn how a mechanically complete game enters a shared desktop host while keeping the game stage visually primary and preserving the boundary between shell controls, DOM interface, Phaser presentation, and simulation.

### Approaches attempted or rejected

- Rejected retaining the permanent side-panel dashboard as the final runtime composition.
- Rejected moving all HUD and action content into Phaser merely because the actor lived there.
- Rejected letting the shared shell own game-specific state.
- Deferred Ledger/Help/Dev hydration beyond the shell contract instead of inventing unsupported payloads.

### Failures and surprises

- The first stage-first damage popup crossed the stable encounter-label lane.
- A desktop application viewport is not the same as a browser screenshot dimension; shell chrome and embedded content consume different regions.
- Dev-server lifecycle and visible game composition are related during review but are not one subsystem.

### What worked and why

The stage-first composition layered a Phaser play surface with DOM-owned HUD, action, and result surfaces. Moving transient damage feedback into its own lane protected stable encounter text. The shared Tauri shell retained launch, stop, close, help, ledger, and developer responsibilities without becoming the game's controller.

### Invariants preserved

- The simulation and controller remained authoritative.
- Bonk, reward, upgrade, stronger-goblin, and victory rules did not change.
- The shell did not acquire game-specific persistence or economy ownership.

### Reusable doctrine

- A game stage should own visual priority even when DOM and Phaser share presentation.
- Shared host controls belong outside the game simulation boundary.
- Stable labels and transient feedback need separate spatial lanes.
- A desktop minimum contract must come from the actual host configuration, not an invented narrow browser target.

### GlyphForge graduates

- Stage-first DOM/Phaser layering pattern.
- Shared-shell versus game-runtime ownership boundary.
- Transient-feedback lane doctrine.

### Evidence and commits

- `docs/runtime/TINY_GOBLIN_ACADEMY_H6_1_MINIMAL_RUNTIME_SHELL_CONTRACT.md`
- `docs/runtime/TINY_GOBLIN_ACADEMY_H6_2_BUTTON_GOBLIN_CLICKER_SHELL_MIGRATION.md`
- `d9ff848` — Academy development runtime shell hardening.
- `f982b6b` — Button Goblin stage-first migration.

### Inheritance passed to Potion Sorter

Potion Sorter may enter the Academy shell with a stage-first composition immediately. It does not need to rediscover shell/game ownership or rebuild a dashboard before designing its scene.

## Phase 2 — Cavern background and scene-anchor integration

### Starting understanding

Code-owned layout could establish hierarchy, but an empty or generic play surface did not establish place. A reviewed cavern image existed, yet simply stretching it behind the goblin would ignore crop behavior, floor grounding, obstruction bands, and responsive composition.

### Intended lesson

Learn to integrate a scene background as authored spatial context while keeping gameplay objects, anchors, and state independent from the image.

### Approaches attempted or rejected

- Rejected stretching the background to arbitrary aspect ratios.
- Rejected repainting or mutating the reviewed source image during runtime integration.
- Rejected treating decorative pixels as collision, state, or actor ownership.
- Deferred a full room/scene rig because this phase only proved a bounded background integration.

### Failures and surprises

- Cover scaling can preserve the viewport while cropping meaningful side detail.
- The floor baseline and foreground obstruction band matter more than simple geometric centering.
- A visually rich background can reduce actor readability unless the central safe zone remains protected.

### What worked and why

The cavern rendered through uniform cover scaling inside the Phaser surface. Named scene anchors identified the central actor zone, lower-floor grounding baseline, and decorative obstruction regions. The result gave the goblin a place without turning the image into a scene graph.

### Invariants preserved

- Actor input and hit truth remained code-owned.
- No background pixel became simulation state.
- The approved source image and its hash remained unchanged.

### Reusable doctrine

- Backgrounds establish place; anchors establish usable space.
- Ground lines, safe zones, and obstruction bands are functional scene metadata.
- Responsive scene art should crop intentionally, never stretch deceptively.

### GlyphForge graduates

- Scene-anchor vocabulary for background integration.
- Grounding-baseline and obstruction-band review method.
- Uniform cover-scaling rule for decorative scene art.

### Evidence and commits

- `docs/runtime/TINY_GOBLIN_ACADEMY_H6_3_BUTTON_GOBLIN_BACKGROUND_STAGE_INTEGRATION.md`
- `manifests/academy/runtime/planning/academy.button-goblin-background-stage-integration.json`
- `efafe34` — cavern background stage integration.

### Inheritance passed to Potion Sorter

Potion Sorter inherits scene-anchor thinking but extends it: its room, conveyor, queue, and sorting destinations can be code-authored layers rather than one flattened background.

## Phase 3 — GoblinRig actor direction and live integration

### Starting understanding

The restored goblin was a simple code-authored head with hit reactions. A large generated animation sheet was an obvious possible next step, but it would bind appearance, motion, state vocabulary, pivots, and correction cost into one difficult asset.

### Intended lesson

Learn whether a code-authored actor rig could provide identity, grounding, expressive states, and reusable animation structure while deferring a giant sprite sheet.

### Approaches attempted or rejected

- Rejected making a large generated sprite sheet a prerequisite for visual progress.
- Rejected replacing the live actor before the vector-rig direction passed preview review.
- Rejected preserving the old head-only hit circle after adding a full body.
- Kept segmented-art skins as a future adapter rather than coupling the rig to vector primitives forever.

### Failures and surprises

- A full body changes the expected click target; visible body parts must not feel falsely non-interactive.
- Feet, shadow, body scale, ear span, and the foreground obstruction band determine whether the actor feels grounded.
- Preview approval and live-runtime approval are distinct gates.
- Capturing a live desktop while the human and automation both interact can contaminate evidence even when the actor itself is correct.

### What worked and why

`GoblinRig` separated anatomy, pivots, skin values, expressions, hit bounds, and stateful motion. Idle and hover established life and affordance. Bonk reactions handled both damage strengths. Defeat changed expression and body motion; reset restored the actor for the next stronger goblin. Upgrade, later-goblin, and victory presentation remained driven by existing game state rather than new actor-owned rules.

### Invariants preserved

- The rig visualized controller/simulation state; it did not create HP, damage, rewards, or progression.
- The original Button Goblin identity remained recognizable.
- The input contract expanded to the visible actor without changing what a bonk meant.

### Reusable doctrine

- A rig is a stateful presentation contract, not merely a drawing technique.
- Actor states should be named capabilities—idle, hover, bonk, defeat, reset—not scattered tweens.
- Preview a reusable rig before replacing a live runtime actor.
- Code-authored rigs can defer expensive animation sheets while preserving a future skin boundary.

### GlyphForge graduates

- `GoblinRig` anatomy, skin, pivot, expression, and hit-area architecture.
- Preview-to-live actor integration workflow.
- Named actor-state vocabulary and whole-silhouette input doctrine.

### Evidence and commits

- `docs/runtime/TINY_GOBLIN_ACADEMY_H6_3B_BUTTON_GOBLIN_VECTOR_ACTOR_RIG_PREVIEW.md`
- `docs/runtime/TINY_GOBLIN_ACADEMY_H6_3C_BUTTON_GOBLIN_LIVE_GOBLIN_RIG_INTEGRATION.md`
- `games/tier-1/01-button-goblin-clicker/evidence/h6-3b-vector-actor-rig-preview/`
- `games/tier-1/01-button-goblin-clicker/evidence/h6-3c-live-goblin-rig-integration/`
- `games/tier-1/01-button-goblin-clicker/evidence/h6-3c-embedded-tauri-review/`
- `e0f50ab` — vector actor-rig preview.
- `e0a53c2` — live GoblinRig integration.

### Inheritance passed to Potion Sorter

Potion Sorter generalizes actor-rig thinking into `SceneRig` thinking: named pieces, anchors, states, transitions, and replaceable visual materials should present simulation truth without becoming it.

## Phase 4 — Shared typography and material-aware text

### Starting understanding

The Academy had selected and proven local font families, but choosing a family was not enough. Text needed scale, weight, contrast, shadow, line height, and placement appropriate to dark panels, parchment, teal frames, and code-native game surfaces.

### Intended lesson

Learn how shared typography can establish Academy identity while remaining material-aware and subordinate to the game stage.

### Approaches attempted or rejected

- Rejected applying one decorative font treatment to every semantic role.
- Rejected treating font-family selection as the completion of typography design.
- Rejected allowing the masthead and HUD values to dominate the actor.
- Deferred unrelated font rollout to the remaining nine games.

### Failures and surprises

- Correct fonts at excessive size still produced the wrong hierarchy.
- The first scroll-label treatment was too small and clipped `ONE UPGRADE` at constrained width.
- Result text that was geometrically inside a plaque could still feel weak if it did not respond to the material beneath it.

### What worked and why

Semantic recipes bound Cinzel to result/title authority, Caudex to parchment body text, Outfit to compact paper labels, and legible data faces to live values. Button-specific caps restrained the masthead and HUD. Region 30 gained a 160px host and a complete label; Region 20 gained distinct title, body, and footer recipes.

### Invariants preserved

- All semantic content remained live DOM text.
- Fonts changed presentation, not game meaning.
- Local font binaries, source provenance, and the shared runtime loader remained authoritative.

### Reusable doctrine

- Typography recipes require semantic role and material context.
- Shared grammar does not require identical sizes in every composition.
- Decorative hierarchy must serve the stage rather than compete with it.
- Font loading, local paths, and runtime fit require evidence, not assumption.

### GlyphForge graduates

- Shared Academy font loader and semantic typography recipes.
- Material-aware paper, parchment, dark-panel, and result-title treatments.
- Runtime font-path and fit verification pattern.

### Evidence and commits

- `docs/assets/shared-assets/shared-ui/TINY_GOBLIN_ACADEMY_H5_99_ACADEMY_TYPOGRAPHY_RUNTIME_INTEGRATION_PROOF.md`
- `manifests/academy/runtime/planning/academy.typography-runtime-integration-h5-99.json`
- `a541b3c` — Academy typography system promotion.
- `bfd0bb2` — Button Goblin typography runtime integration.

### Inheritance passed to Potion Sorter

Potion Sorter starts with proven local fonts and semantic recipes. Its new lesson is how those recipes bind to material textures, bottle labels, sorting stations, and a code-authored room.

## Phase 5 — Shared physical host surfaces, desktop fit, and evidence ownership

### Starting understanding

Shared UI/HUD regions had been mapped and reviewed, but mapping did not prove that every physical panel belonged in every game. Button Goblin still needed to distinguish reusable Academy material from game-owned live surfaces.

### Intended lesson

Learn how to integrate shared physical assets selectively, prove them in the actual Tauri desktop contract, and keep runtime evidence beside the game it documents.

### Approaches attempted or rejected

- Rejected blanket skinning of all four HUD cards with Region 5.
- Rejected forcing one Region 5 label/value contract to represent four independent states.
- Constrained Region 30 to the short `ONE UPGRADE` accent instead of replacing the Bonk card.
- Used Region 20 only where its title/body/footer contract matched the victory result.
- Rejected an exploratory `760×700` harness as the final product acceptance contract.
- Rejected storing H6 runtime evidence in the H5 asset-evidence shelf.

### Failures and surprises

- Region 30 initially read as microscopic print and clipped at `D` under minimum-window pressure.
- Masthead and HUD typography were initially too dominant.
- The victory plaque first rendered beneath the HUD, hiding its title at the actual minimum window.
- Live capture could include the wrong monitor, operator interaction, unfocused-window artifacts, temporary duplicate shelves, or orphaned Tauri processes.
- The real acceptance contract was the configured `1024×640` Tauri content size plus the `1920×1080` primary display—not an imagined mobile layout.

### What worked and why

The shared host primitive preserved uniform scaling, protected borders, independent text, and code-native fallbacks. Region 20 became a ceremonial Academy Graduate certificate; Region 30 became a bounded physical label. Optional flavor text alone reflowed away at minimum width. The result plaque elevated above the HUD. A complete seven-state minimum-window run and primary-display anchors proved the composition inside the real Tauri host.

### Invariants preserved

- HUD and Bonk card semantics remained game-owned.
- Simulation, controller, GoblinRig behavior, hit areas, background, and animations did not change.
- Source sheets and reviewed crops retained their hashes.
- Shared surfaces remained optional candidates, not universal layout law.

### Reusable doctrine

- Shared asset selection is a fit decision, not a mandate.
- Asset-backed UI works best when code retains semantic content and interaction.
- Human visual approval cannot be inferred from automated validation.
- Supported-window defects should be fixed before speculative mobile layouts are invented.
- Runtime evidence belongs with the game runtime lane.
- Evidence capture requires process, listener, focus, input, and temporary-artifact hygiene.

### GlyphForge graduates

- Shared physical host-surface primitive with protected slots and fallbacks.
- Region 20 result-certificate treatment.
- Region 30 compact paper-label treatment.
- Actual-desktop acceptance and game-owned runtime-evidence pattern.

### Evidence and commits

- `docs/runtime/TINY_GOBLIN_ACADEMY_H6_4_BUTTON_GOBLIN_SHARED_HOST_SURFACE_INTEGRATION.md`
- `manifests/academy/runtime/planning/academy.button-goblin-shared-host-surface-integration.json`
- `games/tier-1/01-button-goblin-clicker/evidence/h6-4-button-goblin-shared-host-surface-runtime/`
- `ef903b1` — shared UI surfaces and material typography closure.

### Inheritance passed to Potion Sorter

Potion Sorter may reuse the host primitive where a reviewed surface honestly fits, but it is not required to inherit Button Goblin's panels. It begins with actual Tauri desktop contracts and game-owned evidence placement already established.

## Deferred teaching territory

These phases were not forgotten; they were not taught by Button Goblin's visual pass:

| Curriculum phase | Button Goblin status | Future lane |
|---|---|---|
| Texture/material ingestion | Not taught | Potion Sorter material intake and audition |
| Scene rigging | Only scene-anchor background integration | Potion Sorter room and conveyor SceneRig |
| Environmental lighting and FX | Minimal existing feedback only | Potion Sorter lighting, steam, sparks, dust, glow |
| Audio integration | Explicitly deferred | Later Academy audio pass |
| Accessibility/input evolution | Broad pointer hit area only; no full pass | Later accessibility/input pass |
| Performance optimization | Validation only; no dedicated teaching pass | Later optimization pass |
| Advanced rendering/shaders | Explicitly deferred | Later shader curriculum after material foundations |
| Distribution/release operations | Not part of this pass | Later release curriculum |

## Button Goblin doctrine promoted from this pass

- Presentation subscribes to simulation truth.
- A rig is a named presentation system, not a collection of arbitrary tweens.
- Actor rigs can defer large animation-sheet requirements.
- Background anchors make decorative art usable without making pixels authoritative.
- Shared grammar does not mean shared physical layout.
- Material-aware typography requires more than choosing a font family.
- Shared UI assets remain optional and must pass actual content-fit review.
- Runtime evidence belongs with the game and must use the real supported desktop contract.
- Human review remains sovereign over visual hierarchy and felt coherence.

## Final inheritance passed to Potion Sorter

Potion Sorter begins with:

- an authoritative simulation boundary;
- the Academy desktop shell and stage-first layout doctrine;
- shared typography and optional physical host surfaces;
- actor-rig lessons generalized into SceneRig architecture;
- anchor, protected-zone, evidence, and human-review disciplines.

Its new teaching territory is:

- reusable material and texture ingestion with licensing/provenance;
- a complete code-authored alchemy room and front-facing conveyor;
- perspective queue anchors carrying position, scale, depth, lighting, and occlusion;
- potion actors, environmental motion, lighting, particles, and FX.

Audio and shaders remain later curriculum lanes. The next game inherits capability; it does not inherit permission to skip review.

## Visual-pass closure rule

This game-specific visual pass is not fully closed until:

1. runtime and evidence validation pass;
2. human visual review passes;
3. this game-specific visual learning record is reviewed;
4. reusable doctrine is marked for promotion or explicit deferral;
5. inheritance passed to the next game is named.

Cross-game synthesis is intentionally deferred until all ten games have their own visual-pass learning records.
