import anthropic
import json

client = anthropic.Anthropic()
MAX_ITERATIONS = 5


def read_file(path: str) -> str:
    """Simulated tool — returns fake file content"""
    return f"""# Simulated file content for {path}
def add(a, b):
    return a + b

def divide(a, b):
    return a / b  # BUG: no zero check
"""


def analyze_code(code: str) -> str:
    """Simulated tool — basic issue detection"""
    if "divide" in code and "b == 0" not in code and "b != 0" not in code:
        return "Issue found: divide() has no zero-division guard"
    return "No issues found"


def run_code_review_agent(file_path: str) -> str:
    """TODO: Implement the agentic loop"""
    tools = [
        {
            "name": "read_file",
            "description": "Read the contents of a file",
            "input_schema": {
                "type": "object",
                "properties": {"path": {"type": "string"}},
                "required": ["path"],
            },
        },
        {
            "name": "analyze_code",
            "description": "Analyze code for issues",
            "input_schema": {
                "type": "object",
                "properties": {"code": {"type": "string"}},
                "required": ["code"],
            },
        },
    ]

    messages = [
        {
            "role": "user",
            "content": f"Review the code in {file_path} for issues. Use read_file first, then analyze_code.",
        }
    ]

    # TODO: Implement the loop here
    # 1. Call client.messages.create with tools and messages
    # 2. Check stop_reason
    # 3. If "tool_use": process tool calls, add results to messages, continue
    # 4. If "end_turn": done
    # 5. Guard with MAX_ITERATIONS

    return "TODO: return the agent's final analysis"


if __name__ == "__main__":
    result = run_code_review_agent("src/math.py")
    print(result)
