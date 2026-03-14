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


def extract_meeting_data(notes: str) -> MeetingData:
    """TODO: Extract structured data from meeting notes"""
    return MeetingData(
        title="TODO",
        date="Unknown",
        attendees=[],
        action_items=[],
        decisions=[],
    )


sample_notes = """
Meeting with the eng team on March 5th.
Present: Alice (PM), Bob (eng lead), Carol (designer)
We decided to launch on the 15th.
Bob will finish the API by Friday. Carol needs to update the mockups.
Alice to send the launch email.
"""

print(extract_meeting_data(sample_notes))
