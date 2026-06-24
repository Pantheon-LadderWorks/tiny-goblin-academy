# Lessons Learned: Level 8 (One-Room Platformer)

## Physics & Timestep
1. **The Physics Goblin Must Be Supervised**: Relying on pure AABB physics (Horizontal before Vertical resolution) inside a deterministic `tick` loop is vastly superior to using an external physics engine (like Phaser Arcade) for platformers. It allows the game truth to be 100% testable without a DOM.
2. **Fixed Timesteps Are Mandatory**: A fixed timestep (`1/60`) completely eliminates browser frame variance. `deltaSeconds` should just be passed uniformly to the simulation, divorcing game speed from display refresh rates.

## Input Handling
1. **DOM vs Game Loop Syncing**: When mapping DOM buttons to input states that are also driven by Phaser keyboard cursors, the DOM input states must use an `||` condition. Otherwise, an unpressed keyboard key will immediately overwrite the DOM button's `true` state, rendering the DOM controls functionally dead.

## Automation & Playwright
1. **Playwright AABB Quirks**: Writing a Playwright script to automate a platformer requires exact knowledge of jump physics. Because the player has physical width (`32px`), hitting the side of a platform stops all horizontal momentum immediately. The jump execution points must account for the player's parabolic trajectory to avoid head-bonking or missing the platform entirely.
2. **Waiting for State**: `page.waitForFunction` requires explicit timeouts in its `options` object. If `options` are omitted or passed incorrectly, it defaults to a 30s timeout, which can hang CI if the player is dead and `runStatus` is locked.
