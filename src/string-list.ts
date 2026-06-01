import { AbstractList } from '~/abstract-list';
import { AddableList } from '~/addable-list';
import { ComparableList } from '~/comparable-list';
import { Addable, Comparable, Mergeable } from '~/interface';
import { MergeableList } from '~/mergeable-list';
import { NumberList } from '~/number-list';
import { Distinct } from '~/util/distinct';
import { Empty } from '~/util/empty';

export class StringList extends AbstractList<string> {
  constructor(items?: readonly string[]) {
    super(items);
  }

  static from(iterable?: Iterable<string> | ArrayLike<string>): StringList {
    return new StringList(Array.from(iterable ?? []));
  }

  static of(...items: readonly string[]): StringList {
    return new StringList(items);
  }

  distinct(): StringList {
    return StringList.from(Distinct.distinct(this.items));
  }

  filter(predicate: (value: string, index?: number, array?: readonly string[]) => boolean): StringList {
    return new StringList(this.items.filter((value: string, index?: number, array?: readonly string[]) => predicate(value, index, array)));
  }

  filterEmpty(): StringList {
    return new StringList(Empty.filter(this.items));
  }

  flatMap(mapper: (item: string, index?: number, array?: readonly string[]) => readonly string[]): StringList {
    return new StringList(this.items.flatMap((item: string, index?: number, array?: readonly string[]) => mapper(item, index, array)));
  }

  flattenToAddableList<K extends Addable<K>>(mapper: (item: string) => readonly K[]): AddableList<K> {
    return new AddableList(this.items.flatMap(item => mapper(item)));
  }

  flattenToComparableList<K extends Comparable<K>>(mapper: (item: string) => readonly K[]): ComparableList<K> {
    return new ComparableList(this.items.flatMap(item => mapper(item)));
  }

  flattenToMergeableList<K extends Mergeable<K>>(mapper: (item: string) => readonly K[]): MergeableList<K> {
    return new MergeableList(this.items.flatMap(item => mapper(item)));
  }

  flattenToNumberList(mapper: (item: string) => readonly number[]): NumberList {
    return new NumberList(this.items.flatMap(item => mapper(item)));
  }

  join(separator?: string): string {
    return this.items.join(separator);
  }

  map(mapper: (value: string, index?: number, array?: readonly string[]) => string): StringList {
    return new StringList(this.items.map((value: string, index?: number, array?: readonly string[]) => mapper(value, index, array)));
  }

  sort(): StringList {
    return new StringList(this.items.toSorted((a, b) => a.localeCompare(b)));
  }

  toAddableList<K extends Addable<K>>(mapper: (item: string) => K): AddableList<K> {
    return new AddableList(this.items.map(item => mapper(item)));
  }

  toComparableList<K extends Comparable<K>>(mapper: (item: string) => K): ComparableList<K> {
    return new ComparableList(this.items.map(item => mapper(item)));
  }

  toMergeableList<K extends Mergeable<K>>(mapper: (item: string) => K): MergeableList<K> {
    return new MergeableList(this.items.map(item => mapper(item)));
  }

  toNumberList(mapper: (item: string) => number): NumberList {
    return new NumberList(this.items.map(item => mapper(item)));
  }
}
