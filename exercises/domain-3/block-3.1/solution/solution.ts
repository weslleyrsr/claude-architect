const CLAUDE_MD_CONTENT = `
# payment-processor — Financial Transaction Microservice

This service handles payment processing, refunds, and transaction history for the e-commerce platform. It integrates with Stripe for card processing and stores all transaction records in PostgreSQL. It is a PCI-DSS scoped system.

---

## Critical Rules (Always Follow)

- **Never log card numbers, CVVs, or full PANs** — We are PCI-DSS scoped. Even the last 4 digits should only appear in designated audit logs, not application logs. Violation = compliance incident.
- **Never commit directly to main** — All changes go through pull requests. Direct pushes are blocked by CI. Use feature branches.
- **Always use Prisma migrations, never raw SQL** — Direct schema changes can corrupt the audit trail. Run \`prisma migrate dev\` for local, \`prisma migrate deploy\` for prod.
- **Never skip tests for payment logic** — All charge/refund/webhook handlers require unit + integration tests. Test coverage must remain above 90% for the \`payments/\` module.
- **Use idempotency keys for all Stripe API calls** — Stripe may deliver webhooks multiple times. Every charge and refund call must include an idempotency key derived from the transaction ID.

---

## Architecture Overview

\`\`\`
src/
├── api/           REST handlers (Express routes)
├── payments/      Core payment logic (Stripe integration)
│   ├── charge.ts
│   ├── refund.ts
│   └── webhook.ts
├── db/            Prisma client + query helpers
├── models/        TypeScript interfaces (no classes)
└── utils/         Shared utilities (logger, crypto)

prisma/
├── schema.prisma  Single source of truth for DB schema
└── migrations/    Never edit these files directly
\`\`\`

Entry point: \`src/index.ts\` → Express app → routes → payment handlers → Prisma

---

## Tech Stack

- **Language:** TypeScript (strict mode, Node.js 20)
- **Framework:** Express 4
- **Database:** PostgreSQL 15 via Prisma ORM
- **Payment:** Stripe API v2024
- **Testing:** Vitest + Supertest (integration tests hit real DB)
- **Build:** esbuild
- **Deploy:** AWS Lambda + RDS (via Serverless Framework)
- **Secrets:** AWS Secrets Manager (never .env in production)

---

## Security Notes

- PII in scope: email, name, shipping address, last 4 of card
- Never expose full card data in any response or log
- All endpoints require JWT auth (via \`middleware/auth.ts\`)
- Rate limiting: 100 req/min per user (enforced at API Gateway)
- Audit logs: every financial transaction writes to \`audit_log\` table (never delete rows)
`

function validateClaudeMd(content: string): { passed: boolean; issues: string[] } {
  const issues: string[] = []
  if (!content.includes("Critical") && !content.includes("Rules")) issues.push("Missing Critical Rules section")
  if ((content.match(/- \*\*/g) ?? []).length < 4) issues.push("Need at least 4 rules")
  if (!content.toLowerCase().includes("security") && !content.toLowerCase().includes("pii")) issues.push("Missing security/PII")
  if (!content.toLowerCase().includes("tech stack")) issues.push("Missing tech stack")
  if (content.split("\n").length > 300) issues.push("Too long")
  return { passed: issues.length === 0, issues }
}

const result = validateClaudeMd(CLAUDE_MD_CONTENT)
console.log(result.passed ? "✅ CLAUDE.md looks good!" : `Issues: ${result.issues.join(", ")}`)
