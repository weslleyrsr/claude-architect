import anthropic
import json
from dataclasses import dataclass, field

client = anthropic.Anthropic()


@dataclass
class Finding:
    document: str
    summary: str
    key_points: list[str]


class DocumentAnalyzer:
    def __init__(self, compaction_threshold: int = 10_000):
        self.compaction_threshold = compaction_threshold
        self.findings: list[Finding] = []
        self.messages: list[dict] = [
            {"role": "user", "content": "You are a document analyst. Analyze documents and respond with JSON: {\"summary\": string, \"keyPoints\": string[]}"},
            {"role": "assistant", "content": "Understood. I'll analyze each document and respond with JSON."},
        ]

    def _estimate_tokens(self) -> int:
        return len(json.dumps(self.messages)) // 4

    def _compact(self) -> None:
        print(f"  [Compacting at ~{self._estimate_tokens()} tokens]")
        summary = "\n".join(f"{f.document}: {f.summary}" for f in self.findings)
        self.messages = [
            {"role": "user", "content": f"You are a document analyst. Previous findings:\n{summary}\n\nContinue analyzing. Respond with JSON: {{\"summary\": string, \"keyPoints\": string[]}}"},
            {"role": "assistant", "content": "Understood, I have the previous context."},
        ]

    def analyze_document(self, doc_name: str, content: str) -> Finding:
        if self._estimate_tokens() > self.compaction_threshold:
            self._compact()

        self.messages.append({"role": "user", "content": f"Analyze ({doc_name}):\n\n{content}"})

        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=512,
            messages=self.messages,
        )
        raw = response.content[0].text
        cleaned = raw.strip().lstrip("```json\n").rstrip("```").strip()

        try:
            parsed = json.loads(cleaned)
        except Exception:
            parsed = {"summary": raw[:100], "keyPoints": []}

        self.messages.append({"role": "assistant", "content": raw})

        finding = Finding(
            document=doc_name,
            summary=parsed.get("summary", raw[:100]),
            key_points=parsed.get("keyPoints", []),
        )
        self.findings.append(finding)
        return finding


analyzer = DocumentAnalyzer(compaction_threshold=5_000)
documents = [
    ("report-q1.txt", "Q1 revenue $2.3M, up 15%. Enterprise sales up 40%."),
    ("report-q2.txt", "Q2 slowdown: $2.1M. Marketing up. Product launch delayed."),
    ("report-q3.txt", "Q3 recovery: $2.8M. New product launched, positive reviews."),
    ("report-q4.txt", "Q4 strong: $3.5M. All contracts renewed. 45 employees."),
    ("forecast.txt", "2025 target: $15M. 2 new product lines. Hiring 20 more."),
]

for name, content in documents:
    f = analyzer.analyze_document(name, content)
    print(f"✓ {f.document}: {f.summary}")

print(f"\nAll findings ({len(analyzer.findings)}):")
for f in analyzer.findings:
    print(f"  - {f.document}: {f.summary}")
