import { AbstractList } from '~/abstract-list';
import { AddableList } from '~/addable-list';
import { ComparableList } from '~/comparable-list';
import { Addable, Comparable, Mergeable } from '~/interface';
import { MergeableList } from '~/mergeable-list';
import { StringList } from '~/string-list';
import { Distinct } from '~/util/distinct';
import { Empty } from '~/util/empty';
import { Shuffle } from '~/util/shuffle';

export class NumberList extends AbstractList<number> {
  constructor(items?: readonly number[]) {
    super(items);
  }

  static from(iterable?: Iterable<number> | ArrayLike<number>): NumberList {
    return new NumberList(Array.from(iterable ?? []));
  }

  static of(...items: readonly number[]): NumberList {
    return new NumberList(items);
  }

  concat(items?: ConcatArray<number>): NumberList {
    if (!items) {
      return this;
    }

    return new NumberList(this.items.concat(items));
  }

  distinct(): NumberList {
    return NumberList.from(Distinct.distinct(this.items));
  }

  filter(predicate: (value: number, index?: number, array?: readonly number[]) => boolean): NumberList {
    return new NumberList(this.items.filter(predicate));
  }

  filterEmpty(): NumberList {
    return new NumberList(Empty.filter(this.items));
  }

  flatMap(mapper: (item: number, index?: number, array?: readonly number[]) => readonly number[]): NumberList {
    [1, 2].flatMap((item) => [item, item + 1]);

    return new NumberList(this.items.flatMap(mapper));
  }

  flattenToAddableList<K extends Addable<K>>(mapper: (item: number) => readonly K[]): AddableList<K> {
    return new AddableList(this.items.flatMap(item => mapper(item)));
  }

  flattenToComparableList<K extends Comparable<K>>(mapper: (item: number) => readonly K[]): ComparableList<K> {
    return new ComparableList(this.items.flatMap(item => mapper(item)));
  }

  flattenToMergeableList<K extends Mergeable<K>>(mapper: (item: number) => readonly K[]): MergeableList<K> {
    return new MergeableList(this.items.flatMap(item => mapper(item)));
  }

  flattenToStringList(mapper: (item: number) => readonly string[]): StringList {
    return new StringList(this.items.flatMap(item => mapper(item)));
  }

  map(mapper: (value: number, index?: number, array?: readonly number[]) => number): NumberList {
    return new NumberList(this.items.map(mapper));
  }

  /**
   * Returns the maximum value in the list.
   */
  max(): number {
    return Math.max(...this.items);
  }

  /**
   * Returns the minimum value in the list.
   */
  min(): number {
    return Math.min(...this.items);
  }

  shuffle(): NumberList {
    return new NumberList(Shuffle.shuffle(this.items));
  }

  /**
   * Subtracts all items in the list from the initialValue.
   *
   * @param initialValue
   */
  sub(initialValue: number = 0): number {
    return this.items.reduce((acc: number, cur: number): number => acc - cur, initialValue);
  }

  sort(): NumberList {
    return new NumberList(this.items.toSorted((a, b) => a - b));
  }

  /**
   * Add all items in the list to the initialValue.
   *
   * @param initialValue
   */
  sum(initialValue = 0): number {
    return this.items.reduce((acc: number, cur: number): number => acc + cur, initialValue);
  }

  toAddableList<K extends Addable<K>>(mapper: (item: number) => K): AddableList<K> {
    return new AddableList(this.items.map(item => mapper(item)));
  }

  toComparableList<K extends Comparable<K>>(mapper: (item: number) => K): ComparableList<K> {
    return new ComparableList(this.items.map(item => mapper(item)));
  }

  toMergeableList<K extends Mergeable<K>>(mapper: (item: number) => K): MergeableList<K> {
    return new MergeableList(this.items.map(item => mapper(item)));
  }

  toSorted(compareFn: (a: number, b: number) => number): NumberList {
    return new NumberList(this.items.toSorted(compareFn));
  }

  toStringList(mapper: (item: number) => string): StringList {
    return new StringList(this.items.map(item => mapper(item)));
  }
}
