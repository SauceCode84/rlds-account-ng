/// <reference path="first.d.ts" />

if (!Array.prototype.first) {
  Array.prototype.first = function<T>(predicate?: (item: T) => boolean): T {
    let that: T[] = this;
    
    if (predicate) {
      that = that.filter(predicate);
    }
    
    if (that.length == 0) {
      return null;
    }
    
    return that[0];
  };
}
