# Tiny Goblin Academy Public Asset License Audit

Status: **draft audit for Human Review**
Baseline: `ad91fe30aa017d660404a6695c3df490a431054d`
Audit date: 2026-07-29

This is a repository-exposure and provenance audit, not legal advice and not a remediation action. It changes no asset, root license, release, tag, or Git history. GlyphForge Studios Library intake remains disabled.

## Scope correction

The audit unit is the **asset or coherent source pack**, not every H5/H6 evidence screenshot. The machine inventory covers 173 current non-evidence media payloads in 56 pack/family records. H5/H6 contact sheets, captures, flipbooks, and recordings appear only as supporting lineage references when they prove the origin, transformation, or review of an asset.

The audit excludes external heavy evidence, package caches, `node_modules`, and archived debug captures from the asset count. A screenshot that reproduces an underlying asset does not become a new pantry ingredient; it inherits the exposure concern of the underlying asset.

## Repository baseline

- Repository: `Pantheon-LadderWorks/tiny-goblin-academy`
- Visibility: public
- Branch: `main`
- `HEAD == origin/main`: yes at the baseline above
- Tags: none
- GitHub releases: none
- Current media history removed from the tree: three Vite/React template images only
- Audio payloads found: none
- Root license files changed by this lane: none

## Current published license split

- Code: MIT (`LICENSE`)
- Documentation, curriculum, and planning: CC BY-NC 4.0 unless otherwise stated (`CONTENT_LICENSE.md`)
- TGA art, branding, and visual identity: All Rights Reserved unless explicitly stated (`CONTENT_LICENSE.md`)
- Third-party assets: governed by their own licenses, whether or not the root files currently say this clearly enough

The present split is understandable for first-party work, but its third-party exclusion is not explicit enough. `assets/academy/README.md` also says all art follows the All Rights Reserved content license. That sentence can appear to claim authority over Google Fonts and CC0 source packs that TGA does not own. The repository should eventually add an explicit item-level carve-out, but this audit does not apply it.

## Findings

### Confirmed public-safe third-party groups

Thirty-one records containing 74 payloads have strong local license evidence:

- 18 Google Fonts families, 30 TTF binaries, under SIL Open Font License 1.1;
- 9 ambientCG texture packages under CC0 1.0;
- Kenney Particle Pack under CC0 1.0;
- Kenney Retro Textures Fantasy under CC0 1.0;
- DeadKir hand-painted tileables from OpenGameArt under CC0 1.0;
- Luke.RUSTLTD parchment from OpenGameArt under CC0 1.0.

The raw material archives are large and arguably belong in a different long-term storage architecture, but their recorded CC0 terms do not create a license reason to remove them from this public tree. Storage policy is a separate decision.

### Font-specific result

All 18 font families have local `OFL.txt` files and official Google Fonts provenance. Several licenses declare Reserved Font Names. No conversion, subsetting, or renaming is recorded.

The canonical font inventory represents 20 of 30 tracked binaries. Ten styles across Alegreya, Almendra, Caudex, Cinzel Decorative, Cormorant Garamond, and Fondamento are present in Git but absent from `manifests/academy/fonts/academy.font-inventory.json`. Their family OFL files remain present, so this is a manifest/provenance-coverage defect rather than evidence of a forbidden font.

OFL copyright and license notices must travel with redistributed font software. That is a notice obligation, not a requirement to invent marketing attribution.

### First-party AI-generated and AI-assisted TGA visuals

Twenty-three current records containing 98 payloads are classified `generated-first-party`. They are recorded as Kryssie-directed AI generation or assistance followed by human selection, cleanup, mapping, composition, and integration. No third-party stock-asset license or externally owned source artwork is identified for these families.

Exact provider, model revision, prompt, generation date, chat/job identifier, and original-output genealogy are optional historical metadata. Their absence does not by itself create a third-party license defect. The audit therefore does not require family-by-family excavation merely to distinguish Gemini from ChatGPT or one model revision from another.

The operational record instead keeps separate questions:

- origin type: first-party AI-generated or AI-assisted;
- third-party reference/input concern: none known, yes, or unknown;
- human selection/editing/integration status;
- project and storefront disclosure requirements;
- provider-specific restrictions discovered later;
- copyright strength, which this audit does not assess.

`license-unclear` is now reserved for a credible external-origin, third-party-input, protected-character/brand, provider-restriction, or downloaded-versus-generated uncertainty. Missing model nicknames and prompts are not enough.

