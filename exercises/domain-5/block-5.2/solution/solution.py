import asyncio
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import TypeVar, Callable, Awaitable

T = TypeVar("T")


@dataclass
class EscalationRecord:
    step: str
    error: str
    timestamp: str
    resolution: str


class EscalationManager:
    def __init__(self):
        self.escalation_log: list[EscalationRecord] = []
        self._failure_counts: dict[str, int] = {}
        self.RETRY_LIMIT = 3

    def classify_error(self, error: Exception) -> str:
        msg = str(error).lower()
        if "permission" in msg or "eperm" in msg: return "escalate"
        if "safety" in msg or "violation" in msg: return "escalate"
        if "corrupt" in msg: return "escalate"
        if "network" in msg or "econnrefused" in msg: return "retry"
        if "timeout" in msg or "rate limit" in msg: return "retry"
        return "degrade"

    async def handle_with_escalation(self, step_name: str, fn: Callable, required: bool = True):
        attempts = 0
        while True:
            try:
                result = await fn()
                self._failure_counts[step_name] = 0
                return result
            except Exception as err:
                attempts += 1
                classification = self.classify_error(err) if required else "degrade"
                count = self._failure_counts.get(step_name, 0) + 1
                self._failure_counts[step_name] = count

                if classification == "escalate" or count >= self.RETRY_LIMIT:
                    resolution = f"Escalated after {count} failures" if count >= self.RETRY_LIMIT else "Escalated: immediate"
                    self.escalation_log.append(EscalationRecord(
                        step=step_name, error=str(err),
                        timestamp=datetime.now(timezone.utc).isoformat(), resolution=resolution
                    ))
                    print(f"  🚨 ESCALATED: {step_name}")
                    return None

                if classification == "degrade":
                    self.escalation_log.append(EscalationRecord(
                        step=step_name, error=str(err),
                        timestamp=datetime.now(timezone.utc).isoformat(), resolution="Degraded"
                    ))
                    print(f"  ⚠️ DEGRADED: {step_name}")
                    return None

                print(f"  🔄 Retry {attempts} for {step_name}: {err}")
                await asyncio.sleep(0.1 * attempts)


async def main():
    manager = EscalationManager()
    attempts = 0

    async def fetch_data():
        nonlocal attempts
        attempts += 1
        if attempts < 3:
            raise ConnectionError("ECONNREFUSED: network error")
        return {"data": "success"}

    print("Step 1:", await manager.handle_with_escalation("fetch-data", fetch_data))
    print("Step 2:", await manager.handle_with_escalation("write-db", lambda: (_ for _ in ()).throw(PermissionError("EPERM: permission denied"))))
    print("Step 3:", await manager.handle_with_escalation("generate-chart", lambda: (_ for _ in ()).throw(RuntimeError("Chart unavailable")), required=False))
    print("\nEscalation log:", manager.escalation_log)


asyncio.run(main())
