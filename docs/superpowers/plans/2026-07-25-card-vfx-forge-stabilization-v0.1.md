# Card VFX Forge Stabilization v0.1 Implementation Plan

Date: 2026-07-25  
Lane: H6.22R0 — VFX Mastery Ladder Canon and Card VFX Forge Stabilization  
Status: Implemented for unstaged Human Review

## Intent

Ingest the useful design model from Kryssie's self-contained Downloads prototype into the repository prototype shelf without committing embedded copies of governed assets. Stabilize the first curriculum rung before attempting additional production Phaser recipes.

## Immutable intake baseline

```text
C:\Users\kryst\Downloads\tiny_goblin_card_vfx_forge.html
SHA-256: 9A01098CC0810470BBFB9E16A76D447A15023F0200637435C8CFB7C6149620D0
```

The intake file remains unchanged. Its embedded tabletop, frame, and token sheets already exist as governed repository assets and are referenced from the repository Forge instead.

## Protected concurrent lane

Existing uncommitted H6.22A implementation, tests, evidence metadata, and runtime records were hashed before this lane. This plan authorizes no mutation to those paths.

## Work sequence

1. Establish manifest, Git, instruction, dirty-worktree, port, and H6.22A hash truth.
2. Render a six-face by nine-border light-fit contact sheet before classifying candidates.
3. Add the canonical VFX mastery ladder.
4. Write tests for rounded-perimeter geometry, recipe validation, frame classification, offline assets, and required controls.
5. Implement the core and watch the red tests turn green.
6. Ingest a plain HTML/CSS/JavaScript Forge using repository-local assets.
7. Replace repeating line dashes with two explicit normalized perimeter arcs.
8. Add nullable frames, a small main candidate set, and a raw/experimental comparison group.
9. Add explicit attachment authority and semantic preview anchors.
10. Add a compact six-phase lifecycle strip and complete presentation-only lifecycle preview.
11. Validate recipe edit, browser save, download, import, malformed rejection, and restore.
12. Run local browser evidence at both governed viewports and record zero-network behavior.
13. Store heavy evidence externally, verify protected paths, and clean only lane-owned processes.

## Border comparison decision

The contact sheet uses governed source rectangles, preserves aspect ratio, and reduces overlay opacity to 72 percent. It is a comparison instrument, not production approval.

True CardRig outer-frame selector:

- `none`;
- `gold-ornate`;
- `wood`;
- `bone` baseline alias for the governed corner-ornate open frame.

Environmental slot subsystem:

- `green-slot` — governed board-slot surface;
- `teal-slot` — governed board-slot surface;
- `gold-glow` — governed highlighted empty-slot state;
- `red-corners` — governed card-slot surface;
- `gray-gold` — governed card-slot surface.

No rarity, origin, state, or card-to-frame assignment is made. Persistent outer-frame identity, transient CardRig state, environmental slot response, and VFX remain separate authorities.

## Perimeter correction

The intake prototype used width-derived repeating dash cells on a closed rounded rectangle. Because the dash period did not divide the full perimeter, wraparound split one visual streak and briefly produced a third apparent segment.

The repository core computes:

```text
P = 2(w - 2r) + 2(h - 2r) + 2πr
```

It samples the four edges and four quarter-circle corners continuously. Two explicit arcs use head progress `p` and `p + 0.5`, with bounded normalized arc length. No repeating dash cell or closed-path seam remains.

## Boundaries

- No production CardEffectRecipe mutation.
- No CardRig route, simulation, Hub Ledger, package, lockfile, asset, Cloudflare, or MCP mutation.
- No production Phaser parity claim.
- No staging, commit, or push.
- Human Visual Review remains required.
