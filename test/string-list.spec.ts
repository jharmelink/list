import { Addable, AddableList, Comparable, ComparableList, Mergeable, MergeableList, StringList } from '../src';
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

describe('StringList', () => {
  it('should join items with a separator', () => {
    const list = StringList.of('a', 'b', 'c');

    expect(list.join(',')).toBe('a,b,c');
  });

  it('should map items to uppercase', () => {
    const list = StringList.of('a', 'b', 'c');
    const upperList = list.map(item => item.toUpperCase());

    expect(upperList.toArray()).toEqual(['A', 'B', 'C']);
  });

  it('should remove duplicate strings with distinct', () => {
    expect(StringList.of('a', 'b', 'a', 'c').distinct().toArray()).toEqual(['a', 'b', 'c']);
  });

  it('should sort strings alphabetically', () => {
    expect(StringList.of('c', 'a', 'b').sort().toArray()).toEqual(['a', 'b', 'c']);
  });

  it('should concat two StringLists', () => {
    expect(StringList.of('a', 'b').concat(['c', 'd']).toArray()).toEqual(['a', 'b', 'c', 'd']);
    expect(StringList.of('a', 'b').concat().toArray()).toEqual(['a', 'b']);
  });

  it('should filter strings by predicate', () => {
    expect(StringList.of('apple', 'banana', 'apricot').filter(s => s.startsWith('a')).toArray()).toEqual(['apple', 'apricot']);
  });

  it('should filter empty string values', () => {
    const list = new StringList(['a', null as unknown as string, 'b', undefined as unknown as string]);

    expect(list.filterEmpty().toArray()).toEqual(['a', 'b']);
  });

  it('should flatMap strings', () => {
    expect(StringList.of('ab', 'cd').flatMap(s => s.split('')).toArray()).toEqual(['a', 'b', 'c', 'd']);
  });

  it('should shuffle and keep same elements', () => {
    const list = StringList.of('a', 'b', 'c');

    expect(list.shuffle().length).toBe(3);
  });

  it('should toSorted with comparator', () => {
    expect(StringList.of('c', 'a', 'b').toSorted((a, b) => a.localeCompare(b)).toArray()).toEqual(['a', 'b', 'c']);
  });

  it('should join with no separator', () => {
    expect(StringList.of('a', 'b', 'c').join()).toBe('a,b,c');
  });

  it('should convert to NumberList', () => {
    expect(StringList.of('1', '2', '3').toNumberList(s => Number(s)).sum()).toBe(6);
  });

  it('should convert to AddableList', () => {
    const result = StringList.of('1', '2').toAddableList(s => new MockAddable(Number(s)));

    expect(result).toBeInstanceOf(AddableList);
  });

  it('should convert to ComparableList', () => {
    const result = StringList.of('1', '2').toComparableList(s => new MockComparable(Number(s)));

    expect(result).toBeInstanceOf(ComparableList);
  });

  it('should convert to MergeableList', () => {
    const result = StringList.of('1', '2').toMergeableList(s => new MockMergeable(Number(s), Number(s)));

    expect(result).toBeInstanceOf(MergeableList);
  });

  it('should flattenToNumberList', () => {
    const result = StringList.of('12', '34').flattenToNumberList(s => s.split('').map(Number));

    expect(result.toArray()).toEqual([1, 2, 3, 4]);
  });

  it('should flattenToAddableList', () => {
    const result = StringList.of('1', '2').flattenToAddableList(s => [new MockAddable(Number(s))]);

    expect(result).toBeInstanceOf(AddableList);
  });

  it('should flattenToComparableList', () => {
    const result = StringList.of('1', '2').flattenToComparableList(s => [new MockComparable(Number(s))]);

    expect(result).toBeInstanceOf(ComparableList);
  });

  it('should flattenToMergeableList', () => {
    const result = StringList.of('1', '2').flattenToMergeableList(s => [new MockMergeable(Number(s), Number(s))]);

    expect(result).toBeInstanceOf(MergeableList);
  });
});
