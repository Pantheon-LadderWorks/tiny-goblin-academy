# TGA Asset License Remediation Plan

Status: **proposal only — no remediation authorized**

## Priority 1 — Make the license boundary truthful

Prepare a narrowly reviewed change to `README.md`, `CONTENT_LICENSE.md`, `CREDITS.md`, and `assets/academy/README.md` that:

1. preserves MIT for code and CC BY-NC 4.0 for curriculum/docs;
2. preserves the intended All Rights Reserved status for first-party TGA art and branding;
3. explicitly excludes third-party assets from that first-party claim;
4. points to an item-level asset license index and notices file;
5. states that manifests and runtime approval do not replace source licenses.

Do not apply this text until Human Review.

## Priority 2 — Repair generated-asset provenance

Work family by family, beginning with the corrected production-runtime set: 18 generated/curated payloads across nine families. The other 11 production payloads are already backed by OFL or CC0 authority.

The initial generated-family slice is:

- Academy Hub visuals;
- platformer goblin runtime derivative;
- Button Goblin background;
- Card Goblin tabletop, card frames, and UI tokens;
- Dice Duel runtime art;
- One Room Platformer background and construction sheet;
- Potion Sorter runtime sheet;
- GlyphForge boot splash;
- Hub/Tauri icon derivatives.

For each family:

1. locate retained generation chat/job/output evidence;
2. record provider, product/model where available, date, prompt/job reference, source inputs, and applicable historical terms;
3. hash the original output and link every cleanup/derived sheet;
4. record Human selection/review;
5. classify the family as `generated-public-safe`, `studio-only`, or `license-unclear` based on recovered evidence;
6. do not invent missing facts.

If recovery fails, bring that family to Human Review. Do not silently delete or relicense it.

## Priority 3 — Complete the font inventory

Add the ten tracked but unrepresented font styles to the canonical font inventory with current hashes, family OFL paths, styles, and runtime eligibility. Verify Reserved Font Name constraints before any future rename, subset, or conversion.

## Priority 4 — Resolve mixed brand glyphs

Audit every symbol in `hub/public/icons.svg` individually. Record source, license, alteration status, and trademark-use boundary. If defensible source evidence cannot be recovered, propose a separate replacement lane using first-party text links or newly sourced official brand resources.

## Priority 5 — Normalize confirmed third-party notices

Promote a reviewed notices document and add per-pack directory pointers without copying or rewriting upstream license text. Keep CC0 provenance even where attribution is optional. Preserve OFL copyright/license files with font binaries.

## Current-tree remediation candidates

| Candidate | Proposed action | Destructive now? |
|---|---|---|
| Overbroad All Rights Reserved language | Add explicit third-party exclusion and item index | No action in audit |
| Generated families with missing terms | Recover provenance; Human-review unrecoverable families | No action in audit |
| Ten unindexed font binaries | Extend canonical manifest | No action in audit |
| Mixed service/brand SVG | Source/trademark audit; then retain or replace | No action in audit |
| Large CC0 archives | Defer to storage policy; license allows current public presence | No action in audit |

## History and release remediation

No tag, release, or current finding justifies history rewriting. The three removed Vite/React starter images are low-risk historical residue. Reconsider history only if a later audit identifies a demonstrably restricted payload, and report fork, force-push, hash, clone, evidence, and citation consequences before approval.

## Explicit non-actions

- no deletion, movement, replacement, regeneration, or relicensing;
- no Git history rewrite;
- no release alteration;
- no GlyphForge intake;
- no LFS/storage migration;
- no pipeline extraction;
- no Dungeon Key Run work.
