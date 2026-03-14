import asyncio
import json
import re
from datetime import datetime, timezone


def safe_calculate(expression: str) -> float:
    if not re.match(r'^[0-9+\-*/(). \t]+$', expression):
        raise ValueError("Invalid expression: only numbers and basic operators allowed")
    return eval(expression, {"__builtins__": {}}, {})  # noqa: S307


async def handle_list_tools():
    return {
        "tools": [
            {
                "name": "get_timestamp",
                "description": "Get current UTC timestamp in ISO 8601 format",
                "inputSchema": {"type": "object", "properties": {}, "required": []},
            },
            {
                "name": "calculate",
                "description": "Safely evaluate a simple math expression (+, -, *, /, parentheses)",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "expression": {"type": "string", "description": "Math expression, e.g. '(2+3)*4'"}
                    },
                    "required": ["expression"],
                },
            },
        ]
    }


async def handle_call_tool(name: str, arguments: dict) -> dict:
    if name == "get_timestamp":
        return {"content": [{"type": "text", "text": datetime.now(timezone.utc).isoformat()}]}

    if name == "calculate":
        try:
            result = safe_calculate(arguments.get("expression", ""))
            return {"content": [{"type": "text", "text": str(result)}]}
        except Exception as e:
            return {"content": [{"type": "text", "text": f"Error: {e}"}], "isError": True}

    raise ValueError(f"Unknown tool: {name}")


async def main():
    loop = asyncio.get_event_loop()
    while True:
        try:
            line = await loop.run_in_executor(None, input)
            request = json.loads(line)
            method = request.get("method")
            req_id = request.get("id")

            if method == "tools/list":
                result = await handle_list_tools()
            elif method == "tools/call":
                params = request.get("params", {})
                result = await handle_call_tool(params["name"], params.get("arguments", {}))
            else:
                result = {"error": f"Unknown method: {method}"}

            print(json.dumps({"jsonrpc": "2.0", "id": req_id, "result": result}), flush=True)
        except EOFError:
            break


asyncio.run(main())
