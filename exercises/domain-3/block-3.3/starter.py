import os


def validate_refactor_skill(content: str) -> list[str]:
    issues = []
    if "name:" not in content: issues.append("Missing name: frontmatter")
    if "description:" not in content: issues.append("Missing description: frontmatter")
    if "plan mode" not in content.lower() and "enterplanmode" not in content.lower():
        issues.append("Skill should mention Plan Mode or EnterPlanMode")
    if "approval" not in content.lower() and "approve" not in content.lower():
        issues.append("Skill should wait for human approval")
    if not any(line.strip()[:2].rstrip(".").isdigit() for line in content.splitlines()):
        issues.append("Plan should have numbered steps")
    if "exitplanmode" not in content.lower() and "exit plan mode" not in content.lower():
        issues.append("Skill should exit plan mode after approval")
    return issues


path = ".claude/skills/safe-refactor.md"
if not os.path.exists(path):
    print(f"❌ File not found: {path}")
else:
    with open(path) as f:
        content = f.read()
    issues = validate_refactor_skill(content)
    if not issues:
        print("✅ safe-refactor skill looks good!")
    else:
        for i in issues: print(f"  ❌ {i}")
