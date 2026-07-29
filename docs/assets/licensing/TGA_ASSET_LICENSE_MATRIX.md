# TGA Asset License Matrix

Status: **draft for Human Review**

| Group | Packs / families | Payload files | License authority | Notice | Classification | Main gap |
|---|---:|---:|---|---|---|---|
| Google Fonts | 18 | 30 | SIL OFL 1.1 with local family license files | Preserve copyright and OFL | `third-party-public-safe` | 10 styles absent from canonical inventory |
| ambientCG materials | 9 | 18 | CC0 1.0 with local legalcode, source-page capture, metadata, and hashes | None required | `third-party-public-safe` | Storage size only; not a license defect |
| Kenney Particle Pack | 1 | 9 | CC0 1.0 with local package/license evidence | None required | `third-party-public-safe` | None found |
| Kenney Retro Textures Fantasy | 1 | 13 | CC0 1.0 with local package/license evidence | None required | `third-party-public-safe` | None found |
| OpenGameArt: DeadKir tileables | 1 | 3 | CC0 1.0 with creator URL, direct URLs, local legalcode, and hashes | None required | `third-party-public-safe` | Preserve source record even though attribution is optional |
| OpenGameArt: Luke.RUSTLTD parchment | 1 | 1 | CC0 1.0 with creator URL, direct URL, local legalcode, and hash | None required | `third-party-public-safe` | Preserve source record even though attribution is optional |
| Generated/curated Academy visuals | 23 | 98 | General Gemini statement plus uneven item-level ChatGPT/generated records | N/A pending provenance | `license-unclear` | Per-item provider, model, prompt/job, inputs, terms, and original-output lineage |
| Hub service/brand SVG symbols | 1 | 1 | Not recorded | Unresolved | `license-unclear` | Source licenses and trademark-use boundaries |
| Removed starter media | 1 historical group | 0 current | Vite/React starter origin inferred from filenames/history | None proposed | `license-unclear` | No current-tree or release exposure; no history action justified |

## Production-runtime priority slice

- 29 payloads have references from actual game, Hub, or Tauri production source/configuration.
- 18 of those payloads belong to nine generated/curated `license-unclear` families.
- Tests, fixtures, evidence, capture scripts, audit JSON, and documentation are reported separately and do not elevate an asset into the production-runtime priority set.

## Classification notes

- `third-party-public-safe` means current evidence supports public-repository redistribution under the named item license. It does not transfer ownership to TGA.
- OFL notice preservation is not the same as optional attribution.
- `license-unclear` is a request for provenance repair, not a claim that an asset is forbidden.
- No `studio-only`, `release-only`, `public-derivative-only`, or `public-with-attribution` asset group was confirmed in the current tree.
- Technical readiness, runtime approval, and Human approval remain independent of this matrix.
