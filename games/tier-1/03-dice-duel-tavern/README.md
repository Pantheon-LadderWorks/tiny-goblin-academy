# Dice Duel Tavern

> **Current status:** Playable, build-capable, human runtime reviewed, human visual reviewed, and runtime-approved. The v0.1 mechanical lesson and Tier 1.5 visual-integration lesson are closed. Dice Duel has no standalone game executable and has not been tested as a production/distribution catalog entry.

## Current duel

Dice Duel Tavern is one compact turn-based fight against the Goblin Brawler inside the Crooked Six tavern.

Each player turn follows one explicit authority sequence:

`roll → rolling → action → enemy response → next roll or terminal result`

One shared authoritative d6 determines the value of exactly one player choice:

- **Attack** deals the rolled value.
- **Heal** restores the rolled value, capped at 10 HP.
- **Block** reduces the immediate deterministic three-damage Goblin Brawler response.

The simulation owns HP, action legality, the committed roll, logs, and victory/defeat. Production rolls come from Web Crypto with unbiased rejection sampling. Tests and evidence use injected deterministic roll sources without changing production authority.

## Presentation

- One persistent six-face Phaser Mesh2D `DieRig` leaves the player-side ready station, tumbles through two bounded impacts, settles in the shared tray, and returns as the same actor.
- Full and reduced-motion paths reveal the same already-committed result.
- The stage-first Crooked Six tavern keeps compact HP plaques, the dark shared rolling tray, asymmetric wager props, and deliberate negative space around motion.
- The latest causal exchange remains visible; complete simulation history opens in a contextual drawer.
- Terminal victory and defeat plaques preserve both HP authorities and the final settled die.
- Academy-local typography and existing approved timber, wood, dark-metal, brass, and mapped Dice Duel assets provide the final visual grammar.
- No replay/reset, particles, shaders, audio, equipment, extra dice, or expanded combat system is present.

## Development

From this folder:

```powershell
pnpm dev
```

Production web build, including the protected DieRig laboratory entry:

```powershell
pnpm build
```

The repository’s packaged or development Academy Hub can launch Dice Duel in repository/developer mode by locating this source workspace and managing its local game server. That behavior is intentional for people working from the public repository. It is not a standalone Dice Duel executable, and the separate production/distribution catalog mode was not tested as part of Dice Duel’s closure.

## Learning records

- `PLAYABLE_LOOP_CONTRACT.md` — preserved historical v0.1 mechanical authority.
- `LESSONS_LEARNED.md` — reconstructed mechanical/playable-loop lesson.
- `LESSONS_LEARNED_VISUAL_INTEGRATION.md` — H5.30–H6.12 visual/runtime chapter.
- `PLAYTEST_REPORT.md` — corrected historical v0.1 manual-review record.
- `RELEASE_CHECKLIST.md` — v0.1 archival next-state record; no separate game release claimed.
- `CURRICULUM_CLOSURE.json` — machine-readable current closure flags.
- `evidence/` — committed H6.9–H6.12 responsive, motion, authority, material, and terminal-state proof.

## Authority boundary

The original v0.1 lesson proved a bounded causal turn loop using a fixed test-friendly sequence and primitive presentation. Later H6 work added production randomness, explicit rolling authority, the persistent DieRig, stage-first tavern presentation, materials, typography, and mapped assets. Those later capabilities do not retroactively belong to the first prototype.
