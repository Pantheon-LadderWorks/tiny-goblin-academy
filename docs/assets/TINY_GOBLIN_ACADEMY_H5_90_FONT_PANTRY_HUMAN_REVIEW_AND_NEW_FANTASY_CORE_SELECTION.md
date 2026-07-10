# Tiny Goblin Academy — H5.90 Font Pantry Human Review and New Fantasy Core Selection

## Purpose

H5.90 reviews the H5.89 font pantry inventory and records the Tiny Goblin Academy font direction.

The product decision is simple: Tiny Goblin Academy should not become “Kryssie Method fonts, but in a goblin hat.” Existing local fonts can help as support fonts, but the academy should get its own fantasy/storybook identity.

## Review Input

Primary reviewed plan:

```text
manifests/academy.font-pantry-source-inventory-plan.json
docs/assets/TINY_GOBLIN_ACADEMY_H5_89_FONT_PANTRY_SOURCE_INVENTORY_AND_INTAKE_PLAN.md
```

H5.89 found a useful local font stash, including many local OFL candidates. H5.90 narrows the role of that stash so it supports the academy instead of defining the academy.

## Human Review Decision

Review decision:

```text
passed-with-new-fantasy-core-direction
```

Accepted decisions:

- Existing local fonts are support candidates, not the main Tiny Goblin Academy identity.
- Atkinson Hyperlegible or Outfit may support readable UI and accessibility fallback.
- Fira Code or Space Mono may support debug/tooling mono.
- Ubuntu is not selected for now.
- Love Light is not selected for primary UI.
- `ROGLyonsTypeRegular3.ttf` remains do-not-ingest without license proof.
- New fantasy/storybook fonts should define the shared academy personality.

## Existing Local Font Support Decisions

Support candidates:

| Role | Candidate families | Notes |
| --- | --- | --- |
| readable UI fallback / accessibility | Atkinson Hyperlegible, Outfit | local OFL evidence found in H5.89 |
| debug / tooling mono | Fira Code, Space Mono | local OFL evidence found in H5.89 |

Not selected for primary identity:

- Atkinson Hyperlegible
- Outfit
- Fira Code
- Space Mono
- Iceberg
- Iceland
- Love Light
- Orbitron
- Rajdhani
- Space Grotesk
- Ubuntu

These may still be useful later, but H5.90 does not make them the academy’s main handwriting.

## New Fantasy Candidate Set

Shared / Academy identity candidates:

- Cinzel Decorative
- Cinzel
- Caudex
- Alegreya

Fantasy / magic / dungeon candidates:

- Uncial Antiqua
- MedievalSharp
- Almendra
- Almendra SC
- Macondo
- Metamorphous
- Fondamento
- Cormorant Garamond
- Grenze Gotisch
- Eagle Lake

Cozy / farm / pet candidates:

- Merienda
- Alegreya

These are candidate names only. Future intake must capture source and license evidence before binaries are copied into the repo.

## Selected Shared Core Roles

Recommended shared core direction:

| Role | Selection |
| --- | --- |
| sharedDisplay | Cinzel Decorative or Cinzel |
| sharedReadableFantasyUiBody | Caudex or Alegreya |
| sharedReadableAccessibilityFallback | Atkinson Hyperlegible or Outfit |
| sharedMonoDebug | Fira Code or Space Mono |

The intended pattern is:

```text
fantasy display
+ readable storybook body/UI
+ support fallback for accessibility
+ mono/debug font for tools
```

That gives Tiny Goblin Academy personality without making every button a decorative spell scroll.

## Game Flavor Candidate Direction

Draft flavor mapping:

| Game / domain | Candidate direction |
| --- | --- |
| Button Goblin Clicker | Cinzel + readable UI fallback; no heavy font needed yet |
| Dice Duel Tavern | Cinzel / Fondamento |
| Card Goblin Duel | Cormorant Garamond / Almendra SC / Caudex |
| Potion Sorter | Macondo / Almendra / Caudex |
| Tiny Farm Day | Alegreya / Merienda |
| Pet Campfire | Merienda / Alegreya |
| Dungeon Platformer | MedievalSharp / Metamorphous |
| Top-Down Slime Quest | MedievalSharp / Uncial Antiqua / Metamorphous |

This is visual identity planning only. It does not approve runtime font loading.

## Do-Not-Use / Do-Not-Ingest Decisions

`ROGLyonsTypeRegular3.ttf` remains:

```text
do-not-ingest
```

Reason: no nearby license proof was found during H5.89.

Ubuntu remains:

```text
not-selected-for-now
```

Reason: it has a local `UFL.txt`, but it does not currently fit the desired Tiny Goblin Academy personality direction.

Love Light remains:

```text
decorative-only-if-ever-used
```

Reason: too decorative for primary UI.

## License / Source Boundary

The new fantasy candidates need future source and license capture before intake.

No remote fonts were fetched in H5.90. No Google Fonts CSS was downloaded. No font binaries were copied. No `assets/academy/fonts/` folder was created.

The future font pantry can be broad, but the runtime font set should stay tiny.

## Tool Lane Boundary

The GlyphForge tool lane remains paused after H5.88E.

Future tool-lane return point:

```text
H5.88F — GlyphForge Region Browser Image Preview Plan
```

H5.90 does not continue tool implementation.

## Runtime Boundary

H5.90 does not:

- wire fonts into runtime;
- modify game code;
- modify package or lock files;
- install dependencies;
- copy font binaries;
- modify PNGs/images;
- modify tool implementation files;
- reorganize docs or manifests folders;
- runtime-approve any font.

## Next Priority After Fonts

After the font lane, the next priority is planning the shelf cleanup:

```text
H5.91 — Manifest Folder Reorganization Dry Run
H5.92 — Asset Docs Reorganization Dry Run
H5.93 — Stale Overview Docs Correction
```

## Recommended Next Step

Recommended next lane:

```text
H5.91 — Manifest Folder Reorganization Dry Run
```

Future font-specific lane after organization planning:

```text
Font binary intake + preview evidence for the selected core set
```
