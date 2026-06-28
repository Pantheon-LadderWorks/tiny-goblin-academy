# Repository Strategy

## Current Strategy: Private Monorepo
One private monorepo is recommended and currently used for the entire AI Game Studio Ladder (`ai-game-studio-ladder`). 

Do not split every game into its own repo yet.

## Rationale (Private-First)
The next planned phase includes a Tiny Goblin Academy hub/launcher that discovers, launches, and packages the games together. Keeping the games, docs, templates, evidence, and future hub in one repo preserves the ecosystem and avoids submodule/repo coordination overhead.

## Future Architecture
The hub/launcher belongs in this repo at first. Future Itch/Butler deployment can be added later under scripts or hub docs.

Proposed future structure:
- `hub/` (Tauri-based launcher)
- `scripts/` (Build/deploy/butler helpers)
- `builds/` or `dist/` (Ignored by git)

## Graduation
Individual games can graduate to standalone repos only after explicit release/maintenance approval.
