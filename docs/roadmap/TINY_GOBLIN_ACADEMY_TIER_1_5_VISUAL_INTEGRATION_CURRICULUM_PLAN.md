# Tiny Goblin Academy — Tier 1.5 Visual Integration Curriculum Plan

**Status:** Human-approved curriculum allocation

**Captured:** 2026-07-15

**Scope:** Tier 1 visual integration across all ten games

## Purpose

Tier 1.5 is not ten unrelated polish passes. It is a cumulative visual-development curriculum.

Every Tier 1 game receives its reviewed, cleaned, and prepared game-specific assets. Each game also owns one new headline visual discipline that expands the Academy's reusable vocabulary. Techniques learned earlier remain available to every later game.

The progression is:

```text
actor presentation
→ scene presentation
→ interaction presentation
→ authored VFX
→ spatial readability
→ systematic world-state visuals
→ continuous ambience
→ modular environment construction
→ production tilemap integration
→ scalable cumulative composition
```

## Curriculum Law

Every game-level visual plan and visual-integration lessons record must distinguish three fields:

| Field | Meaning |
| --- | --- |
| **Primary new discipline** | The visual-system concept this game is responsible for teaching. |
| **New acquisition category** | The new external asset family that must be researched, licensed, ingested, and reviewed for this lesson. |
| **Previously learned systems reused** | Earlier visual techniques that may appear again without becoming the headline lesson. |

There is no artificial ban on reuse. Pet Campfire may use particles after Card Goblin teaches particle construction. Mini Settlement may reuse SceneRig, materials, animation, lighting, tiles, and particles. Reuse is evidence that the curriculum is accumulating into a studio vocabulary.

## Shared Baseline for All Ten Games

Every visual integration pass must:

- preserve the accepted playable loop and simulation/controller ownership;
- integrate reviewed cleaned assets selectively rather than dumping an atlas into the scene;
- keep live text, state, focus, controls, and accessibility code-owned;
- preserve source images and provenance records;
- create runtime derivatives only through a documented, reversible pipeline;
- test the actual supported desktop window contract;
- capture human-review evidence beside the owning game;
- write a separate visual-integration lessons record;
- defer cross-game synthesis until all ten visual passes are complete.

## Ten-Game Curriculum Allocation

| Level | Game | Primary new discipline | New acquisition category | Previously learned systems reused | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | Button Goblin Clicker | Code-authored ActorRig, material typography, and selective physical UI surfaces | Local open fonts and modular actor/UI presentation ingredients | Cleaned sprite regions, scene anchors, responsive shell composition | Completed and documented |
| 2 | Potion Sorter | SceneRig and layered material composition | Stylized and realistic textures, material surfaces, grime, parchment, glass-support ingredients | Typography, physical UI surfaces, actor/prop placement | Completed and documented; game ledger pending human review |
| 3 | Dice Duel Tavern | Procedural motion choreography and readable interaction feedback | Dice faces, action glyphs, cursors, and input prompts | Typography, SceneRig layering, restrained material treatment | Completed and documented |
| 4 | Card Goblin Duel | Authored particle/VFX recipes synchronized to gameplay events | Particle sprites, glows, impacts, trails, card ornament, and repeatable patterns | Motion choreography, typography, physical card/UI surfaces | Planned |
| 5 | Dungeon Key Run | Spatial readability through masks, lighting, occlusion, and decals | Light/shadow overlays, cracks, soot, tracks, danger marks, and navigation decals | Particles for restrained pickup/impact feedback, motion, materials | Planned |
| 6 | Tiny Farm Day | Stateful tile grammar, patterns, and palette discipline | Terrain and crop-state tiles, transition pieces, patterns, and palette families | Decals, materials, motion, readable state feedback | Planned |
| 7 | Pet Campfire | Continuous ambience and state-driven visual adaptation | Mood/atmosphere overlays, light fields, ambient layers, and state variants | Particle emitters for fire/smoke/embers, tiles, palettes, materials | Planned |
| 8 | One Room Platformer | Modular environment construction aligned with collision geometry | Architectural/platform kits, boundaries, layered backgrounds, and foreground pieces | Lighting, decals, motion, particles, palette discipline | Planned |
| 9 | Top-Down Slime Quest | Production tilemap/autotiling and directional animation integration | Complete top-down tilesets, terrain transitions, directional actors, and animation families | Modular environments, particles, lighting, decals, palettes | Planned last or near-last |
| 10 | Mini Settlement Sim | Data-driven scene growth, icon systems, and scalable cumulative composition | Modular building kits, resource icon families, UI kits, and nine-slice surfaces | All earlier disciplines as justified by the game | Planned capstone |

