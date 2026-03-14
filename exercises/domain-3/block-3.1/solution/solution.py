CLAUDE_MD_CONTENT = """
# payment-processor — Financial Transaction Microservice

This service handles payment processing, refunds, and transaction history for the e-commerce platform. It integrates with Stripe for card processing and stores all transaction records in PostgreSQL. It is a PCI-DSS scoped system.

---

## Critical Rules (Always Follow)

- **Never log card numbers, CVVs, or full PANs** — PCI-DSS scope. Violation = compliance incident.
- **Never commit directly to main** — All changes go through pull requests.
- **Always use Prisma migrations, never raw SQL** — Direct schema changes corrupt the audit trail.
- **Never skip tests for payment logic** — 90%+ coverage required for the payments/ module.
- **Use idempotency keys for all Stripe API calls** — Stripe delivers webhooks multiple times.

---

## Architecture Overview

```
src/
├── api/           REST handlers
├── payments/      Core logic (charge, refund, webhook)
├── db/            Prisma client
├── models/        TypeScript interfaces
└── utils/         Shared utilities
```

Entry: src/index.ts → Express → routes → payment handlers → Prisma

---

## Tech Stack

- Language: TypeScript (strict, Node.js 20)
- Framework: Express 4
- Database: PostgreSQL 15 via Prisma ORM
- Payment: Stripe API v2024
- Testing: Vitest + Supertest (real DB, no mocks)
- Deploy: AWS Lambda + RDS

---

## Security / PII

- PII in scope: email, name, address, card last 4
- Never expose full card data in responses or logs
- All endpoints require JWT auth
- Audit logs: every financial transaction → audit_log table (never delete)
"""


def validate_claude_md(content: str) -> dict:
    issues = []
    if "Critical" not in content and "Rules" not in content:
        issues.append("Missing Critical Rules section")
    if content.count("- **") < 4:
        issues.append("Need at least 4 rules")
    if "security" not in content.lower() and "pii" not in content.lower():
        issues.append("Missing security/PII")
    if "tech stack" not in content.lower():
        issues.append("Missing tech stack")
    if len(content.splitlines()) > 300:
        issues.append("Too long")
    return {"passed": len(issues) == 0, "issues": issues}


result = validate_claude_md(CLAUDE_MD_CONTENT)
print("✅ CLAUDE.md looks good!" if result["passed"] else f"Issues: {result['issues']}")
