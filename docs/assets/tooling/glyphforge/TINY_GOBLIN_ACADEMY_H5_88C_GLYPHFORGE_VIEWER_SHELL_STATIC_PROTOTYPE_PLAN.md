# Tiny Goblin Academy — H5.88C GlyphForge Viewer Shell Static Prototype Plan

## Purpose

H5.88C creates the concrete implementation plan for the first GlyphForge unified viewer shell static prototype.

This lane plans the first build. It does not build the shell, implement UI, edit prototype HTML files, wire runtime, modify game code, install dependencies, process images, modify PNGs, or reorganize docs/manifests.

## Context

```text
H5.88  — Visual Tool Suite Registry Plan
H5.88A — Visual Tool Prototype Intake and Maturity Comparison
H5.88A2 — Level 8 Sticker Book Editor Prototype Addendum
H5.88B — GlyphForge Unified Viewer Shell Design
H5.88C — Static Prototype Plan
```

H5.88B designed the workbench. H5.88C writes the build cut list.

## Working Name

```text
GlyphForge Visual Workbench — Static Prototype v0.1
```

## Proposed Future Location

```text
tools/glyphforge/viewer-shell-static/
```

## Proposed Future Files

```text
tools/glyphforge/viewer-shell-static/index.html
tools/glyphforge/viewer-shell-static/styles.css
tools/glyphforge/viewer-shell-static/app.js
tools/glyphforge/viewer-shell-static/README.md
tools/glyphforge/registry/glyphforge-visual-registry.v0.1.json
```

These files are planned only. H5.88C does not create the full shell structure.

## Source of Truth

The pantry index remains the source of truth:

```text
manifests/academy.visual-asset-pantry-index.json
```

The future GlyphForge registry should be generated from the pantry index and supporting manifests. It should not be manually invented.

Suggested future generated registry path:

```text
tools/glyphforge/registry/glyphforge-visual-registry.v0.1.json
```

## Registry Entry Shape

Future entries should include:

```text
entryId
displayName
gameSlug or domain
assetFamily
toolMode
manifestPath
sourcePath
derivedPath
evidencePaths
status
reviewStatus
pipelineUse
runtimeEligibility
counts
warnings
deniedRegions
deferredRegions
futurePantryOnly
historical
notes
```

The generated registry must carry review and runtime-boundary metadata forward. It must never upgrade runtime approval.

## Tool Mode Routing

```text
animation manifests -> flipbook-viewer
region and cleanup manifests -> region-asset-browser
scene-anchor/background manifests -> scene-composition-editor
particle preset manifests -> particle-fx-viewer
future audio manifests -> audio-viewer-placeholder
```

## Planned UI Regions

```text
top header / title
left asset group list
filter/search bar
status/runtime boundary strip
main viewer panel
details/metadata side panel
warnings/exclusions panel
raw manifest preview / JSON preview panel
mode switcher tabs
evidence/source/derived path panel
```

The status/runtime boundary strip should stay visible for every selected entry.

## Navigation Flow

1. Open the static `index.html` locally/offline.
2. Load generated registry JSON.
3. Show dashboard summary by tool mode, game/domain, review status, runtime eligibility, warnings, and counts.
4. Select or filter asset entries.
5. Route the selected entry to the correct mode panel.
6. Display manifest/source/derived/evidence paths and runtime boundary status.
7. Keep editing/playback/authoring out of scope for the first build unless later approved.

## First Build Scope

The first actual static prototype should support:

- loading a local generated registry JSON;
- listing asset entries;
- filtering by game/domain/toolMode/reviewStatus/runtimeEligibility;
- opening an entry;
- showing manifest/source/derived/evidence paths;
- showing status/runtime warnings;
- showing region counts;
- showing accepted/denied/deferred counts;
- showing animation group counts;
- showing anchor counts;
- placeholder panels for all modes;
- a first useful Region / Asset Browser summary mode.

## Recommended First Useful Mode

```text
Region / Asset Browser / Sticker Picture Book Mode
```

Reason:

This mode immediately helps browse pantry assets, cleanup outputs, accepted/denied/deferred regions, and game asset sheets before runtime wiring.

It also keeps Scene Composition distinct from Region Browser.

```text
Region Browser = what is this asset / box?
Scene Composition = where does this asset / entity go?
```

## Explicitly Out of Scope for First Build

```text
full bbox editing
full drag placement editing
full animation playback
full particle FX authoring
audio playback
runtime wiring
modifying manifests
writing back to source assets
approving runtime placement
approving collision/pathfinding/tilemap behavior
package/dependency installs
prototype HTML edits
game/runtime edits
```

## Evidence Plan for H5.88D

Future H5.88D should produce:

```text
screenshot of dashboard loaded with registry
screenshot of Region Browser entry
screenshot of scene-anchor/background entry
screenshot of animation entry placeholder
screenshot of runtime-boundary/status strip
optional exported/generated registry JSON
```

## Validation Plan for Future Build

H5.88D should validate:

- generated registry JSON parses;
- every entry has required routing fields;
- toolMode values are known;
- runtimeEligibility is never upgraded;
- source/derived/evidence paths are visible but not mutated;
- no game/runtime/package/lock/image files change unless explicitly scoped.

## Runtime and Asset Safety Boundaries

H5.88C does not approve:

- runtime placement;
- runtime visual integration;
- tilemap use;
- collision;
- pathfinding;
- walkability;
- hazard behavior;
- water behavior;
- slime behavior;
- portal behavior;
- trigger behavior;
- game wiring.

Runtime approval is never inferred from visual names, status labels, scene anchors, placement JSON, or animation labels.

## Tier and Runtime Order Doctrine

Button Goblin Clicker remains the first later runtime visual integration candidate.

Top-Down Slime Quest remains last or near-last because animation, map behavior, tile behavior, placement, collision, pathfinding, and map rules remain deferred.

Audio remains future Tier 2.5.

## Files Intentionally Updated

```text
CHANGELOG.md
docs/assets/TINY_GOBLIN_ACADEMY_ASSET_SYSTEM_PLAN.md
docs/assets/TINY_GOBLIN_ACADEMY_H5_88C_GLYPHFORGE_VIEWER_SHELL_STATIC_PROTOTYPE_PLAN.md
manifests/academy.glyphforge-static-prototype-plan.json
```

## Recommended Next Lane

```text
H5.88D — GlyphForge Static Viewer Shell Prototype
```

Alternative pause lane:

```text
H5.89 — Font Pantry Intake
```

Tiny verdict:

```text
H5.88B designed the goblin workbench.
H5.88C writes the cut list before anyone starts sawing wood.
```
