# Lessons Learned

* **Determinism is paramount**: Real-time-feeling games should still use deterministic simulation ticks.
* **Separation of Concerns**: Browser timers may drive the UI pulse, but must not own game truth.
* **Testability**: Short survival windows make real-time loops playtestable.
* **Pacing**: Meter decay creates pressure without requiring enemies or hazards.
* **Clarity**: Terminal pet states should be explicit and visible.
