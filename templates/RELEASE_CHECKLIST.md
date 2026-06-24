# Release / Next-State Checklist — <game name>

Use this only after v0.1 has browser playtest evidence and Kryssie’s Human Review Gate has been completed.

## Preconditions

- [ ] Playable Loop Contract is approved and preserved.
- [ ] Exactly one v0.1 loop was built; no unapproved expansion was folded in.
- [ ] Required playtest evidence is recorded in `PLAYTEST_REPORT.md`.
- [ ] Stop conditions were checked and any finding is resolved or explicitly accepted.
- [ ] Kryssie has decided whether it counts as playable/fun enough.

## Choose one next state

- [ ] **Stop at Playtested:** the learning objective is complete; move to the next ladder game.
- [ ] **Release:** a separately approved distribution target and release scope exist.
- [ ] **Retire:** preserve evidence and rationale; no further work planned.
- [ ] **Propose bounded v0.2:** write a new approval request naming exactly what changes and why.
- [ ] **Graduate project:** propose a separate repository/submodule only when a verified playable loop and clear maintenance/release reason justify it.

## Release-only checks

- [ ] Target platform and audience are explicitly approved.
- [ ] Build steps are repeatable.
- [ ] Game starts in a useful actionable state.
- [ ] Main verb, success, and failure/recovery states were rechecked in the release build.
- [ ] HUD/menu remains readable at supported viewport sizes.
- [ ] Known limitations are documented.
- [ ] No secrets, private assets, or unapproved project material are included.

## Record

- **Chosen next state:** <state>
- **Decision date:** <timestamp>
- **Kryssie approval/reference:** <reference>
- **Rationale:** <why this is the correct next state>
