import { Addable, AddableList, Comparable, ComparableList, Mergeable, MergeableList } from '../src';
import { describe, expect, it } from 'vitest';

class TestMergeable implements Mergeable<TestMergeable> {
  constructor(public id: number, public value: number) {
  }

  merge(other: TestMergeable): TestMergeable {
    return new TestMergeable(this.id, this.value + other.value);
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

describe('MergeableList', () => {
  it('should create an empty MergeableList', () => {
    const list = new MergeableList<TestMergeable>();
    expect(list.toArray()).toEqual([]);
  });

  it('should create a MergeableList with items', () => {
    const items = [new TestMergeable(1, 10), new TestMergeable(2, 20)];
    const list = new MergeableList(items);
    expect(list.toArray()).toEqual(items);
  });

  it('should merge items by identifier', () => {
    const items = [
      new TestMergeable(1, 10),
      new TestMergeable(2, 20),
      new TestMergeable(1, 30),
    ];
    const list = new MergeableList(items);
    const mergedList = list.mergeBy(item => item.id);
    expect(mergedList.toArray()).toEqual([
      new TestMergeable(1, 40),
      new TestMergeable(2, 20),
    ]);
  });

  it('should throw an error when merging non-mergeable items', () => {
    const items = [
      { id: 1, value: 10 },
      { id: 2, value: 20 },
    ] as any;
    const list = new MergeableList(items);
    expect(() => list.mergeBy((item: any) => item.id)).toThrowError(
      'Cannot merge non-mergeable item: {"id":1,"value":10}',
    );
  });

  it('should concat two MergeableLists', () => {
    const a = MergeableList.of(new TestMergeable(1, 10));
    const b = [new TestMergeable(2, 20)];

    expect(a.concat(b).toArray().length).toBe(2);
    expect(a.concat().toArray().length).toBe(1);
  });

  it('should filter by predicate', () => {
    const list = MergeableList.of(new TestMergeable(1, 10), new TestMergeable(2, 20), new TestMergeable(3, 30));

    expect(list.filter(item => item.value > 10).toArray().length).toBe(2);
  });

  it('should filterEmpty', () => {
    const list = new MergeableList([new TestMergeable(1, 10), null as unknown as TestMergeable, new TestMergeable(2, 20)]);

    expect(list.filterEmpty().toArray().length).toBe(2);
  });

  it('should map items', () => {
    const list = MergeableList.of(new TestMergeable(1, 10), new TestMergeable(2, 20));
    const mapped = list.map(item => new TestMergeable(item.id, item.value * 2));

    expect(mapped.toArray().map(i => i.value)).toEqual([20, 40]);
  });

  it('should sortBy value', () => {
    const list = MergeableList.of(new TestMergeable(1, 30), new TestMergeable(2, 10), new TestMergeable(3, 20));

    expect(list.sortBy(item => item.value).toArray().map(i => i.value)).toEqual([10, 20, 30]);
  });

  it('should toSorted with comparator', () => {
    const list = MergeableList.of(new TestMergeable(1, 30), new TestMergeable(2, 10));

    expect(list.toSorted((a, b) => a.value - b.value).first()!.value).toBe(10);
  });

  it('should distinctBy key', () => {
    const list = MergeableList.of(new TestMergeable(1, 10), new TestMergeable(1, 20), new TestMergeable(2, 30));

    expect(list.distinctBy(item => item.id).length).toBe(2);
  });

  it('should shuffle and keep same elements', () => {
    const list = MergeableList.of(new TestMergeable(1, 10), new TestMergeable(2, 20));

    expect(list.shuffle().length).toBe(2);
  });

  it('should flatMap items', () => {
    const list = MergeableList.of(new TestMergeable(1, 10), new TestMergeable(2, 20));
    const result = list.flatMap(item => [new TestMergeable(item.id, item.value * 2)]);

    expect(result.toArray().map(i => i.value)).toEqual([20, 40]);
  });

  it('should convert to NumberList', () => {
    expect(MergeableList.of(new TestMergeable(1, 5), new TestMergeable(2, 3)).toNumberList(i => i.value).sum()).toBe(8);
  });

  it('should convert to StringList', () => {
    expect(MergeableList.of(new TestMergeable(1, 5)).toStringList(i => String(i.value)).join('')).toBe('5');
  });

  it('should convert to AddableList', () => {
    const result = MergeableList.of(new TestMergeable(1, 5)).toAddableList(i => new MockAddable(i.value));

    expect(result).toBeInstanceOf(AddableList);
  });

  it('should convert to ComparableList', () => {
    const result = MergeableList.of(new TestMergeable(1, 5)).toComparableList(i => new MockComparable(i.value));

    expect(result).toBeInstanceOf(ComparableList);
  });

  it('should flattenToNumberList', () => {
    const result = MergeableList.of(new TestMergeable(1, 5), new TestMergeable(2, 3)).flattenToNumberList(i => [i.value]);

    expect(result.sum()).toBe(8);
  });

  it('should flattenToStringList', () => {
    const result = MergeableList.of(new TestMergeable(1, 5)).flattenToStringList(i => [String(i.value)]);

    expect(result.toArray()).toEqual(['5']);
  });

  it('should flattenToAddableList', () => {
    const result = MergeableList.of(new TestMergeable(1, 5)).flattenToAddableList(i => [new MockAddable(i.value)]);

    expect(result).toBeInstanceOf(AddableList);
  });

  it('should flattenToComparableList', () => {
    const result = MergeableList.of(new TestMergeable(1, 5)).flattenToComparableList(i => [new MockComparable(i.value)]);

    expect(result).toBeInstanceOf(ComparableList);
  });
});
