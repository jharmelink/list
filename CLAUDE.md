# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
yarn test                              # run all tests (vitest, with --typecheck)
yarn test:coverage                     # run tests with coverage thresholds enforced
yarn test:update                       # update snapshots
npx vitest run test/list.spec.ts       # run a single test file
npx vitest run -t "should group by"    # run tests matching a name
yarn lint                              # eslint (flat config scopes src + test)
yarn lint:fix                          # eslint --fix
yarn format                            # prettier --check
yarn format:fix                        # prettier --write
yarn build                             # vite library build (ES + CJS) into dist/
```

Tests run with `--typecheck`, so type errors in `src/` or `test/` fail the suite even if runtime behavior is correct. Coverage thresholds (`yarn test:coverage`) are enforced: 90% lines, 80% functions/branches/statements.

## Architecture

`@jharmelink/list` is an immutable, type-safe collection library. Every list wraps a `readonly T[]` and every transformation returns a **new** list instance — `items` is never mutated.

### Class hierarchy

`AbstractList<T>` (`src/abstract-list.ts`) holds the `readonly items` array and all shared operations: non-transforming (`length`, `get`, `first`, `last`, `every`, `some`, `includes`, `findIndex`, `groupBy`, `mapBy`, `reduce`, `toArray`) and shared transforming (`concat`, `shuffle`, `sortBy`, `toSorted`).

Concrete subclasses each add their own transforming/specialized methods and re-declare `from`/`of` static factories:

- `List<T>` — general purpose; the richest API and the entry point for `toXxxList` / `flattenToXxxList` conversions.
- `AddableList<T extends Addable<T>>` — `.add()` folds items via each item's `add`.
- `ComparableList<T extends Comparable<T>>` — `.equals()` for order-independent equality via each item's `equals`.
- `MergeableList<T extends Mergeable<T>>` — `.mergeBy()` merges same-key items via each item's `merge`.
- `NumberList` / `StringList` — primitive lists with `distinct`, `sort`, plus numeric `sum`/`sub`/`min`/`max` or string `join`.

The `Addable` / `Comparable` / `Mergeable` interfaces (`src/interface/`) are the contracts that gate which typed list a value can live in.

## Code style

See `.claude/code-style.md` for the full list of code style rules. Read that file before writing or reviewing code in
this project. When the user gives a new code style rule, add it to `.claude/code-style.md` — that file is the single
source of truth for style in this repo. Do not save style rules to auto-memory.

### Build & release

- Build is a Vite **library** build emitting both ESM (`index.js`) and CJS (`index.cjs`) plus `.d.ts` types (`tsconfig.build.json` is declaration-only and used by `vite-plugin-dts` — Vite produces the JS).
- Releases are automated via **semantic-release** driven by **Conventional Commits** (`commitlint` enforces this). Commit types map to changelog sections in `.releaserc.yaml`: `feat` → Features, `fix` → Bug fixes; `chore`/`perf`/`test` are hidden. Use these prefixes.
