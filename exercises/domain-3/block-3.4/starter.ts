// Exercise 3.4 — Create .github/workflows/ai-review.yml
// This validates the structure of your workflow file

import fs from "fs"

function validateWorkflow(content: string): string[] {
  const issues: string[] = []
  if (!content.includes("pull_request")) issues.push("Must trigger on pull_request")
  if (content.includes("ANTHROPIC_API_KEY:") && !content.includes("secrets.")) {
    issues.push("ANTHROPIC_API_KEY must come from secrets, not hardcoded")
  }
  if (!content.includes("ANTHROPIC_API_KEY")) issues.push("Must reference ANTHROPIC_API_KEY")
  if (!content.includes("claude")) issues.push("Must invoke claude command")
  if (!content.includes("-p") && !content.includes("--print")) issues.push("Should use claude -p for non-interactive mode")
  if (!content.includes("timeout-minutes")) issues.push("Should set a timeout for the Claude step")
  return issues
}

const workflowPath = ".github/workflows/ai-review.yml"
if (!fs.existsSync(workflowPath)) {
  console.log(`❌ File not found: ${workflowPath}`)
} else {
  const content = fs.readFileSync(workflowPath, "utf8")
  const issues = validateWorkflow(content)
  if (issues.length === 0) {
    console.log("✅ Workflow looks good!")
  } else {
    issues.forEach((i) => console.log(`  ❌ ${i}`))
  }
}
