import { Addable, AddableList, Comparable, ComparableList, Mergeable, MergeableList } from '../src';
import { describe, expect, it } from 'vitest';

class MockAddable implements Addable<MockAddable> {
  constructor(private readonly value: number) {
  }

  add(other: MockAddable): MockAddable {
    return new MockAddable(this.value + other.value);
  }

  getValue(): number {
    return this.value;
  }
}

class MockComparable implements Comparable<MockComparable> {
  constructor(readonly n: number) {}
  equals(other: MockComparable) { return this.n === other.n; }
}

class MockMergeable implements Mergeable<MockMergeable> {
  constructor(readonly id: number, readonly n: number) {}
  merge(other: MockMergeable) { return new MockMergeable(this.id, this.n + other.n); }
}

describe('AddableList', () => {
  it('should create an AddableList with the static of method', () => {
    const list = AddableList.from([new MockAddable(1), new MockAddable(2)]);
    expect(list.toArray().length).toBe(2);
  });

  it('should add all items in the list', () => {
    const list = AddableList.of(new MockAddable(1), new MockAddable(2), new MockAddable(3));
    const result = list.add(new MockAddable(0));
    expect(result.getValue()).toBe(6);
  });

  it('should throw an error when adding a non-addable item', () => {
    const list = new AddableList([new MockAddable(1), {} as any]);
    expect(() => list.add(new MockAddable(0))).toThrow('Cannot add non-addable item');
  });

  it('should concat two AddableLists', () => {
    const a = AddableList.of(new MockAddable(1));
    const b = [new MockAddable(2)];

    expect(a.concat(b).toArray().length).toBe(2);
    expect(a.concat().toArray().length).toBe(1);
  });

  it('should filter by predicate', () => {
    const list = AddableList.of(new MockAddable(1), new MockAddable(2), new MockAddable(3));

    expect(list.filter(item => item.getValue() > 1).toArray().length).toBe(2);
  });

  it('should filterEmpty', () => {
    const list = new AddableList([new MockAddable(1), null as unknown as MockAddable, new MockAddable(2)]);

    expect(list.filterEmpty().toArray().length).toBe(2);
  });

  it('should map items', () => {
    const list = AddableList.of(new MockAddable(1), new MockAddable(2));
    const mapped = list.map(item => new MockAddable(item.getValue() * 10));

    expect(mapped.add(new MockAddable(0)).getValue()).toBe(30);
  });

  it('should sortBy value', () => {
    const list = AddableList.of(new MockAddable(3), new MockAddable(1), new MockAddable(2));

    expect(list.sortBy(item => item.getValue()).toArray().map(i => i.getValue())).toEqual([1, 2, 3]);
  });

  it('should sortBy value descending', () => {
    const list = AddableList.of(new MockAddable(1), new MockAddable(3), new MockAddable(2));

    expect(list.sortBy(item => item.getValue(), true).toArray().map(i => i.getValue())).toEqual([3, 2, 1]);
  });

  it('should toSorted with comparator', () => {
    const list = AddableList.of(new MockAddable(3), new MockAddable(1), new MockAddable(2));

    expect(list.toSorted((a, b) => a.getValue() - b.getValue()).toArray().map(i => i.getValue())).toEqual([1, 2, 3]);
  });

  it('should distinctBy key', () => {
    const a1 = new MockAddable(1);
    const a2 = new MockAddable(1);
    const a3 = new MockAddable(2);
    const list = AddableList.of(a1, a2, a3);

    expect(list.distinctBy(item => item.getValue()).length).toBe(2);
  });

  it('should shuffle and keep same elements', () => {
    const list = AddableList.of(new MockAddable(1), new MockAddable(2), new MockAddable(3));
    const shuffled = list.shuffle();

    expect(shuffled.length).toBe(3);
  });

  it('should flatMap items', () => {
    const list = AddableList.of(new MockAddable(1), new MockAddable(2));
    const result = list.flatMap(item => [new MockAddable(item.getValue() * 10)]);

    expect(result.add(new MockAddable(0)).getValue()).toBe(30);
  });

  it('should convert to NumberList', () => {
    const list = AddableList.of(new MockAddable(1), new MockAddable(2));

    expect(list.toNumberList(item => item.getValue()).sum()).toBe(3);
  });

  it('should convert to StringList', () => {
    const list = AddableList.of(new MockAddable(1), new MockAddable(2));

    expect(list.toStringList(item => String(item.getValue())).join(',')).toBe('1,2');
  });

  it('should convert to ComparableList', () => {
    const list = AddableList.of(new MockAddable(1), new MockAddable(2));
    const result = list.toComparableList(item => new MockComparable(item.getValue()));

    expect(result).toBeInstanceOf(ComparableList);
    expect(result.length).toBe(2);
  });

  it('should convert to MergeableList', () => {
    const list = AddableList.of(new MockAddable(1), new MockAddable(2));
    const result = list.toMergeableList(item => new MockMergeable(item.getValue(), item.getValue()));

    expect(result).toBeInstanceOf(MergeableList);
  });

  it('should flattenToNumberList', () => {
    const list = AddableList.of(new MockAddable(1), new MockAddable(2));
    const result = list.flattenToNumberList(item => [item.getValue(), item.getValue() * 10]);

    expect(result.toArray()).toEqual([1, 10, 2, 20]);
  });

  it('should flattenToStringList', () => {
    const list = AddableList.of(new MockAddable(1), new MockAddable(2));
    const result = list.flattenToStringList(item => [String(item.getValue())]);

    expect(result.toArray()).toEqual(['1', '2']);
  });

  it('should flattenToMergeableList', () => {
    const list = AddableList.of(new MockAddable(1), new MockAddable(2));
    const result = list.flattenToMergeableList(item => [new MockMergeable(item.getValue(), item.getValue())]);

    expect(result).toBeInstanceOf(MergeableList);
    expect(result.length).toBe(2);
  });

  it('should flattenToComparableList', () => {
    const list = AddableList.of(new MockAddable(1), new MockAddable(2));
    const result = list.flattenToComparableList(item => [new MockComparable(item.getValue())]);

    expect(result).toBeInstanceOf(ComparableList);
    expect(result.length).toBe(2);
  });
});
