# Dice Duel Tavern — Visual Integration Lessons Learned

## Record identity

**Curriculum pass:** Tier 1.5 visual and runtime integration
**Level:** 3 — Dice Duel Tavern
**Mechanical authority:** `PLAYABLE_LOOP_CONTRACT.md` and `LESSONS_LEARNED.md`
**Visual/runtime sequence:** H5.30–H5.33 and H6.8–H6.12
**Final visual closure:** `796cf6d` (`feat: finish dice duel tavern visual integration`)

This is Dice Duel’s second learning record. It explains how an accepted but primitive causal turn loop became a stage-first tavern game with one persistent animated die. It does not rewrite the fixed-sequence v0.1 prototype as though production randomness, Mesh2D, reduced motion, or finished materials existed from the beginning.

## A. Prepared assets before runtime wiring

### Starting assumption

The Dice Duel concept sheet appeared to contain everything needed for a finished game: dice, props, action glyphs, and effects.

### Intended lesson

Learn how mapping and cleanup make source art addressable without prematurely granting it runtime authority.

### Rejected or failed attempt

Treating every visually interesting region—especially angled dice and baked motion/FX frames—as an automatic animation candidate was rejected.

### Observed failure

H5.30–H5.33 mapped 64 regions and created a reviewed transparent derivative, but those records approved only draft pipeline use. The assets still lacked live scale, semantic placement, actor continuity, interaction, and gameplay evidence.

### Successful correction

The cleaned sheet remained a prepared source. Later H6 work promoted only exact regions whose semantics and live purpose survived review: flat die faces, three action tokens, and a sparse set of tavern props.

### Protected invariant

Source pixels, mapping history, and the distinction between accepted-for-preparation and runtime-approved remained intact.

### Reusable doctrine

> Prepared assets do not equal live integration.

## B. Stage before actor

### Starting assumption

The original three-column layout seemed adequate because it exposed player state, a 520×280 canvas, and the full combat log at once.

### Intended lesson

Create a spatial composition in which a moving die would visibly belong before implementing the die itself.

### Rejected or failed attempt

The permanent status and combat-log rails were removed, but the first replacement still read like a generic dojo or duel board. Placeholder combatant circles preserved the dashboard’s abstract opponent-versus-player composition rather than establishing a tavern dice game.

### Observed failure

The stage technically grew while the rolling area remained visually secondary. Character circles competed with the only actor that actually mattered, and there was no clear path from ready position to shared landing surface.

### Successful correction

H6.9 removed the combatant circles, made one shared rolling tray the hero surface, established the Crooked Six as an asymmetric tavern scaffold, preserved compact HP plaques, and kept complete history in a contextual drawer. Negative space around the tray was intentionally reserved for later motion.

### Protected invariant

Attack, Heal, Block, HP, enemy response, causal logs, and terminal rules remained simulation-owned and unchanged.

### Reusable doctrine

> Stage geometry should establish where the actor belongs before the actor is integrated.

## C. Canonical die-surface selection

### Starting assumption

Angled, rolling, paired, glowing, and clustered dice looked like convenient animation frames.

### Intended lesson

Select six surfaces capable of forming one coherent die whose identity survives arbitrary rotation.

### Rejected or failed attempt

Perspective-varying dice and baked FX were rejected as canonical actor surfaces. Their camera angles, proportions, lighting, and silhouettes did not share one stable cube.

### Observed failure

Sequencing inconsistent reference images would produce visible swaps rather than rotation. A final flat face could be correct numerically while still exposing that the “actor” changed underneath it.

### Successful correction

The reviewed flat faces 1–6 became canonical surfaces with opposite pairs fixed as 1–6, 2–5, and 3–4. Angled dice remained reference art; paired, glowing, clustered, small-rolling, and baked sparkle/dust/spiral/burst/smoke regions remained explicitly rejected.

### Protected invariant

The live Mesh2D is the only die actor. Decorative assets never contradict its face or become independent input objects.

### Reusable doctrine

> Reference art may suggest motion, but canonical animation surfaces must share one stable topology.

## D. Persistent DieRig laboratory

### Starting assumption

A convincing roll might require external 3D, physics, or a sprite replacement at settle.

### Intended lesson

Prove one continuous six-face actor, exact topology, readable full/reduced motion, and deterministic settlement in isolation.

### Rejected or failed attempt

The team rejected physics-driven authority, a final-face sprite swap, multiple actor handoffs, and using the large inspection-scale laboratory die as the production size.

### Observed failure

Initial renderer evidence exposed UV orientation and padding problems. Full-page browser screenshots also misrepresented the real viewport. The laboratory’s deliberately enlarged die was useful for inspecting faces but looked like an automotive fuzzy die when judged as a tavern object.

### Successful correction

H6.10 built one persistent Phaser Mesh2D actor with stable vertices, six reviewed textures, injected result, multi-axis tumble, two bounded impacts, code-authored shadow/contact response, exact target orientation, and a reduced-motion path. Renderer UV flip/padding corrections kept the art aligned. True viewport captures replaced misleading full-page proof.

### Protected invariant

One actor ID survives request, tumble, impacts, settle, and repeated rolls. No physics engine or renderer event selects the result.

### Reusable doctrine

> Prove actor continuity, topology, and motion in isolation before live gameplay integration.

## E. Authority before animation

### Starting assumption

The v0.1 fixed sequence was useful for testing, but it was not a finished production roll source.

### Intended lesson

Separate authoritative result generation and simulation commitment from the presentation that reveals the result.

### Rejected or failed attempt

Modulo-biased random mapping, animation-selected faces, post-animation rerolls, duplicate completion, stale callbacks, and action unlock before settle were rejected.

### Observed failure

