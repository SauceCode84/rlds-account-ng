
interface Array<T> {
  first(): T;
  first(predicate?: (item: T) => boolean): T;
}
