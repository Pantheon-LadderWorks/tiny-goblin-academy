# Level 6 Lessons Learned

1. **Action-driven ticks work perfectly for deterministic loops.** Time does not need to flow continuously. By making valid actions push time forward, the simulation becomes a clean, predictable state machine rather than a fuzzy real-time calendar.
2. **"Wait" is an unnecessary verb.** When other valid productive actions (like moving to the next plot and planting/watering it) can advance time cleanly, you don't need a standalone "wait" or "sleep" action to force growth.
3. **Keep the simulation as a state machine.** A farm simulation is effectively a discrete state machine. It is much more robust when treated strictly as states and transitions rather than trying to build a real-time scheduler for a 1-day loop.
4. **Ruthlessly tiny economic scope.** One sell action, one upgrade, one day. Constraining the economy prevents scope creep and focuses the player entirely on understanding the core interaction model.
