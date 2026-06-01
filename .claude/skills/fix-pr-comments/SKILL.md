---
name: fix-pr-comments
description:
  Read open PR review comments on the current branch (or a given PR number), apply the suggested fixes, verify with lint
  + typecheck, then mark each comment's review thread as resolved on GitHub. Use when the user asks to "fix PR
  comments", "address review feedback", "resolve Copilot/reviewer comments", or wants to clear the review queue on a PR.
---

Walk the unresolved review feedback on a cockpit PR end-to-end: fetch → fix → verify → resolve on GitHub.

## Inputs

- **No arg** → use the PR for the current branch. Resolve via
  `gh pr view --json number,headRepository,headRepositoryOwner`.
- **A number** (e.g. `868`) → use that PR.
- **A PR URL** → extract the number from the URL.

If no PR exists for the current branch, stop and tell the user — do not silently fall back to `main`.

## Phase 1 — Fetch unresolved feedback

Delegate to the project script — it owns the GraphQL query and returns one JSON document with thread IDs (needed by
Phase 5), inline review threads, and top-level PR comments:

```
.claude/scripts/pr-comments.sh --json [pr-or-branch]
```

Omit the arg to target the current branch's PR. Output shape: `.data.repository.pullRequest.reviewThreads.nodes[]` and
`.data.repository.pullRequest.comments.nodes[]`. Parse with `jq`; do not call `gh api` inline.

Filter to **unresolved** items only:

- Inline: every `reviewThreads.nodes` where `isResolved = false`. Keep the `id` (this is the `threadId` needed by
  `resolveReviewThread`).
- Top-level: `pullRequest.comments.nodes` from human reviewers (skip bots like `sonarqubecloud[bot]`, CI status posts).
  These have no thread to resolve — they're just context.

Skip `isOutdated = true` threads unless the user explicitly asked to include them; outdated threads usually point to
code that has already moved.

## Phase 2 — Triage

Bucket each comment before touching code:

1. **Actionable** — concrete change request anchored to a file + line. Apply.
2. **Question / discussion** — reviewer is asking, not requesting. Leave for the user; flag in the report.
3. **Already addressed** — the file content at `path:line` no longer matches what the comment describes (e.g. code was
   rewritten in a later commit). Mark as "already fixed" — but **do not auto-resolve**; surface it for confirmation.
4. **Ambiguous / opinion** — no clear single fix (e.g. "consider extracting this"). Skip and flag.

Read the file fresh before deciding bucket — `diffHunk` shows what the comment was written against, not the current
state.

## Phase 3 — Apply fixes

For each actionable comment:

1. Read the file at `path` around `line`.
2. Make the smallest change that addresses the comment's concern. Do not bundle unrelated cleanup.
3. After the edit, run lint and typecheck for the touched files:
   - `yarn lint <path>` (eslint runs scoped to the path)
   - `yarn typecheck` (project-wide; the only mode available)
4. If lint or typecheck regresses, stop on that comment and revert the edit. Report it as "fix attempted but failed
   verification" rather than silently leaving broken code.

Group related fixes in the same file into a single edit pass when sensible. Don't edit the same file four times if one
pass covers all four comments.

## Phase 4 — Confirm with user

**Do not resolve threads yet.** Show a summary:

```
## Fixed (N)
- <thread-id-short> · <path>:<line> — <one-line description of what was changed>
- ...

## Skipped (M)
- <thread-id-short> · <path>:<line> — <bucket: question / ambiguous / already-addressed> — <why>
- ...

## Failed verification (K)
- <thread-id-short> · <path>:<line> — <what broke>

Lint: <pass/fail>  Typecheck: <pass/fail>
```

Then ask: **"Resolve the N fixed threads on GitHub?"**

Only proceed to Phase 5 after explicit user confirmation. If they say no, leave everything as-is — the file edits stay,
but no threads are marked resolved.

## Phase 5 — Resolve threads

For each fixed thread the user confirmed, call:

```
gh api graphql -F threadId=<id> -f query='
  mutation($threadId: ID!) {
    resolveReviewThread(input: { threadId: $threadId }) {
      thread { id isResolved }
    }
  }'
```

`<id>` is the `reviewThreads.nodes.id` from Phase 1 (a `node_id`, not a number). Iterate one at a time; on error, skip
that thread, keep going, and surface the error in the final report.

Final report: one line per thread — `resolved | failed: <reason>`.

## Rules of engagement

- **Never resolve a thread you didn't fix.** A "question" comment stays unresolved — that's a signal to the reviewer.
- **Never amend or push commits** as part of this skill. File edits land in the working tree; the user decides when to
  commit.
- **Do not re-fetch comments per phase.** One `pr-comments.sh --json` call in Phase 1 covers it. Round-tripping is slow
  and racy.
- **Verify before resolving.** A resolved thread on a broken fix is worse than an open thread on broken code — the
  reviewer thinks it's done.
- **Skip bot top-level comments.** SonarCloud, CI bots, Dependabot summaries are not review feedback. Copilot's _inline_
  review comments DO count and should be processed.
- **Respect cockpit conventions** when applying fixes: `const` over `let`, `Taf*` over kompas / `dynamic-form/Form*`,
  `yarn` over `npx`, alphabetical i18n keys. See `.claude/code-style.md`.
- For multi-step exploration (e.g. tracing a returnTo flow across pages), spawn the `cockpit-explore` subagent rather
  than greppping inline.
