---
name: study-block
description: Runs a complete study block — theory, exercise, and knowledge check. Use when a student starts any block.
---

# Study Block Runner

This skill runs a complete study block for a given block ID (e.g., "1.1", "3.2").

## Setup

1. Use MCP tool `progress_read` to load student profile (name, language preference, level)
2. Read the curriculum file: `curriculum/domain-<D>/block-<D.B>-*.md`
3. Read the exercise README: `exercises/domain-<D>/block-<D.B>/README.md`
4. Note the start time (you'll estimate time spent at the end)

## Phase 1: Jedi Mode Offer

Before starting theory, offer Jedi Mode (unless this is a beginner student on their first block):

> **Block X.Y — [Title]** (~XX min)
>
> Want to test out of this block with Jedi Mode? (5 scenario questions, need 80% to skip)
> - Yes, test me
> - No, let's study

If they choose Jedi Mode → invoke the `jedi-mode` skill, then return here only if they fail.

## Phase 2: Theory

Walk the student through the curriculum content interactively.

**Do NOT just paste the markdown.** Instead:
1. Introduce the block's core concept in plain language (2-3 sentences)
2. Walk through each major concept section with explanations
3. Use ASCII diagrams from the curriculum or create your own
4. After each major section, pause and ask: "Any questions before we move on?"
5. Highlight exam tips explicitly with: `🎯 Exam Tip:`
6. End theory with a quick recap of the 3-5 most important points

Make this conversational and engaging. The student should feel like they have a tutor.

## Phase 3: Exercise

Show the exercise from `exercises/domain-<D>/block-<D.B>/README.md`.

Tell the student:
> Here's your hands-on exercise. Open `exercises/domain-<D>/block-<D.B>/starter.<ext>` and implement the solution. When you're done, paste your code here and I'll validate it.

(Use `.ts` if language = "ts", `.py` if language = "py")

### Validation Loop (max 3 attempts)

When the student pastes code:
1. Evaluate it yourself against the rubric from `exercises/domain-<D>/block-<D.B>/README.md` (already loaded in Setup). Produce:
   - `passed`: true if score ≥ 70
   - `score`: 0–100 integer
   - `feedback`: 2–4 sentences (what they did well, what's missing)
   - `hints`: 2 specific actionable hints if failed
   - `keyConceptsVerified`: list of rubric criteria the code satisfies
2. Show the result:

**If passed:**
> ✅ **Exercise passed!** Score: X/100
> [feedback from validator]

**If failed (attempt 1 or 2):**
> ❌ **Not quite yet.** Score: X/100
> [feedback from validator]
>
> Hints:
> [hints from validator]
>
> Give it another try! (Attempt X/3)

**If failed (attempt 3):**
> You've hit the max attempts. Let's look at the solution together.

Show the contents of `exercises/domain-<D>/block-<D.B>/solution/` with full explanation of why the solution works. This is a learning moment, not a failure.

Track attempt count for the block report.

## Phase 4: Knowledge Check

Present 3 exam-style multiple choice questions about this block's content.

Format:
```
Knowledge Check — Question X/3

[Scenario description]

A) ...
B) ...
C) ...
D) ...
```

After each answer:
- **Correct:** Brief reinforcement + why it's right
- **Wrong:** Correct answer revealed + clear explanation of the concept

Track score (0-3) for the block report.

## Phase 5: Complete the Block

Invoke the `block-report` skill to:
1. Write the block report
2. Save progress
3. Commit to student branch

Then show:
> 🎉 **Block X.Y complete!**
>
> Quiz: X/3 | Exercise: Pass/Fail (N attempts) | Time: ~XX min
>
> Next recommended: **Block X.Y — [Next Title]** (~XX min)
> Ready to continue? Or type /study to see your dashboard.
