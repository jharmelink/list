## Why

Test coverage is currently reported as 0% because tests import from the `dist/` package alias rather than `src/`, meaning the coverage tool never observes code execution. Even accounting for this, the existing test suite covers only a small fraction of public methods across all list classes.

## What Changes

- Fix vitest alias so `@jharmelink/list` resolves to `src/index.ts` during test runs, making coverage meaningful
- Re-enable coverage thresholds in `vitest.config.ts` (functions, branches, statements, lines)
- Add comprehensive tests for all untested public methods across all list classes:
  - `AbstractList`: `every`, `some`, `first`, `last`, `get`, `findIndex`, `includes`, `reduce`, `toArray`, `length`
  - `List`: `concat`, `distinctBy`, `flat`, `flatMap`, `map`, `shuffle`, `sortBy`, `toSorted`, all `flattenTo*` and `to*List` conversion methods
  - `AddableList`: same shared methods + class-specific variants
  - `ComparableList`: same shared methods + `equals` edge cases
  - `MergeableList`: same shared methods + `mergeBy` edge cases
  - `NumberList`: `distinct`, `sort`, `concat`, `filter`, `filterEmpty`, `flatMap`, `map`, conversion methods
  - `StringList`: `distinct`, `sort`, `concat`, `filter`, `filterEmpty`, `flatMap`, conversion methods

## Capabilities

### New Capabilities

- `test-coverage`: Verified, enforced test coverage for all public list class methods

### Modified Capabilities

(none — no spec-level behavior changes, implementation only)

## Impact

- `vitest.config.ts`: add resolve alias, re-enable thresholds
- `test/*.spec.ts`: expanded test cases across all 7 spec files
- No changes to `src/` — this is purely test infrastructure and coverage enforcement
