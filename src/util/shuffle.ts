export class Shuffle {
  static shuffle<T>(items: readonly T[]): readonly T[] {
    const result = [...items];

    [...result.keys()].reverse().forEach(i => {
      const j = Math.floor(Math.random() * (i + 1));

      [result[i], result[j]] = [result[j], result[i]];
    });

    return result;
  }
}
