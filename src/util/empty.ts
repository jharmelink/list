import { nonNullable } from '~/global';

export class Empty {
  static filter<T, K>(items: readonly T[], value?: (value: T) => K): Array<NonNullable<T>> {
    if (!value) {
      return items.filter(nonNullable);
    }

    return items.filter(nonNullable).filter(item => nonNullable(value(item)));
  }
}
