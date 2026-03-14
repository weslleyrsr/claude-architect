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
        self.pre_hooks.append(hook)
        return self

    def add_post_hook(self, hook: HookFn) -> "WorkflowEngine":
        self.post_hooks.append(hook)
        return self

    async def run(self, initial_context: dict = {}) -> dict:
        context = dict(initial_context)

        for name, step_fn in self.steps:
            skip = False
            for hook in self.pre_hooks:
                result = hook(name, context)
                if result is False:
                    skip = True
                    break

            if not skip:
                print(f"▶ Running: {name}")
                context = step_fn(context)
            else:
                print(f"⏭ Skipped: {name}")

            for hook in self.post_hooks:
                hook(name, context)

        return context


engine = WorkflowEngine()
engine.add_step("read", lambda ctx: {**ctx, "document": "Hi", "word_count": 1})
engine.add_step("transform", lambda ctx: {**ctx, "document": ctx["document"].upper()})
engine.add_step("save", lambda ctx: {**ctx, "saved": True})


def block_short_docs(step_name: str, ctx: dict) -> bool | None:
    if step_name == "save" and ctx.get("word_count", 0) < 5:
        print("  🚫 Pre-hook blocked save: document too short")
        return False


def log_completion(step_name: str, ctx: dict) -> None:
    print(f"  ✓ Post-hook: {step_name} done. Keys: {list(ctx.keys())}")


engine.add_pre_hook(block_short_docs)
engine.add_post_hook(log_completion)


async def main():
    result = await engine.run({"filename": "test.txt"})
    print("Final context:", result)


asyncio.run(main())
