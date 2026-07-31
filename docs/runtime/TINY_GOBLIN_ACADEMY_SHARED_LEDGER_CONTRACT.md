# Tiny Goblin Academy Shared Ledger Contract

**Status:** Shared Hub contract implemented; Card Goblin Duel and Dungeon Key Run are live publishers; Dice Duel Tavern backfill remains separately gated.

**Introduced in:** H6.20C

## Purpose

The Academy Hub owns a reusable Ledger surface for games that produce meaningful ordered causal history. The game simulation remains the source of truth. The Hub only projects immutable receipts supplied by the active game.

```text
simulation transition
→ game-specific ledger adapter
→ shared Academy ledger message contract
→ Hub ledger projection
→ Hub Ledger overlay
```

The contract is optional per game. A game without authored causal history must not invent filler entries merely because the Hub exposes a Ledger control.

## Authority Boundary

### Game simulation owns

- legal actions and phase transitions;
- randomness and deterministic evidence injection;
- damage, healing, status effects, scores, rewards, and terminal outcomes;
- the causal facts from which ledger receipts are authored;
- run reset truth.

### Game ledger adapter owns

- mapping simulation transitions into player-readable causal receipts;
- assigning one run identity per playthrough;
- deterministic sequence numbers within that run;
- immutable event identities;
- publishing incremental events;
- publishing a complete current snapshot when the Hub requests one;
- starting a replacement run and snapshot after reset.

### Hub owns

- validating messages from the active game iframe;
- rejecting malformed or wrong-game messages;
- ordering receipts by `sequence`;
- deduplicating by `eventId` and sequence;
- replacing the visible projection when a new `runId` is announced;
- requesting a snapshot after iframe load or reconnection;
- opening, closing, and rendering the Ledger overlay.

The Hub does not calculate or reinterpret gameplay outcomes.

## Shared Event Envelope

The canonical TypeScript contract lives at:

```text
contracts/academy-ledger.ts
```

```ts
type AcademyLedgerEvent = Readonly<{
  gameId: string;
  runId: string;
  sequence: number;
  eventId: string;
  kind: string;
  title: string;
  summary: string;
  phase?: string;
  turn?: number;
  details?: Readonly<Record<string, unknown>>;
}>;
```

Message kinds:

- `tga:ledger-event` — one immutable incremental receipt;
- `tga:ledger-snapshot` — complete current-run projection;
- `tga:ledger-request-snapshot` — Hub request after load or reconnection.

## Contract Laws

1. `sequence`, not wall-clock time, owns ordering.
2. Re-rendering must not create duplicate receipts.
3. Event receipts are immutable after publication.
4. A reset creates a new `runId` and replaces the Hub projection.
5. The game must answer a valid snapshot request for its own `gameId`.
6. The Hub accepts messages only from the active iframe and active game identity.
7. A snapshot must contain one run, unique event IDs, and unique sequence numbers.
8. Local immediate feedback and complete historical feedback must not become independently maintained histories.
9. The Hub Ledger is presentation-only and may never become simulation authority.

## Card Goblin Duel Publisher

Card Goblin Duel uses game identity `tga-04` and publishes authored receipts for:

- new duel;
- card selected;
- card effect committed;
- Guard or Stun applied;
- Spark replacement requested;
- Spark replacement chosen;
- enemy response;
- skipped draw;
- victory or defeat;
- reset into a new run.

The game keeps only current exchange feedback near the table. Complete ordered history belongs to the Hub Ledger.

A live iframe handshake proved one Guard transition as:

```text
1 run.started
2 card.selected
3 card.effect
4 status.applied
5 enemy.response
```

All five receipts shared one run identity, and a later Hub snapshot request restored the same ordered history.

## Dungeon Key Run Publisher

Dungeon Key Run uses game identity `tga-05` and publishes authored receipts for:

- a new Ruin Hall run;
- committed or blocked movement;
- Thug patrol consequences;
- gold-key collection;
- locked-exit attempts;
- the exit opening;
- victory or defeat;
- reset into a replacement run;
- snapshot recovery after Hub request or reconnection.

The frozen Level 5 simulation remains authoritative. Its existing local movement trace is not replaced or rewritten; the adapter reads each completed simulation transition and authors immutable Hub receipts from those facts. Rendering and animation never publish receipts.

A live parent/iframe handshake proved:

- the initial `run.started` snapshot;
- a requested replacement snapshot for the same run;
- ordered `movement.committed` and `enemy.patrolled` incremental events;
- `key.collected`, `exit.unlocked`, and terminal `run.victory` events;
- reset into a new `runId`;
- terminal `run.defeat` followed by a complete requested snapshot;
- zero browser or page errors across the handshake.

## Dice Duel Tavern Backfill

Dice Duel Tavern already has compact local `Last Exchange` feedback and previously had a fuller combat history. It requires a separate bounded retrofit after Card Goblin Duel completes Human Review.

That lane may:

- publish roll request and roll result;
- publish selected action;
- publish attack, heal, or block resolution;
- publish opponent response;
- publish HP consequences;
- publish terminal outcome;
- preserve compact `Last Exchange` feedback;
- remove or redirect the local History control to the Hub Ledger.

That lane must not reopen Dice visuals, DieRig, tavern composition, probability, mechanics, or curriculum.

## Capability Declaration Follow-up

A later shared-shell lane should add an explicit per-game declaration such as:

```json
{
  "hubCapabilities": {
    "ledger": "causal-events"
  }
}
```

Games without authored history may declare `"ledger": "none"`, allowing the Hub to hide or disable the control rather than show an empty surface. This capability declaration is recorded here but is not implemented by H6.20C.

## Current Adoption State

| Game | Local immediate feedback | Hub Ledger publisher |
|---|---|---|
| Button Goblin Clicker | Game-local status only | None |
| Potion Sorter | Game-local status only | None |
| Dice Duel Tavern | `Last Exchange` | Pending separate backfill |
| Card Goblin Duel | Current resolution/result | Implemented in H6.20C |
| Dungeon Key Run | Simulation-owned movement trace | Implemented for Ruin Hall |

No other game is implicitly opted into the ledger contract.
