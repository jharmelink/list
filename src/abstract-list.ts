import { Shuffle } from '~/util/shuffle';
import { Sort } from '~/util/sort';

export abstract class AbstractList<T> {
  protected readonly items: readonly T[];

  protected constructor(items?: readonly T[]) {
    this.items = items ?? [];
  }

  get length(): number {
    return this.items.length;
  }

  protected create(items: readonly T[]): this {
    return new (this.constructor as new (items?: readonly T[]) => this)(items);
  }

  concat(items?: ConcatArray<T>): this {
    return items ? this.create(this.items.concat(items)) : this;
  }

  shuffle(): this {
    return this.create(Shuffle.shuffle(this.items));
  }

  sortBy(identifier: (item: T) => number | string, reverse = false): this {
    return this.create(Sort.sort(this.items, identifier, reverse));
  }

  toSorted(compareFn: (a: T, b: T) => number): this {
    return this.create(this.items.toSorted(compareFn));
  }

  every(predicate: (item: T, index?: number, array?: readonly T[]) => boolean): boolean {
    return this.items.every((element, index, array) => predicate(element, index, array));
  }

  first(): T | undefined {
    if (this.items.length > 0) {
      return this.items[0];
    }
  }

  last(): T | undefined {
    return this.items.at(-1);
  }

  findIndex(predicate: (item: T, index?: number, array?: readonly T[]) => boolean): number {
    return this.items.findIndex((element, index, array) => predicate(element, index, array));
  }

  get(index: number): T | undefined {
    if (index < 0 || index >= this.items.length) {
      return undefined;
    }

    return this.items[index];
  }

  groupBy<K>(identifier: (item: T) => K): Map<K, readonly T[]>;

  groupBy<K, L>(identifier: (item: T) => K, mapper: (item: T) => L): Map<K, readonly L[]>;

  groupBy<K, L>(identifier: (item: T) => K, mapper?: (item: T) => L): Map<K, readonly T[] | readonly L[]> {
    if (!mapper) {
      return this.reduce((acc: Map<K, T[]>, cur: T) => {
        const key = identifier(cur);
        const group = acc.get(key);

        if (group) {
          group.push(cur);
        } else {
          acc.set(key, [cur]);
        }

        return acc;
      }, new Map<K, T[]>());
    }

    return this.reduce((acc: Map<K, L[]>, cur: T) => {
      const key = identifier(cur);
      const group = acc.get(key);

      if (group) {
        group.push(mapper(cur));
      } else {
        acc.set(key, [mapper(cur)]);
      }

      return acc;
    }, new Map<K, L[]>());
  }

  includes(item: T): boolean {
    return this.items.includes(item);
  }

  mapBy<K>(identifier: (item: T) => K): Map<K, T>;

  mapBy<K, L>(identifier: (item: T) => K, mapper: (item: T) => L): Map<K, L>;

  mapBy<K, L>(identifier: (item: T) => K, mapper?: (item: T) => L): Map<K, T | L> {
    if (!mapper) {
      return this.reduce((acc: Map<K, T>, cur: T) => {
        const key = identifier(cur);

        acc.set(key, cur);

        return acc;
      }, new Map<K, T>());
    }

    return this.reduce((acc: Map<K, L>, cur: T) => {
      const key = identifier(cur);

      acc.set(key, mapper(cur));

      return acc;
    }, new Map<K, L>());
  }

  reduce<K>(reducer: (acc: K, cur: T, index?: number, array?: readonly T[]) => K, initialValue: K): K {
    return this.items.reduce((accumulator, element, index, array) => reducer(accumulator, element, index, array), initialValue);
  }

  some(predicate: (item: T, index?: number, array?: readonly T[]) => boolean): boolean {
    return this.items.some((element, index, array) => predicate(element, index, array));
  }

  toArray(): readonly T[] {
    return this.items;
  }
}
