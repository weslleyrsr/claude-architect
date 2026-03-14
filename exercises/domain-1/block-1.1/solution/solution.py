import anthropic
import json

client = anthropic.Anthropic()
MAX_ITERATIONS = 5


def read_file(path: str) -> str:
    return f"""# Simulated file content for {path}
def add(a, b):
    return a + b

def divide(a, b):
    return a / b  # BUG: no zero check
"""


def analyze_code(code: str) -> str:
    if "divide" in code and "b == 0" not in code:
        return "Issue found: divide() has no zero-division guard. Add: if b == 0: raise ValueError('Division by zero')"
    return "No issues found — code looks clean"


def process_tool(name: str, tool_input: dict) -> str:
    if name == "read_file":
        return read_file(tool_input["path"])
    elif name == "analyze_code":
        return analyze_code(tool_input["code"])
    return f"Unknown tool: {name}"


def run_code_review_agent(file_path: str) -> str:
    tools = [
        {"name": "read_file", "description": "Read file contents",
         "input_schema": {"type": "object", "properties": {"path": {"type": "string"}}, "required": ["path"]}},
        {"name": "analyze_code", "description": "Analyze code for issues",
         "input_schema": {"type": "object", "properties": {"code": {"type": "string"}}, "required": ["code"]}},
    ]

    messages = [{"role": "user", "content": f"Review the code in {file_path} for issues. Use read_file first, then analyze_code."}]

    iterations = 0
    final_response = ""

    while iterations < MAX_ITERATIONS:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            tools=tools,
            messages=messages,
        )
        iterations += 1

        if response.stop_reason == "end_turn":
            for block in response.content:
                if block.type == "text":
                    final_response = block.text
            break

        if response.stop_reason == "tool_use":
            messages.append({"role": "assistant", "content": response.content})

            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    result = process_tool(block.name, block.input)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                    })

            messages.append({"role": "user", "content": tool_results})

    if iterations >= MAX_ITERATIONS and not final_response:
        final_response = "Max iterations reached — partial analysis completed"

    return final_response


if __name__ == "__main__":
    print(run_code_review_agent("src/math.py"))
