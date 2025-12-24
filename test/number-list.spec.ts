import { NumberList } from '@jharmelink/list';
import { describe, expect, it } from 'vitest';

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
});
