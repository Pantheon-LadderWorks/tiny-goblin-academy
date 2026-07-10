# Tiny Goblin Academy — H5.89 Font Pantry Source Inventory and Intake Plan

## Purpose

H5.89 pauses the GlyphForge tool lane and opens a font pantry planning lane for Tiny Goblin Academy.

Fonts are visual-adjacent Tier 1.5 support assets. They affect identity, readability, debug/tooling review, game flavor, and future local/offline packaging, but they are not runtime game behavior. This pass creates an inventory and intake plan only.

## Relationship To H5.88D / H5.88E

H5.88D built the first static/offline GlyphForge Visual Workbench prototype. H5.88E recorded the human/product review pass for that prototype.

The tool lane is paused after H5.88E. The documented tool-lane return point remains:

```text
H5.88F — GlyphForge Region Browser Image Preview Plan
```

H5.89 does not continue tool implementation. It records the font pantry work needed before later visual/runtime polish.

## Font Pantry Doctrine

Fonts should be treated like visual support assets:

- they need source provenance;
- they need license status;
- they need usage roles;
- they need future preview evidence;
- they need runtime boundaries.

A font file is not accepted into Tiny Goblin Academy just because it exists locally. A font becomes an academy asset only after source, license, intended use, and pipeline status are recorded.

Game-specific flavor fonts should be used sparingly so the UI does not become ransom-note goblin.

## Local Font Sources Inspected

Inspected local root:

```text
C:\Users\kryst\Workspace\Literature\the-kryssie-method\km_series\kryssie_method_1\fonts
```

Local candidates found:

| Family / File | Local files | License finding | H5.89 decision |
| --- | ---: | --- | --- |
| Atkinson Hyperlegible | 4 | `OFL.txt` present | eligible for future review/intake |
| Fira Code | 6 | `OFL.txt` present | eligible for future review/intake |
| Iceberg | 1 | `OFL.txt` present | eligible for future review/intake |
| Iceland | 1 | `OFL.txt` present | eligible for future review/intake |
| Love Light | 1 | `OFL.txt` present | eligible for future review/intake |
| Orbitron | 7 | `OFL.txt` present | eligible for future review/intake |
| Outfit | 10 | `OFL.txt` present | eligible for future review/intake |
| Rajdhani | 5 | `OFL.txt` present | eligible for future review/intake |
| Space Grotesk | 6 | `OFL.txt` present | eligible for future review/intake |
| Space Mono | 4 | `OFL.txt` present | eligible for future review/intake |
| Ubuntu | 8 | `UFL.txt` present | local license present, needs human review |
| ROGLyonsTypeRegular3.ttf | 1 | no nearby license found | do not ingest |

## License Findings

The following local families have inspected local SIL Open Font License evidence:

- Atkinson Hyperlegible
- Fira Code
- Iceberg
- Iceland
- Love Light
- Orbitron
- Outfit
- Rajdhani
- Space Grotesk
- Space Mono

Ubuntu has a local `UFL.txt` license file. H5.89 records it as:

```text
local-license-present-needs-human-review
```

`ROGLyonsTypeRegular3.ttf` has no nearby license file in the inspected local font root. It must not be ingested unless clear license provenance is found later.

## Recommended Shared Core Font Set

Recommended shared core roles:

| Role | Preferred | Fallback | Status |
| --- | --- | --- | --- |
| sharedDisplay | Cinzel Decorative | Cinzel | remote candidate; license/source capture needed later |
| sharedReadableUi | Atkinson Hyperlegible | Outfit | local OFL candidates available |
| sharedMonoDebug | Fira Code | Space Mono | local OFL candidates available |

This keeps the academy identity split clean:

- one display font for titles / identity;
- one readable UI font for normal interaction;
- one mono/debug font for tools, coordinates, manifests, and technical overlays.

## Game Flavor Font Candidates

Candidate flavor groups:

- fantasy / magic / dungeon: Uncial Antiqua, MedievalSharp, Almendra, Macondo, Metamorphous, Fondamento, Caudex, Cormorant Garamond;
- tech / arcane: Orbitron, Rajdhani, Iceland, Iceberg, Space Grotesk, Space Mono;
- cozy / farm / pet: Alegreya, Merienda, Love Light.

These are candidates, not runtime-approved choices. Future game-specific typography should prefer readability for UI and reserve heavier flavor fonts for headings, labels, cards, title cards, or decorative surfaces.

## Proposed Future Folder Shape

Future font intake should use:

```text
assets/academy/fonts/
  README.md
  shared/
  pantry/
  licenses/
  manifests/
```

H5.89 does not create this folder and does not copy font binaries. The folder shape is a future intake proposal.

## Proposed Future Manifest Shape

Future canonical font pantry manifest:

```text
manifests/academy.font-pantry.json
```

Expected fields:

- schemaVersion
- status
- reviewStatus
- runtimeEligibility
- fontFamilies
- fontFiles
- licenseFiles
- licenseStatus
- usageRoles
- gameFlavorRoles
- sourceProvenance
- packagingNotes
- runtimeApproval

H5.89 creates only the planning manifest:

```text
manifests/academy.font-pantry-source-inventory-plan.json
```

## Runtime Boundary

H5.89 does not approve runtime font usage.

No runtime font wiring occurred. No game code changed. No package or lock files changed. No dependency installs occurred. No PNGs changed. No font binaries were copied into Tiny Goblin Academy.

License status must be recorded before font ingestion. Local fonts with acceptable-looking license evidence still need a later explicit human review/intake gate before they become repo assets.

## Non-Goals

H5.89 does not:

- wire fonts into runtime;
- modify game code;
- modify package or lock files;
- install dependencies;
- reorganize manifests or docs folders;
- modify PNGs;
- copy or ingest font binaries;
- continue GlyphForge implementation;
- runtime-approve any font.

## Open Questions

- Should Atkinson Hyperlegible or Outfit become the shared readable UI default?
- Should the academy display font wait for a later Cinzel / Cinzel Decorative source intake?
- Should Ubuntu be excluded permanently or human-reviewed as a readable UI alternative?
- Which decorative fonts are allowed in actual game UI versus title/preview surfaces only?
- What small sample evidence sheet should prove readability before runtime wiring?

## Recommended Next Step

Recommended next lane:

```text
H5.90 — Font Pantry Human Review and Core Set Selection
```

After font planning/review, the tool lane can resume at:

```text
H5.88F — GlyphForge Region Browser Image Preview Plan
```
