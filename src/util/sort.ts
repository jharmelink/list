export class Sort {
  static sort<T>(items: readonly T[], identifier: (item: T) => number | string, reverse = false): readonly T[] {
    return items.toSorted((a, b) => {
      const compare = Sort.compare(identifier(a), identifier(b));

      return reverse ? -compare : compare;
    });
  }

  private static compare(a: number | string, b: number | string): number {
    if (typeof a === 'string' && typeof b === 'string') {
      return a.localeCompare(b);
    }

    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }

    return 0;
  }
}
