import os


def validate_workflow(content: str) -> list[str]:
    issues = []
    if "pull_request" not in content: issues.append("Must trigger on pull_request")
    if "ANTHROPIC_API_KEY:" in content and "secrets." not in content:
        issues.append("ANTHROPIC_API_KEY must come from secrets")
    if "ANTHROPIC_API_KEY" not in content: issues.append("Must reference ANTHROPIC_API_KEY")
    if "claude" not in content: issues.append("Must invoke claude command")
    if "-p" not in content and "--print" not in content:
        issues.append("Should use claude -p for non-interactive mode")
    if "timeout-minutes" not in content: issues.append("Should set a timeout")
    return issues


path = ".github/workflows/ai-review.yml"
if not os.path.exists(path):
    print(f"❌ File not found: {path}")
else:
    with open(path) as f:
        content = f.read()
    issues = validate_workflow(content)
    if not issues:
        print("✅ Workflow looks good!")
    else:
        for i in issues: print(f"  ❌ {i}")