Without an explicit intermediate phase, a visual roll could leave Roll or actions legal at the wrong time. Timing failures could also tempt presentation to request a replacement value.

### Successful correction

H6.11 introduced production Web Crypto d6 generation with unbiased rejection sampling and injectable fixed/seeded sources for tests and evidence. Simulation accepts the face first and enters `rolling`; presentation performs the already-committed result; valid completion enters `action` and records one `You rolled N.` event. Duplicate or stale completions cannot change truth, and bounded fallback uses the same face rather than rerolling.

### Protected invariant

Dropped frames, reduced motion, capture hooks, or rejected animation requests cannot alter the committed face, HP math, action legality, or outcome.

### Reusable doctrine

> Gameplay authority commits truth; presentation performs it.

## F. Production integration corrections

### Starting assumption

The approved laboratory actor could enter the tavern with only a coordinate change.

### Intended lesson

Integrate the same actor into live gameplay while respecting scale, stage paths, input locks, terminal retention, and the Academy launch boundary.

### Rejected or failed attempt

The laboratory scale and an initial tray-edge ready position were rejected for production. A die that disappeared, duplicated, swapped, or reset at terminal state would have broken continuity.

### Observed failure

At museum scale the die overwhelmed the tray and exposed its planes as mounted tiles. The tray-edge ready position weakened the player-to-table motion story.

### Successful correction

The settled die became 24.5% of live tray width with a restrained 107% launch peak. Its ready station moved beside the player wager and cup. The same actor enters, settles, returns after nonterminal actions, repeats across turns, and remains settled at victory or defeat. Action buttons stay locked until the result is readable.

The packaged Academy Hub review intentionally exercised repository/developer mode: the Hub located the source workspace and managed Dice Duel’s local server. This is supported developer behavior, not a packaging defect. Standalone Dice Duel and production/distribution catalog proof remain separate future lanes.

### Protected invariant

Production scale, ready/tray/settle positions, motion timing, two-impact budget, actor identity, and action mathematics remain protected H6.11 authority.

### Reusable doctrine

Laboratory scale proves construction; production scale proves composition. Developer launch behavior and distribution packaging must also remain separate claims.

## G. Materials, typography, and selective assets

### Starting assumption

The approved geometry was functional, but flat procedural browns and generic text still made the Crooked Six feel unfinished.

### Intended lesson

Apply existing Academy grammar and pantry assets without covering mechanic-owned structure or competing with the die.

### Rejected or failed attempt

Blanket decoration, character portraits, a second decorative die, icon-only actions, stronger all-over texture, copied Potion Sorter layouts, and every available tavern prop were rejected.

### Observed failure

More material did not automatically mean more place. The tray needed to remain darker than the table; the cream die needed contrast; action meaning could not depend on icons; and the tavern still needed negative space.

### Successful correction

H6.12 applied Academy semantic typography with strong Cinzel title/result hierarchy; restrained structural timber, hand-painted hero-table wood, dark metal, and limited brass; labels-first sword/heal/shield action buttons; and sparse cup, mug, coin, and candle props. Character representations remained unnecessary. Bounded victory/defeat plaques preserve HP and final-die visibility.

### Protected invariant

Materials remain presentation-only, button text remains accessible authority, source assets remain unchanged, and the live DieRig remains the focal actor.

### Reusable doctrine

> Shared visual grammar should strengthen mechanic-owned structure, not replace it.

## H. Evidence lessons

### Starting assumption

Ordinary screenshots and manual timing would be sufficient to prove responsive layout and short motion phases.

### Intended lesson

Create evidence that truthfully represents supported windows, deterministic runtime states, actor continuity, production authority, and human-visible quality.

### Rejected or failed attempt

Full-page captures posing as viewport evidence, manually lucky impact frames, production-active query overrides, and automation-only visual approval were rejected.

### Observed failure

Short anticipation/impact/rebound phases are difficult to capture reliably. Automated Windows control can also fail independently of the game, and evidence generation itself can accumulate substantial PNG/WebM weight.

### Successful correction

Evidence used true 1920×1080 and 1024×640 viewports, development-only deterministic sources and phase-freeze hooks, production-preview audits that proved query overrides were ignored, telemetry for actor/timing/scale authority, and human review as the final visual/runtime gate. Large evidence storage is explicitly deferred to a dedicated repository-size and D-drive taxonomy lane.

### Protected invariant

Capture instrumentation cannot change production random authority, gameplay rules, or runtime approval semantics.

### Reusable doctrine

Evidence must prove the claim it names. Deterministic instrumentation may expose timing, but production authority and human judgment remain separate gates.

## Inheritance passed to Card Goblin Duel

Card Goblin Duel may inherit without artificial bans:

- stage-first shell migration;
- Academy typography and material recipes;
- selective mapped-asset integration;
- persistent presentation actors;
- deterministic evidence injection;
- input locking and explicit motion phases;
- reduced-motion patterns;
- contextual history and result surfaces;
- supported-window and human visual-review workflow.

Its new headline lesson remains hidden state, card resolution, UI synchronization, and primary particle/VFX integration. This record does not design or begin Level 04.

## Deferred territory

- evidence-size inventory and D-drive evidence warehouse;
- future heavy-capture redirection;
- Card Goblin particle/VFX curriculum;
- audio;
- shaders and advanced lighting;
- standalone production/distribution packaging;
- broader accessibility/settings curriculum;
- replay/reset unless separately approved.

## Closure

- `visualIntegrationLessonClosed: true`
- `humanRuntimeReviewPassed: true`
- `humanVisualReviewPassed: true`
- `runtimeApproved: true`
- `evidenceWarehouseMigrationComplete: false`
- `cardGoblinDuelStarted: false`

The immediate next lane is the evidence-size audit and D-drive migration plan—not Card Goblin Duel implementation.
