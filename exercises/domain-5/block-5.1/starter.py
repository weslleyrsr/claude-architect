import anthropic
from dataclasses import dataclass, field

client = anthropic.Anthropic()


@dataclass
class Finding:
    document: str
    summary: str
    key_points: list[str]


class DocumentAnalyzer:
    def __init__(self, compaction_threshold: int = 10_000):
        self.messages: list[dict] = []
        self.findings: list[Finding] = []
        self.compaction_threshold = compaction_threshold

    def _estimate_tokens(self) -> int:
        """TODO: Estimate tokens from messages (chars / 4)"""
        return 0

    def _compact(self) -> None:
        """TODO: Summarize findings, replace messages with compact summary"""
        print("  [Compacting context...]")

    def analyze_document(self, doc_name: str, content: str) -> Finding:
        """TODO: Analyze document with context management"""
        return Finding(document=doc_name, summary="TODO", key_points=[])


analyzer = DocumentAnalyzer(compaction_threshold=5_000)

documents = [
    ("report-q1.txt", "Q1 revenue $2.3M, up 15%. Enterprise sales up 40%."),
    ("report-q2.txt", "Q2 slowdown: $2.1M. Marketing up. Product launch delayed."),
    ("report-q3.txt", "Q3 recovery: $2.8M. New product launched, positive reviews."),
    ("report-q4.txt", "Q4 strong: $3.5M. All major contracts renewed. 45 employees."),
    ("forecast.txt", "2025 target: $15M. 2 new product lines. Hiring 20 more."),
]

for name, content in documents:
    finding = analyzer.analyze_document(name, content)
    print(f"Analyzed: {finding.document}")

print(f"\nTotal findings: {len(analyzer.findings)}")
