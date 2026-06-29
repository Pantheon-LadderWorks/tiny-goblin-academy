# Tiny Goblin Academy H3.9.5A - Packaged App Validation Report

## Overview
This report documents the validation alignment and commit audit for the non-blocking dev launcher rewrite (H3.9.5). The primary goal is to ensure the validation path remains the packaged `app.exe` desktop executable and to verify that the `git add .` from the prior commit was safe.

## Audit Results
- **H3.9.5 Commit SHA:** `0b804c2`
- **Git Add Audit:** Passed. The commit only contained 4 expected source files (`lib.rs`, `runtime_status.rs`, `GameDetailPanel.tsx`, `RuntimeStatus.ts`).
- **Unrelated Files Included:** None (no target folders, installers, logs, or generated junk).
- **CodeCraft Touched:** No.
- **Production/Static Artifacts Touched:** No. The static build artifact command remains completely retired from the active roadmap.

## Validation Workflow Alignment
- **Correction Acknowledged:** Validation must occur via the built `app.exe`, NOT `tauri dev`. The previous recommendation to use `pnpm tauri dev` was a hallucination of the workflow.
- **App.exe Rebuilt:** Yes
- **App.exe Path:** `hub/src-tauri/target/release/app.exe`
- **App.exe Timestamp:** `6/28/2026 8:41:07 PM`

## Manual Validation Status
*Pending user execution.*

**Validation Checklist:**
- [ ] app opens normally
- [ ] no `(Not Responding)` in the title bar when clicking `Launch Dev Game`
- [ ] launch button immediately returns control to UI or shows a nonblocking launching state
- [ ] no visible terminal window appears
- [ ] if launch succeeds:
  - [ ] embedded runtime view appears
  - [ ] game loads inside Tauri
  - [ ] `Close Game / Return to Academy` stops the dev server
  - [ ] app returns to Hub
- [ ] if launch fails:
  - [ ] app remains responsive
  - [ ] clear error appears
  - [ ] no orphan server remains

## Post-Validation Checks
*Pending user execution.*

Run the following to verify no orphaned processes remain:
```powershell
netstat -ano | findstr :5101
Get-Process node,pnpm,cmd -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, Path, StartTime
```

## Environment Debt Record
- **Rust Toolchain:** The `tauri dev` path currently fails due to a Rust toolchain/rustup override behavior (`toolchain 'stable-x86_64-pc-windows-msvc' is not installable`). This is recorded as separate environment debt and was deliberately ignored during this pass. Packaged build/test via `pnpm run hub:tauri:build` remains the chosen validation route.