## Level 1 — Button Goblin Clicker

### Primary new discipline

Turn a functional prototype into an authored game surface through a code-driven goblin ActorRig, local material typography, and selective physical UI host surfaces.

### New acquisition category

- open-license font families preserved locally;
- reviewed physical UI labels and result surfaces;
- modular visual ingredients suitable for a code-authored actor.

### Previously learned systems reused

- reviewed source and cleaned regions;
- scene-anchor analysis;
- responsive shell and game-host layout;
- evidence-first human review.

### Closure state

Completed. Its mechanical and visual lessons are recorded separately. Button Goblin establishes the baseline discipline that every later game inherits.

## Level 2 — Potion Sorter

### Primary new discipline

Build a medieval alchemy production-room SceneRig from individually addressable layers and reusable material recipes instead of importing one flattened room image.

### New acquisition category

- stylized fantasy timber and masonry;
- dark metal and warm brass/bronze;
- parchment, grime, wear, and optional magical surface helpers;
- realistic textures retained as restrained grain, wear, and focal-metal support;
- glass/liquid support ingredients when a bounded implementation lane proves their need.

### Previously learned systems reused

- local typography;
- physical UI surfaces;
- actor/prop placement and anchoring;
- responsive desktop composition.

### Lesson boundary

Potion Sorter teaches material selection, tiling, scaling, tinting, masks, layering, and SceneRig ownership. It does not need to introduce advanced PBR, full shader architecture, or every possible 2D material map.

### Closure state

Completed. H5.100/H5.100C established the governed hybrid material pantry;
H5.101 selected the provisional room recipes on controlled specimens; H5.102A
proved containment, masking, anchors, and interaction geometry; H6 previewed
and corrected Composition C; H6.5 migrated the game into the stage-first shell;
H6.6 integrated the live alchemy SceneRig; and H6.7/H6.7A completed semantic
typography and the authored result surface. Runtime, evidence, and human visual
review passed. The separate game-owned visual lessons ledger is written and
awaits human review before the Level 2 curriculum record is fully closed.

## Level 3 — Dice Duel Tavern

### Primary new discipline

Teach interaction presentation through anticipation, roll, tumble, bounce, settle, selection, and impact choreography. The player must be able to read what is actionable, what is resolving, and what result became authoritative.

### New acquisition category

- coherent dice-face families;
- Attack, Heal, and Block glyphs;
- mouse cursor, click, keyboard, and optional gamepad prompt families;
- hard-edged motion accents only where they improve readability.

### Previously learned systems reused

- material surfaces and typography for the tavern presentation;
- SceneRig layering;
- physical UI framing.

### Lesson boundary

Dice Duel may use small visual accents, but it does not own the particle-system lesson. Its proof is a readable motion timeline whose final state always agrees with simulation truth.

### Closure state

Completed. H5.30–H5.33 prepared and reviewed 64 mapped source regions without confusing preparation with runtime approval. H6.9 established the Crooked Six stage before actor integration; H6.10 proved one persistent six-face Mesh2D DieRig in isolation; H6.11 integrated production Web Crypto authority, explicit rolling/input gates, full and reduced motion, production scale, and continuous actor ownership; H6.12 added restrained materials, semantic typography, selective mapped action/prop assets, and terminal tavern plaques. Runtime, evidence, human visual review, human runtime review, and both mechanical/visual lessons records passed. The evidence-size inventory and D-drive warehouse lane remains intentionally incomplete and precedes Level 4.

## Level 4 — Card Goblin Duel

### Primary new discipline

Teach authored moment-to-moment VFX: particle recipes, blend modes, effect timing, origin/target relationships, lifetime, cleanup, and synchronization to deterministic card events.

### New acquisition category

