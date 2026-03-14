import asyncio
import random
from dataclasses import dataclass


@dataclass
class ToolResult:
    success: bool
    data: dict | None = None
    error: str | None = None
    retryable: bool | None = None
    suggestion: str | None = None


@dataclass
class FetchResult:
    status: int
    body: str


async def simulate_fetch(url: str) -> FetchResult:
    rand = random.random()
    if rand < 0.3:
        raise ConnectionError("ECONNREFUSED")
    if rand < 0.5:
        return FetchResult(503, "Service Unavailable")
    if "missing" in url:
        return FetchResult(404, "Not Found")
    return FetchResult(200, f"<html>Content of {url}</html>")


async def robust_fetch_tool(url: str) -> ToolResult:
    MAX_RETRIES = 3

    for attempt in range(MAX_RETRIES):
        try:
            result = await simulate_fetch(url)

            if 200 <= result.status < 300:
                return ToolResult(success=True, data={"status": result.status, "body": result.body})

            if 400 <= result.status < 500:
                return ToolResult(
                    success=False,
                    error=f"HTTP {result.status}: {result.body}",
                    retryable=False,
                    suggestion="Verify the URL is correct." if result.status == 404 else "Check request parameters.",
                )

            # 5xx — retry
            if attempt < MAX_RETRIES - 1:
                print(f"  Attempt {attempt + 1} failed ({result.status}), retrying...")
                await asyncio.sleep(1.0 * (2 ** attempt))
                continue

            return ToolResult(
                success=False,
                error=f"Server error after {MAX_RETRIES} attempts: HTTP {result.status}",
                retryable=True,
                suggestion="The server is experiencing issues. Try again later.",
            )

        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                print(f"  Attempt {attempt + 1} network error, retrying...")
                await asyncio.sleep(1.0 * (2 ** attempt))
                continue

            return ToolResult(
                success=False,
                error=f"Network error after {MAX_RETRIES} attempts: {e}",
                retryable=True,
                suggestion="Check network connectivity.",
            )

    return ToolResult(success=False, error="Max retries exceeded", retryable=True)


async def main():
    print("Testing valid URL:")
    print(await robust_fetch_tool("https://example.com/page"))
    print("\nTesting missing URL:")
    print(await robust_fetch_tool("https://example.com/missing"))


asyncio.run(main())
