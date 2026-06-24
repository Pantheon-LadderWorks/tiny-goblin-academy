# Level 8 Lessons Learned

* **Original lesson:** Fixed-step physics simulation and collisions.
* **Verified lesson:** Pure deterministic simulation core must be isolated from browser timers entirely.
* **Notable drift/correction:** Math and collision ambiguity required exact top-left coordinate contracts.
* **Reusable doctrine:** Deterministic tests prove collision; fixed-step physics is superior to browser time for reliability.

*(Note: This file was backfilled after ladder completion based on existing contracts, reports, and the synthesis document.)*
