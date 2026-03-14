# Exercise 2.1 — Design a Well-Structured Tool Set

## Scenario

You're building a file management agent. It needs tools to list files, read a file, write a file, and delete a file. Design all four tools with production-quality descriptions and schemas.

## Your Task

Define an array/list of 4 tool definitions:
1. `list_files` — list files in a directory
2. `read_file` — read file contents
3. `write_file` — write/overwrite a file
4. `delete_file` — permanently delete a file (irreversible)

Each tool definition must follow best practices.

## Success Criteria (used by validator)

- [ ] All 4 tools have meaningful descriptions (not one-word)
- [ ] `delete_file` description explicitly marks it as irreversible/permanent
- [ ] All schema properties have their own `description` field
- [ ] `list_files` has an optional `pattern` or `extension` filter parameter
- [ ] Required vs optional fields are correctly marked

## Starter Code

See `starter.ts` / `starter.py` in this directory.

## Hints

<details>
<summary>Hint 1 — Description quality</summary>
A good description answers: what does it do, when to use it vs. alternatives, any side effects. For delete_file, mention it's permanent and suggest confirmation.
</details>
