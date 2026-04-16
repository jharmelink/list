## ADDED Requirements

### Requirement: Coverage tool measures source code
The test runner SHALL resolve `@jharmelink/list` imports to `src/index.ts` during test execution so that coverage reports reflect actual source code execution.

#### Scenario: Coverage is non-zero after fix
- **WHEN** `yarn test:coverage` is run
- **THEN** all `src/**/*.ts` files report > 0% coverage

### Requirement: Coverage thresholds enforced
The project SHALL enforce minimum coverage thresholds so that CI fails when coverage regresses below the configured values.

#### Scenario: Threshold failure
- **WHEN** a code change reduces function coverage below 80%
- **THEN** `yarn test:coverage` exits with a non-zero code

### Requirement: AbstractList methods are tested
All public methods of `AbstractList` SHALL have at least one passing test scenario.

#### Scenario: every / some
- **WHEN** `every` or `some` is called with a predicate
- **THEN** it returns the correct boolean result

#### Scenario: first / last
- **WHEN** `first()` or `last()` is called on a non-empty list
- **THEN** it returns the correct element

#### Scenario: get with valid index
- **WHEN** `get(n)` is called with an in-bounds index
- **THEN** it returns the element at that index

#### Scenario: get with out-of-bounds index
- **WHEN** `get(n)` is called with a negative or too-large index
- **THEN** it returns `undefined`

#### Scenario: findIndex
- **WHEN** `findIndex` is called with a matching predicate
- **THEN** it returns the correct index

#### Scenario: includes
- **WHEN** `includes` is called with a present value
- **THEN** it returns `true`

#### Scenario: reduce
- **WHEN** `reduce` accumulates over items
- **THEN** it returns the correct accumulated value

#### Scenario: toArray
- **WHEN** `toArray()` is called
- **THEN** it returns the underlying readonly array

#### Scenario: length
- **WHEN** `length` is accessed
- **THEN** it returns the number of items

### Requirement: List methods are tested
All public methods of `List` SHALL have at least one passing test scenario including `concat`, `distinctBy`, `flat`, `flatMap`, `map`, `shuffle`, `sortBy`, `toSorted`, and all conversion methods.

#### Scenario: concat
- **WHEN** `concat` is called with an array
- **THEN** the result contains items from both lists

#### Scenario: flat
- **WHEN** `flat()` is called on a list of arrays
- **THEN** the result is a flattened list

#### Scenario: map
- **WHEN** `map` is called with a transform function
- **THEN** each item is transformed

#### Scenario: shuffle
- **WHEN** `shuffle()` is called
- **THEN** the result has the same length and contains the same elements

#### Scenario: sortBy ascending
- **WHEN** `sortBy` is called with a key function
- **THEN** items are sorted in ascending order

#### Scenario: sortBy descending
- **WHEN** `sortBy` is called with `reverse = true`
- **THEN** items are sorted in descending order

#### Scenario: toSorted
- **WHEN** `toSorted` is called with a comparator
- **THEN** items are sorted accordingly

#### Scenario: conversion methods
- **WHEN** any `to*List` conversion method is called with a mapper
- **THEN** the result is a list of the correct type

### Requirement: NumberList and StringList methods are tested
`NumberList` and `StringList` SHALL have tests for `distinct`, `sort`, `concat`, `filter`, `filterEmpty`, `flatMap`, and `map`.

#### Scenario: distinct removes duplicates
- **WHEN** `distinct()` is called on a list with duplicates
- **THEN** the result contains only unique values

#### Scenario: sort orders values
- **WHEN** `sort()` is called
- **THEN** values are in natural ascending order
