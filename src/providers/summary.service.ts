import { Injectable } from "@angular/core";
//import { AngularFireDatabase, FirebaseObjectObservable } from "angularfire2/database";

@Injectable()
export class SummaryService {

  constructor(/*private db: AngularFireDatabase*/) { }

  public getSummaryData(): SummaryData {
    return null;
    //return this.db.object("/stats");
  }

}

type TotalsByMonth = { [year: number]: { [month: number]: number } };

interface SummaryData {
  balance: number;
  "class": TotalsByMonth;
  private: TotalsByMonth;
  registration: TotalsByMonth;
  payment: TotalsByMonth;
  exam: TotalsByMonth;
  festival: TotalsByMonth;
  costume: TotalsByMonth;
}