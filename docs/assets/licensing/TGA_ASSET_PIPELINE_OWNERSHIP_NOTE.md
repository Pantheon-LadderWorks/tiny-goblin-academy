# TGA Asset Pipeline Ownership Note

Status: **documentation-only future boundary**

The current canonical public CLI is `scripts/asset-pipeline/cli.mjs`. Its surrounding scripts, libraries, documentation, and governed workflows support source inventory, hashing, cleanup, crop/region mapping, normalization, manifest generation, contact sheets, flipbooks, evidence records, validation, and promotion review.

## Current TGA responsibility

TGA uses the pipeline to teach reproducible asset intake and to preserve curriculum-visible evidence. The current repository contains TGA-specific schemas, game manifests, Academy path assumptions, H5/H6 review gates, and evidence-storage rules. Those responsibilities should not be uprooted during a license audit.

## Reusable studio responsibility

Several capabilities are broader than TGA: deterministic hashing, source/derivative lineage, license metadata, cleanup recipes, crop mapping, validation, contact-sheet generation, and promotion contracts. They may later justify a mature GlyphForge-owned production implementation.

## Future questions

- Does TGA retain a small public curriculum implementation while GlyphForge owns a production implementation?
- Is shared schema ownership separated from game-specific adapters?
- How do private sources produce public-safe lessons without leaking restricted payloads?
- Where do storage, cache, evidence, and export policies belong?
- How are fixes shared without turning one repository into an undeclared dependency of the other?

## Boundary for this audit

- Tooling is not an asset payload.
- Nothing is moved, copied, renamed, extracted, or rehomed.
- No tooling repository or larger subsystem is created or named.
- TGA may retain a public curriculum-facing version.
- GlyphForge may later own a mature production version.
- That decision belongs to a separate propose-and-approve lane.
