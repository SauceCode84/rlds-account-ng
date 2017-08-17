/// <reference path="sum.d.ts" />

if (!Array.prototype.sum) {
  Array.prototype.sum = function<T>(selectorFn: NumberSelector<T>, initalValue: number = 0): number {
    return this.reduce((total: number, current: T) => {
      let value: number = selectorFn(current);
      
      if (value) {
        total += value;
      }
  
      return total;
    }, initalValue);
  };
}

export const sum = <T>(array: T[], selectorFn: (item: T) => number, initalValue: number = 0): number => {
  return array.sum(selectorFn, initalValue);
}
