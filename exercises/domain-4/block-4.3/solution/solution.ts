import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

interface ProductData {
  name: string
  price: number
  category: string
  description?: string
}

function validateProduct(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return "Response must be a JSON object"
  const d = data as Record<string, unknown>
  if (typeof d.name !== "string" || !d.name) return "Missing or invalid 'name' field (must be non-empty string)"
  if (typeof d.price !== "number") return `Invalid 'price' field: got ${typeof d.price}, expected number`
  if (d.price < 0) return `Invalid 'price': ${d.price} is negative`
  if (typeof d.category !== "string" || !d.category) return "Missing or invalid 'category' field"
  return null
}

const SYSTEM_PROMPT = `Extract product data from descriptions. Output ONLY valid JSON:
{"name": "<product name>", "price": <number>, "category": "<category>", "description": "<optional summary>"}
No markdown fences. price must be a number (not string).`

async function extractProductData(description: string): Promise<ProductData> {
  const defaults: ProductData = { name: "Unknown Product", price: 0, category: "uncategorized" }
  const messages: Anthropic.MessageParam[] = [{
    role: "user",
    content: `Extract product data from this description:\n\n${description}`
  }]

  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      temperature: 0,
      system: SYSTEM_PROMPT,
      messages,
    })

    const raw = response.content[0].type === "text" ? response.content[0].text : ""
    const cleaned = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim()

    let parsed: unknown
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      // Add corrective prompt for parse failure
      messages.push({ role: "assistant", content: raw })
      messages.push({ role: "user", content: `Your response was not valid JSON. Error: invalid JSON syntax. Please respond with ONLY a valid JSON object, no other text.` })
      continue
    }

    const error = validateProduct(parsed)
    if (!error) return parsed as ProductData

    // Corrective retry with specific error
    messages.push({ role: "assistant", content: raw })
    messages.push({ role: "user", content: `Validation failed: ${error}. Please fix this specific issue and return the corrected JSON.` })
  }

  return defaults
}

const descriptions = [
  "The ProMax Laptop 15 — ultra-thin aluminum chassis, M3 chip, starting at $1,299.",
  "Fresh organic bananas. Price: $2.49. Category: produce.",
  "Wireless noise-canceling headphones. MSRP $249.99. Electronics.",
]

Promise.all(descriptions.map(extractProductData))
  .then(results => results.forEach((r, i) => console.log(`\n${i+1}:`, r)))
  .catch(console.error)
