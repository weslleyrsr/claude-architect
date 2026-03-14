import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

interface MeetingData {
  title: string
  date: string              // ISO date or "Unknown"
  attendees: string[]
  action_items: string[]
  decisions: string[]
}

// TODO: Implement extraction
// Use tool-use trick OR instruction + fence stripping
async function extractMeetingData(notes: string): Promise<MeetingData> {
  return {
    title: "TODO",
    date: "Unknown",
    attendees: [],
    action_items: [],
    decisions: [],
  }
}

// Test
const sampleNotes = `
Meeting with the eng team on March 5th.
Present: Alice (PM), Bob (eng lead), Carol (designer)
We decided to launch on the 15th.
Bob will finish the API by Friday.
Carol needs to update the mockups.
Alice to send the launch email.
`

extractMeetingData(sampleNotes).then(console.log).catch(console.error)
