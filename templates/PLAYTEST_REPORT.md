# Playtest Report — <game name> v0.1

## Run metadata

- **Date/time:** <timestamp>
- **Build/commit/reference:** <identifier>
- **Browser and viewport:** <environment>
- **Tester:** <name>
- **Contract reviewed:** <link/path>

## Outcome

Pass / Conditional pass / Fail

## Required evidence

| Check | Evidence path/link | Result | Notes |
| --- | --- | --- | --- |
| Useful actionable boot state | evidence/screenshots/<file> | Pass/Fail | <note> |
| Primary verb works | evidence/videos/<file> | Pass/Fail | <note> |
| Immediate feedback is visible | evidence/screenshots/<file> | Pass/Fail | <note> |
| State change is visible | evidence/videos/<file> | Pass/Fail | <note> |
| Success state works | evidence/screenshots/<file> | Pass/Fail/N/A | <note> |
| Failure/reset state works | evidence/screenshots/<file> | Pass/Fail/N/A | <note> |
| HUD protects the playfield | evidence/screenshots/<file> | Pass/Fail | <note> |
| Narrow viewport / input behavior | evidence/playtest-notes/<file> | Pass/Fail | <note> |

## Main-verb test script

1. <action>
2. <expected visible result>
3. <next action>
4. <expected completion or failure result>

## Findings

| Severity | What is observed | Reproduction | Owning boundary | Recommended next action |
| --- | --- | --- | --- | --- |
| <P0-P3> | <finding> | <steps> | Simulation / renderer / UI / input / asset / build | <action> |

## Stop-condition check

- [ ] Game visibly boots into an actionable state.
- [ ] Main verb is playable.
- [ ] No contract-external system was added.
- [ ] UI reads as a game face, not dashboard chrome.
- [ ] State is visible on screen, not only in logs/headless output.
- [ ] Renderer is not the source of truth.

## Agent conclusion

<Whether the contract evidence is satisfied, with limitations.>

## Human Review Gate — Kryssie

- [ ] Accepted: counts as playable/fun enough to advance to **Playtested**.
- [ ] Does not count yet; return to the named blocker.
- [ ] Approved to discuss a bounded v0.2 only after this v0.1 result is accepted.

**Reviewer notes:** <notes>
