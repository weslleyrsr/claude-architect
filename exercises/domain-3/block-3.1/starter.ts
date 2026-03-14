// Exercise 3.1 — Write the content of a production CLAUDE.md
// Your task: fill in the CLAUDE_MD_CONTENT string with a complete, effective CLAUDE.md
// for the "payment-processor" microservice project.

const CLAUDE_MD_CONTENT = `
# payment-processor

TODO: Write a complete CLAUDE.md for this project following best practices.

Include:
1. Project overview (2-3 sentences)
2. Critical Rules section (4-5 rules with rationale)
3. Architecture overview
4. Tech stack
5. Security/PII section

See the exercise README for details.
`

// Validate your CLAUDE.md meets basic criteria
function validateClaudeMd(content: string): { passed: boolean; issues: string[] } {
  const issues: string[] = []

  if (!content.includes("Critical") && !content.includes("Rules")) {
    issues.push("Missing Critical Rules section")
  }
  if ((content.match(/- \*\*|^\d\./gm) ?? []).length < 4) {
    issues.push("Need at least 4 rules")
  }
  if (!content.toLowerCase().includes("security") && !content.toLowerCase().includes("pii")) {
    issues.push("Missing security/PII mention")
  }
  if (!content.toLowerCase().includes("tech stack") && !content.toLowerCase().includes("typescript")) {
    issues.push("Missing tech stack section")
  }
  if (content.split("\n").length > 300) {
    issues.push("Too long — keep under 300 lines")
  }

  return { passed: issues.length === 0, issues }
}

const result = validateClaudeMd(CLAUDE_MD_CONTENT)
if (result.passed) {
  console.log("✅ CLAUDE.md looks good!")
} else {
  console.log("Issues found:")
  result.issues.forEach((issue) => console.log(`  ❌ ${issue}`))
}
