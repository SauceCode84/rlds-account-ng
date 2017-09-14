/// <reference path="sum.d.ts" />

const selfFn = (o: any) => o;

if (!Array.prototype.sum) {
  Array.prototype.sum = function<T>(selectorFn: NumberSelector<T> = (o: any) => o, initalValue: number = 0): number {
    return this.reduce((total: number, current: T) => {
      let value: number = selectorFn(current);
      
      if (value) {
        total += value;
      }
  
      return total;
    }, initalValue);
  };
}

export const sum = <T>(array: T[], selectorFn?: (item: T) => number, initalValue?: number): number => {
  return array.sum(selectorFn, initalValue);
}