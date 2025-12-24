import { Comparable, ComparableList } from '@jharmelink/list';
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
});
