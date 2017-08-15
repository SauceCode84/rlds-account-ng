
export const sum = <T>(array: T[], selectorFn: (item: T) => number, initalValue: number = 0): number => {
  return array.reduce((total: number, current: T) => {
    let value = selectorFn(current);
    
    if (value) {
      total += value;
    }

    return total;
  }, initalValue);
}
