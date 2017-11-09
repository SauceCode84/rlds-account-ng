
type KeySelector<T, TKey> = (value: T) => TKey;

interface Array<T> {
  groupBy<TKey>(keySelector: KeySelector<T, TKey>): Map<TKey, T[]>;
}
