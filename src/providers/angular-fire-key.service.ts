import { Injectable } from "@angular/core";

import { AngularFireDatabase } from "angularfire2/database";

@Injectable()
export class AngularFireKeyService {

  constructor(private db: AngularFireDatabase) { }

  public nextKey(path: string) {
    return this.db.list(path, {
      query: {
        orderByKey: true,
        limitToLast: 1
      }
    })
    .take(1)
    .switchMap(items => {
      let last = items[0];
      let key = last.$key;

      if (!key) {
        key = 0;
      }

      let newKey = (parseInt(key, 16) + 1).toString(16);

      // return as an array - toPromise is calling .last().subscribe()
      return [ newKey ];
    })
    .toPromise();
  }

  public randomKey() {
    return ("000000" + Math.random().toString(16).slice(2, 8)).slice(-6);
  }

}
