import { Addable, AddableList, Comparable, ComparableList, Mergeable, MergeableList, NumberList } from '../src';
import { describe, expect, it } from 'vitest';

class MockAddable implements Addable<MockAddable> {
  constructor(readonly n: number) {}
  add(other: MockAddable) { return new MockAddable(this.n + other.n); }
}

class MockComparable implements Comparable<MockComparable> {
  constructor(readonly n: number) {}
  equals(other: MockComparable) { return this.n === other.n; }
}

class MockMergeable implements Mergeable<MockMergeable> {
  constructor(readonly id: number, readonly n: number) {}
  merge(other: MockMergeable) { return new MockMergeable(this.id, this.n + other.n); }
}

describe('NumberList', () => {
  it('should sum all numbers in the list', () => {
    const list = NumberList.of(1, 2, 3, 4, 5);
    const sum = list.sum();

    expect(sum).toBe(15);
  });

  it('should find the maximum number in the list', () => {
    const list = NumberList.of(1, 2, 3, 4, 5);
    const max = list.max();

    expect(max).toBe(5);
  });

  it('should find the minimum number in the list', () => {
    const list = NumberList.of(1, 2, 3, 4, 5);
    const min = list.min();

    expect(min).toBe(1);
  });

  it('should subtract all numbers in the list', () => {
    const list = NumberList.of(1, 2, 3, 4, 5);
    const sub = list.sub(15);

    expect(sub).toBe(0);
  });

  it('should remove duplicate numbers with distinct', () => {
    expect(NumberList.of(1, 2, 2, 3, 3).distinct().toArray()).toEqual([1, 2, 3]);
  });

  it('should sort numbers in ascending order', () => {
    expect(NumberList.of(3, 1, 4, 1, 5).sort().toArray()).toEqual([1, 1, 3, 4, 5]);
  });

  it('should concat two NumberLists', () => {
    expect(NumberList.of(1, 2).concat([3, 4]).toArray()).toEqual([1, 2, 3, 4]);
    expect(NumberList.of(1, 2).concat().toArray()).toEqual([1, 2]);
  });

  it('should filter numbers by predicate', () => {
    expect(NumberList.of(1, 2, 3, 4).filter(n => n % 2 === 0).toArray()).toEqual([2, 4]);
  });

  it('should filter empty (null/undefined) values', () => {
    const list = new NumberList([1, null as unknown as number, 2, undefined as unknown as number]);

    expect(list.filterEmpty().toArray()).toEqual([1, 2]);
  });

  it('should flatMap numbers', () => {
    expect(NumberList.of(1, 2).flatMap(n => [n, n * 10]).toArray()).toEqual([1, 10, 2, 20]);
  });

  it('should map numbers', () => {
    expect(NumberList.of(1, 2, 3).map(n => n * 3).toArray()).toEqual([3, 6, 9]);
  });

  it('should shuffle and keep same elements', () => {
    const list = NumberList.of(1, 2, 3);
    const shuffled = list.shuffle();

    expect(shuffled.length).toBe(3);
    expect(shuffled.toArray().slice().sort((a, b) => a - b)).toEqual([1, 2, 3]);
  });

  it('should toSorted with comparator', () => {
    expect(NumberList.of(3, 1, 2).toSorted((a, b) => b - a).toArray()).toEqual([3, 2, 1]);
  });

  it('should sum with initial value', () => {
    expect(NumberList.of(1, 2, 3).sum(10)).toBe(16);
  });

  it('should sub with no initial value', () => {
    expect(NumberList.of(1, 2, 3).sub()).toBe(-6);
  });

  it('should convert to StringList', () => {
    expect(NumberList.of(1, 2).toStringList(n => String(n)).join(',')).toBe('1,2');
  });

  it('should convert to AddableList', () => {
    const result = NumberList.of(1, 2).toAddableList(n => new MockAddable(n));

    expect(result).toBeInstanceOf(AddableList);
    expect(result.add(new MockAddable(0)).n).toBe(3);
  });

  it('should convert to ComparableList', () => {
    const result = NumberList.of(1, 2).toComparableList(n => new MockComparable(n));

    expect(result).toBeInstanceOf(ComparableList);
  });

  it('should convert to MergeableList', () => {
    const result = NumberList.of(1, 2).toMergeableList(n => new MockMergeable(n, n));

    expect(result).toBeInstanceOf(MergeableList);
  });

  it('should flattenToStringList', () => {
    const result = NumberList.of(1, 2).flattenToStringList(n => [String(n), String(n * 10)]);

    expect(result.toArray()).toEqual(['1', '10', '2', '20']);
  });

  it('should flattenToAddableList', () => {
    const result = NumberList.of(1, 2).flattenToAddableList(n => [new MockAddable(n)]);

    expect(result).toBeInstanceOf(AddableList);
  });

  it('should flattenToComparableList', () => {
    const result = NumberList.of(1, 2).flattenToComparableList(n => [new MockComparable(n)]);

    expect(result).toBeInstanceOf(ComparableList);
  });

  it('should flattenToMergeableList', () => {
    const result = NumberList.of(1, 2).flattenToMergeableList(n => [new MockMergeable(n, n)]);

    expect(result).toBeInstanceOf(MergeableList);
  });
});
