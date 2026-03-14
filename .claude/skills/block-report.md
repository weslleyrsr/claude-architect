---
name: block-report
description: Write a personalized block completion report and commit it to the student branch. Always invoke after completing any study block.
---

# Block Report Writer

After every block completion, write a personalized report and commit it.

## Step 1: Gather Context

You should have from the study session:
- Block ID and title
- Quiz score (0-3)
- Exercise attempts and pass/fail
- Whether Jedi Mode was used
- Approximate time spent (estimate from session)
- Which concepts the student asked questions about (struggles)
- Which questions they got wrong in the quiz

Use MCP tool `progress_read` to get the student's name, language, and history.

## Step 2: Write the Report

Write to `progress/reports/block-<X.Y>-report.md`:

```markdown
# Block X.Y Report — <Title>
Date: <ISO date> | Student: <name> | Language: <ts/py>

## Session Summary
Time: ~XX min | Quiz: X/3 | Exercise: <Pass/Fail> (attempt N of 3) | Mode: <Study/Jedi>

## What You Nailed
<Specific concepts the student demonstrated understanding of — be specific, not generic>
<Reference actual questions they answered correctly or code patterns they used well>

## Where You Struggled
<Specific questions or concepts they got wrong + targeted clarification>
<If they passed Jedi Mode, note any close-call concepts>

## Personalized Tips
<Pattern analysis — if this is not their first block, note any recurring mistake types>
<Language-specific tip if relevant (TS vs Python approach differences)>

## Weak Exam Areas to Watch
<Map their struggles to specific domain/task statement weights>
<e.g., "Task statement 1.3 (multi-agent coordination) was tricky — this is 27% of the exam">

## Next Recommended Block
**Block X.Y — <Title>** (~XX min)
<One sentence on why this block follows naturally from what they just learned>
```

Make this report genuinely useful. Be specific about what THEY did, not generic praise. Mention actual code patterns or specific wrong answers. This report will inform the weak-area-review block.

## Step 3: Save Progress

Use MCP tool `progress_write` with the completed block data:
```json
{
  "data": {
    "blocks": {
      "<blockId>": {
        "status": "completed",
        "completedAt": "<ISO date>",
        "quizScore": <0-3>,
        "exerciseAttempts": <1-3>,
        "timeSpentMinutes": <estimated>,
        "jediMode": false
      }
    }
  }
}
```

## Step 4: Commit

Use MCP tool `git_commit_progress` with message:
`"complete block X.Y - <student name>"`

Confirm the commit succeeded and show the commit hash.
