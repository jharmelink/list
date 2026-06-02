import { AbstractList } from '~/abstract-list';
import { ComparableList } from '~/comparable-list';
import { Addable, Comparable, Mergeable } from '~/interface';
import { MergeableList } from '~/mergeable-list';
import { NumberList } from '~/number-list';
import { StringList } from '~/string-list';
import { Distinct } from '~/util/distinct';
import { Empty } from '~/util/empty';

export class AddableList<T extends Addable<T>> extends AbstractList<T> {
  constructor(items?: readonly T[]) {
    super(items);
  }

  static from<T extends Addable<T>>(iterable?: Iterable<T> | ArrayLike<T>): AddableList<T> {
    return new AddableList(Array.from(iterable ?? []));
  }

  static of<T extends Addable<T>>(...items: readonly T[]): AddableList<T> {
    return new AddableList(items);
  }

  add(initialValue: T): T {
    return this.items.reduce((acc: T, cur: T): T => {
      if (!cur) {
        return acc;
      } else if (!this.isAddable(cur)) {
        throw new Error(`Cannot add non-addable item: ${JSON.stringify(cur)}`);
      }

      return acc.add(cur);
    }, initialValue);
  }

  distinctBy<K>(identifier: (item: T) => K): AddableList<T> {
    return AddableList.from(Distinct.distinctBy(this.items, identifier));
  }

  filter<S extends T & Addable<S>>(
    predicate: (item: T, index?: number, array?: readonly T[]) => item is S,
  ): AddableList<S>;
  filter(predicate: (value: T, index?: number, array?: readonly T[]) => boolean): AddableList<T>;
  filter<S extends T & Addable<S>>(
    predicate: (item: T, index?: number, array?: readonly T[]) => item is S,
  ): AddableList<S> {
    return new AddableList(this.items.filter(predicate));
  }

  filterEmpty(): AddableList<NonNullable<T>>;
  filterEmpty<K>(value: (value: T) => K): AddableList<NonNullable<T>>;
  filterEmpty<K>(value?: (value: T) => K): AddableList<NonNullable<T>>;
  filterEmpty<K>(value?: (value: T) => K): AddableList<NonNullable<T>> {
    return new AddableList(Empty.filter(this.items, value));
  }

  flatMap<K extends Addable<K>>(
    mapper: (item: T, index?: number, array?: readonly T[]) => readonly K[],
  ): AddableList<K> {
    return new AddableList(
      this.items.flatMap((item: T, index?: number, array?: readonly T[]) => mapper(item, index, array)),
    );
  }

  flattenToComparableList<K extends Comparable<K>>(mapper: (item: T) => readonly K[]): ComparableList<K> {
    return new ComparableList(this.items.flatMap(item => mapper(item)));
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

  map<K extends Addable<K>>(mapper: (value: T, index?: number, array?: readonly T[]) => K): AddableList<K> {
    return new AddableList(
      this.items.map((value: T, index?: number, array?: readonly T[]) => mapper(value, index, array)),
    );
  }

  toComparableList<K extends Comparable<K>>(mapper: (item: T) => K): ComparableList<K> {
    return new ComparableList(this.items.map(item => mapper(item)));
  }

  toMergeableList<K extends Mergeable<K>>(mapper: (item: T) => K): MergeableList<K> {
    return new MergeableList(this.items.map(item => mapper(item)));
  }

  toNumberList(mapper: (item: T) => number): NumberList {
    return new NumberList(this.items.map(item => mapper(item)));
  }

  toStringList(mapper: (item: T) => string): StringList {
    return new StringList(this.items.map(item => mapper(item)));
  }

  private isAddable(object: unknown): object is Addable<T> {
    return typeof object === 'object' && object !== null && 'add' in object;
  }
}
