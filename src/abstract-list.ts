export abstract class AbstractList<T> {
  protected readonly items: readonly T[];

  protected constructor(items?: readonly T[]) {
    this.items = items ?? [];
  }

  get length(): number {
    return this.items.length;
  }

  every(predicate: (item: T, index?: number, array?: readonly T[]) => boolean): boolean {
    return this.items.every(predicate);
  }

  first(): T | undefined {
    if (this.items.length > 0) {
      return this.items[0];
    }
  }

  last(): T | undefined {
    return this.items[this.items.length - 1];
  }

  findIndex(predicate: (item: T, index?: number, array?: readonly T[]) => boolean): number {
    return this.items.findIndex(predicate);
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

        if (!acc.has(key)) {
          acc.set(key, [cur]);
        } else {
          acc.get(key)!.push(cur);
        }

        return acc;
      }, new Map<K, T[]>());
    }

    return this.reduce((acc: Map<K, L[]>, cur: T) => {
      const key = identifier(cur);

      if (!acc.has(key)) {
        acc.set(key, [mapper(cur)]);
      } else {
        acc.get(key)!.push(mapper(cur));
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
    return this.items.reduce(reducer, initialValue);
  }

  some(predicate: (item: T, index?: number, array?: readonly T[]) => boolean): boolean {
    return this.items.some(predicate);
  }

  toArray(): readonly T[] {
    return this.items;
  }
}
