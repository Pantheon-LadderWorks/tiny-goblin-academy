# Dungeon Key Run Patrol Tension treatment v0.1

## Status

Implemented / Human Review direction applied

Human Review selected **B — Patrol Tension** with one required refinement: saturated red scuffs were replaced by muted, non-gory worn patrol traces. The production default is `patrol-tension-adjusted-b`.

## Production authority

The treatment is a presentation adapter over the frozen Ruin Hall scene and simulation. It owns no topology, collision, movement, objective, terminal, reset, or Ledger state.

Code-native layers:

- ambient field `#070d17` at `0.18` alpha;
- radial mask cutouts for current player, enemy, key, and exit state;
- soft local light textures generated at runtime;
- muted patrol footprints and boot abrasion using `#8f7654` and `#695f50` at `0.18` alpha;
- restrained top-lintel and east-wall depth shadows.

No Kenney Light Masks or other external asset dependency was introduced.

## State rules

- key light is visible only while the key exists;
- exit emphasis changes from locked `0.16` to open `0.34` alpha;
- enemy emphasis follows the actual Thug position and disappears on defeat;
- movement remains `660 ms` and directional idle remains `1320 ms`;
- HUD, Ledger, and Help remain outside the stage treatment.

Development-only query controls:

- `?treatment=off`
- `?debug=grid,collision,patrol,anchors`

These controls do not create a player-facing laboratory panel.

## Evidence

Canonical external root:

`D:\Projects\Active\Tiny-Goblin-Academy\Evidence\level-05-dungeon-key-run`

Production packet:

`spatial-readability-production\implementation-20260801`

The packet contains private-actor and public-fallback evidence at `1920×1080` and `1024×640`, neutral and debug proofs, browser reports, and public-build validation.

## Verification result

- private evidence: 24 captures, zero page errors, zero console errors;
- fallback evidence: 8 captures, zero page errors, zero console errors;
- fallback network proof: manifest probe only, zero actor-strip requests;
- public build: zero private payload files;
- Dungeon Key tests, TypeScript, and production build pass;
- private projection remains ignored and verified;
- simulation and Ledger files were not modified.

## Accepted limitations

The treatment uses restrained generated gradients rather than authored light-mask textures. The existing Vite large-chunk warning remains unrelated debt. Typography, shared UI closure, broad VFX, Level 8, and slime work remain deferred.

During external evidence normalization, one inaccessible 55,559-byte duplicate JSON remained beneath the obsolete `future` Level 5 path because the filesystem denied read, move, ACL inspection, and deletion. Its canonical destination copy had already passed SHA-256 verification. Permission mutation was not authorized, so the residual was preserved and reported instead of forced.
