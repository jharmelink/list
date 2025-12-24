import { Addable, AddableList } from '@jharmelink/list';
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
});
