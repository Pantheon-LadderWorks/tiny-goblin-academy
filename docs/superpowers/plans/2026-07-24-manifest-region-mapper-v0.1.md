# Manifest Region Mapper v0.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a small browser-only GlyphForge prototype that adjusts existing manifest rectangles against an image and exports the same manifest schema.

**Architecture:** Keep schema discovery and coordinate conversion in a dependency-free UMD core that runs in Node tests and a browser. The HTML page owns only file loading, SVG interaction, selection, zoom, keyboard input, preview, and download behavior. The primary manifest is cloned and mutated only at the selected rectangle path; an optional source-region manifest resolves surface crops but is never exported or modified.

**Tech Stack:** Plain HTML, CSS, JavaScript, SVG, Node.js built-in test runner; no package or lockfile changes.

## Global Constraints

- Place the prototype under `tools/glyphforge/prototypes/` beside existing GlyphForge references.
- Preserve the loaded manifest schema, IDs, labels, review fields, notes, and unrelated data.
- Support source-pixel `sourceRect`, `derivedRect`, `rect`, and `bounds` objects plus surface-relative `relativeRect` objects.
- Support an optional source-region manifest for resolving `surfaces[].sourceRegionId` into an isolated crop.
- Do not edit images, generate derived assets, alter pipeline authority, or wire the prototype into game runtime.
- Do not add frameworks, dependencies, package changes, server requirements, polygons, animation editing, or registry integration.
- Leave all mapper paths unstaged for Human Review and do not touch the existing H6.21B dirty paths.

---

### Task 1: Schema-preserving manifest adapter

**Files:**
- Create: `tools/glyphforge/prototypes/manifest-region-mapper-core.js`
- Test: `tools/glyphforge/prototypes/tests/manifest-region-mapper-core.test.cjs`

**Interfaces:**
- Consumes: parsed primary manifest, optional parsed source manifest, loaded image dimensions.
- Produces: `createSession()`, `updateItemRect()`, `serializeManifest()`, and validation helpers via `RegionMapperCore`.

- [ ] Write focused tests for direct pixel rectangles, nested animation frames, functional surface slots, optional crop resolution, unrelated-field preservation, and bounds warnings.
- [ ] Run `node --test tools/glyphforge/prototypes/tests/manifest-region-mapper-core.test.cjs` and verify failure because the core module does not exist.
- [ ] Implement the smallest adapter that makes each test pass without adding a mapper-specific export schema.
- [ ] Rerun the focused test and require zero failures.

### Task 2: Browser editor

**Files:**
- Create: `tools/glyphforge/prototypes/manifest-region-mapper-prototype-v0.1.html`
- Modify: `tools/glyphforge/prototypes/README.md`

**Interfaces:**
- Consumes: `window.RegionMapperCore` from Task 1.
- Produces: a local-file page that imports image/manifest files and downloads the corrected primary manifest.

- [ ] Build load controls for the image, primary manifest, and optional source-region manifest.
- [ ] Render the selected scope with an SVG image and rectangles using the source image's natural coordinate system.
- [ ] Add surface/region selectors, visibility and lock toggles, eight resize handles, drag movement, numeric x/y/w/h fields, pixel and normalized readouts, and selected-region crop preview.
- [ ] Add fit/100%/zoom controls, pointer pan, arrow-key one-pixel nudging, Shift+arrow ten-pixel nudging, warnings, and same-schema JSON download.
- [ ] Disable editing and export until the required inputs and resolvable rectangles exist.

### Task 3: Browser proof and repository validation

**Files:**
- No production files beyond Tasks 1-2.

**Interfaces:**
- Consumes: the actual Card Goblin Duel functional-slot manifest, its source-region manifest, and the governed card-frame image.
- Produces: browser interaction evidence and fresh command output proving behavior and repository hygiene.

- [ ] Launch a temporary local static server without creating an evidence lane or changing package files.
- [ ] Browser-load the Card Goblin image and both manifests, select a banner surface, move and resize a slot, and verify the UI updates pixel and normalized coordinates.
- [ ] Export the manifest and prove only the chosen rectangle changed while unrelated manifest fields remain byte-equivalent after JSON parsing.
- [ ] Verify lock/visibility, zoom, keyboard nudge, bounds warning, and selected crop preview.
- [ ] Capture temporary review screenshots outside tracked evidence, inspect them, then stop the exact local server.
- [ ] Run focused tests, `pnpm validate:academy-manifest`, text/JSON hygiene, `git diff --check`, and exact path/status audits.
- [ ] Leave all new/modified mapper paths unstaged for Human Review; do not commit or push.

## Self-review

- Spec coverage: existing-manifest adjustment, sheet pixels, surface-relative slots, crop resolution, schema preservation, controls, preview, validation, export, and prototype placement are assigned.
- Placeholder scan: no TBD/TODO/implement-later steps remain.
- Type consistency: the browser consumes the same `RegionMapperCore` API exercised by Node tests.
