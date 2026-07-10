# Tiny Goblin Academy — Engine and Tooling Ladder Doctrine

## Purpose

This note preserves a set of future-facing doctrines from the Tiny Goblin Academy asset/tooling discussions.

Tiny Goblin Academy is no longer only teaching how to make small games. It is becoming a training ground for transferable game-development systems: asset intake, scene assembly, manifests, validation, tiny creative tools, runtime boundaries, and engine-independent design habits.

Core doctrine:

```text
Tiny Goblin Academy teaches how to build transferable game-development systems without marrying one engine too early.
```

## 1. Phaser As Training Yard

Phaser is the training yard, not the castle.

Do not abandon Phaser because it is "only 2D." Extract the transferable lessons first.

Phaser still teaches:

- game loop;
- input;
- state;
- collision;
- camera;
- animation and state-symbol handling;
- asset loading;
- audio;
- save/load;
- UI boundaries;
- level data;
- tooling;
- packaging;
- playtest evidence.

Those lessons transfer to Unity, Godot, Unreal, Three.js, and future Aether/DWOS work.

## 2. Third-Party Asset Intake

Third-party assets do not replace the asset pipeline.

They become new ore for the pipeline.

```text
Free assets are not "drop into game and use."
Free assets are "intake → license check → classify → normalize → manifest → validate → promote."
```

Downloaded assets are not academy assets until their license, source, intended use, and pipeline status are recorded.

Future lane:

```text
third-party asset intake / quarantine
```

This lane should track:

- source URL or origin;
- license;
- author/credit needs;
- allowed use;
- intended Academy use;
- original archive or source file;
- normalized copy;
- manifest status;
- validation status;
- promotion status.

License doctrine:

```text
Free download is not free rights.
```

Prefer low-friction sources first, especially CC0/public-domain style assets, and quarantine anything with unclear, personal-use-only, share-alike, GPL-for-art, or missing license terms until reviewed.

## 3. CLI-First / Micro-UI Tooling

The toolchain should be CLI-first with tiny creative UIs.

Doctrine:

```text
CLI validates truth.
Micro-UIs help humans make visual/audio decisions.
Manifests preserve the result.
Runtime consumes approved data.
```

Good TGA-style tools:

- Sticker Book → placement;
- Flipbook → animation/state preview;
- Hitbox Tuner → collision box review;
- Audio Pad → sound approval/rejection;
- Atlas Inspector → sourceRect naming;
- Scene Anchor View → placement/readability review.
- Audio Pad → sound approval/rejection.

Trap to avoid:

```text
Build a whole editor because one workflow was annoying.
```

Tiny doctrine:

```text
Build little windows, not a mall.
```

## 4. Tool Adoption By Task Lane

Do not "learn Blender" or "learn Krita" as giant blank-canvas obligations.

Learn one task lane at a time:

- crop/slice a sprite;
- place objects on a level;
- preview animation or state-symbol frames;
- normalize one sound;
- export one GLB;
- make one collision box.

Every adopted tool should have a small recipe:

```text
Tiled recipe: create one platformer test map and export JSON.
Audacity recipe: trim one sound, normalize it, export OGG.
Blender recipe: export one upright GLB and inspect it in a neutral viewer.
Unity recipe: rebuild one tiny clicker loop with one button and one state variable.
```

Tutorials are allowed to be contracts with pictures. The Academy should prefer small, repeatable recipes over open-ended "be creative in a giant editor" tasks.

## 5. Scene Assembly vs Texture Workflow

Sticker Book is not just a tool. It is scene assembly.

The One-Room Platformer Birthday Build proved a 2D scene composition pipeline:

```text
background
+ placed construction pieces
+ collision intent
+ hazards / goals / spawn
+ exported JSON
= authored playable scene
```

Future role split:

```text
Scene anchors = where things belong visually
Sticker Book = authoring / review / export surface
Movement contract = what the player can actually do
Validator = whether the layout is fair
Phaser adapter = how the scene becomes playable
```

The Sticker Book should not be the whole source of truth. It should become one layer in a smarter layout system.

## 6. Suggested External Tool Roles

Future tools should be adopted only when they become stable roles in the pipeline:

```text
Tiled = map authoring / collision and object layer export
Krita = 2D cleanup and paintover bench
Blender = 3D creation, repair, and export bench
Material Maker = procedural material learning later
Bfxr = quick SFX generation
Audacity = trim / normalize / convert / export audio
LMMS = future music loops and motifs
Godot = open-source engine literacy bridge
Unity = production engine/editor workflow
Unreal = high-end 3D/world production later
Aether = custom orchestration where normal engines cannot satisfy DWOS
```

