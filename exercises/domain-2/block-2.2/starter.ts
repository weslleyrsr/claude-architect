interface ToolResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
  retryable?: boolean
  suggestion?: string
}

interface FetchResult {
  status: number
  body: string
}

// Simulate an HTTP fetch (replace with real fetch in production)
async function simulateFetch(url: string): Promise<FetchResult> {
  // Randomly fail to simulate real network behavior
  const rand = Math.random()
  if (rand < 0.3) throw new Error("ECONNREFUSED: connection refused")  // network error
  if (rand < 0.5) return { status: 503, body: "Service Unavailable" }  // transient
  if (url.includes("missing")) return { status: 404, body: "Not Found" }  // permanent
  return { status: 200, body: `<html>Content of ${url}</html>` }
}

// TODO: Implement robustFetchTool
// - Retry up to 3 times for 5xx / network errors (exponential backoff)
// - Do NOT retry for 4xx errors
// - Return ToolResult (never throw)
async function robustFetchTool(url: string): Promise<ToolResult<FetchResult>> {
  // TODO: implement
  return { success: false, error: "Not implemented" }
}

// Test it
async function main() {
  console.log("Testing with valid URL:")
  console.log(await robustFetchTool("https://example.com/page"))

  console.log("\nTesting with missing URL (404 — should not retry):")
  console.log(await robustFetchTool("https://example.com/missing"))
}

main()
