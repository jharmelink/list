## 1. Fix Coverage Infrastructure

- [x] 1.1 Add resolve alias in `vitest.config.ts` so `@jharmelink/list` resolves to `src/index.ts` during tests

## 2. AbstractList Tests

- [x] 2.1 Add tests for `every` and `some`
- [x] 2.2 Add tests for `first` and `last` (including empty list)
- [x] 2.3 Add tests for `get` (valid index, negative index, out-of-bounds)
- [x] 2.4 Add tests for `findIndex`
- [x] 2.5 Add tests for `includes`
- [x] 2.6 Add tests for `reduce`
- [x] 2.7 Add tests for `toArray` and `length`

## 3. List Tests

- [x] 3.1 Add tests for `concat`
- [x] 3.2 Add tests for `distinctBy` with key function only
- [x] 3.3 Add tests for `distinctBy` with key + value mapper
- [x] 3.4 Add tests for `flat`
- [x] 3.5 Add tests for `flatMap`
- [x] 3.6 Add tests for `map`
- [x] 3.7 Add tests for `shuffle` (same length and elements, different order possible)
- [x] 3.8 Add tests for `sortBy` ascending and descending
- [x] 3.9 Add tests for `toSorted`
- [x] 3.10 Add tests for `toNumberList`, `toStringList`, `toAddableList`, `toComparableList`, `toMergeableList`
- [x] 3.11 Add tests for `flattenToNumberList`, `flattenToStringList`

## 4. NumberList Tests

- [x] 4.1 Add tests for `distinct`
- [x] 4.2 Add tests for `sort`
- [x] 4.3 Add tests for `concat`
- [x] 4.4 Add tests for `filter` and `filterEmpty`
- [x] 4.5 Add tests for `flatMap`
- [x] 4.6 Add tests for `map`

## 5. StringList Tests

- [x] 5.1 Add tests for `distinct`
- [x] 5.2 Add tests for `sort`
- [x] 5.3 Add tests for `concat`
- [x] 5.4 Add tests for `filter` and `filterEmpty`
- [x] 5.5 Add tests for `flatMap`

## 6. AddableList / ComparableList / MergeableList Tests

- [x] 6.1 Add tests for `concat`, `filter`, `filterEmpty`, `map`, `sortBy` on `AddableList`
- [x] 6.2 Add tests for `concat`, `filter`, `filterEmpty`, `map`, `sortBy` on `ComparableList`
- [x] 6.3 Add tests for `concat`, `filter`, `filterEmpty`, `map`, `sortBy` on `MergeableList`

## 7. Enforce Thresholds

- [x] 7.1 Re-enable coverage thresholds in `vitest.config.ts` (80% functions/branches/statements, 90% lines)
- [x] 7.2 Run `yarn test:coverage` and confirm all thresholds pass
