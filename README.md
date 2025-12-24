# List

---

## Index

- [Installation](#installation)
- [Usage](#usage)
- [Classes](#classes)
    - [AddableList](#addableList)
        - [add](#add)
    - [ComparableList](#comparableList)
        - [equals](#equals)
    - [List](#list)
        - [distinctBy](#distinctBy)
        - [groupBy](#groupBy)
        - [mapBy](#mapBy)
    - [MergeableList](#mergeableList)
        - [mergeBy](#mergeBy)
    - [NumberList](#numberList)
        - [max](#max)
        - [min](#min)
        - [sub](#sub)
        - [sum](#sum)
    - [StringList](#stringList)
        - [join](#join)

## Installation

Using [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/)

```sh
yarn add @jharmelink/list
```

Using [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

```shell
npm install @jharmelink/list
```

## Usage

```ts
import { List } from '@jharmelink/list';

const myList = List.of(1, 2, 3);
```

## Classes

### AddableList

Create a new `AddableList` from an `Array`

```ts
import { AddableList } from '@jharmelink/list';

const addableList = AddableList.from([1, 2, 3]); // AddableList([1, 2, 3])
```

```ts
import { AddableList } from '@jharmelink/list';

const addableList = AddableList.of(1, 2, 3); // AddableList([1, 2, 3])
```

```ts
import { AddableList, List } from '@jharmelink/list';

const addableList = List.of({ n: 1 }, { n: 2 }, { n: 3 }).toAddableList(item => item.n); // AddableList([1, 2, 3])
```

#### add

Add custom `Addable` objects in a `AddableList`

```ts
import { Addable, AddableList } from '@jharmelink/list';

class Payment implements Addable<Payment> {
  constructor(readonly note: string, readonly amount: number) {
  }

  add(payment: Payment) {
    return new Payment(this.note, this.amount + payment.amount);
  }
}

const payments = AddableList.of(
  new Payment('first', 100),
  new Payment('second', 200),
  new Payment('third', 300),
);
const sum = payments.add(new Payment('sum', 0)); // Payment('sum', 600)
```

Add decimals in a `AddableList` using [decimal.js](https://www.npmjs.com/package/decimal.js)

```ts
import { AddableList } from '@jharmelink/list';
import Decimal from 'decimal.js';

const decimals = AddableList.of(
  new Decimal(23.56457),
  new Decimal(12.34543),
  new Decimal(34.12345),
);
const sum = payments.add(new Decimal(0)); // Decimal(70.03345)
```

### ComparableList

Create a new `ComparableList` from an `Array` using [decimal.js](https://www.npmjs.com/package/decimal.js)

```ts
import { ComparableList } from '@jharmelink/list';
import Decimal from 'decimal.js';

const comparableList = ComparableList.from([new Decimal(1), new Decimal(2), new Decimal(3)]); // ComparableList([Decimal(1), Decimal(2), Decimal(3)])
```

```ts
import { ComparableList } from '@jharmelink/list';
import Decimal from 'decimal.js';

const comparableList = ComparableList.of(new Decimal(1), new Decimal(2), new Decimal(3)); // ComparableList([Decimal(1), Decimal(2), Decimal(3)])
```

Create a `ComparableList` from an `List` using [decimal.js](https://www.npmjs.com/package/decimal.js)

```ts
import { ComparableList, List } from '@jharmelink/list';
import Decimal from 'decimal.js';

const comparableList = List.of({ n: new Decimal(1) }, { n: new Decimal(2) }, { n: new Decimal(3) }).toComparableList(item => item.n); // ComparableList([Decimal(1), Decimal(2), Decimal(3)])
```

#### equals

Check if two `ComparableList`s, containing custom comparable objects, are equal

```ts
import { type Comparable, ComparableList } from '@jharmelink/list';

class ComparableItem implements Comparable<ComparableItem> {
  constructor(readonly item: string) {
  }

  equals(comparableItem: ComparableItem) {
    return this.item === comparableItem.item;
  }
}

const comparableItems1 = ComparableList.of(new ComparableItem('a'), new ComparableItem('b'));
const comparableItems2 = ComparableList.of(new ComparableItem('b'), new ComparableItem('a'));
const areEqual = comparableItems1.equals(comparableItems2); // true
```

Check if two `ComparableList`s, containing decimals, are equal
using [decimal.js](https://www.npmjs.com/package/decimal.js)

```ts
import { ComparableList } from '@jharmelink/list';
import Decimal from 'decimal.js';

const decimals1 = ComparableList.from(
  new Decimal(23.56457),
  new Decimal(12.34543),
  new Decimal(34.12345),
);
const decimals2 = ComparableList.from(
  new Decimal(12.34543),
  new Decimal(23.56457),
  new Decimal(34.12345),
);
const areEqual = decimals1.equals(decimals2); // true
```

### List

Create a new `List` from an `Array`

```ts
import { List } from '@jharmelink/list';

const list = List.from([1, 2, 3]); // List([1, 2, 3])
```

```ts
import { List } from '@jharmelink/list';

const list = List.of(1, 2, 3); // List([1, 2, 3])
````

#### distinctBy

Remove duplicates from a `List` using a **key function**

```ts
import { List } from '@jharmelink/list';

const usersWithDuplicates = List.of(
  { id: '1', gender: 'male', name: 'John' },
  { id: '2', gender: 'female', name: 'Jane' },
  { id: '1', gender: 'male', name: 'John' },
);
const usersWithoutDuplicates = usersWithDuplicates.distinctBy(user => user.id); // List([{ id: '1', gender: 'male', name: 'John' }, { id: '2', gender: 'female', name: 'Jane' }])
```

Remove duplicates from a `List` using a **key function** and a **value function**

```ts
import { List } from '@jharmelink/list';

const usersWithDuplicates = List.of(
  { id: '1', gender: 'male', name: 'John' },
  { id: '2', gender: 'female', name: 'Jane' },
  { id: '1', gender: 'male', name: 'John' },
);
const namesWithoutDuplicates = usersWithDuplicates.distinctBy(user => user.id, user => user.name); // List(['John', 'Jane'])
```

### groupBy

Group a `List` to a `Map` using a **key function**

```ts
import { List } from '@jharmelink/list';

const users = List.of(
  { id: '1', gender: 'male', name: 'John' },
  { id: '2', gender: 'female', name: 'Jane' },
  { id: '3', gender: 'male', name: 'Joe' },
);
const usersByGroup = users.groupBy(user => user.gender); // Map([['male', [{id: '1', gender: 'male', name: 'John'}, {id: '3', gender: 'male', name: 'Joe'}]], ['female', [{id: '2', gender: 'female, name: 'Jane'}]]])
```

Group a `List` to a `map` using a **key function** and a **value function**

```ts
import { List } from '@jharmelink/list';

const users = List.of(
  { id: '1', gender: 'male', name: 'John' },
  { id: '2', gender: 'female', name: 'Jane' },
  { id: '3', gender: 'male', name: 'Joe' },
);
const userNamesById = users.groupBy(user => user.gender, user => user.name); // Map([['male', ['John', 'Joe']], ['female', ['Jane']]])
```

### mapBy

Map a `List` to a `map` using a **key function**

```ts
import { List } from '@jharmelink/list';

const users = List.of(
  { id: '1', name: 'John' },
  { id: '2', name: 'Jane' },
  { id: '3', name: 'Joe' },
);
const usersById = users.mapBy(user => user.id); // Map([['1', {id: '1', gender: 'male', name: 'John'}], ['2', {id: '2', gender: 'female, name: 'Jane'}], ['3', {id: '3', gender: 'male', name: 'Joe'}]])
```

Map a `List` to a `map` using a **key function** and a **value function**

```ts
import { List } from '@jharmelink/list';

const users = List.of(
  { id: '1', name: 'John' },
  { id: '2', name: 'Jane' },
  { id: '3', name: 'Joe' },
);
const userNamesById = users.mapBy(user => user.id, user => user.name); // Map([['1', 'John'], ['2', 'Jane'], ['3', 'Joe']])
```

### MergeableList

Create a new `MergeableList` from an `Array`

```ts
import { MergeableList } from '@jharmelink/list';

const mergeableList = MergeableList.from([1, 2, 3]); // MergeableList([1, 2, 3])
```

```ts
import { MergeableList } from '@jharmelink/list';

const mergeableList = MergeableList.of(1, 2, 3); // MergeableList([1, 2, 3])
```

Create a `MergeableList` from an `List`

```ts
import { MergeableList, List } from '@jharmelink/list';

const mergeableList = List.of({ n: 1 }, { n: 2 }, { n: 3 }).toMergeableList(item => item.n); // MergeableList([1, 2, 3])
```

#### mergeBy

Merge custom `Mergeable` objects in an `Array`

```ts
class Drink implements Mergeable<Drink> {
  constructor(readonly name: string, readonly amount: number) {
  }

  merge(drink: Drink) {
    return new Drink(this.name, this.amount + drink.amount);
  }
}

const drinks = MergeableList.of(
  new Drink('beer', 5),
  new Drink('wine', 2),
  new Drink('beer', 3),
);
const sum = drinks.merge(drink => drink.name); // MergeableList([Drink('beer', 8), Drink('wine', 2)])
```

### NumberList

Create a new `NumberList` from an `Array`

```ts
import { NumberList } from '@jharmelink/list';

const numberList = NumberList.from([1, 2, 3]); // NumberList([1, 2, 3])
```

```ts
import { NumberList } from '@jharmelink/list';

const numberList = NumberList.of(1, 2, 3); // NumberList([1, 2, 3])
```

Create a `NumberList` from an `List`

```ts
import { NumberList, List } from '@jharmelink/list';

const numberList = List.of({ n: 1 }, { n: 2 }, { n: 3 }).toNumberList(item => item.n); // NumberList([1, 2, 3])
```

#### max

Max number in a `NumberList`

```ts
import { NumberList } from '@jharmelink/list';

const numbers = NumberList.of(1, 2, 3).max(); // 3
```

#### min

Min number in a `NumberList`

```ts
import { NumberList } from '@jharmelink/list';

const numbers = NumberList.of(1, 2, 3).min(); // 1
```

#### sub

Subtract all numbers in a `NumberList`

```ts
import { NumberList } from '@jharmelink/list';

const numbers = NumberList.of(1, 2, 3).subtract(6); // 0
```

#### sum

Sum all numbers in a `NumberList`

```ts
import { NumberList } from '@jharmelink/list';

const numbers = NumberList.of(1, 2, 3).sum(); // 6
```

### StringList

Create a new `StringList` from an `Array`

```ts
import { StringList } from '@jharmelink/list';

const stringList = StringList.from(['a', 'b', 'c']); // StringList(['a', 'b', 'c'])
```

```ts
import { StringList } from '@jharmelink/list';

const stringList = StringList.of('a', 'b', 'c'); // StringList(['a', 'b', 'c'])
```

Create a `StringList` from an `List`

```ts
import { StringList, List } from '@jharmelink/list';

const stringList = List.of({ n: 'a' }, { n: 'b' }, { n: 'c' }).toStringList(item => item.n); // StringList(['a', 'b', 'c'])
```

#### join

Join all strings in a `StringList`

```ts
import { StringList } from '@jharmelink/list';

const strings = StringList.of('a', 'b', 'c').join(); // 'abc'
```
