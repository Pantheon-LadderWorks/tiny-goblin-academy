# Manifests

This folder contains draft and future source-of-truth manifests for Tiny Goblin Academy.

H5.91 reorganized the manifest shelf from a flat root pile into categorized folders. The root should now contain this `README.md` plus category folders only.

## Current Shelf Map

```text
manifests/
  README.md
  academy/
    core/
    hub/
    shared/
    creatures/
    games/
    topdown/
    visual-pantry/
    fonts/
    tooling/
  boot/
```

## Key Active Manifests

- Academy game roster: `manifests/academy/core/academy.games.json`
- Hub icon manifest: `manifests/academy/hub/hub.icons.json`
- Hub icon source regions: `manifests/academy/hub/hub.icon-regions.json`
- Visual asset pantry index: `manifests/academy/visual-pantry/academy.visual-asset-pantry-index.json`
- Font pantry planning: `manifests/academy/fonts/`
- GlyphForge/tooling plans: `manifests/academy/tooling/`

## Rules

- Paths must be repo-relative.
- No local absolute paths.
- No generated temp paths.
- No secrets.
- No launch/process behavior is implemented by these manifests.
- Runtime approval is never inferred from manifest presence.
- Historical lane reports may mention old flat paths; active machine-readable references should use the nested manifest paths.

## Validation

Use the standard validation path:

```text
node scripts/asset-pipeline/cli.mjs validate-provenance
node scripts/asset-pipeline/smoke-check.mjs
node scripts/asset-pipeline/cli.mjs validate
```
