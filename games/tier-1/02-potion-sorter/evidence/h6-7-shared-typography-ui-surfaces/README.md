# H6.7 Potion Sorter Shared Typography and UI Surface Evidence

## Review status

- implementation: complete
- automated contract QA: passed
- browser runtime QA: passed
- human visual review: passed 2026-07-17
- staging/commit: authorized as the combined H6.7/H6.7A packet

## What this packet proves

- Potion Sorter loads the repository-local Academy font runtime before Phaser creates text;
- the DOM and Phaser renderers consume the shared semantic typography recipes;
- Cinzel owns the game and result headings;
- Caudex owns the objective and result body;
- Outfit owns compact HUD and in-room labels;
- Atkinson Hyperlegible owns Time, Score, and Combo values;
- Macondo owns transient play instruction and feedback;
- the live HUD remains code-native and is not forced into rejected Region 5;
- Region 20 is used only as the round-result host surface;
- successful completion and timer expiry receive truthful, distinct result language;
- receiver faces, destination labels, Composition C, tap, drag, controller authority, and simulation authority remain unchanged;
- 1920×1080 and 1024×640 remain overflow-free;
- all eight required local font faces report loaded at both desktop contracts.

## Evidence index

- `captures/desktop-01-initial.png`
- `captures/desktop-02-round-complete.png`
- `captures/minimum-01-initial.png`
- `captures/minimum-02-round-complete.png`
- `captures/minimum-03-timer-expired.png`
- `runtime-audit.json`
- `capture-h6-7-evidence.mjs`

`runtime-audit.json` records the viewport and document dimensions, local font load results, computed DOM font families/sizes/weights, Phaser typography audit roles, Region 20 state and bounds, result copy, and authoritative round state.

## Human review verdict

Passed. The shared font roles, restrained HUD, transient feedback, Region 20
content fit, and distinct successful-completion and timer-expiry states are
approved at both supported desktop contracts. The H6.7A correction below is
part of this final authority.

## Deliberate exclusions

- no new font acquisition or audition;
- no Region 5 HUD integration;
- no receiver or room redesign;
- no particles, shaders, audio, boot scene, or replay/reset feature;
- no package or lockfile changes;
- no manifest, roadmap, lessons-learned, or packaging closure in this packet.
