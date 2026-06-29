# Tiny Goblin Academy — H4.6 Hub Surface Contract + Future Layer Scaling Plan

## 1. Purpose
This document defines the future-facing hub surface layout strategy and architecture, shifting Tiny Goblin Academy from a static web dashboard model into a full-screen, game-like launcher surface. It establishes clear rules for UI scaling, layout models, and handling future layers (options, updates, cross-game ecosystems) without prematurely implementing them.

## 2. Current Problem
Human visual review after H4.5/H4.5B revealed that the hub is currently fighting itself. By treating the layout as a standard web application with a fixed "header/body/footer", components like the Tiny Goblin Academy banner, Glyphforge Games studio identity, backend status, and card/details displays all compete for the same cramped header/card space. This layout becomes visually confused and will break down as more games are added.

## 3. Core Pivot: Dashboard Page → Full-Screen Launcher Surface
The hub must stop being treated like a normal web dashboard. Instead, it must become a full-screen, game-like launcher surface—similar to a console dashboard or Xbox game hub. This involves moving away from fixed HTML headers and embracing a layered, environmental UI that uses background stages, compact status rails, and navigable game shelves.

## 4. Identity Hierarchy
The visual hierarchy between the studio and the product must be respected:
- **Glyphforge Games** = studio / maker mark
- **Tiny Goblin Academy** = product / academy hub / game collection

**Doctrine:**
Glyphforge Games appears as the maker/studio mark during boot and as a compact maker seal/status identity in the hub.
Tiny Goblin Academy owns the hub masthead and game catalog surface.
Do not place large studio and product banner assets side-by-side in the same header.

Glyphforge Games should not disappear from the hub, nor should it dominate the hub header as a second competing banner. The small Glyphforge icon/emblem is likely better for compact in-hub studio identity. The large Glyphforge boot/emblem image belongs to boot/splash or marketing surfaces. The Tiny Goblin Academy banner should not be forced into a traditional header if that makes the launcher unusable. A full-screen launcher surface may use a layered background/stage composition rather than a normal header component.

## 5. Current Runtime Truth
The Tauri hub app is packaged/built.
The games are currently dev/local-source runtime targets, not production-installed games.
Launching a selected game may intentionally start its trusted local dev server and display it inside the Tauri app.
This is developer-mode launch behavior, not production install behavior.

**Rule Correction:**
The hub must not silently install dependencies, mutate source, update packages, or launch arbitrary commands.
The hub may start a trusted local dev server only as the direct result of an explicit launch action for a selected dev-mode game.
Production launch/install/update behavior requires a separate future contract.

We explicitly distinguish between:
- devRunnable
- sourceAvailable
- workspaceMember
- playableMode: dev
- installed
- playableMode: static / bundled / itch-cave
- distributionReady
- updateAvailable

Current dev games must not be presented as production installed artifacts.

## 6. Future Layer Stack
The hub needs to scale not just in number of games, but in number of layers.

**Current visible layers:**
- boot screen
- academy identity
- studio identity
- dev backend status
- game card list/grid
- details view
- game launch action

**Near-future layers:**
- options/settings
- compact details vs full details
- tier selector
- launcher mode/status

**Future production/distribution layers:**
- install
- update
- uninstall
- repair
- open folder
- Butler/butlerd cave state
- production playable artifact state
- release channel

**Future account/identity layers:**
- local profile
- Federation account identity
- Pantheon LadderWorks vs Into The Eye client context
- possible cloud/profile sync later

**Future ecosystem layers:**
- cross-game ledger
- resource producers/faucets
- resource consumers/sinks
- converters
- independent modules
- capstone/meta hubs

These are future layers. This document captures them so the visual layout does not paint the project into a corner.

## 7. Layout Model Candidates
Three candidates were considered for the hub evolution:

**Candidate A: Traditional Dashboard Grid**
- Pros: Simple; closest to current implementation; works for exactly 10 games.
- Cons: Fights banner/header height; becomes catalog-like; scales poorly to 15+ games; repeated metadata overloads cards; risks web-page scrolling.

**Candidate B: Full-Screen Launcher Grid**
- Pros: Feels more game-like; can use a designed background/stage; better identity integration.
- Cons: Fixed grids can still break at 15+ games; may require paging or tier filters; static background holes would be brittle.

**Candidate C: Console-Style Selected Feature + Horizontal Game Shelf**
- Pros: Scales naturally from 10 to 15+ games; keeps fixed identity/status/options zones; gives room for Play / Details / Options / future Install / Update actions; allows compact cards; selected-game preview owns text; closer to Xbox/console launcher behavior.
- Cons: Requires keyboard/controller/mouse navigation design; requires selected-game state; needs careful accessibility/focus handling; bigger refactor than CSS tightening.

**Recommended direction:** Candidate C — Selected Feature + Horizontal Game Shelf.

## 8. Recommended Layout Direction
The recommended architecture for the hub surface is **Candidate C**:

Academy Launcher Surface
  Background / Stage Layer
  Studio Identity Rail
  Academy Masthead / Product Plaque
  Tier Selector / Curriculum Lane
  Selected Game Feature Panel
  Horizontal Game Shelf
  Action Cluster
  Details Overlay / Drawer
  Options Overlay

**Visual Structure:**
- Fixed / semi-fixed: Glyphforge studio seal, Tiny Goblin Academy product identity, active tier, runtime mode/status, backend connected state, selected game details preview, action cluster.
- Navigable: game card shelf, tier shelf, details/options overlays.

Controlled shelf scrolling is acceptable.
Random page/document scrolling for the main launcher dashboard is not the target.

