# Manifests

This folder contains draft and future source-of-truth manifests for the Tiny Goblin Academy.

Currently, it contains:
- **Academy Game Manifest** (`academy.games.json`): Powers the Hub's read-only roster.
- **Hub Icon Manifest** (`hub.icons.json`): Maps Hub game card icons to the shared icon sheet. It is separate from full asset sheet manifests and runtime manifests.

Future manifests (asset, runtime, and release manifests) are planned and will be placed here.

## Rules
- Paths must be repo-relative.
- No local absolute paths.
- No generated temp paths.
- No secrets.
- No launch/process behavior is implemented by these manifests.
