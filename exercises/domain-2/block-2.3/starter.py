import asyncio
import json
from datetime import datetime, timezone


async def handle_list_tools():
    """TODO: Return tool definitions for get_timestamp and calculate"""
    return {
        "tools": [
            # TODO: Define get_timestamp (no inputs)
            # TODO: Define calculate (expression: string)
        ]
    }


async def handle_call_tool(name: str, arguments: dict) -> dict:
    """TODO: Execute the named tool"""
    if name == "get_timestamp":
        # TODO: Return ISO timestamp
        return {"content": [{"type": "text", "text": "TODO"}]}

    if name == "calculate":
        # TODO: Safely evaluate math expression
        return {"content": [{"type": "text", "text": "TODO"}]}

    raise ValueError(f"Unknown tool: {name}")


async def main():
    """Simple stdio MCP server — reads JSON-RPC from stdin, writes to stdout"""
    # NOTE: A real implementation uses the MCP Python SDK
    # For this exercise, implement the tool logic in handle_list_tools and handle_call_tool
    # The stdio framing below is illustrative

    while True:
        line = await asyncio.get_event_loop().run_in_executor(None, input)
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

        response = {"jsonrpc": "2.0", "id": req_id, "result": result}
        print(json.dumps(response), flush=True)


asyncio.run(main())
