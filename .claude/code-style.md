# List code style rules

Source of truth for code style rules in this project. Mirrored in `CLAUDE.md` for general Claude Code sessions; this
standalone file exists so review agents (and other tooling) can ingest the rules without pulling in the rest of
CLAUDE.md.

## Rules

- **Never use `let` in TypeScript/JavaScript.** Always use `const`; restructure with helpers, ternaries,
  `.map`/`.reduce`/`.filter`, or intermediate `const`s when mutation feels needed.
- Prefer the `Number.*` namespaced forms over the global aliases: use `Number.NaN` (not `NaN`), `Number.isNaN` (not
  `isNaN`), `Number.isFinite` (not `isFinite`), `Number.parseInt` (not `parseInt`), `Number.parseFloat` (not
  `parseFloat`). The namespaced versions don't coerce non-number arguments and are what ESLint's
  `unicorn/prefer-number-properties` enforces.
- Always wrap `if` statement bodies in curly braces, even single-statement bodies. No `if (x) return;` one-liners —
  expand to `if (x) { return; }`.
- Use `if` / `else if` / `else` for mutually exclusive branches instead of a sequence of independent `if` blocks.
  Back-to-back `if` blocks read as independent rules and both can fire; if only one branch should run, make that
  explicit with `else if` (or `else`). This applies to the single binary case too — prefer `if (cond) { a } else { b }`
  over `if (cond) { a; return; } b`, since the early `return` is just hiding an `else`. Exception: when all branches
  already terminate (e.g. all `return` a value), leave the `else` off — it's redundant. Reserve early returns for
  genuine guard clauses (especially multiple guards in a row, where chained `if/else` would nest into a pyramid).
- Insert a blank line after a closing `}` when the next statement is at the same level (e.g. between a guard `if` block
  and the statement that follows it). Doesn't apply when `}` is followed by `else`, the end of the enclosing block, or
  another `}`.
- Fill doc/block comments (JSDoc and `//` runs) toward the ~120-char ceiling — don't hard-wrap prose narrower
  (e.g. at ~72/80). Prettier doesn't reflow prose inside `.ts`/`.js` comments at all (its `printWidth: 120` governs
  code only), so comment wrapping is manual. The ceiling is enforced — ESLint `max-len` with `comments: 120` fails
  `yarn lint` on any comment over 120, but it can't push under-filled lines up, so filling toward 120 is still on you.

### Conventions to follow when extending

- **Immutability**: never mutate `this.items`. Build a new array (`toSorted`, `concat`, spread, `Array.from`) and return a new instance.
- **Method overloads**: methods with an optional `mapper` (e.g. `groupBy`, `mapBy`, `distinctBy`) are declared with multiple overload signatures followed by one implementation. Match this pattern when adding similar APIs.
- **Reusable logic lives in `src/util/`** as classes of `static` methods (`Distinct`, `Empty`, `Shuffle`, `Sort`). Subclasses delegate to these rather than reimplementing — add shared algorithms here.
- **Conversions**: cross-list conversions come in two forms — `toXxxList(mapper)` (1:1) and `flattenToXxxList(mapper)` (item → array, flattened). Keep both when adding a new list type.
- **Path alias**: imports use `~/*` → `src/*` (configured in `tsconfig.json`, vite, and vitest). Use it instead of relative paths.
