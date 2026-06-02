export class Distinct {
  static distinct<T>(items: Iterable<T>): Iterable<T> {
    return new Set(items).values();
  }

  static distinctBy<T, K, L>(
    items: readonly T[],
    identifier: (item: T) => K,
    mapper: (item: T) => T | L = item => item,
  ): Iterable<T | L> {
    const map = items.reduce((acc: Map<K, T | L>, cur: T) => {
      const key = identifier(cur);

      return acc.has(key) ? acc : acc.set(key, mapper(cur));
    }, new Map<K, T | L>());

    return map.values();
  }
}
