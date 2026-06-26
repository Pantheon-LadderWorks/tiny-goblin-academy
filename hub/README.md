# Tiny Goblin Academy Hub

This is the read-only dashboard scaffold for the Tiny Goblin Academy hub.

## Status
Minimal Read-Only Scaffold.
*Explicit Note*: There is no game launching, process management, or Tauri behavior implemented yet.

## Commands

Run the following inside the `hub/` directory:

```bash
pnpm install
pnpm build
pnpm dev
```

To validate the Academy Game Manifest, run the following from the repo root:
```bash
node scripts/validate-academy-manifest.mjs
```

*Note: `pnpm dev` only runs the Hub UI in your browser. It does not run the individual games.*
