import { AbstractList } from '~/abstract-list';
import { AddableList } from '~/addable-list';
import { Addable, Comparable, Mergeable } from '~/interface';
import { MergeableList } from '~/mergeable-list';
import { NumberList } from '~/number-list';
import { StringList } from '~/string-list';
import { Distinct } from '~/util/distinct';
import { Empty } from '~/util/empty';
import { Shuffle } from '~/util/shuffle';
import { Sort } from '~/util/sort';

export class ComparableList<T extends Comparable<T>> extends AbstractList<T> {
  constructor(items?: readonly T[]) {
    super(items);
  }

  static from<T extends Comparable<T>>(iterable?: Iterable<T> | ArrayLike<T>): ComparableList<T> {
    return new ComparableList(Array.from(iterable ?? []));
  }

  static of<T extends Comparable<T>>(...items: readonly T[]): ComparableList<T> {
    return new ComparableList(items);
  }

  concat(items?: ConcatArray<T>): ComparableList<T> {
    if (!items) {
      return this;
    }

    return new ComparableList(this.items.concat(items));
  }

  distinctBy<K>(identifier: (item: T) => K): ComparableList<T> {
    return ComparableList.from(Distinct.distinctBy(this.items, identifier));
  }

  equals(items?: readonly T[]): boolean {
    if (!items?.length) {
      return !this.items.length; // If both empty, they are equal
    }

    [...this.items, ...items].forEach((item: T) => {
      if (!this.isComparable(item)) {
        throw new Error(`Cannot compare non-comparable item: ${JSON.stringify(item)}`);
      }
    });

    return (
      this.items.length === items.length &&
      this.items.every((localItem: T) => items.some((item: T) => item.equals(localItem))) &&
      items.every(item => this.items.some((localItem: T) => localItem.equals(item)))
    );
  }

  filter<S extends T & ComparableList<S>>(predicate: (item: T, index?: number, array?: readonly T[]) => item is S): ComparableList<S>;
  filter(predicate: (value: T, index?: number, array?: readonly T[]) => boolean): ComparableList<T>;
  filter<S extends T & ComparableList<S>>(predicate: (item: T, index?: number, array?: readonly T[]) => item is S): ComparableList<S> {
    return new ComparableList(this.items.filter(predicate));
  }

  filterEmpty(): ComparableList<NonNullable<T>>;
  filterEmpty<K>(value: (value: T) => K): ComparableList<NonNullable<T>>;
  filterEmpty<K>(value?: (value: T) => K): ComparableList<NonNullable<T>>;
  filterEmpty<K>(value?: (value: T) => K): ComparableList<NonNullable<T>> {
    return new ComparableList(Empty.filter(this.items, value));
  }

  flatMap<K extends Comparable<K>>(mapper: (item: T, index?: number, array?: readonly T[]) => readonly K[]): ComparableList<K> {
    return new ComparableList(this.items.flatMap(mapper));
  }

  flattenToAddableList<K extends Addable<K>>(mapper: (item: T) => readonly K[]): AddableList<K> {
    return new AddableList(this.items.flatMap(item => mapper(item)));
  }

  flattenToMergeableList<K extends Mergeable<K>>(mapper: (item: T) => readonly K[]): MergeableList<K> {
    return new MergeableList(this.items.flatMap(item => mapper(item)));
  }

  flattenToNumberList(mapper: (item: T) => readonly number[]): NumberList {
    return new NumberList(this.items.flatMap(item => mapper(item)));
  }

  flattenToStringList(mapper: (item: T) => readonly string[]): StringList {
    return new StringList(this.items.flatMap(item => mapper(item)));
  }

  map<K extends Comparable<K>>(mapper: (value: T, index?: number, array?: readonly T[]) => K): ComparableList<K> {
    return new ComparableList(this.items.map(mapper));
  }

  shuffle(): ComparableList<T> {
    return new ComparableList(Shuffle.shuffle(this.items));
  }

  sortBy(identifier: (item: T) => number | string, reverse = false): ComparableList<T> {
    return new ComparableList(Sort.sort(this.items, identifier, reverse));
  }

  toAddableList<K extends Addable<K>>(mapper: (item: T) => K): AddableList<K> {
    return new AddableList(this.items.map(item => mapper(item)));
  }

  toMergeableList<K extends Mergeable<K>>(mapper: (item: T) => K): MergeableList<K> {
    return new MergeableList(this.items.map(item => mapper(item)));
  }

  toNumberList(mapper: (item: T) => number): NumberList {
    return new NumberList(this.items.map(item => mapper(item)));
  }

  toSorted(compareFn: (a: T, b: T) => number): ComparableList<T> {
    return new ComparableList(this.items.toSorted(compareFn));
  }

  toStringList(mapper: (item: T) => string): StringList {
    return new StringList(this.items.map(item => mapper(item)));
  }

  private isComparable(object: unknown): object is Comparable<T> {
    return typeof object === 'object' && object !== null && 'equals' in object;
  }
}
