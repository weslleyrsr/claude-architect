import anthropic
import json
from typing import TypedDict

client = anthropic.Anthropic()


class MeetingData(TypedDict):
    title: str
    date: str
    attendees: list[str]
    action_items: list[str]
    decisions: list[str]


EXTRACTION_TOOL = {
    "name": "extract_meeting_data",
    "description": "Extract and structure data from meeting notes",
    "input_schema": {
        "type": "object",
        "properties": {
            "title": {"type": "string"},
            "date": {"type": "string", "description": "ISO date or 'Unknown'"},
            "attendees": {"type": "array", "items": {"type": "string"}},
            "action_items": {"type": "array", "items": {"type": "string"}},
            "decisions": {"type": "array", "items": {"type": "string"}},
        },
        "required": ["title", "date", "attendees", "action_items", "decisions"],
        "additionalProperties": False,
    },
}

DEFAULTS: MeetingData = {
    "title": "Unknown Meeting",
    "date": "Unknown",
    "attendees": [],
    "action_items": [],
    "decisions": [],
}


def extract_meeting_data(notes: str) -> MeetingData:
    try:
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            temperature=0,
            tools=[EXTRACTION_TOOL],
            tool_choice={"type": "any"},
            messages=[{"role": "user", "content": f"Extract structured data:\n\n{notes}"}],
        )

        for block in response.content:
            if block.type == "tool_use":
                return {**DEFAULTS, **block.input}

        for block in response.content:
            if block.type == "text":
                cleaned = block.text.strip().lstrip("```json\n").rstrip("```").strip()
                return {**DEFAULTS, **json.loads(cleaned)}
    except Exception:
        pass

    return DEFAULTS


sample_notes = """
Meeting with the eng team on March 5th.
Present: Alice (PM), Bob (eng lead), Carol (designer)
We decided to launch on the 15th.
Bob will finish the API by Friday. Carol to update mockups. Alice to send launch email.
"""

print(extract_meeting_data(sample_notes))