- true-alpha particle and VFX artwork;
- glows, sparks, impacts, trails, smoke, and magical helper shapes;
- repeatable card-back, cloth, rune, and ornament patterns;
- provenance-clean historical ornament only when its license and transformation path are explicit.

### Previously learned systems reused

- Dice Duel motion choreography for draws, plays, and reactions;
- Button Goblin typography and physical UI principles;
- Potion Sorter layering and material recipes.

### Lesson boundary

Card Goblin owns particle construction because its deterministic card events provide clear triggers and expected outcomes. VFX must explain or celebrate state; it must never obscure the causal ledger or become gameplay truth.

### Closure state

Technical closure and Human Visual/Runtime Review complete. The production result uses a
single semantic CardRig root for face, live content, true outer frame, state,
card-local VFX, motion, and activation-source ownership. Three persistent hand
slots remain visible through occupied, focused, selected, replacement, locked,
vacant, and incoming states. Six typed full/reduced material recipes synchronize
to live simulation events without becoming gameplay authority. The final
typography/UI patch and compact external evidence packet were approved after a
complete Tauri Hub playthrough.

## Level 5 — Dungeon Key Run

### Primary new discipline

Teach spatial readability through masks, lighting fields, layer depth, foreground/background relationships, and environmental storytelling decals.

### New acquisition category

- soft light and shadow overlays;
- cracks, soot, tracks, scratches, chalk marks, and danger symbols;
- key/exit emphasis shapes and environmental navigation marks.

### Previously learned systems reused

- Card Goblin particles for restrained pickup or terminal feedback;
- Dice Duel motion for entity response;
- Potion Sorter materials for walls, floors, and props.

### Lesson boundary

The approved playable loop excludes fog-of-war gameplay. Masks and lighting remain presentational and must not create hidden simulation rules or reduce grid readability.

## Level 6 — Tiny Farm Day

### Primary new discipline

Teach systematic world-state visuals through tile grammar, crop-stage variants, terrain transitions, decorative patterns, and a coherent palette system.

### New acquisition category

- terrain and plot tiles;
- crop-state and soil-state variants;
- edge, corner, and transition pieces;
- palette files or documented color ramps;
- restrained farm patterns and decorative alternates.

### Previously learned systems reused

- materials and decals;
- interaction motion and state feedback;
- particles for bounded harvest or upgrade celebration.

### Lesson boundary

The lesson is not a giant farm tileset. It is a small, explicit visual grammar in which every plot state is readable and every variation preserves gameplay clarity.

## Level 7 — Pet Campfire

### Primary new discipline

Teach continuous ambience: the scene changes as time and pet state change, rather than responding only to discrete clicks.

### New acquisition category

- mood and atmosphere overlays;
- warm/cool light fields and vignette families;
- environmental state variants;
- optional weather or time references for future use, without expanding the current playable contract.

### Previously learned systems reused

- Card Goblin particle recipes for fire, smoke, and embers;
- Tiny Farm palettes and state variants;
- Dungeon Key lighting and masking;
- Potion Sorter material layering.

### Lesson boundary

The current game contract excludes weather and a day/night system. Visual adaptation must be driven by approved hunger, happiness, survival time, and pet-status state unless a separate contract expansion is approved.

## Level 8 — One Room Platformer

### Primary new discipline

Teach modular environment construction whose visual geometry agrees with collision geometry.

### New acquisition category

- platform, floor, wall, trim, doorway, hazard, and boundary kits;
- layered background and foreground pieces;
- modular architectural decorations that preserve the required route.

### Previously learned systems reused

- materials, decals, lighting, palette discipline, and motion;
- particles only if the visual-pass contract deliberately relaxes the current no-particles exclusion.

### Lesson boundary

Every visible ledge, hazard, and doorway must truthfully represent its collision or goal geometry. Decorative depth must not imply nonexistent paths. The fixed-room contract does not require a scrolling camera; background layering may teach depth without inventing one.

## Level 9 — Top-Down Slime Quest

### Primary new discipline

Teach production tilemap integration: autotiling, terrain-family transitions, directional actors, animation states, placement rules, and navigable world assembly.

### New acquisition category

