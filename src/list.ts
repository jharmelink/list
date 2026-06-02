import { AbstractList } from '~/abstract-list';
import { AddableList } from '~/addable-list';
import { ComparableList } from '~/comparable-list';
import { Addable, Comparable, Mergeable } from '~/interface';
import { MergeableList } from '~/mergeable-list';
import { NumberList } from '~/number-list';
import { StringList } from '~/string-list';
import { Distinct } from '~/util/distinct';
import { Empty } from '~/util/empty';

export class List<T> extends AbstractList<T> {
  constructor(items?: readonly T[]) {
    super(items);
  }

  static from<T>(iterable?: Iterable<T> | ArrayLike<T>): List<T> {
    return new List(Array.from(iterable ?? []));
  }

  static of<T>(...items: readonly T[]): List<T> {
    return new List(items);
  }

  distinctBy<K>(identifier: (item: T) => K): List<T>;
  distinctBy<K, L>(identifier: (item: T) => K, mapper: (item: T) => L): List<L>;
  distinctBy<K, L>(identifier: (item: T) => K, mapper?: (item: T) => L): List<T | L>;
  distinctBy<K, L>(identifier: (item: T) => K, mapper?: (item: T) => L): List<T | L> {
    return List.from(Distinct.distinctBy(this.items, identifier, mapper));
  }

  filter<S extends T>(predicate: (item: T, index?: number, array?: readonly T[]) => item is S): List<S>;
  filter(predicate: (item: T, index?: number, array?: readonly T[]) => boolean): List<T>;
  filter<S extends T>(predicate: (item: T, index?: number, array?: readonly T[]) => item is S): List<S> {
    return new List(this.items.filter(predicate));
  }

  filterEmpty(): List<NonNullable<T>>;
  filterEmpty<K>(value: (value: T) => K): List<NonNullable<T>>;
  filterEmpty<K>(value?: (value: T) => K): List<NonNullable<T>>;
  filterEmpty<K>(value?: (value: T) => K): List<NonNullable<T>> {
    return new List(Empty.filter(this.items, value));
  }

  flat<D extends number = 1>(depth?: D): List<FlatArray<readonly T[], D>> {
    return new List(this.items.flat(depth));
  }

  flatMap<K>(mapper: (item: T, index?: number, array?: readonly T[]) => readonly K[]): List<K> {
    return new List(this.items.flatMap((item: T, index?: number, array?: readonly T[]) => mapper(item, index, array)));
  }

  flattenToAddableList<K extends Addable<K>>(mapper: (item: T) => readonly K[]): AddableList<K> {
    return new AddableList(this.items.flatMap(item => mapper(item)));
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

  map<K>(mapper: (item: T, index?: number, array?: readonly T[]) => K): List<K> {
    return new List(this.items.map((item: T, index?: number, array?: readonly T[]) => mapper(item, index, array)));
  }

  toAddableList<K extends Addable<K>>(mapper: (item: T) => K): AddableList<K> {
    return new AddableList(this.items.map(item => mapper(item)));
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
}
