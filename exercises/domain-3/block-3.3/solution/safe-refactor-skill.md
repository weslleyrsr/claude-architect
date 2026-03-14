---
name: safe-refactor
description: Use when asked to refactor, restructure, or significantly modify TypeScript files. Invoke before any multi-file refactoring to ensure a safe, approved plan exists before any changes are made.
---

# Safe Refactor Skill

This skill ensures all TypeScript refactoring is planned and approved before execution.

## Step 1: Enter Plan Mode

Use EnterPlanMode now. Do not write any code or edit any files until the plan is approved.

## Step 2: Analyze the Target

1. Read the target file(s) specified by the user
2. Identify: imports, exports, function signatures, class structure
3. Note any dependencies (other files that import this one)

## Step 3: Present the Refactoring Plan

Show a numbered plan:

```
Refactoring Plan for [filename]
══════════════════════════════

1. [First change — describe what changes and why]
2. [Second change]
3. [Update imports in dependent files: list them]
4. [Run tests to verify: describe test command]
5. [Final cleanup]

Estimated files affected: N
Reversibility: [easy/moderate/hard] — [brief explanation]
```

## Step 4: Wait for Approval

Ask explicitly:
> "Does this plan look good? You can:
> - Say **'Approved'** to proceed with all steps
> - Say **'Skip step N'** to exclude a step
> - Say **'Modify step N'** to change what that step does
> - Say **'Cancel'** to abort"

## Step 5: Execute After Approval

Only after the human says "Approved" (or an approved variant):

Use ExitPlanMode and begin executing the approved steps in order. After each step, briefly confirm what was done before moving to the next.
