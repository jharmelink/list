import { Mergeable, MergeableList } from '@jharmelink/list';
import { describe, expect, it } from 'vitest';

class TestMergeable implements Mergeable<TestMergeable> {
  constructor(public id: number, public value: number) {
  }

  merge(other: TestMergeable): TestMergeable {
    return new TestMergeable(this.id, this.value + other.value);
  }
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
});
