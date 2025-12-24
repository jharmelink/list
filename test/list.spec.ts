import { List, Mergeable } from '@jharmelink/list';
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

  it('should flatten and merge items by identifier', () => {
    const list = List.of(mock1, mock2);

    expect(list.flattenToMergeableList(item => item.mergeables).mergeBy(item => item.id).toArray()).toEqual([
      new TestMergeable(1, 20),
      new TestMergeable(2, 40),
    ]);
  });
});
