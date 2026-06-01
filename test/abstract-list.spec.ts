import { List } from '../src';
import { describe, expect, it } from 'vitest';

class Mock {
  constructor(readonly value: number, readonly name: string) {
  }
}

describe('AbstractList', () => {
  const mock1 = new Mock(1, 'a');
  const mock2 = new Mock(2, 'b');
  const mock3 = new Mock(3, 'a');

  it('should support undefined', () => {
    const list: List<Mock> = List.from();

    expect(list.length).toBe(0);
  });

  it('should support null', () => {
    const list = List.from(null as any);

    expect(list.length).toBe(0);
  });

  it('should map by name', () => {
    const list = List.of(mock1, mock2);

    expect(list.mapBy(item => item.name).size).toBe(2);
  });

  it('should group by name', () => {
    const list = List.of(mock1, mock2, mock3);
    const group = list.groupBy(item => item.name);

    expect(group.size).toBe(2);
    expect(group.get('a')?.length).toBe(2);
  });

  it('should group by name with value mapper', () => {
    const list = List.of(mock1, mock2, mock3);
    const group = list.groupBy(item => item.name, item => item.value);

    expect(group.get('a')).toEqual([1, 3]);
    expect(group.get('b')).toEqual([2]);
  });

  it('should map by name with value mapper', () => {
    const list = List.of(mock1, mock2);
    const map = list.mapBy(item => item.name, item => item.value);

    expect(map.get('a')).toBe(1);
    expect(map.get('b')).toBe(2);
  });

  it('should sort by name', () => {
    const list = List.of(mock2, mock1, mock3);

    expect(list.sortBy(item => item.name).toArray()).toEqual([mock1, mock3, mock2]);
  });

  it('should sort by value', () => {
    const list = List.of(mock2, mock1, mock3);

    expect(list.sortBy(item => item.value).toArray()).toEqual([mock1, mock2, mock3]);
  });

  it('should return true when every item satisfies predicate', () => {
    expect(List.of(mock1, mock2, mock3).every(item => item.value > 0)).toBe(true);
    expect(List.of(mock1, mock2, mock3).every(item => item.value > 1)).toBe(false);
  });

  it('should return true when some item satisfies predicate', () => {
    expect(List.of(mock1, mock2, mock3).some(item => item.value === 2)).toBe(true);
    expect(List.of(mock1, mock2, mock3).some(item => item.value === 9)).toBe(false);
  });

  it('should return first item', () => {
    expect(List.of(mock1, mock2).first()).toBe(mock1);
    expect(List.of<Mock>().first()).toBeUndefined();
  });

  it('should return last item', () => {
    expect(List.of(mock1, mock2).last()).toBe(mock2);
    expect(List.of<Mock>().last()).toBeUndefined();
  });

  it('should get item by index', () => {
    const list = List.of(mock1, mock2, mock3);

    expect(list.get(0)).toBe(mock1);
    expect(list.get(2)).toBe(mock3);
    expect(list.get(-1)).toBeUndefined();
    expect(list.get(99)).toBeUndefined();
  });

  it('should find index of matching item', () => {
    const list = List.of(mock1, mock2, mock3);

    expect(list.findIndex(item => item.value === 2)).toBe(1);
    expect(list.findIndex(item => item.value === 9)).toBe(-1);
  });

  it('should check if list includes item', () => {
    expect(List.of(mock1, mock2).includes(mock1)).toBe(true);
    expect(List.of(mock1, mock2).includes(mock3)).toBe(false);
  });

  it('should reduce items to a value', () => {
    const list = List.of(mock1, mock2, mock3);
    const total = list.reduce((acc, item) => acc + item.value, 0);

    expect(total).toBe(6);
  });

  it('should forward index and array to every predicate', () => {
    const list = List.of(mock1, mock2, mock3);
    const indices: number[] = [];

    list.every((item, index, array) => {
      indices.push(index!);
      expect(array).toEqual([mock1, mock2, mock3]);

      return item.value > 0;
    });

    expect(indices).toEqual([0, 1, 2]);
  });

  it('should forward index and array to some predicate', () => {
    const list = List.of(mock1, mock2, mock3);
    const indices: number[] = [];

    list.some((item, index, array) => {
      indices.push(index!);
      expect(array).toEqual([mock1, mock2, mock3]);

      return false;
    });

    expect(indices).toEqual([0, 1, 2]);
  });

  it('should forward index and array to findIndex predicate', () => {
    const list = List.of(mock1, mock2, mock3);
    const indices: number[] = [];

    list.findIndex((item, index, array) => {
      indices.push(index!);
      expect(array).toEqual([mock1, mock2, mock3]);

      return false;
    });

    expect(indices).toEqual([0, 1, 2]);
  });

  it('should forward index and array to reduce reducer', () => {
    const list = List.of(mock1, mock2, mock3);
    const indices: number[] = [];

    list.reduce((acc, item, index, array) => {
      indices.push(index!);
      expect(array).toEqual([mock1, mock2, mock3]);

      return acc + item.value;
    }, 0);

    expect(indices).toEqual([0, 1, 2]);
  });

  it('should return underlying array with toArray', () => {
    const list = List.of(mock1, mock2);

    expect(list.toArray()).toEqual([mock1, mock2]);
  });

  it('should return length', () => {
    expect(List.of(mock1, mock2, mock3).length).toBe(3);
    expect(List.of<Mock>().length).toBe(0);
  });
});