Current OpenAI terms assign OpenAI's rights in output to the user while keeping responsibility for lawful inputs and use with the user. Google's terms say Google does not claim ownership over original content generated in covered services and likewise require respect for others' rights. These provider rules can change, so release review should check current terms rather than preserve a public birth certificate for every sprite. The U.S. Copyright Office separately treats human authorship as the copyrightability question; inclusion of AI-generated material does not by itself bar copyright in a larger human-authored work. Steam currently asks developers to disclose pre-generated AI content that ships with and is consumed by players. These are separate ownership, input-risk, copyright-strength, and storefront-disclosure questions—not one provenance field.

Primary policy references reviewed 2026-07-29:

- OpenAI Terms of Use: <https://openai.com/policies/row-terms-of-use/>
- Google Terms of Service: <https://policies.google.com/terms?hl=en-US>
- U.S. Copyright Office, Copyright and Artificial Intelligence Part 2: <https://www.copyright.gov/ai/>
- Steamworks Content Survey: <https://partner.steamgames.com/doc/gettingstarted/contentsurvey>

### Mixed brand-icon surface

`hub/public/icons.svg` contains service/brand glyphs including Bluesky, Discord, and GitHub. Its local source and license provenance are not recorded, and trademark-use questions are distinct from copyright licensing. It remains `license-unclear` until each glyph's source and permitted use are documented.

### Evidence and derivatives

H5/H6 evidence is useful proof, but it should not inflate the asset census. Evidence reproducing CC0 or OFL material inherits a public-safe source boundary. Evidence reproducing first-party AI-generated TGA art remains supporting evidence for that `generated-first-party` family; it does not create another asset or another license question.

No independent restricted evidence pack was identified in the narrowed asset audit. This lane did not perform a storage-retention audit of the evidence corpus.

### Runtime consumption

The corrected reference classifier observes 29 payloads used by production game, Hub, or Tauri runtime source/configuration. It separately reports 12 payloads referenced by tests/fixtures, 113 by evidence/capture surfaces, and 169 by documentation/control-plane text; these sets may overlap.

Eighteen of the 29 production payloads belong to nine `generated-first-party` families: Academy Hub visuals, the runtime goblin, Button Goblin background, Card Goblin assets, Dice Duel art, One Room Platformer art, Potion Sorter art, the GlyphForge boot splash, and Hub/Tauri icon derivatives. They require the same project/storefront AI-disclosure policy as the other first-party generated visuals, not a special per-asset provenance-repair slice.

Runtime approval and license permission remain separate fields. An H5 `not-runtime-approved` marker was a phase gate, not a license verdict; later H6 use does not repair missing provenance, and missing H6 use does not make a licensed asset unlawful.

### Global tracked-media sentinel

The global scan finds 979 Git-tracked media candidates using the audit's extensions:

- 173 canonical asset payloads represented in the inventory;
- 795 H5/H6 or runtime evidence media explicitly excluded as supporting lineage rather than independent pantry assets;
- 11 archived debug/evidence images explicitly excluded from active asset scope;
- zero unexpected media outside governed or explicitly excluded surfaces.

The inventory builder now fails closed if a future tracked media file is neither inventoried nor assigned an explicit exclusion reason.

### History and releases

No tags or GitHub releases exist. The only non-evidence media paths found in history but absent from the current tree are `hub/src/assets/hero.png`, `hub/src/assets/react.svg`, and `hub/src/assets/vite.svg`, introduced and removed with the starter UI. No history rewrite is recommended from this finding.

## Risk order

1. **High:** the All Rights Reserved boundary can be read as covering third-party fonts and CC0 sources.
2. **Medium:** mixed brand glyph provenance and trademark-use authority are unrecorded.
3. **Medium:** ten OFL font binaries are missing from the canonical font inventory.
4. **Low:** project/storefront AI disclosure should be made explicit before a release that requires it.
5. **Low:** public raw CC0 archives increase repository weight, but not license risk.
6. **Low:** three removed starter-template images remain in history; no tags or releases amplify exposure.

## Human decisions required before remediation

- Approve the proposed third-party carve-out and notices architecture.
- Approve a proportional project-level AI disclosure and release/storefront checklist without requiring per-asset model/prompt genealogy.
- Decide whether the mixed brand-icon sheet is retained with documented sources, replaced with self-authored links/text, or reviewed separately.
- Approve adding the ten missing font styles to the canonical inventory.

No decision about GlyphForge storage, LFS, private overlays, or asset-pipeline relocation is required to close this audit.
