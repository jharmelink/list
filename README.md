# @jharmelink/list

Immutable, type-safe list classes for TypeScript with rich collection utilities.

---

## Index

- [Installation](#installation)
- [Usage](#usage)
- [Classes](#classes)
  - [List](#list)
  - [AddableList](#addablelist)
  - [ComparableList](#comparablelist)
  - [MergeableList](#mergeablelist)
  - [NumberList](#numberlist)
  - [StringList](#stringlist)
- [Shared Methods](#shared-methods)
- [Interfaces](#interfaces)

---

## Installation

```sh
yarn add @jharmelink/list
```

```sh
npm install @jharmelink/list
```

---

## Usage

```ts
import { List } from '@jharmelink/list';

const list = List.of(1, 2, 3);
```

---

## Classes

### List

A general-purpose immutable list.

**Create**

```ts
List.from([1, 2, 3])       // from iterable
List.of(1, 2, 3)           // from arguments
```

#### concat

```ts
List.of(1, 2).concat([3, 4]) // List([1, 2, 3, 4])
```

#### distinctBy

Remove duplicates by a key function, with an optional value mapper.

```ts
const users = List.of(
  { id: '1', name: 'John' },
  { id: '2', name: 'Jane' },
  { id: '1', name: 'John' },
);

users.distinctBy(u => u.id)               // List([{ id: '1', name: 'John' }, { id: '2', name: 'Jane' }])
users.distinctBy(u => u.id, u => u.name)  // List(['John', 'Jane'])
```

#### filter

```ts
List.of(1, 2, 3).filter(n => n > 1) // List([2, 3])
```

#### filterEmpty

Remove `null` and `undefined` values, with an optional value accessor.

```ts
List.of(1, null, 2, undefined).filterEmpty()           // List([1, 2])
List.of({ n: 1 }, { n: null }).filterEmpty(item => item.n) // List([{ n: 1 }])
```

#### flat

```ts
List.of([1, 2], [3, 4]).flat() // List([1, 2, 3, 4])
```

#### flatMap

```ts
List.of(1, 2).flatMap(n => [n, n * 10]) // List([1, 10, 2, 20])
```

#### groupBy

Group to a `Map` by a key function, with an optional value mapper.

```ts
const users = List.of(
  { id: '1', gender: 'male', name: 'John' },
  { id: '2', gender: 'female', name: 'Jane' },
  { id: '3', gender: 'male', name: 'Joe' },
);

users.groupBy(u => u.gender)
// Map([['male', [{ id: '1', ... }, { id: '3', ... }]], ['female', [{ id: '2', ... }]]])

users.groupBy(u => u.gender, u => u.name)
// Map([['male', ['John', 'Joe']], ['female', ['Jane']]])
```

#### map

```ts
List.of(1, 2, 3).map(n => n * 2) // List([2, 4, 6])
```

#### mapBy

Map to a `Map` by a key function, with an optional value mapper.

```ts
const users = List.of({ id: '1', name: 'John' }, { id: '2', name: 'Jane' });

users.mapBy(u => u.id)              // Map([['1', { id: '1', name: 'John' }], ['2', { ... }]])
users.mapBy(u => u.id, u => u.name) // Map([['1', 'John'], ['2', 'Jane']])
```

#### shuffle

Returns a new list with items in random order.

```ts
List.of(1, 2, 3).shuffle() // List([2, 1, 3]) — order varies
```

#### sortBy

Sort by a key function. Pass `true` as second argument to reverse.

```ts
const users = List.of({ name: 'Joe' }, { name: 'Alice' });

users.sortBy(u => u.name)         // List([{ name: 'Alice' }, { name: 'Joe' }])
users.sortBy(u => u.name, true)   // List([{ name: 'Joe' }, { name: 'Alice' }])
```

#### toSorted

Sort with a custom comparator (standard `Array.prototype.toSorted` signature).

```ts
List.of(3, 1, 2).toSorted((a, b) => a - b) // List([1, 2, 3])
```

#### Conversion methods

Convert to a typed list using a mapper function.

```ts
list.toAddableList(item => item.value)
list.toComparableList(item => item.value)
list.toMergeableList(item => item.value)
list.toNumberList(item => item.amount)
list.toStringList(item => item.name)
```

Flatten nested arrays directly into a typed list.

```ts
list.flattenToAddableList(item => item.values)
list.flattenToComparableList(item => item.values)
list.flattenToMergeableList(item => item.values)
list.flattenToNumberList(item => item.amounts)
list.flattenToStringList(item => item.names)
```

---

### AddableList

A list of items implementing the `Addable<T>` interface.

**Create**

```ts
AddableList.from([item1, item2])
AddableList.of(item1, item2)
List.of(item1, item2).toAddableList(item => item.value)
```

#### add

Fold all items into one using each item's `add` method.

```ts
class Payment implements Addable<Payment> {
  constructor(readonly note: string, readonly amount: number) {}

  add(other: Payment) {
    return new Payment(this.note, this.amount + other.amount);
  }
}

const payments = AddableList.of(
  new Payment('first', 100),
  new Payment('second', 200),
  new Payment('third', 300),
);

payments.add(new Payment('total', 0)) // Payment('total', 600)
```

Example with [decimal.js](https://www.npmjs.com/package/decimal.js):

```ts
import Decimal from 'decimal.js';

const decimals = AddableList.of(new Decimal(23.56), new Decimal(12.34), new Decimal(34.10));
decimals.add(new Decimal(0)) // Decimal(70.00)
```

Also supports: `concat`, `distinctBy`, `filter`, `filterEmpty`, `flatMap`, `map`, `shuffle`, `sortBy`, `toSorted`, and all conversion methods.

---

### ComparableList

A list of items implementing the `Comparable<T>` interface.

**Create**

```ts
ComparableList.from([item1, item2])
ComparableList.of(item1, item2)
List.of([item1, item2]).toComparableList(item => item.value)
```

#### equals

Check if two lists contain the same items (order-independent).

```ts
class ComparableItem implements Comparable<ComparableItem> {
  constructor(readonly item: string) {}

  equals(other: ComparableItem) {
    return this.item === other.item;
  }
}

const a = ComparableList.of(new ComparableItem('x'), new ComparableItem('y'));
const b = ComparableList.of(new ComparableItem('y'), new ComparableItem('x'));
a.equals(b.toArray()) // true
```

Example with [decimal.js](https://www.npmjs.com/package/decimal.js):

```ts
import Decimal from 'decimal.js';

const a = ComparableList.of(new Decimal(1), new Decimal(2));
const b = ComparableList.of(new Decimal(2), new Decimal(1));
a.equals(b.toArray()) // true
```

Also supports: `concat`, `distinctBy`, `filter`, `filterEmpty`, `flatMap`, `map`, `shuffle`, `sortBy`, `toSorted`, and all conversion methods.

---

### MergeableList

A list of items implementing the `Mergeable<T>` interface.

**Create**

```ts
MergeableList.from([item1, item2])
MergeableList.of(item1, item2)
List.of(item1, item2).toMergeableList(item => item.value)
```

#### mergeBy

Merge items sharing the same key using each item's `merge` method.

```ts
class Drink implements Mergeable<Drink> {
  constructor(readonly name: string, readonly amount: number) {}

  merge(other: Drink) {
    return new Drink(this.name, this.amount + other.amount);
  }
}

const drinks = MergeableList.of(
  new Drink('beer', 5),
  new Drink('wine', 2),
  new Drink('beer', 3),
);

drinks.mergeBy(d => d.name)
// MergeableList([Drink('beer', 8), Drink('wine', 2)])
```

Also supports: `concat`, `distinctBy`, `filter`, `filterEmpty`, `flatMap`, `map`, `shuffle`, `sortBy`, `toSorted`, and all conversion methods.

---

### NumberList

A list of `number` values with numeric operations.

**Create**

```ts
NumberList.from([1, 2, 3])
NumberList.of(1, 2, 3)
List.of(item1, item2).toNumberList(item => item.amount)
```

#### distinct

Remove duplicate values.

```ts
NumberList.of(1, 2, 2, 3).distinct() // NumberList([1, 2, 3])
```

#### max

```ts
NumberList.of(1, 2, 3).max() // 3
```

#### min

```ts
NumberList.of(1, 2, 3).min() // 1
```

#### sort

Sort in ascending order.

```ts
NumberList.of(3, 1, 2).sort() // NumberList([1, 2, 3])
```

#### sub

Subtract all items from an initial value.

```ts
NumberList.of(1, 2, 3).sub(10) // 4
NumberList.of(1, 2, 3).sub()   // -6 (initial value defaults to 0)
```

#### sum

Add all items to an initial value.

```ts
NumberList.of(1, 2, 3).sum()    // 6
NumberList.of(1, 2, 3).sum(10)  // 16
```

Also supports: `concat`, `distinct`, `filter`, `filterEmpty`, `flatMap`, `map`, `shuffle`, `toSorted`, and all conversion methods.

---

### StringList

A list of `string` values.

**Create**

```ts
StringList.from(['a', 'b', 'c'])
StringList.of('a', 'b', 'c')
List.of(item1, item2).toStringList(item => item.name)
```

#### distinct

Remove duplicate values.

```ts
StringList.of('a', 'b', 'a').distinct() // StringList(['a', 'b'])
```

#### join

```ts
StringList.of('a', 'b', 'c').join()      // 'abc'
StringList.of('a', 'b', 'c').join(', ')  // 'a, b, c'
```

#### sort

Sort alphabetically.

```ts
StringList.of('c', 'a', 'b').sort() // StringList(['a', 'b', 'c'])
```

Also supports: `concat`, `filter`, `filterEmpty`, `flatMap`, `map`, `shuffle`, `toSorted`, and all conversion methods.

---

## Shared Methods

All list classes inherit the following from `AbstractList`:

| Method | Description |
| --- | --- |
| `length` | Number of items |
| `get(index)` | Item at index, or `undefined` if out of bounds |
| `first()` | First item, or `undefined` |
| `last()` | Last item, or `undefined` |
| `every(predicate)` | Returns `true` if all items satisfy predicate |
| `some(predicate)` | Returns `true` if any item satisfies predicate |
| `includes(item)` | Returns `true` if item is in the list |
| `findIndex(predicate)` | Index of first matching item, or `-1` |
| `groupBy(identifier, mapper?)` | Group items into a `Map` |
| `mapBy(identifier, mapper?)` | Map items into a `Map` |
| `reduce(reducer, initialValue)` | Standard reduce |
| `toArray()` | Returns the underlying `readonly T[]` |

---

## Interfaces

### Addable\<T>

```ts
interface Addable<T> {
  add(other: T): T;
}
```

### Comparable\<T>

```ts
interface Comparable<T> {
  equals(other: T): boolean;
}
```

### Mergeable\<T>

```ts
interface Mergeable<T> {
  merge(other: T): T;
}
```