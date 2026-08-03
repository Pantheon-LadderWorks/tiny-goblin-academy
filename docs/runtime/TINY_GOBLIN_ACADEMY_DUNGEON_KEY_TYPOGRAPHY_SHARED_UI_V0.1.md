# Dungeon Key Run typography and shared UI v0.1

Status: implemented production closure for the completed Ruin Hall game face.

## Boundary

This lane applies the Academy semantic typography runtime and shared interface grammar without changing Ruin Hall topology, simulation, actors, Patrol Tension, or Ledger publication.

Local authority:

```text
games/tier-1/05-dungeon-key-run/src/uiAuthority.ts
```

Authority ID: `tga-05.typography-shared-ui.v0.1`.

Shared UI supplies semantic ingredients and state vocabulary. Dungeon Key retains its existing stage-first layout rather than copying another game's geometry.

## Semantic role map

| Surface | Role | Governed face |
| --- | --- | --- |
| Academy brand, room subtitle, kickers, controls | `compact-label` | Outfit 600 |
| Game title | `game-title` | Cinzel 800 |
| Objective heading | `panel-heading` | Cinzel 600 |
| Objective body | `body-instruction` | Caudex 700 |
| Key and exit chips | `data-value` | Atkinson Hyperlegible 700 |
| Current feedback | `dialogue-speech` | Caudex 700 |
| Victory and defeat | `result-state` | Cinzel 800 |
| Drawer titles | `dialogue-title` | Cinzel 600 |
| Help and Ledger body | `dialogue-speech` | Caudex 700 |

The game imports `assets/academy/fonts/runtime/academy-typography.css` and waits on `waitForAcademyFonts` before declaring runtime readiness. No font was downloaded or added.

During post-crash recovery, the existing smoke report exposed legacy local `font:` shorthands that still overrode semantic family and weight on several role-bearing surfaces. Those shorthands were reduced to local optical `font-size` rules only. A focused regression test now requires the shared Academy runtime to remain the sole family/weight authority for the brand, title, subtitle, kicker, heading, status, feedback, and outcome surfaces.

## Shared UI state grammar

Production controls expose `rest`, `hover`, `focus-visible`, `pressed`, `disabled`, and `open` states.

- Interactive targets are at least 44 px in each governed dimension.
- Keyboard focus uses a three-pixel high-contrast ring with offset.
- Open Help or Ledger controls remain selected beneath their destination.
- Disabled movement changes border, surface, text, saturation, opacity, and cursor; it does not masquerade as enabled.
- The 1024×640 minimum laptop viewport remains the lower contract. No mobile layout was introduced.
- The stage remains dominant; the objective remains compact; no permanent local history rail or developer surface was added.

## Help, Ledger, and input

Help and Ledger remain shell destinations with `role="dialog"` and modal semantics.

- Opening a destination moves focus to its Close control.
- Tab and Shift+Tab remain within the active destination.
- Escape closes the destination and restores focus to its opener.
- `L` toggles the Ledger.
- Arrow input does not reach gameplay while either destination is open.
- On-screen and keyboard movement behavior outside overlays is unchanged.

Patrol Tension remains confined to the Phaser stage and does not recolor or dim DOM controls.

## Preserved systems

Regression coverage protects simulation topology and coordinates, collision, patrol, 660 ms movement, 1320 ms idle, private and fallback actors, Patrol Tension authority, key/exit lighting, victory, defeat, reset, and Ledger ordering/snapshots/reconnect/deduplication.

Neither `simulation.ts` nor `ledger-bridge.ts` changed. GlyphForge was not modified. No package or lockfile changed.

## Evidence

External evidence root:

```text
D:\Projects\Active\Tiny-Goblin-Academy\Evidence\level-05-dungeon-key-run\typography-shared-ui-production\implementation-20260801
```

The completed pre-crash browser smoke remains valid proof of canonical font-file readiness, exact 1024×640 containment, visible drawer focus, focus restoration, and blocked stage input with zero page or console errors. Its computed-style snapshot predates the final local-shorthand correction and is not claimed as final computed-family evidence; the final semantic ownership is instead protected by the focused static regression test and successful production builds.

The abandoned broad 24-frame packet was intentionally not recreated after the Windows resource-exhaustion incident. No new browser automation was required for closure. The final lesson, Human playthrough, bounded visual evidence, and graduation closure is the next lane.
