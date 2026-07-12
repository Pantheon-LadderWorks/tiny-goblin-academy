# Tiny Goblin Academy — H6.3B Button Goblin Code-Authored Vector Actor Rig Preview

## Purpose

H6.3B creates a preview-only Phaser vector actor rig for Button Goblin Clicker.

The goal is to test whether the current simple goblin identity can grow into a reusable full-body actor without requiring a large sprite sheet yet.

This pass does not replace the live runtime goblin. The live game still uses the H6.2/H6.3 Phaser head actor.

## Relationship To H6.2-H6.3

H6.2 migrated Button Goblin Clicker into a stage-first composition.

H6.3 integrated the cavern background into the live Phaser play surface and granted narrow runtime approval to the background as Button Goblin decorative stage art.

H6.3B uses that same approved cavern background as a preview environment for a future code-authored goblin actor.

## Preview Scope

Created preview-only files:

- `games/tier-1/01-button-goblin-clicker/src/actors/GoblinRig.ts`
- `games/tier-1/01-button-goblin-clicker/src/goblinRigPreview.ts`
- `games/tier-1/01-button-goblin-clicker/src/goblinRigPreview.css`
- `games/tier-1/01-button-goblin-clicker/goblin-rig-preview.html`

Preview URL while the Button Goblin dev server is running:

```text
http://127.0.0.1:5101/goblin-rig-preview.html
```

Recommended local preview command:

```powershell
pnpm --dir games/tier-1/01-button-goblin-clicker dev --host 127.0.0.1 --port 5101
```

## Actor Rig Summary

The rig is built from Phaser vector primitives and nested containers:

```text
GoblinRigRoot
├── shadow
├── rear arm
├── rear leg
├── front leg
├── torso
│   ├── ragged tunic
│   └── belt
├── front arm
└── head
    ├── left ear
    ├── right ear
    ├── round face
    ├── normal eyes
    ├── X eyes
    ├── fang mouth
    └── hurt mouth
```

Preserved identity:

- large round green goblin head;
- triangular ears;
- cream eyes and dark pupils;
- small fang;
- simple readable Academy style.

Added body affordances:

- compact torso;
- ragged tunic;
- belt;
- articulated arms;
- stubby legs;
- broad feet;
- ground shadow.

No weapon is included. The player owns the Bonk Stick.

## Preview Actions

The preview surface includes controls for:

- Idle;
- Hover On / Off;
- Bonk -1;
- Bonk -2;
- Defeat;
- Reset;
- Next Goblin / Variant.

The rig supports:

- idle breathing;
- blink/tiny ear-twitch flavor;
- hover scale/angle;
- light and heavier bonk reactions;
- defeated pose with X-eyes;
- baseline reset;
- alternate color/proportion variant.

These are presentation states only. They do not approve game simulation or progression changes.

## Placement And Anchor Fit

The preview uses an 800x600 Phaser canvas and the H6.3 cavern background.

Initial placement:

```text
centerX: 400
feetBaselineY: 500
actorHeight: approximately 300
hitArea: 250x305 ellipse
```

The preview shows:

- the H5.85/H6.3 background anchor overlay;
- the actor hit-area ellipse;
- actor bounds;
- foot baseline;
- lower foreground obstruction band.

The actor sits in the central click-stage safe zone and keeps the feet above the foreground obstruction band.

## Runtime Boundary

H6.3B does not approve or perform:

- live runtime goblin replacement;
- controller or simulation changes;
- gameplay timing changes;
- new click/damage/HP rules;
- exact final runtime coordinates;
- sprite sheet creation;
- custom art skin integration;
- UI sprite integration;
- other game migrations;
- Tauri/Rust lifecycle changes.

The current live Button Goblin runtime remains H6.3: cavern background plus the existing simple Phaser goblin head.

## Evidence Created

Evidence folder:

```text
games/tier-1/01-button-goblin-clicker/evidence/h6-3b-vector-actor-rig-preview/
```

