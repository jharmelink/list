import { Addable, AddableList, Comparable, ComparableList, Mergeable, MergeableList } from '../src';
import { describe, expect, it } from 'vitest';

class MockComparable implements Comparable<MockComparable> {
  constructor(private readonly value: number) {
  }

  equals(other: MockComparable): boolean {
    return this.value === other.value;
  }

  getValue(): number {
    return this.value;
  }
}

class MockAddable implements Addable<MockAddable> {
  constructor(readonly n: number) {}
  add(other: MockAddable) { return new MockAddable(this.n + other.n); }
}

class MockMergeable implements Mergeable<MockMergeable> {
  constructor(readonly id: number, readonly n: number) {}
  merge(other: MockMergeable) { return new MockMergeable(this.id, this.n + other.n); }
}

describe('ComparableList', () => {
  it('should create a ComparableList with the static of method', () => {
    const list = ComparableList.of(new MockComparable(1), new MockComparable(2));

    expect(list.toArray().length).toBe(2);
  });

  it('should return true for equal lists', () => {
    const list1 = ComparableList.of(new MockComparable(1), new MockComparable(2));
    const list2 = [new MockComparable(1), new MockComparable(2)];

    expect(list1.equals(list2)).toBe(true);
  });

  it('should return false for non-equal lists', () => {
    const list1 = ComparableList.of(new MockComparable(1), new MockComparable(2));
    const list2 = [new MockComparable(1), new MockComparable(3)];

    expect(list1.equals(list2)).toBe(false);
  });

  it('should map items correctly', () => {
    const list = ComparableList.of(new MockComparable(1), new MockComparable(2));
    const mappedList = list.map(item => new MockComparable(item.getValue() * 2));

    expect(mappedList.toArray().map(item => item.getValue())).toEqual([2, 4]);
  });

  it('should throw an error when comparing a non-comparable item', () => {
    const list = ComparableList.of(new MockComparable(1), new MockComparable(2));

    expect(() => list.equals([new MockComparable(1), {} as any])).toThrow('Cannot compare non-comparable item');
  });

  it('should return true when both lists are empty', () => {
    expect(ComparableList.of<MockComparable>().equals([])).toBe(true);
  });

  it('should return false when comparing against empty list', () => {
    const list = ComparableList.of(new MockComparable(1));

    expect(list.equals([])).toBe(false);
  });

  it('should concat two ComparableLists', () => {
    const a = ComparableList.of(new MockComparable(1));
    const b = [new MockComparable(2)];

    expect(a.concat(b).toArray().length).toBe(2);
    expect(a.concat().toArray().length).toBe(1);
  });

  it('should filter by predicate', () => {
    const list = ComparableList.of(new MockComparable(1), new MockComparable(2), new MockComparable(3));

    expect(list.filter(item => item.getValue() > 1).toArray().length).toBe(2);
  });

  it('should filterEmpty', () => {
    const list = new ComparableList([new MockComparable(1), null as unknown as MockComparable, new MockComparable(2)]);

    expect(list.filterEmpty().toArray().length).toBe(2);
  });

  it('should sortBy value', () => {
    const list = ComparableList.of(new MockComparable(3), new MockComparable(1), new MockComparable(2));

    expect(list.sortBy(item => item.getValue()).toArray().map(i => i.getValue())).toEqual([1, 2, 3]);
  });

  it('should toSorted with comparator', () => {
    const list = ComparableList.of(new MockComparable(3), new MockComparable(1));

    expect(list.toSorted((a, b) => a.getValue() - b.getValue()).first()!.getValue()).toBe(1);
  });

  it('should distinctBy key', () => {
    const list = ComparableList.of(new MockComparable(1), new MockComparable(1), new MockComparable(2));

    expect(list.distinctBy(item => item.getValue()).length).toBe(2);
  });

  it('should shuffle and keep same elements', () => {
    const list = ComparableList.of(new MockComparable(1), new MockComparable(2), new MockComparable(3));

    expect(list.shuffle().length).toBe(3);
  });

  it('should flatMap items', () => {
    const list = ComparableList.of(new MockComparable(1), new MockComparable(2));
    const result = list.flatMap(item => [new MockComparable(item.getValue() * 10)]);

    expect(result.length).toBe(2);
  });

  it('should convert to NumberList', () => {
    expect(ComparableList.of(new MockComparable(1), new MockComparable(2)).toNumberList(i => i.getValue()).sum()).toBe(3);
  });

  it('should convert to StringList', () => {
    expect(ComparableList.of(new MockComparable(1)).toStringList(i => String(i.getValue())).join('')).toBe('1');
  });

  it('should convert to AddableList', () => {
    const result = ComparableList.of(new MockComparable(1)).toAddableList(i => new MockAddable(i.getValue()));

    expect(result).toBeInstanceOf(AddableList);
  });

  it('should convert to MergeableList', () => {
    const result = ComparableList.of(new MockComparable(1)).toMergeableList(i => new MockMergeable(i.getValue(), i.getValue()));

    expect(result).toBeInstanceOf(MergeableList);
  });

  it('should flattenToNumberList', () => {
    const result = ComparableList.of(new MockComparable(2), new MockComparable(3)).flattenToNumberList(i => [i.getValue()]);

    expect(result.sum()).toBe(5);
  });

  it('should flattenToStringList', () => {
    const result = ComparableList.of(new MockComparable(1)).flattenToStringList(i => [String(i.getValue())]);

    expect(result.toArray()).toEqual(['1']);
  });

  it('should flattenToAddableList', () => {
    const result = ComparableList.of(new MockComparable(1)).flattenToAddableList(i => [new MockAddable(i.getValue())]);

    expect(result).toBeInstanceOf(AddableList);
  });

  it('should flattenToMergeableList', () => {
    const result = ComparableList.of(new MockComparable(1)).flattenToMergeableList(i => [new MockMergeable(i.getValue(), i.getValue())]);

    expect(result).toBeInstanceOf(MergeableList);
  });
});
