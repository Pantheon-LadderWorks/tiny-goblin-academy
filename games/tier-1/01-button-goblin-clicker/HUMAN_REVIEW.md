# Button Goblin Clicker v0.1 Human Review

## Status

Human Review Passed / Level 1 Source Restored

## How to Run

Use pnpm from the repository root.

Commands:
```bash
pnpm install
pnpm --filter tga-01-button-goblin-clicker dev
pnpm --filter tga-01-button-goblin-clicker test
pnpm --filter tga-01-button-goblin-clicker build
```

Open the local URL provided by the Vite output (usually `http://localhost:5173` or similar).

## What Kryssie Should Verify

Checklist:
- [x] game visibly boots into an actionable screen;
- [x] goblin is visible;
- [x] clicking/bonking goblin visibly decreases HP;
- [x] goblin defeat increases coins;
- [x] buy Bonk Stick upgrade when enough coins exist;
- [x] upgrade changes damage from 1 to 2;
- [x] later goblins have more HP;
- [x] victory appears after 10 goblins;
- [x] loop stays on one screen;
- [x] no v0.2 systems appear;
- [x] visual style feels like a game face, not a generic dashboard.

## Evidence To Capture

Required screenshots or video:
* boot state;
* damaged goblin state;
* defeated/reward state;
* upgrade available or purchased state;
* final victory state.

Recommended paths:
* `evidence/screenshots/`
* `evidence/videos/`
* `evidence/playtest-notes/`

## Manual Review Helper
To capture evidence, use your standard OS screenshot tools (e.g., Snipping Tool on Windows, Cmd+Shift+4 on Mac) and save the files directly into the `evidence/screenshots/` folder. Video captures can be placed in `evidence/videos/`.

## Human Review Decision

Options:
* **Accepted / Counts as restored v0.1**
* Needs Fixes / Does Not Count Yet

State:
Kryssie has passed the Human Review Gate.
