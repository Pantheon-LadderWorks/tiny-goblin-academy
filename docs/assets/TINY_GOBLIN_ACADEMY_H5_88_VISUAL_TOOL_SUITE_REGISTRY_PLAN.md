# Tiny Goblin Academy — H5.88 Visual Tool Suite Registry Plan

## Purpose

H5.88 plans the future Tiny Goblin Academy / GlyphForge visual tool suite.

The pantry now has enough reviewed assets that tools should discover assets through registries and manifests, not through human memory, flat folders, or one-off hardcoded paths.

This pass creates a planning registry only. No tools are built.

## Relationship To H5.85-H5.87

H5.85 created the first global visual asset pantry index:

```text
manifests/academy.visual-asset-pantry-index.json
```

H5.86 reviewed that pantry index and accepted it as the Tier 1.5 visual integration planning source of truth.

H5.87 planned how manifests and asset docs should eventually be organized:

```text
manifests/academy.manifest-and-docs-organization-plan.json
```

H5.88 adds the next layer:

```text
pantry index
+ organized manifest/docs plan
= tool-suite discovery plan
```

## Existing Tool / Prototype Findings

Existing repo evidence includes several flipbook-style HTML viewers:

```text
assets/academy/evidence/h5-14b-dummy-flipbook/platformer-training-dummy-enemy-flipbook.html
assets/academy/evidence/h5-14c-dummy-flipbook/platformer-training-dummy-enemy-flipbook.html
assets/academy/evidence/h5-14d-dummy-flipbook/platformer-training-dummy-enemy-flipbook.html
assets/academy/evidence/h5-15-goblin-flipbook/platformer-goblin-player-flipbook.html
assets/academy/evidence/topdown-slime-flipbook/topdown-slime-player-flipbook.html
assets/academy/evidence/topdown-slime-v2-action/topdown-slime-v2-action-flipbook.html
assets/academy/evidence/topdown-slime-v2-idle-move/topdown-slime-v2-idle-move-flipbook.html
assets/academy/evidence/topdown-soldier-flipbook/topdown-soldier-enemy-flipbook.html
```

These are evidence prototypes, not a canonical app surface.

User-held Downloads prototypes also exist:

```text
C:/Users/kryst/Downloads/sprite-box-annotator.html
C:/Users/kryst/Downloads/particle_fx_viewer (1).html
```

H5.88 inspected their identity only. They were not copied, moved, modified, ingested, or made canonical. Future lanes can decide whether to ingest, archive, or rebuild them as repo-native tools.

## Planned Tool Surfaces

### Flipbook Viewer

Purpose:

- preview animation sheets;
- load available animation states from manifests;
- support characters, enemies, pets, slimes, soldiers, training dummies, and future animation sheets;
- show frame count, frame rects, preview FPS, loop hints, and animation names;
- avoid implying runtime approval.

Expected data:

```text
source image path
animation id / label
frame rects
frame count
preview FPS
loop hint
state/direction tags if available
reviewStatus
runtimeEligibility
```

### Sticker / Picture Book Viewer

Purpose:

- preview static props, backgrounds, UI tokens, terrain tiles, floor tilesheets, walls, objects, card frames, and scene anchors;
- support asset sheet mode, individual region mode, background/scene-anchor mode, topdown mode, platformer mode, and UI/card mode;
- preserve denied, deferred, historical, visual-only, and future-pantry-only status.

Expected data:

```text
source image path
derived image path if present
region index/id/label/category
sourceRect
derivedRect if present
cleanupStatus
pipelineUse
reviewStatus
runtimeEligibility
denied/deferred reason
game/domain
tool mode tags
```

### Particle FX Viewer

Purpose:

- preview particle presets and adjustable visual effects;
- support future lightning, glow, wind, projectile, portal, flame, sparkle, smoke, and magic effects;
- become the preferred replacement path for many deferred soft FX sprites.

Expected data:

```text
preset id
effect family
adjustable parameters
preview defaults
asset dependencies
runtimeBehavior: none-approved
reviewStatus
runtimeEligibility
```

Particle presets are visual presets only until a later runtime lane approves behavior.

### Future Audio / Sound Pipeline Viewer

Audio is future Tier 2.5, not part of Tier 1.5 visual implementation.

Future scope may include:

- UI blips;
- hit sounds;
- ambient loops;
- music;
- stingers;
- volume normalization;
- license/source metadata;
- preview playback;
- runtime trigger planning.

H5.88 does not implement audio.

## Discovery Model

