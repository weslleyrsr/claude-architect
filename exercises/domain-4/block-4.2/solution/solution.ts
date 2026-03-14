import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

interface MeetingData {
  title: string
  date: string
  attendees: string[]
  action_items: string[]
  decisions: string[]
}

const extractionTool: Anthropic.Tool = {
  name: "extract_meeting_data",
  description: "Extract and structure data from meeting notes",
  input_schema: {
    type: "object" as const,
    properties: {
      title: { type: "string", description: "Meeting title or topic" },
      date: { type: "string", description: "Meeting date in ISO format (YYYY-MM-DD) or 'Unknown'" },
      attendees: { type: "array", items: { type: "string" }, description: "List of attendee names" },
      action_items: { type: "array", items: { type: "string" }, description: "Action items assigned" },
      decisions: { type: "array", items: { type: "string" }, description: "Decisions made" },
    },
    required: ["title", "date", "attendees", "action_items", "decisions"],
    additionalProperties: false,
  },
}

async function extractMeetingData(notes: string): Promise<MeetingData> {
  const defaults: MeetingData = {
    title: "Unknown Meeting",
    date: "Unknown",
    attendees: [],
    action_items: [],
    decisions: [],
  }

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      temperature: 0,
      tools: [extractionTool],
      tool_choice: { type: "any" },
      messages: [{
        role: "user",
        content: `Extract structured data from these meeting notes:\n\n${notes}`,
      }],
    })

    const toolUse = response.content.find((b): b is Anthropic.ToolUseBlock => b.type === "tool_use")
    if (toolUse) {
      return { ...defaults, ...(toolUse.input as Partial<MeetingData>) }
    }

    // Fallback: parse text response
    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text")
    if (textBlock) {
      const cleaned = textBlock.text.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim()
      return { ...defaults, ...JSON.parse(cleaned) }
    }
  } catch { /* fall through to defaults */ }

  return defaults
}

const sampleNotes = `
Meeting with the eng team on March 5th.
Present: Alice (PM), Bob (eng lead), Carol (designer)
We decided to launch on the 15th.
Bob will finish the API by Friday. Carol to update mockups. Alice to send launch email.
`

extractMeetingData(sampleNotes).then(console.log).catch(console.error)
