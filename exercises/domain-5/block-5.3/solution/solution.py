import asyncio
from dataclasses import dataclass


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
    trigger: object  # Callable
    message: object  # Callable


class ReviewGatedAgent:
    def __init__(self):
        self.gates: list[ReviewGate] = []
        self.gate_log: list[dict] = []

    def add_gate(self, gate: ReviewGate) -> "ReviewGatedAgent":
        self.gates.append(gate)
        return self

    async def evaluate_gates(self, ctx: TaskContext, get_approval) -> bool:
        triggered = []
        for gate in self.gates:
            did_trigger = gate.trigger(ctx)
            self.gate_log.append({"gate": gate.name, "triggered": did_trigger, "task": ctx.description})
            if did_trigger:
                triggered.append(gate)

        if not triggered:
            return True

        message = "\n\n".join(g.message(ctx) for g in triggered)
        return await get_approval(message)

    async def run_task(self, ctx: TaskContext, task, get_approval) -> None:
        print(f"\nTask: {ctx.description}")
        approved = await self.evaluate_gates(ctx, get_approval)
        if not approved:
            print("  ❌ Task rejected")
            return
        await task()


agent = ReviewGatedAgent()
agent.add_gate(ReviewGate("many-files", lambda ctx: len(ctx.files_modified) > 5, lambda ctx: f"⚠️ Modifies {len(ctx.files_modified)} files."))
agent.add_gate(ReviewGate("db-migration", lambda ctx: ctx.includes_db_migration, lambda ctx: "⚠️ DB schema change."))


async def simulate_approval(message: str) -> bool:
    print(f"  [Review]\n  {message}\n  [Auto-approve: YES]")
    return True


async def main():
    await agent.run_task(
        TaskContext("Fix typo", ["README.md"], False, False, 1),
        lambda: asyncio.sleep(0) or print("  ✓ Fixed"),
        simulate_approval
    )
    await agent.run_task(
        TaskContext("Refactor auth", [f"auth/f{i}.ts" for i in range(8)], False, False, 340),
        lambda: asyncio.sleep(0) or print("  ✓ Refactored"),
        simulate_approval
    )
    print("\nGate log:", agent.gate_log)


asyncio.run(main())
