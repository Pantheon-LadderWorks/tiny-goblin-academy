# Tiny Goblin Academy H6.22R2 — Persistent Hand-Slot Authority

**Status:** Implementation, technical browser review, and checkpoint validation complete.

**Committed baseline:** `8ccc6fa7d84aba33cb75410360d7737d774ac449`

**Game:** Level 04 — Card Goblin Duel

**Lane:** Promote governed environmental slot assets into the production three-card hand dock without confusing them with CardRig outer frames.

```yaml
h6_22R1CommittedAndPushed: true
authoritativeHandCapacity: 3
persistentSlotCount: 3
gameplayRulesChanged: false
outerFrameDoctrineChanged: false
h6_22R2ImplementationComplete: true
h6_22R2TechnicalBrowserReviewPassed: true
h6_22R2CheckpointReady: true
productionVfxStarted: false
```

## Authority

`HAND_CAPACITY = 3` is exported by the deterministic simulation and consumed by both draw/refill behavior and presentation. The dock always renders exactly three stable `hand-slot-0..2` groups even when the authoritative hand contains fewer cards.

This preserves the approved gameplay contract. Heavy Bonk still skips its refill; the difference is that its missing card is now represented by a visible environmental vacancy rather than by a shrinking two-column hand.

## Slot state map

Environmental slots remain outside the moving CardRig. They communicate location and interaction state, not rarity or permanent card identity.

| Slot state | Governed surface | Meaning |
|---|---|---|
| occupied | `green-slot` | stable player-hand socket |
| focused | `green-slot` | stable socket plus code-owned focus response |
| selected/incoming | `gold-glow` | reserved transition emphasis |
| replacement | `red-corners` | Spark replacement choice |
| locked | `gray-gold` | terminal/non-actionable location |
| vacant | `green-slot` | stable empty hand position |

The teal environmental slot remains governed but unused in production. No card is permanently paired to an environmental slot surface. True outer-frame selection remains a separate CardRig authority.

## Presentation behavior

- Occupied slot art extends slightly beyond the card silhouette, keeping the environmental socket legible beneath the card.
- SparkChoice renders two red-corner replacement sockets and one green vacancy.
- Heavy Bonk renders two occupied green sockets and one green vacancy.
- Terminal renders two gray/gold locked sockets and one green vacancy for the deterministic victory fixture.
- Empty slots expose a restrained `VACANT` label and remain non-actionable.
- Every occupied card retains one semantic button; the slot wrapper is a labelled group and does not create a duplicate control.

## Focused proof

- simulation and card-view tests prove the shared capacity authority, three stable slots, Heavy Bonk vacancy, replacement surfaces, locked surfaces, and frame/slot separation;
- stage-shell tests prove the environmental rim remains visible beneath occupied cards;
- local Playwright inspection covered default `1280x660`, minimum `1024x580`, SparkChoice, Heavy Bonk vacancy, and Terminal;
- every inspected state rendered three slots, remained document-contained, and produced zero console or page errors.

Temporary browser-review screenshots live outside the repository under the Codex visualization workspace. They are not production evidence and must not be committed.

## Deferred work

This lane does not assign rarity frames, author production VFX, integrate the provisional H6.22A visual recipes, change CardRig routes, alter simulation outcomes, or begin the final Academy typography/UI closure pass.