## 9. Viewport / Scale Targets
- **Primary desktop target:** 1920x1080 (launcher breathes; feature and shelf can be larger; identity/status intentional)
- **Minimum comfortable target:** 1280x720 (hub remains coherent; primary launch/details actions visible; shelf may show fewer cards; details overlay may scroll)
- **Common laptop target:** 1366x768 (comfortable; avoids catastrophic crowding; tests compact shelf behavior)
- **Mid desktop target:** 1600x900
- **Optional safety target:** 1024x640 or 1100x640 (no beauty guarantee, no catastrophic breakage; do not heavily optimize here in H4.x)
- **Not a current target:** mobile/tablet/480px layouts

## 10. Game Count Scaling
**Current Tier 1:** 10 games.
**Known future direction:** Tier 2 may upgrade 5 existing Tier 1 games and add 5 new games. The total launcher library may become 15+ games after Tier 1.5 finalization and asset phase completion.

Do not design the launcher around exactly 10 cards.

**Preferred scaling strategy:**
- Tier-aware shelves
- Horizontal game shelf
- Selected-game feature panel
- Compact cards
- Details overlay owns long metadata
- Paging/scrolling within shelf allowed

**Potential future tier groupings:**
- Tier 1 Foundations
- Tier 1.5 Productization / Asset Phase
- Tier 2 Expansion
- Upgraded Lessons
- New Lessons
- Independent Modules

Do not implement Tier 2 now. Do not add Tier 2 games now. Do not change academy roster now.

## 11. Card / Details Responsibility Split
**Compact Card Content:**
- icon/title art
- level number
- short lesson/category label
- tiny runtime/status badge
- selection/focus state

**Selected Feature Panel Content:**
- full game title
- short description
- lesson focus
- primary action: Launch Dev Game
- secondary actions: Details, Options
- compact runtime summary

**Details Overlay/Drawer Content:**
- full description
- controls
- lesson contract summary
- source availability
- workspace/dev metadata
- build/runtime metadata
- prod/Butler placeholders
- release/update status
- notes

Cards should not behave like audit reports.
Verbose metadata belongs in details, not on every card face.

## 12. Options Layer
Options are a future layer. The layout should reserve conceptual room for them, but H4.6 must not implement options UI.

**Potential Option Categories:** game options, launcher options, dev/runtime options, accessibility, audio, display/window mode, open source folder, reset local save, view logs, diagnostics.

**Where options likely live:** Selected feature action cluster, details overlay, dedicated options overlay, controller/menu button equivalent later.

## 13. Dev vs Production Layer
The hub must visually distinguish between local developer runtime states (source-based, workspace dev servers) and production/installed artifact states. This distinction should be clear in the runtime mode status rails.

## 14. Butler / Update Layer
Future states involving itch/butler packaging, downloading, installing, updating, and verifying artifacts will be managed by separate background tasks and exposed through specific layered UI panels (e.g. Action Cluster states like `Update Available` instead of `Launch Dev Game`), separate from the core hub identity.

## 15. Account / Federation Identity Layer
Account identity must not be conflated with local dev runtime.
Account integration requires its own future contract.

Future concerns include: local profile, Federation account, client context (Pantheon LadderWorks vs Into The Eye), cross-client boundaries, save ownership, sync eligibility, privacy/security, offline fallback.

## 16. Future Cross-Game Ledger / Ecosystem Layer
Tiny Goblin Academy Tier 1 remains an isolated playable-loop archive.
Future Tier 2+ may introduce a Hub-owned Glyphforge Ledger where games contribute validated events to a shared ecosystem.
Games must never directly mutate each other’s state.

Games do not talk to games. Games submit validated event intents to the Hub. The Hub/Tauri backend owns the ledger. The ledger validates event type, game id, rate limits, reward mapping, and atomic writes. The Hub decides rewards from economy contracts.

Example conceptual event:
```ts
submitLedgerEvent({
  gameId: "dice-duel-tavern",
  eventType: "round_won",
  contractId: "academy-ledger-v0",
  payload: {
    difficulty: "standard",
    result: "win"
  }
})
```

Possible roles: producer/faucet, consumer/sink, converter, independent module, capstone/meta hub.

Possible future manifest fields (Theory Only):
```json
{
  "ecosystemRole": "producer",
  "ledgerParticipation": "optional",
  "emits": ["round_won", "perfect_clear"],
  "consumes": [],
  "economyContract": "academy-ledger-v0"
}
```

This is theory only. No ledger implementation. No global save file. No injected API. No game modifications. No manifest migration in H4.6.

## 17. Non-Goals
- Do not implement the new layout in H4.6.
- Do not rewrite HubShell or CSS yet.
- Do not modify game code or CodeCraft Native.
- Do not migrate manifests beyond documentation examples.
- Do not add Tier 2 games.

## 18. Recommended Next Implementation Sequence
The recommended next implementation prompt is: **H4.7 — Console-Style Launcher Mock/Evidence Pass**. This will produce a layout evidence sheet for grid vs horizontal shelf vs hybrid selected-feature shelf before touching the hub runtime code again.

## 19. Open Questions
- What specific background staging art should be used for the launcher base layer?
- Should the tier selector be a vertical curriculum lane on the left or a horizontal tab above the shelf?

## 20. Human Review Gate
Review this layout model and the future layers scaling plan. If acceptable, proceed to H4.7 to generate mockups of the Candidate C layout.

> [!NOTE]
> **H4.7 Update:** Static evidence and mockups for Candidate C have been generated in the ssets/academy/hub/evidence/h4-7/ directory to validate this contract visually across viewports.
