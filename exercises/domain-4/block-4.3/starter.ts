import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

interface ProductData {
  name: string
  price: number
  category: string
  description?: string
}

function validateProduct(data: unknown): string | null {
  // TODO: Return error message if invalid, null if valid
  // Check: name (string), price (number, non-negative), category (string)
  return null
}

async function extractProductData(description: string): Promise<ProductData> {
  // TODO: Implement validation + corrective retry loop
  // 1. Initial prompt asking for JSON extraction
  // 2. Parse response
  // 3. Validate — if fails, add error to messages and retry
  // 4. Max 3 attempts
  // 5. Return default if all fail

  return { name: "Unknown", price: 0, category: "unknown" }
}

// Test
const descriptions = [
  "The ProMax Laptop 15 — ultra-thin aluminum chassis, M3 chip, starting at $1,299. Perfect for creative professionals.",
  "Fresh organic bananas, sold by the bunch. Price: $2.49. Category: produce.",
  "Wireless noise-canceling headphones by SoundCore. Features 30hr battery. MSRP $249.99. Electronics.",
]

Promise.all(descriptions.map(extractProductData)).then(results => {
  results.forEach((r, i) => console.log(`\n${i + 1}:`, r))
}).catch(console.error)