Evidence files:

- `button-goblin-rig-preview-01-desktop-idle.png`
- `button-goblin-rig-preview-02-hover.png`
- `button-goblin-rig-preview-03-bonk-minus-1.png`
- `button-goblin-rig-preview-04-bonk-minus-2.png`
- `button-goblin-rig-preview-05-defeat.png`
- `button-goblin-rig-preview-06-reset.png`
- `button-goblin-rig-preview-07-variant.png`
- `button-goblin-rig-preview-08-narrow-idle.png`
- `button-goblin-rig-preview-09-narrow-bonk.png`
- `button-goblin-rig-preview-sequence-sheet.png`
- `button-goblin-rig-preview-capture-index.json`
- `README.md`

## Validation Notes

Initial implementation validation passed:

- Button Goblin tests;
- Button Goblin TypeScript/build;
- preview evidence capture from the standalone Vite page;
- no active `5101` listener remained after capture.

Final validation was run before commit. Button Goblin tests/build, hub TypeScript, asset-pipeline validators, manifest parsing, source hash, runtime-import guard, port cleanup, package/lock diff, and git diff checks passed. `cargo check` from `hub/src-tauri` was attempted but blocked before code checking because local Rust toolchain state reports `error: target tuple in channel name '1.96.0-x86_64-pc-windows-msvc'` and `rustup toolchain list` reports no installed toolchains. No Rust install, build, or repair was performed in H6.3B.

## Human/Product Review Result

Human visual review: **passed**.

Accepted findings:

- actor design: accepted;
- anchor-region fit: accepted;
- preview state vocabulary: accepted;
- variant/config boundary: accepted;
- preview tooling: accepted;
- runtime replacement: not yet approved;
- gameplay approval: none changed;
- runtime asset approval: preview-only.

The full-body vector rig preserves the original Button Goblin identity: enormous round head, long triangular ears, simple cream eyes, tiny fang, primitive shape language, compact body, and slightly ridiculous Academy silhouette. The body reads as the missing lower half of the existing head instead of replacement artwork.

Anchor fit is accepted for preview planning:

- the actor remains in the central click-stage safe zone;
- feet and shadow visibly ground on the lower cavern floor;
- the actor stays above the foreground obstruction band;
- motion and feedback remain away from torch-risk regions.

Preview state vocabulary is accepted:

- Idle: planted baseline;
- Hover: alert without ballooning the silhouette;
- Bonk -1: small recoil;
- Bonk -2: stronger recoil;
- Defeat: X eyes, collapsed posture, and weight shift;
- Reset: baseline recovery;
- Variant: appearance configuration changes while rig behavior remains stable.

## Rig / Skin Doctrine

The rig defines how a goblin moves.
The skin defines which goblin is wearing it.

H6.3B proves that the same skeleton, pivots, and animation/state vocabulary can support a different appearance configuration. Vector primitives are the first skin implementation. Later segmented transparent art may replace individual parts while retaining the same pivots and state calls.

A flattened whole-character sprite can still be useful as a still or frame-based animation source, but it cannot independently articulate head, ears, arms, torso, legs, eyes, and mouth without separate frames, overlays, or segmented parts.

## Future Runtime Consideration For H6.3C

When H6.3C replaces the live Button Goblin head actor with `GoblinRig`, the clickable hit area should match the whole actor silhouette or a generous central capsule, not the old head-only circle.

The player should be able to bonk the obvious goblin body: head, torso, arms, and upper legs. Broad ears may remain optional, but clicking the visible goblin body should count. This is runtime wiring guidance for H6.3C, not a preview correction.

## Recommended Next Step

Recommended next lane after accepted H6.3B review:

```text
H6.3C — Button Goblin Runtime GoblinRig Replacement
```

Proceed to H6.3C only after H6.3B is committed and the live-runtime replacement lane is explicitly opened.