The tools should discover assets from:

```text
manifests/academy.visual-asset-pantry-index.json
```

and secondarily from organized manifest categories planned in:

```text
manifests/academy.manifest-and-docs-organization-plan.json
```

Tool law:

```text
Registry first.
Manifest second.
Image path third.
Runtime approval never inferred.
```

Tools should visibly show:

- `pipelineUse`;
- `reviewStatus`;
- `runtimeEligibility`;
- accepted / denied / deferred / historical / future-pantry-only state;
- cleanup or exclusion notes where present.

## Manifest Contracts

### Flipbook contract

Flipbook data comes from animation manifests such as:

```text
manifests/academy.platformer-goblin-player.animations.json
manifests/academy.platformer-training-dummy-enemy.animations.json
manifests/academy.topdown-slime-v2-idle-move.animations.json
manifests/academy.topdown-soldier-enemy.animations.json
```

The viewer must understand frame rects and animation groups, but it must not approve runtime animation cycles.

### Sticker / Picture Book contract

Sticker/Picture Book data comes from region and cleanup manifests such as:

```text
manifests/academy.topdown.objects.nonfx-regenerated.cleanup-candidate.json
manifests/academy.card-goblin-duel.ui-tokens.cleanup-candidate.json
manifests/academy.potion-sorter.cleanup-candidate.json
manifests/academy.dice-duel-tavern.cleanup-candidate.json
```

The viewer must preserve reviewed, denied, deferred, and not-runtime-approved status.

### Background / scene-anchor contract

Background anchor data comes from scene-anchor manifests such as:

```text
manifests/academy.button-goblin-clicker.background.scene-anchors.json
manifests/academy.pet-campfire.background.scene-anchors.json
```

The viewer should show anchors, readability-risk zones, negative-space zones, and placement boundaries, but it must not create exact runtime coordinates.

### Particle FX contract

Particle FX will need future preset manifests. Shared FX remains:

```text
reference-only / concept-only / particle-first
```

until concrete needs produce approved true-alpha sprites or procedural presets.

## Safety Boundaries

H5.88 does not:

- build tools;
- ingest Downloads tools;
- move folders;
- reorganize manifests;
- reorganize docs;
- wire runtime;
- modify game code;
- modify PNGs;
- process images;
- modify package/lock files;
- approve collision;
- approve pathfinding;
- approve placement;
- approve tilemap behavior;
- approve animation behavior;
- approve particle behavior;
- approve audio behavior.

Visual assets remain Tier 1.5.

Audio remains future Tier 2.5.

Button Goblin Clicker remains the first later runtime visual integration candidate.

Top-Down Slime Quest remains last or near-last for runtime visual integration.

## Implementation Phases

Recommended phases:

1. **H5.88A — Tool Prototype Intake Decision**  
   Decide whether the Downloads-held Sprite Box Annotator and Particle FX Viewer should be ingested, archived as references, or rebuilt as repo-native tools.

2. **H5.88B — Registry-fed Viewer Shell Plan**  
   Plan a lightweight launcher/shell that can route to Flipbook, Sticker/Picture Book, Particle FX, and future Audio surfaces from registry entries.

3. **H5.90 — Manifest Folder Reorganization Dry Run**  
   Make manifest path discovery resilient before moving files.

4. **H5.91 — Asset Docs Reorganization Dry Run**  
   Dry-run docs movement and link/reference updates.

5. **H6.0 — Button Goblin Clicker Runtime Visual Integration Plan**  
   Plan the first runtime visual integration.

## Open Questions

- Should the Downloads-held Sprite Box Annotator and Particle FX Viewer be ingested as canonical repo prototypes, archived as references, or regenerated as cleaner repo-native tools?
- Should the unified tool surface be a single HTML launcher, a Vite/React page, or script-generated static evidence?
- Should tool discovery read the pantry index directly, or should a smaller generated tool registry be emitted from the pantry index?
- Where should future implementation live: `scripts/asset-pipeline/`, a future `tools/glyphforge/`, `docs/assets/tooling/`, or an app surface?
- How much existing flipbook evidence code should be reused?

## Recommended Next Lane

Recommended next lane:

```text
H5.88A — Tool Prototype Intake Decision
```

Alternative if Kryssie wants to keep shelving first:

```text
H5.90 — Manifest Folder Reorganization Dry Run
```

Tiny law:

```text
H5.87 mapped the shelves.
H5.88 maps the tool bench.
Runtime goblins still wait outside with permission slips.
```
