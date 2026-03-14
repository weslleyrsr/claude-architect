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

async function simulateFetch(url: string): Promise<FetchResult> {
  const rand = Math.random()
  if (rand < 0.3) throw new Error("ECONNREFUSED: connection refused")
  if (rand < 0.5) return { status: 503, body: "Service Unavailable" }
  if (url.includes("missing")) return { status: 404, body: "Not Found" }
  return { status: 200, body: `<html>Content of ${url}</html>` }
}

function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

async function robustFetchTool(url: string): Promise<ToolResult<FetchResult>> {
  const MAX_RETRIES = 3

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await simulateFetch(url)

      if (result.status >= 200 && result.status < 300) {
        return { success: true, data: result }
      }

      if (result.status >= 400 && result.status < 500) {
        // Client error — don't retry
        return {
          success: false,
          error: `HTTP ${result.status}: ${result.body}`,
          retryable: false,
          suggestion: result.status === 404
            ? "The URL does not exist. Verify the URL is correct with list_available_pages."
            : "Check request parameters and try a different URL.",
        }
      }

      // 5xx — transient, retry
      if (attempt < MAX_RETRIES - 1) {
        console.log(`  Attempt ${attempt + 1} failed (${result.status}), retrying...`)
        await sleep(1000 * Math.pow(2, attempt))
        continue
      }

      return {
        success: false,
        error: `Server error after ${MAX_RETRIES} attempts: HTTP ${result.status}`,
        retryable: true,
        suggestion: "The server appears to be experiencing issues. Try again later.",
      }

    } catch (err) {
      // Network error — transient, retry
      if (attempt < MAX_RETRIES - 1) {
        console.log(`  Attempt ${attempt + 1} network error, retrying...`)
        await sleep(1000 * Math.pow(2, attempt))
        continue
      }

      return {
        success: false,
        error: `Network error after ${MAX_RETRIES} attempts: ${err}`,
        retryable: true,
        suggestion: "Check network connectivity and try again.",
      }
    }
  }

  return { success: false, error: "Max retries exceeded", retryable: true }
}

async function main() {
  console.log("Testing with valid URL:")
  console.log(await robustFetchTool("https://example.com/page"))
  console.log("\nTesting with missing URL:")
  console.log(await robustFetchTool("https://example.com/missing"))
}

main()
