# Tiny Goblin Academy Boot Experience Integration

## Status

Doctrine / Roadmap Integration

## Purpose

Explain:

* boot screens are not just polish;
* they hide startup/load transitions;
* they establish product identity;
* they prevent raw white screens, sudden dashboard spawn, and half-loaded game states;
* they are part of the game development learning path.

## Existing Standard

Reference:

* `docs/PANTHEON_PRODUCT_BOOT_EXPERIENCE_STANDARD.md`
* `assets/studio/glyphforge-games/glyphforge-games-boot-splash-concept.png`

Glyphforge Games is a draft/internal studio identity until legally finalized.

## Three Boot Layers

### 1. Hub Boot Screen

Purpose:

* covers React hub startup;
* shows studio/product identity;
* transitions into academy dashboard;
* currently implemented in `hub/src/components/BootScreen.tsx`.

Current status:

* implemented as a short timed boot state (2000ms);
* skip button exists;
* not a launcher.

### 2. Game Launch Boot Screen

Purpose:

* future layer shown when launching a selected game from the hub/launcher;
* can show selected lesson, source/build/play mode, and loading status;
* must not exist until launch behavior exists.

Current status:

* future work;
* do not implement in read-only hub.

### 3. In-Game Boot / Preload Scene

Purpose:

* each Phaser game should eventually teach/implement a boot/preload scene;
* covers asset loading;
* displays honest progress/status;
* transitions into gameplay only when ready.

Current status:

* future curriculum direction;
* not retrofitted into all 10 games yet.

## Learning Direction

Tiny Goblin Academy should eventually teach:

* BootScene / PreloadScene / GameScene separation;
* honest loading indicators;
* asset preload queues;
* graceful fallback if assets fail;
* no fake loading bars;
* skip/fast path where appropriate;
* avoiding blank screens and half-loaded gameplay.

## Hub Relationship

* the hub boot screen is the academy doorway;
* the hub must remain read-only for now;
* the existing disabled launch buttons should not imply game launch boot exists yet;
* future launcher/runtime phases can add game launch boot flow.

## Asset Relationship

* the Glyphforge boot splash concept is a reference asset;
* it should not be blindly injected everywhere;
* decide later whether hub boot uses text-only mark, SVG, raster image, or branded animation;
* ensure repo-relative path and licensing/branding notes before production use.

## Acceptance Checklist

* [x] Hub has deliberate entry state.
* [x] Hub avoids raw dashboard spawn.
* [x] Hub boot references draft studio identity carefully.
* [x] Read-only hub does not imply launch/runtime behavior.
* [x] Future game launch boot is documented but not implemented.
* [x] Future Phaser preload scene curriculum is documented.

## Proposed Next Step

1. Review boot integration doctrine.
2. Later H2 may polish the hub boot screen visually.
3. Later launcher phase may implement game launch boot.
4. Later game curriculum phase may add BootScene/PreloadScene patterns.
