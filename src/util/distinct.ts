export class Distinct {
  static distinct<T>(items: Iterable<T>): Iterable<T> {
    const set = new Set(items);

    return set.values();
  }

  static distinctBy<T, K, L>(items: readonly T[], identifier: (item: T) => K, mapper?: (item: T) => L): Iterable<T | L> {
    if (!mapper) {
      const map = items.reduce((acc: Map<K, T>, cur: T) => {
        const key = identifier(cur);

        if (!acc.has(key)) {
          acc.set(key, cur);
        }

        return acc;
      }, new Map<K, T>());

      return map.values();
    }

    const map = items.reduce((acc: Map<K, L>, cur: T) => {
      const key = identifier(cur);

      if (!acc.has(key)) {
        acc.set(key, mapper(cur));
      }

      return acc;
    }, new Map<K, L>());

    return map.values();
  }
}
