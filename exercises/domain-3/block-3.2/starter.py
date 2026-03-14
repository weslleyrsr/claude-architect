# Exercise 3.2 — Your actual output is markdown files, not Python!
# Create: .claude/commands/standup.md AND .claude/skills/generate-standup.md
# Then run this validator.

import os


def validate_command(content: str) -> list[str]:
    issues = []
    if "description:" not in content:
        issues.append("Command missing description: frontmatter")
    if "$ARGUMENTS" not in content and "default" not in content:
        issues.append("Command should use $ARGUMENTS or have a default period")
    if "generate-standup" not in content.lower() and "standup skill" not in content.lower():
        issues.append("Command should invoke generate-standup skill")
    return issues


def validate_skill(content: str) -> list[str]:
    issues = []
    if "name:" not in content:
        issues.append("Skill missing name: frontmatter")
    if "description:" not in content:
        issues.append("Skill missing description: frontmatter")
    if "done" not in content.lower() and "completed" not in content.lower():
        issues.append("Skill should include done/completed section")
    if "planned" not in content.lower() and "next" not in content.lower():
        issues.append("Skill should include planned/next section")
    return issues


checks = [
    (".claude/commands/standup.md", validate_command, "Command"),
    (".claude/skills/generate-standup.md", validate_skill, "Skill"),
]

all_passed = True
for path, validator, label in checks:
    if not os.path.exists(path):
        print(f"❌ {label} file not found: {path}")
        all_passed = False
        continue
    with open(path) as f:
        content = f.read()
    issues = validator(content)
    if not issues:
        print(f"✅ {label} file looks good!")
    else:
        all_passed = False
        for issue in issues:
            print(f"  ❌ {issue}")

if all_passed:
    print("\n🎉 Both files pass validation!")
