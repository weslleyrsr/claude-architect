// Exercise 3.2 — Your actual output is markdown files, not TypeScript!
// This file validates that you've created the correct markdown files.
// Create these two files:
//   .claude/commands/standup.md
//   .claude/skills/generate-standup.md
// Then run this validator.

import fs from "fs"
import path from "path"

function validateCommandFile(content: string): string[] {
  const issues: string[] = []
  if (!content.includes("description:")) issues.push("Command missing description: frontmatter")
  if (!content.includes("$ARGUMENTS") && !content.includes("default")) issues.push("Command should use $ARGUMENTS or have a default period")
  if (!content.toLowerCase().includes("generate-standup") && !content.toLowerCase().includes("standup skill")) {
    issues.push("Command should invoke generate-standup skill")
  }
  return issues
}

function validateSkillFile(content: string): string[] {
  const issues: string[] = []
  if (!content.includes("name:")) issues.push("Skill missing name: frontmatter")
  if (!content.includes("description:")) issues.push("Skill missing description: frontmatter")
  if (!content.toLowerCase().includes("done") && !content.toLowerCase().includes("completed")) {
    issues.push("Skill should include 'done/completed' section")
  }
  if (!content.toLowerCase().includes("planned") && !content.toLowerCase().includes("next")) {
    issues.push("Skill should include 'planned/next' section")
  }
  return issues
}

const commandPath = ".claude/commands/standup.md"
const skillPath = ".claude/skills/generate-standup.md"

let allPassed = true

for (const [label, filePath, validator] of [
  ["Command", commandPath, validateCommandFile],
  ["Skill", skillPath, validateSkillFile],
] as const) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${label} file not found: ${filePath}`)
    allPassed = false
    continue
  }
  const content = fs.readFileSync(filePath, "utf8")
  const issues = validator(content)
  if (issues.length === 0) {
    console.log(`✅ ${label} file looks good!`)
  } else {
    allPassed = false
    issues.forEach((i) => console.log(`  ❌ ${i}`))
  }
}

if (allPassed) console.log("\n🎉 Both files pass validation!")
