import { Addable, AddableList, Comparable, ComparableList, List, Mergeable, MergeableList } from '../src';
import { describe, expect, it } from 'vitest';

class TestMergeable implements Mergeable<TestMergeable> {
  constructor(public id: number, public value: number) {
  }

  merge(other: TestMergeable): TestMergeable {
    return new TestMergeable(this.id, this.value + other.value);
  }
}

class Mock {
  constructor(readonly value: number, readonly mergeables: TestMergeable[]) {
  }
}

class Nock {
  constructor(readonly value: number, readonly mergeables: TestMergeable[]) {
  }
}

class MockAddable implements Addable<MockAddable> {
  constructor(readonly n: number) {}
  add(other: MockAddable) { return new MockAddable(this.n + other.n); }
}

class MockComparable implements Comparable<MockComparable> {
  constructor(readonly n: number) {}
  equals(other: MockComparable) { return this.n === other.n; }
}

describe('List', () => {
  const mergeables = [new TestMergeable(1, 10), new TestMergeable(2, 20)];
  const mock1 = new Mock(1, mergeables);
  const mock2 = new Mock(2, mergeables);
  const nock = new Nock(3, mergeables);

  it('should filter nock', () => {
    const list = List.of(mock1, mock2, nock);

    expect(list.filter(d => d instanceof Mock).toArray()).toEqual([mock1, mock2]);
  });

  it('should filter empty items', () => {
    const list = List.of(mock1, null, mock2, undefined);

    expect(list.filterEmpty().toArray()).toEqual([mock1, mock2]);
  });

  it('should filterEmpty with value accessor', () => {
    const list = List.of({ n: 1 }, { n: null as unknown as number }, { n: 2 });

    expect(list.filterEmpty(item => item.n).toArray()).toEqual([{ n: 1 }, { n: 2 }]);
  });

  it('should flatten and merge items by identifier', () => {
    const list = List.of(mock1, mock2);

    expect(list.flattenToMergeableList(item => item.mergeables).mergeBy(item => item.id).toArray()).toEqual([
      new TestMergeable(1, 20),
      new TestMergeable(2, 40),
    ]);
  });

  it('should concat two lists', () => {
    expect(List.of(1, 2).concat([3, 4]).toArray()).toEqual([1, 2, 3, 4]);
    expect(List.of(1, 2).concat().toArray()).toEqual([1, 2]);
  });

  it('should remove duplicates with distinctBy key function', () => {
    const list = List.of({ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 1, name: 'a' });

    expect(list.distinctBy(item => item.id).length).toBe(2);
  });

  it('should remove duplicates with distinctBy key and value mapper', () => {
    const list = List.of({ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 1, name: 'a' });

    expect(list.distinctBy(item => item.id, item => item.name).toArray()).toEqual(['a', 'b']);
  });

  it('should flat nested arrays', () => {
    expect(List.of([1, 2], [3, 4]).flat().toArray()).toEqual([1, 2, 3, 4]);
  });

  it('should flatMap items', () => {
    expect(List.of(1, 2).flatMap(n => [n, n * 10]).toArray()).toEqual([1, 10, 2, 20]);
  });

  it('should map items', () => {
    expect(List.of(1, 2, 3).map(n => n * 2).toArray()).toEqual([2, 4, 6]);
  });

  it('should shuffle and return same elements', () => {
    const list = List.of(1, 2, 3, 4, 5);
    const shuffled = list.shuffle();

    expect(shuffled.length).toBe(5);
    expect(shuffled.toArray().slice().sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('should sortBy descending', () => {
    const list = List.of({ n: 3 }, { n: 1 }, { n: 2 });

    expect(list.sortBy(item => item.n, true).toArray()).toEqual([{ n: 3 }, { n: 2 }, { n: 1 }]);
  });

  it('should toSorted with comparator', () => {
    expect(List.of(3, 1, 2).toSorted((a, b) => a - b).toArray()).toEqual([1, 2, 3]);
  });

  it('should convert to NumberList', () => {
    const result = List.of({ n: 1 }, { n: 2 }).toNumberList(item => item.n);

    expect(result.sum()).toBe(3);
  });

  it('should convert to StringList', () => {
    const result = List.of({ s: 'a' }, { s: 'b' }).toStringList(item => item.s);

    expect(result.join('')).toBe('ab');
  });

  it('should convert to AddableList', () => {
    const result = List.of(new MockAddable(1), new MockAddable(2)).toAddableList(item => item);

    expect(result).toBeInstanceOf(AddableList);
  });

  it('should convert to ComparableList', () => {
    const result = List.of(new MockComparable(1)).toComparableList(item => item);

    expect(result).toBeInstanceOf(ComparableList);
  });

  it('should convert to MergeableList', () => {
    const result = List.of(new TestMergeable(1, 10)).toMergeableList(item => item);

    expect(result).toBeInstanceOf(MergeableList);
  });

  it('should flattenToNumberList', () => {
    const result = List.of({ ns: [1, 2] }, { ns: [3] }).flattenToNumberList(item => item.ns);

    expect(result.toArray()).toEqual([1, 2, 3]);
  });

  it('should flattenToStringList', () => {
    const result = List.of({ ss: ['a', 'b'] }, { ss: ['c'] }).flattenToStringList(item => item.ss);

    expect(result.toArray()).toEqual(['a', 'b', 'c']);
  });
});
