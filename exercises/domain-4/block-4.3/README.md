# Exercise 4.3 — Build a Validation + Retry Pipeline

## Scenario

You're extracting structured product data from descriptions. The output must always include `name`, `price` (number), and `category`. Claude sometimes outputs invalid JSON or misses required fields — build a pipeline that validates and retries with corrective prompts.

## Your Task

Implement `extractProductData(description: string)` that:

1. Calls Claude to extract product data
2. Validates: all required fields present, price is a number, no negative prices
3. On validation failure, retries with a corrective prompt (tells Claude what was wrong)
4. Maximum 3 attempts
5. Returns a default if all attempts fail

## Success Criteria (used by validator)

- [ ] Validates required fields (name, price, category)
- [ ] Validates price is a number (not string)
- [ ] Corrective retry includes the specific error message (not just "try again")
- [ ] Maximum 3 retries
- [ ] Returns a typed default on final failure
- [ ] Uses multi-turn message history for corrections

## Starter Code

See `starter.ts` / `starter.py` in this directory.
