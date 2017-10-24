import { Injectable } from "@angular/core";

//import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from "angularfire2/database";

import { Fee } from "models";

@Injectable()
export class FeesService {

  constructor(/*private db: AngularFireDatabase*/) { }

  public getFees(): Fee[] {
    return [];
    //return this.db.list("fees", { query: { orderByChild: "sortOrder" } });
  }

  public getFeeById(key: string): Fee {
    return null;
    //return this.db.object("/fees/" + key);
  }

  public async upsertFee(key: string, data: any) {
    /*if (!key) {
      await this.getFees().push(data);
    } else {
      await this.getFeeById(key).update(data);
    }*/
  }

}
