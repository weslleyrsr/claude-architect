import json
import os
from datetime import datetime, timezone
from typing import Callable, Awaitable
import asyncio

StepFn = Callable[[str], Awaitable[None]]


class ResumablePipeline:
    def __init__(self, state_file: str):
        self.state_file = state_file
        self.steps: list[tuple[str, StepFn]] = []

    def add_step(self, name: str, fn: StepFn) -> "ResumablePipeline":
        self.steps.append((name, fn))
        return self

    def _load_state(self) -> dict:
        # TODO: Load from self.state_file (return default if not found)
        return {"completed_steps": [], "last_updated": datetime.now(timezone.utc).isoformat()}

    def _save_state(self, state: dict) -> None:
        # TODO: Write state to self.state_file as JSON
        pass

    async def run(self) -> None:
        # TODO:
        # 1. Load state
        # 2. Skip completed steps
        # 3. Execute remaining steps
        # 4. Save state after each step
        print("TODO: implement resumable run")


# Demo
STATE_FILE = "/tmp/pipeline_state.json"
if os.path.exists(STATE_FILE):
    os.remove(STATE_FILE)

pipeline = ResumablePipeline(STATE_FILE)


async def step_fetch(name: str):
    print(f"  ✓ {name}: fetched data")


async def step_transform(name: str):
    print(f"  ✓ {name}: transformed data")
    raise RuntimeError("Simulated interruption!")


async def step_save(name: str):
    print(f"  ✓ {name}: saved results")


pipeline.add_step("step-1-fetch", step_fetch)
pipeline.add_step("step-2-transform", step_transform)
pipeline.add_step("step-3-save", step_save)


async def main():
    print("=== Run 1 (will be interrupted) ===")
    try:
        await pipeline.run()
    except Exception:
        print("Interrupted. Now resuming...\n")
        print("=== Run 2 (should skip steps 1 & 2) ===")
        await pipeline.run()
        print("Pipeline complete!")


asyncio.run(main())
