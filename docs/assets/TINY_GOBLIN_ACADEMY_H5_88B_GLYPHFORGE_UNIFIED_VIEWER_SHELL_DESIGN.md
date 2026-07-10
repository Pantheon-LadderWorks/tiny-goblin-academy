# Tiny Goblin Academy — H5.88B GlyphForge Unified Viewer Shell Design

## Purpose

H5.88B designs the unified GlyphForge Visual Workbench shell.

This is shell/design planning only. No tool implementation happens in this lane.

The shell’s job is to route reviewed pantry and manifest records into the right visual bench:

```text
Flipbook Viewer
Region / Asset Browser
Scene Composition / Layout Editor
Particle FX Viewer
Future Audio Viewer placeholder
```

## Relationship To H5.88 / H5.88A / H5.88A2

H5.88 created the visual tool suite registry plan:

```text
manifests/academy.visual-tool-suite-registry-plan.json
```

H5.88A compared the visual tool prototypes:

```text
manifests/academy.visual-tool-prototype-intake-comparison.json
```

H5.88A2 added the missing Level 8 Sticker Book Editor prototype as a scene-composition / layout-export reference.

H5.88B turns those findings into a shell design.

## Primary Design Correction

The Sticker / Picture Book surface should not be one vague tool. It needs two related but distinct modes:

| Mode | Question | Prototype source |
| --- | --- | --- |
| Region / Asset Browser | What is the box around this asset? | Sprite Box Annotator |
| Scene Composition / Layout Editor | Where does this asset/entity go in the scene? | Level 8 Sticker Book Editor |

That split matters because sourceRect review and scene layout are different jobs.

## Preserved Prototype Sources

Known preserved prototypes:

```text
tools/glyphforge/prototypes/sprite-box-annotator-prototype-v0.1.html
tools/glyphforge/prototypes/particle-fx-viewer-prototype-v0.1.html
tools/glyphforge/prototypes/level-8-sticker-book-editor-prototype-v0.1.html
```

Known repo-local flipbook evidence prototypes:

```text
assets/academy/evidence/**/**flipbook*.html
```

These prototypes remain reference material. They are not canonical tools and were not modified in H5.88B.

## Shell Modes

### 1. Dashboard / Launcher Mode

Question:

```text
Which goblin bench should this asset go to?
```

Responsibilities:

- list asset groups from the pantry index;
- filter by game/domain;
- filter by tool target;
- show source, derived, evidence, and manifest paths;
- show `pipelineUse`, `reviewStatus`, and `runtimeEligibility`;
- route the selected manifest into the right viewer mode.

### 2. Flipbook Viewer Mode

Question:

```text
How does it move?
```

Supports:

- source image;
- derived image if present;
- animation groups;
- frame rects;
- frame count;
- FPS / preview FPS;
- loop hint;
- state/action labels;
- review status;
- runtime eligibility.

This mode previews animation candidates only. It does not approve animation cycles, timing, pivots, hitboxes, hurtboxes, or runtime behavior.

### 3. Region / Asset Browser Mode

Question:

```text
What is the box around this asset?
```

Supports:

- source image;
- derived image if present;
- region index/id/label/category;
- sourceRect;
- derivedRect;
- cleanupStatus;
- accepted/denied/deferred status;
- notes, risk, and polish notes;
- `pipelineUse`;
- `reviewStatus`;
- `runtimeEligibility`.

This is the natural evolution of the Sprite Box Annotator into a registry-fed asset browser / region review surface.

### 4. Scene Composition / Layout Editor Mode

Question:

```text
Where does this asset/entity go in the scene?
```

Supports:

- background source image;
- scene anchors;
- safe zones / negative-space zones;
- readability-risk zones;
- palette of selectable assets from pantry/manifests;
- placed entities with `x/y/w/h`;
- optional snap grid;
- import/export JSON;
- layers or entity groups;
- `runtimePlacementApproval: none` by default.

The Level 8 Sticker Book Editor’s key value is layout JSON export with board-pixel `x/y/w/h` records. H5.88B preserves that as a future design input, not runtime approval.

### 5. Particle FX Viewer Mode

Question:

```text
What visual effect can we conjure?
```

Supports:

- preset id;
- effect family;
- adjustable parameters;
- preview defaults;
- emitter counts;
- canvas interaction / click casting;
- `runtimeBehavior: none-approved` by default.