Current adoption posture:

```text
Keep now:
  pnpm, TypeScript, Phaser, custom manifests, Playwright/Vitest, small custom tools

Add soon / lightly:
  Tiled for one export test
  Audacity for trim/normalize/export
  Bfxr or existing CLI sound generation for small SFX
  Git LFS only when asset weight demands it

Defer:
  LMMS, Material Maker, serious Blender pipelines, Unity, Unreal, full 3D asset systems
```

Git LFS should be considered before the repository becomes too asset-heavy, but it must be used intentionally because hosting/storage limits can matter.

## 7. Audio Pipeline Doctrine

Sound should be simplified brutally.

TGA does not need a full DAW workflow yet. It needs:

```text
collect or generate short SFX
→ trim
→ normalize
→ convert
→ name
→ manifest
→ preview
→ approve / reject
```

Future CLI shape:

```text
pnpm audio:normalize
pnpm audio:convert
pnpm audio:manifest
pnpm audio:validate
pnpm audio:preview
```

Future Audio Pad shape:

```text
list sounds
play / pause
volume slider
category dropdown
approve / reject / needs trim
write audio manifest JSON
```

No waveform editor, mixing suite, or music-composition requirement is needed for the first pass.

## 8. Engine Ladder

The current engine ladder:

```text
Phaser teaches game logic.
Unity/Godot teach engine/editor workflow.
Unreal teaches high-end world production.
Aether teaches what DWOS uniquely needs.
```

Do not treat any single engine as the final identity of the project.

Tiny Goblin Academy should extract portable concepts:

- asset pipeline discipline;
- manifest-first data;
- scene-anchor grammar;
- movement contracts;
- validation loops;
- playtest evidence;
- runtime boundaries;
- authoring tools;
- promotion gates.

## 9. Canonical Pose Gate For 3D Assets

Runtime controls are for intentional placement.

They are not for repairing broken asset orientation.

Doctrine:

```text
A 3D character must enter runtime upright, forward-facing, scaled, grounded, and origin-correct.
Runtime must not compensate for haunted geometry.
```

If a model needs bizarre rotation, scale, or position offsets just to stand up, it is not game-ready. It belongs in intake/quarantine until Blender/export fixes it.

The canonical pose gate should check:

- upright orientation;
- forward-facing direction;
- reasonable scale;
- grounded feet/base;
- correct origin/pivot;
- clean transform values;
- export sanity;
- runtime import sanity.

This matters for future Unity/Godot/Unreal/Aether/DWOS work.

When a positioning UI becomes an asset repair tool, the pipeline is leaking.

Correct layer split:

```text
Blender/export layer = fixes asset truth
Runtime/game layer = places valid assets intentionally
Editor/helper UI = previews placement but does not hide asset defects
```

Future 3D intake path:

```text
raw generated model
→ Blender intake
→ apply rotation/scale
→ set origin/pivot
→ align forward/up axes
→ place feet/base on ground
→ export GLB
→ inspect in viewer
→ import into game
→ runtime placement only
```

## 10. Do Not Build Every Tool By Hand

Do not build every possible tool just because the workflow exists.

Prefer:

```text
small focused tool
+ manifest output
+ validator
+ evidence preview
+ runtime adapter later
```

Avoid:

```text
giant editor
+ unclear truth source
+ fragile custom workflows
+ runtime coupling too early
```

The Academy should grow tools only where the workflow repeats and the output can be preserved in manifests.

Do not custom-build these yet:

- full level editor;
- full animation editor;
- full audio editor;
- full material editor;
- full 3D renderer;
- full physics engine;
- full asset database;
- package manager;
- visual scripting system.

Build adapters and schemas instead.

Example:

```text
Do not create a new Tiled.
Define a TGA level schema.
Import Tiled JSON.
Normalize it into TGA objects.
Feed Phaser/Godot/Unity adapters.
```

## 11. Future Doctrine Summary

The reusable system is:

```text
intake
→ classify
→ normalize
→ manifest
→ evidence
→ human review
→ promotion
→ runtime adapter
```

For scenes:

```text
background
→ scene anchors
→ placement grammar
→ authoring/review UI
→ movement or interaction contract
→ validator
→ runtime layout
```

For engines:

```text
learn the transferable lesson first
then choose the engine/tool that deserves the next layer
```

Tiny goblin verdict:

```text
The Academy is not just making tiny games.
The Academy is learning how game-making systems should remember what they know.
```
