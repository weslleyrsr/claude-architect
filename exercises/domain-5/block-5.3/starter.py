import asyncio
from dataclasses import dataclass, field
from typing import Callable, Awaitable


@dataclass
class TaskContext:
    description: str
    files_modified: list[str]
    includes_db_migration: bool
    is_deployment: bool
    lines_changed: int


@dataclass
class ReviewGate:
    name: str
    trigger: Callable[[TaskContext], bool]
    message: Callable[[TaskContext], str]


class ReviewGatedAgent:
    def __init__(self):
        self.gates: list[ReviewGate] = []
        self.gate_log: list[dict] = []

    def add_gate(self, gate: ReviewGate) -> "ReviewGatedAgent":
        self.gates.append(gate)
        return self

    async def evaluate_gates(self, ctx: TaskContext, get_approval: Callable) -> bool:
        """TODO: Evaluate all gates, request approval for triggered ones"""
        return True

    async def run_task(self, ctx: TaskContext, task: Callable, get_approval: Callable) -> None:
        """TODO: Evaluate gates then run task if approved"""
        print(f"Running: {ctx.description}")


agent = ReviewGatedAgent()
agent.add_gate(ReviewGate(
    name="many-files",
    trigger=lambda ctx: len(ctx.files_modified) > 5,
    message=lambda ctx: f"⚠️ This task modifies {len(ctx.files_modified)} files.",
))
agent.add_gate(ReviewGate(
    name="db-migration",
    trigger=lambda ctx: ctx.includes_db_migration,
    message=lambda ctx: "⚠️ Database schema change detected.",
))


async def simulate_approval(message: str) -> bool:
    print(f"\n[Review]\n{message}\n[Auto-approve: YES]")
    return True


async def main():
    await agent.run_task(
        TaskContext("Fix typo", ["README.md"], False, False, 1),
        lambda: print("  ✓ Fixed"),
        simulate_approval
    )
    await agent.run_task(
        TaskContext("Refactor auth", [f"auth/f{i}.ts" for i in range(8)], False, False, 340),
        lambda: print("  ✓ Refactored"),
        simulate_approval
    )
    print("\nGate log:", agent.gate_log)


asyncio.run(main())
