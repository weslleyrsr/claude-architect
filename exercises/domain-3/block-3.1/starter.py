# Exercise 3.1 — Write the content of a production CLAUDE.md

CLAUDE_MD_CONTENT = """
# payment-processor

TODO: Write a complete CLAUDE.md for this project following best practices.

Include:
1. Project overview (2-3 sentences)
2. Critical Rules section (4-5 rules with rationale)
3. Architecture overview
4. Tech stack
5. Security/PII section

See the exercise README for details.
"""


def validate_claude_md(content: str) -> dict:
    issues = []

    if "Critical" not in content and "Rules" not in content:
        issues.append("Missing Critical Rules section")
    if len([l for l in content.splitlines() if l.startswith("- **") or (l[:2].isdigit() and l[2] == ".")]) < 4:
        issues.append("Need at least 4 rules")
    if "security" not in content.lower() and "pii" not in content.lower():
        issues.append("Missing security/PII mention")
    if "tech stack" not in content.lower() and "typescript" not in content.lower():
        issues.append("Missing tech stack section")
    if len(content.splitlines()) > 300:
        issues.append("Too long — keep under 300 lines")

    return {"passed": len(issues) == 0, "issues": issues}


result = validate_claude_md(CLAUDE_MD_CONTENT)
if result["passed"]:
    print("✅ CLAUDE.md looks good!")
else:
    print("Issues found:")
    for issue in result["issues"]:
        print(f"  ❌ {issue}")
