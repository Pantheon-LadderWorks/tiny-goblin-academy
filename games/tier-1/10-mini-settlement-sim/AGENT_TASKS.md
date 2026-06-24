# Level 10: Mini Settlement Sim - Tasks

## Implementation Stop Instruction
**After patching the docs, stop for final implementation authorization. Do not create `src`/`public`/`package` files yet.**

## Tooling Rules
* Use `pnpm`.
* Do not run `npm install`.
* If `npm` is accidentally used, remove `node_modules` and `package-lock.json`, then run `pnpm install`.

## Skill Lane
Use: `game-studio` → `web-game-foundations` → `phaser-2d-game` → `game-ui-frontend` → `game-playtest`

Also require:
* `test-driven-development`
* `systematic-debugging` when behavior is wrong
* `verification-before-completion`

*(Do not use `sprite-pipeline` unless Kryssie explicitly approves resident sprite/animation work.)*

## Tests Required
Implement unit tests covering:
- [ ] initial state.
- [ ] selecting priority does not advance day.
- [ ] Forage adds food after consumption.
- [ ] Chop adds wood after consumption.
- [ ] Build spends 3 wood and adds 1 shelter.
- [ ] Build with insufficient wood logs/does nothing except daily consumption.
- [ ] each day consumes 3 food.
- [ ] starvation defeat when Food < 0 after consumption.
- [ ] starvation defeat short-circuits before priority production can rescue the settlement.
- [ ] Day 5 storm defeat if Shelter < 2.
- [ ] Day 5 Build can prevent storm defeat if priority resolves before event.
- [ ] victory at end of Day 10 without defeat.
- [ ] Day 10 victory does not increment to Day 11.
- [ ] terminal lock prevents priority/advance mutation after Victory/Defeat.
- [ ] reset restores initial state.
- [ ] ledger logs discrete daily events.
