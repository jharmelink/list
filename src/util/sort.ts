export class Sort {
  static sort<T>(items: readonly T[], identifier: (item: T) => number | string, reverse = false): readonly T[] {
    return items.toSorted((a, b) => {
      const aValue = identifier(reverse ? b : a);
      const bValue = identifier(reverse ? a : b);

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return aValue - bValue;
      }

      return 0;
    });
  }
}
