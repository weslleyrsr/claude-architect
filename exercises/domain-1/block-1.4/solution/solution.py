import json
import os
from datetime import datetime, timezone
import asyncio


class ResumablePipeline:
    def __init__(self, state_file: str):
        self.state_file = state_file
        self.steps = []

    def add_step(self, name, fn):
        self.steps.append((name, fn))
        return self

    def _load_state(self):
        try:
            if os.path.exists(self.state_file):
                with open(self.state_file) as f:
                    return json.load(f)
        except Exception:
            pass
        return {"completed_steps": [], "last_updated": datetime.now(timezone.utc).isoformat()}

    def _save_state(self, state):
        tmp = self.state_file + ".tmp"
        with open(tmp, "w") as f:
            json.dump(state, f, indent=2)
        os.replace(tmp, self.state_file)

    async def run(self):
        state = self._load_state()

        for name, fn in self.steps:
            if name in state["completed_steps"]:
                print(f"  ⏭ Skipped: {name}")
                continue

            await fn(name)

            state["completed_steps"].append(name)
            state["last_updated"] = datetime.now(timezone.utc).isoformat()
            self._save_state(state)


STATE_FILE = "/tmp/pipeline_state.json"
if os.path.exists(STATE_FILE):
    os.remove(STATE_FILE)

pipeline = ResumablePipeline(STATE_FILE)


async def step_fetch(name): print(f"  ✓ {name}: fetched")
async def step_transform(name):
    print(f"  ✓ {name}: transformed")
    raise RuntimeError("Interrupted!")
async def step_save(name): print(f"  ✓ {name}: saved")


pipeline.add_step("step-1-fetch", step_fetch)
pipeline.add_step("step-2-transform", step_transform)
pipeline.add_step("step-3-save", step_save)


async def main():
    print("=== Run 1 ===")
    try:
        await pipeline.run()
    except Exception:
        print("Interrupted.\n=== Run 2 ===")
        await pipeline.run()
        print("Done!")


asyncio.run(main())