This mode is the future safe path for particle-first FX such as flame, smoke, glow, portal, sparkles, wind, lightning, and magic.

### 6. Future Audio Viewer Placeholder Mode

Question:

```text
What sound belongs here later?
```

Future Tier 2.5 support may include:

- sound id;
- category;
- source/license metadata;
- preview playback;
- volume normalization metadata;
- `runtimeTriggerApproval: none` by default.

Audio remains Tier 2.5 and is not implemented now.

## Navigation Model

The shell should:

- list asset groups from the pantry index;
- filter by game/domain;
- filter by tool target;
- open a manifest in the appropriate mode;
- show source/derived/evidence paths;
- show warnings and runtime boundaries;
- route animation manifests to Flipbook;
- route region/cleanup manifests to Region Browser;
- route scene-anchor/background manifests to Scene Composition;
- route particle presets to Particle FX Viewer later;
- keep future Audio visible as a placeholder, not an implementation.

## Registry Discovery Model

Discovery law:

```text
Registry first.
Manifest second.
Image path third.
Runtime approval never inferred.
```

Primary registry:

```text
manifests/academy.visual-asset-pantry-index.json
```

Supporting plans:

```text
manifests/academy.visual-tool-suite-registry-plan.json
manifests/academy.visual-tool-prototype-intake-comparison.json
manifests/academy.manifest-and-docs-organization-plan.json
```

The shell should not start by scanning random folders. It should discover through pantry entries and manifest records.

## Shared Data Contract

Every mode should understand:

```text
manifestPath
domain
operationalType
pipelineUse
reviewStatus
runtimeEligibility
sourcePath
derivedPath when present
evidencePaths when present
statusWarnings
humanReviewBoundary
```

Every mode must avoid inferring:

```text
runtime approval
placement approval
collision approval
pathfinding approval
tilemap approval
animation cycle approval
particle behavior approval
audio trigger approval
```

## Prototype Feature Sources

Reusable ideas:

- Flipbooks: canvas playback, FPS slider, play/pause, animation buttons, frame-rect rendering.
- Sprite Box Annotator: bbox editing, snap grid, zoom/fit, labels, status select, notes, coordinate fields, JSON copy/import.
- Level 8 Sticker Book Editor: entity palette, board placement, drag + snap grid, delete/backspace, live layout JSON, copy-to-clipboard, board-pixel `x/y/w/h`.
- Particle FX Viewer: canvas FX preview, effect selector, click/touch casting, counters, recipe-like definitions, generic emitter pattern.

## Safety Boundaries

H5.88B does not:

- build the tool suite;
- implement UI;
- wire runtime;
- modify game code;
- modify package/lock files;
- install dependencies;
- process images;
- modify PNGs;
- reorganize manifests/docs folders;
- move existing prototypes;
- convert prototypes into canonical implementations.

Runtime placement remains unapproved.

Button Goblin Clicker remains the first later runtime visual integration candidate.

Top-Down Slime Quest remains last or near-last for runtime visual integration.

Audio remains Tier 2.5.

## First Implementation Recommendation

Recommended next implementation-planning lane:

```text
H5.88C — GlyphForge Viewer Shell Static Prototype Plan
```

If choosing a first tool mode to implement after planning, the most useful first build is probably:

```text
GlyphForge Region Asset Browser / Sticker Picture Book Mode
```

Reason: it can immediately browse the visual pantry, cleanup outputs, denied/deferred regions, and game asset sheets before runtime wiring starts.

## Open Questions

- Should H5.88C plan a static shell prototype before any implementation?
- Should Region Asset Browser be the first implemented mode?
- Should the shell be single-file/offline HTML first, or a repo app surface later?
- Should draft layout JSON from Scene Composition use board pixels, anchor-relative hints, or both?
- Should the shell consume the pantry index directly or consume a generated tool-focused registry?
- Where should canonical tool implementation live after prototypes?

## Recommended Next Lane

Recommended:

```text
H5.88C — GlyphForge Viewer Shell Static Prototype Plan
```

Alternative if Kryssie wants to keep shelf migration moving first:

```text
H5.90 — Manifest Folder Reorganization Dry Run
```

Tiny tool law:

```text
Sprite Box Annotator asks: what is this asset?
Sticker Book Editor asks: where does it go?
Flipbook asks: how does it move?
Particle Viewer asks: what visual effect can we conjure?
GlyphForge shell asks: which goblin bench do I send this asset to?
```
