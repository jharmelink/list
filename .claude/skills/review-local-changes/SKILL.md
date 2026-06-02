---
name: review-local-changes
description:
  Review uncommitted local changes (staged + unstaged) in the working tree for correctness bugs, style-rule violations,
  and stale/leftover references — then verify with the project's own tooling. Use when the user asks to "review local
  changes", "review my diff", "review what I've changed", or wants a read of the working tree before committing.
---

Review the working tree's local changes end-to-end: gather the diff → delegate the read to a sonnet subagent → verify
with the repo's tooling → report. This skill does **not** edit code; it reports findings and waits for the user to ask
for fixes.

## Phase 1 — Gather the diff

Collect the full picture of what changed, staged and unstaged, in one pass:

```sh
git --no-pager diff --stat && echo "===STAGED===" && git --no-pager diff --cached --stat
git --no-pager diff && echo "===STAGED===" && git --no-pager diff --cached
```

If there are no local changes, say so and stop. Note untracked files (`git status --porcelain`) but don't review their
full contents unless the user asks — flag their existence.

## Phase 2 — Review on sonnet

Spawn a subagent on **sonnet** (`Agent` tool with `model: sonnet`, `subagent_type: Explore` or `general-purpose`) and
hand it the diff plus the review focus below. Running the review on sonnet keeps it fast and cheap while the main
thread stays free. Tell the subagent to return structured findings (file:line, severity, one-line reason, suggested
fix) and to do read-only work — no edits.

The subagent should check, in priority order:

1. **Correctness** — logic bugs, off-by-one, wrong/missing null handling, broken types, mutation of supposedly-immutable
   data (this library never mutates `this.items`), incorrect overloads.
2. **Code-style rules** — read `.claude/code-style.md` first and check the diff against every rule (no `let`,
   `Number.*` namespaced forms, curly braces on all `if` bodies, `if/else if/else` over independent `if`s, blank line
   after closing `}`, comment fill width, `~/*` path alias over relative imports).
3. **Stale / leftover references** — copy-paste leftovers from other projects, dead comments, doc claims that no longer
   match config (e.g. command snippets in CLAUDE.md), references to files/agents/subagents that don't exist.
4. **Scope** — changes unrelated to the apparent intent; debug leftovers; commented-out code.

## Phase 3 — Verify with tooling

Run the project's own checks so the report rests on facts, not guesses (see CLAUDE.md for the canonical commands):

```sh
yarn lint
yarn format
yarn test        # vitest run --typecheck — catches type errors in src/ and test/
```

Report each as pass/fail with the relevant output. If a check fails, quote the failing lines — never claim green
without the command's output backing it.

## Phase 4 — Report

Lead with a one-line verdict, then:

- **Tooling**: lint / format / test+typecheck — pass or fail, with output for any failure.
- **Findings**: grouped by severity (bugs first, then style, then stale refs, then scope). Each as `file:line` +
  one-line reason + suggested fix. Cite `.claude/code-style.md` by rule when flagging a style issue.
- **Nothing to flag** is a valid result — say so plainly rather than inventing nits.

End by offering to apply the fixes. Do not edit anything until the user asks.
