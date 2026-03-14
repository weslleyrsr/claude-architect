// Exercise 3.3 — Create .claude/skills/safe-refactor.md
// This validator checks your skill file structure

import fs from "fs"

function validateRefactorSkill(content: string): string[] {
  const issues: string[] = []
  if (!content.includes("name:")) issues.push("Missing name: frontmatter")
  if (!content.includes("description:")) issues.push("Missing description: frontmatter")
  if (!content.toLowerCase().includes("plan mode") && !content.toLowerCase().includes("enterplanmode")) {
    issues.push("Skill should mention Plan Mode or EnterPlanMode")
  }
  if (!content.toLowerCase().includes("approval") && !content.toLowerCase().includes("approve")) {
    issues.push("Skill should wait for human approval")
  }
  if (!/\d\./m.test(content)) issues.push("Plan should have numbered steps")
  if (!content.toLowerCase().includes("exitplanmode") && !content.toLowerCase().includes("exit plan mode")) {
    issues.push("Skill should exit plan mode after approval")
  }
  return issues
}

const skillPath = ".claude/skills/safe-refactor.md"
if (!fs.existsSync(skillPath)) {
  console.log(`❌ File not found: ${skillPath}`)
} else {
  const content = fs.readFileSync(skillPath, "utf8")
  const issues = validateRefactorSkill(content)
  if (issues.length === 0) {
    console.log("✅ safe-refactor skill looks good!")
  } else {
    issues.forEach((i) => console.log(`  ❌ ${i}`))
  }
}
