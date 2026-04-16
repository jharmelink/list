export class Shuffle {
  static shuffle<T>(items: readonly T[]): readonly T[] {
    return items.map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
  }
}