- coherent top-down tileset families;
- corners, edges, transitions, obstacles, and decorations;
- directional actor and enemy animation families;
- animated terrain or environmental elements where justified.

### Previously learned systems reused

- Tiny Farm tile grammar and palettes;
- One Room modular environment discipline;
- particles, lighting, decals, SceneRig layering, and motion choreography.

### Lesson boundary

This remains last or near-last because pantry richness is not runtime readiness. Animation, tile behavior, walkability, collision, placement, and map rules must agree before the scene is approved.

## Level 10 — Mini Settlement Sim

### Primary new discipline

Teach scalable composition: data-driven visual growth, modular building states, coherent icon systems, resizable UI surfaces, and hierarchy under increasing information density.

### New acquisition category

- modular building and settlement kits;
- citizen and resource icon families;
- UI kits with suitable corners, edges, centers, and states;
- nine-slice-ready panels and controls.

### Previously learned systems reused

- every earlier discipline whose use remains bounded and legible.

### Lesson boundary

Mini Settlement is a capstone, not a junk drawer. Its new proof is that scene growth and interface complexity remain readable and data-driven. Reused techniques do not need to be re-taught or over-demonstrated.

## Incremental Acquisition Roadmap

The Academy should acquire assets just in time, using each game to prove the need for a new pantry shelf.

```text
Fonts and modular actor presentation
→ textures and material surfaces
→ input prompts and action glyphs
→ particle/VFX artwork and patterns
→ decals and lighting overlays
→ tiles, palettes, and state variants
→ ambience layers
→ modular architecture and layered backgrounds
→ complete top-down tilesets and directional actors
→ building kits, icon families, and scalable UI kits
```

### Intake rules

- Prefer CC0 for reusable source packs.
- Allow OFL, MIT, ISC, CC BY, and similarly usable licenses only with complete license and attribution preservation.
- Treat “free download” without an explicit license as unusable.
- Verify license terms and original creator/source pages at the time of intake; old research notes are not sufficient.
- Reject rendered previews, material balls, or scene screenshots as production texture assets unless the package also contains the underlying reusable files.
- Preserve source packages, hashes, licenses, metadata, selection decisions, and evidence.
- Register only the useful selected assets in active manifests when a large source pack contains substantial unrelated content.
- Do not interpret pantry acceptance as runtime approval or mandatory use by the game that opened the intake lane.

## Per-Game Execution Pattern

Each remaining visual pass should proceed through bounded checkpoints:

1. Reconfirm the current playable-loop and visual-shell contract.
2. Audit the game-specific cleaned pantry and current runtime.
3. Define the headline discipline and acceptance proof.
4. Research only the new acquisition category required by that lesson.
5. Preserve provenance and create comparison evidence.
6. Select assets and recipes through human review.
7. Implement the smallest runtime integration that teaches the discipline.
8. Validate gameplay preservation, supported windows, source integrity, and repository hygiene.
9. Capture game-owned runtime evidence.
10. Write `LESSONS_LEARNED_VISUAL_INTEGRATION.md` using the shared template.
11. Commit the bounded game pass before moving to the next game.

## Synthesis Boundary

Do not continuously rewrite the first mechanical `LESSONS_LEARNED.md` as later disciplines arrive.

Each game keeps a separate visual-integration lessons record. After all ten visual passes are complete, synthesize the ten visual records into a dedicated Tier 1.5 visual-pass synthesis. Later audio, accessibility/input, optimization, and advanced-rendering passes should follow the same parallel-record pattern.

## GlyphForge Studios Library Boundary

This Academy plan governs curriculum and lesson-specific public-safe intake. It does not define or create the future private GlyphForge Studios Library repository.

The private library is a separate future project seed. Repository establishment is deferred until Tier 1.5 is complete and before Tier 2 begins, so its shelves, manifests, lifecycle states, and graduation rules can be designed from ten completed visual integrations rather than speculation.

## Non-Goals

This plan does not:

- authorize Potion Sorter runtime work by itself;
- acquire every listed asset category immediately;
- create the private GlyphForge Studios Library repository;
- require every technique to appear in every game;
- promote assets from pantry acceptance to runtime approval;
- change simulation, controller, or playable-loop contracts;
- begin Tier 2 or audio integration.
