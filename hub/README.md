# Tiny Goblin Academy Hub

This is the read-only dashboard catalog for the Tiny Goblin Academy Tier 1.

## Status
Minimal Read-Only Scaffold.
*Explicit Note*: There is no game launching, installer behavior, Butler integration, or Tauri shell implemented yet.

## Architecture Notes
* Game dependencies are managed by the root pnpm workspace. Do not run `npm install` inside the individual games.

## Boot Experience Notes
* Hub has an existing boot screen (hub-entry only).
* Game launch boot is future runtime work.
* In-game preload scenes are future curriculum/game refinement work.
* Glyphforge boot splash concept exists as a reference asset, not final trademark-cleared branding.

## Commands

Run the following inside the repo root:

```bash
# Install workspace dependencies
pnpm install

# Build the Hub
pnpm --filter tiny-goblin-academy-hub build
```

To run the Hub locally in dev mode:
```bash
# from the repo root
pnpm --filter tiny-goblin-academy-hub dev
```
*Note: `pnpm dev` only runs the Hub UI in your browser. It does not run the individual games.*

## Validation
To validate the Academy Game Manifest:
```bash
node scripts/validate-academy-manifest.mjs
```

To validate the Hub Icon Manifest:
```bash
node scripts/validate-hub-icons.mjs
```
