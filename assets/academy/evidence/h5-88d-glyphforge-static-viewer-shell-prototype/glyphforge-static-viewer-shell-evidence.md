# H5.88D GlyphForge Static Viewer Shell Prototype Evidence

## Evidence type

Written verification evidence.

Screenshots were intentionally skipped because H5.88D avoids adding browser automation dependencies. The static shell supports manual browser review through the bundled registry or file picker.

## Registry load path

Generated registry:

```text
tools/glyphforge/registry/glyphforge-visual-registry.v0.1.json
```

Generator:

```text
node tools/glyphforge/registry/generate-glyphforge-visual-registry.mjs
```

Generation result:

```text
24 registry entries
```

The static shell attempts to load the registry from:

```text
../registry/glyphforge-visual-registry.v0.1.json
```

If browser `file://` restrictions block fetch, the file picker path is documented in the viewer README.

## Region Browser proof

Registry entries routed to:

```text
region-asset-browser
```

The Region / Asset Browser summary mode displays:

- display name;
- asset family;
- game/domain;
- manifest path;
- source path;
- derived path;
- region/count metadata;
- denied/deferred regions;
- warnings/exclusions;
- runtime eligibility.

## Scene-anchor/background route proof

Scene-anchor/background entries route to:

```text
scene-composition-editor
```

H5.88D implements this as a placeholder route panel that shows entry metadata, counts, paths, and runtime placement boundary warnings.

## Animation route proof

Animation entries route to:

```text
flipbook-viewer
```

H5.88D implements this as a placeholder route panel that shows entry metadata, counts, paths, and runtime animation boundary warnings.

## Runtime-boundary/status strip proof

Every selected entry displays:

```text
pipelineUse
reviewStatus
runtimeEligibility
Runtime approval is never inferred.
```

## Non-goals confirmed

- No runtime wiring.
- No game code changes.
- No image processing.
- No PNG/source/derived/evidence image mutation.
- No package or lock file changes.
- No dependency installation.
- No manifest/docs folder reorganization.
