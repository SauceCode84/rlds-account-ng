
type NumberSelector<T> = (item: T) => number;

interface Array<T> {
  /**
   * Returns the sum of the elements in the array based on the values from the specified callback function
   * @param selectorFn A callback function which returns a number, used to sum the elements in the array
   * @param initalValue An initial value. Default is 0
   */
  sum(selectorFn: NumberSelector<T>, initalValue?: number): number;
}
