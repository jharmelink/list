import { nonNullable } from '~/global';

export class Empty {
  static filter<T, K>(items: readonly T[], value?: (value: T) => K): Array<NonNullable<T>> {
    const present = items.filter(nonNullable);

    return value ? present.filter(item => nonNullable(value(item))) : present;
  }
}
