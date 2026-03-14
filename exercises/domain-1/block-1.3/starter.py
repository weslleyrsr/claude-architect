from typing import Callable, Any
import asyncio

HookFn = Callable[[str, dict], bool | None]
StepFn = Callable[[dict], dict]


class WorkflowEngine:
    def __init__(self):
        self.steps: list[tuple[str, StepFn]] = []
        self.pre_hooks: list[HookFn] = []
        self.post_hooks: list[HookFn] = []

    def add_step(self, name: str, fn: StepFn) -> "WorkflowEngine":
        self.steps.append((name, fn))
        return self

    def add_pre_hook(self, hook: HookFn) -> "WorkflowEngine":
        # TODO: Add hook to self.pre_hooks
        return self

    def add_post_hook(self, hook: HookFn) -> "WorkflowEngine":
        # TODO: Add hook to self.post_hooks
        return self

    async def run(self, initial_context: dict = {}) -> dict:
        context = dict(initial_context)

        for name, step_fn in self.steps:
            # TODO: Run pre_hooks — if any return False, skip this step
            # TODO: Run the step (if not skipped)
            # TODO: Run post_hooks
            print(f"Running step: {name}")

        return context


# Demo: Document processing pipeline
engine = WorkflowEngine()

engine.add_step("read", lambda ctx: {**ctx, "document": "Hello World content", "word_count": 2})
engine.add_step("transform", lambda ctx: {**ctx, "document": ctx["document"].upper()})
engine.add_step("save", lambda ctx: {**ctx, "saved": True})

# TODO: Add a pre_hook that blocks "save" if word_count < 5
# TODO: Add a post_hook that logs step completion


async def main():
    result = await engine.run({"filename": "test.txt"})
    print("Final context:", result)


asyncio.run(main())
