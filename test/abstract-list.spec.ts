import { List } from '@jharmelink/list';
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
    const list = List.from();

    expect(list.length).toBe(0);
  });

  it('should support null', () => {
    const list = List.from(null as unknown as Mock[]);

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

  it('should sort by name', () => {
    const list = List.of(mock2, mock1, mock3);

    expect(list.sortBy(item => item.name).toArray()).toEqual([mock1, mock3, mock2]);
  });

  it('should sort by value', () => {
    const list = List.of(mock2, mock1, mock3);

    expect(list.sortBy(item => item.value).toArray()).toEqual([mock1, mock2, mock3]);
  });
});
