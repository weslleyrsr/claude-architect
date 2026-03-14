import asyncio
import random
from dataclasses import dataclass, field
from typing import TypeVar, Generic

T = TypeVar("T")


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
    """Simulate HTTP fetch with random failures"""
    rand = random.random()
    if rand < 0.3:
        raise ConnectionError("ECONNREFUSED: connection refused")
    if rand < 0.5:
        return FetchResult(503, "Service Unavailable")
    if "missing" in url:
        return FetchResult(404, "Not Found")
    return FetchResult(200, f"<html>Content of {url}</html>")


async def robust_fetch_tool(url: str) -> ToolResult:
    """
    TODO: Implement robust fetch with retry logic
    - Retry up to 3 times for 5xx / network errors (exponential backoff)
    - Do NOT retry for 4xx errors
    - Return ToolResult (never raise to caller)
    """
    return ToolResult(success=False, error="Not implemented")


async def main():
    print("Testing with valid URL:")
    print(await robust_fetch_tool("https://example.com/page"))

    print("\nTesting with missing URL (404 — should not retry):")
    print(await robust_fetch_tool("https://example.com/missing"))


asyncio.run(main())
