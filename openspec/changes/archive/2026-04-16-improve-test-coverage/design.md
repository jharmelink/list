## Context

Tests import from `@jharmelink/list` (the package name), which resolves to `dist/` via `package.json` exports. Vitest's coverage tool instruments `src/**/*.ts`, so when tests never touch `src/`, coverage is 0%. All 27 tests pass but measure nothing.

The fix is to add a Vitest resolve alias that redirects `@jharmelink/list` → `src/index.ts` during test runs only. This requires no changes to source code or test import paths.

## Goals / Non-Goals

**Goals:**
- Make coverage reports reflect actual source execution
- Enforce minimum coverage thresholds in CI so regressions fail fast
- Cover all public methods across the 7 list classes

**Non-Goals:**
- 100% coverage — edge cases like internal `private` guards are lower priority
- Changing the public API or source code
- Restructuring the test file layout

## Decisions

**Alias in vitest.config.ts, not tsconfig.json**
The alias should only apply during test runs. Putting it in `tsconfig.json` or `vite.config.ts` would affect the build output. Vitest config is the right scope.

**Thresholds: 80% functions/branches/statements, 90% lines**
These match the commented-out values already in the config — they were presumably the intended target. Starting there is sensible; raise them as coverage improves.

**Expand existing spec files, don't create new ones**
Each class already has a `*.spec.ts`. Adding tests there keeps the file-per-class structure consistent rather than splitting by method group.

## Risks / Trade-offs

- [Risk] Alias points to `src/index.ts` which re-exports everything — if a circular import exists it could surface here → Mitigation: tests already pass, so no circular issues exist
- [Risk] Thresholds fail CI immediately if current coverage is below them → Mitigation: thresholds are set to match what the coverage actually achieves after tests are written; enable thresholds last

## Open Questions

- Should `shuffle()` be tested? It's non-deterministic by design. A smoke test (returns same length, same elements) is sufficient.
