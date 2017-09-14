import { Injectable } from "@angular/core";

import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";

import "rxjs/add/operator/take";
import "rxjs/add/operator/toPromise";

import * as moment from "moment";

import { Statement, StatementLine, LineType } from "models";
import { AngularFireKeyService } from "providers/angular-fire-key.service";

import "helpers/sum";
import "helpers/last";

@Injectable()
export class StatementService {

  constructor(private db: AngularFireDatabase, private keyService: AngularFireKeyService) { }

  public linesByStudentId(studentId: string): FirebaseListObservable<StatementLine[]> {
    return this.db.list("/transactions", {
      query: {
        orderByChild: "studentId",
        equalTo: studentId
      }
    });
  }

  public statementForStudent(studentId: string, fromDate?: Date) {
    return this.linesByStudentId(studentId).map(sl => {
      let statementLines: StatementLine[] = [].concat(sl).sort(statementLineByDate);

      statementLines.forEach(statementLine => statementLine.balance = 0);

      fromDate = fromDate || new Date(new Date().getFullYear(), 0, 1);
    
      let totalInvoiced: number = statementLines.sum(line => line.debit);
      let totalPayments: number = statementLines.sum(line => line.credit);

      let lines = statementLines.filter(line => line.date <= fromDate);

      let balance = lines.reduce(calculateBalance, 0);

      statementLines.splice(0, lines.length);

      let balanceLine = {
        date: fromDate,
        details: "Balance Brought Forward",
        balance: balance
      };

      statementLines.unshift(balanceLine);
      
      let currentBalance = statementLines.reduce(calculateBalance, 0);

      let lastPayment: Date = lastPaymentDate(statementLines);

      return <Statement>{
        lines: statementLines,
        currentBalance: currentBalance,
        totalInvoiced: totalInvoiced,
        totalPayments: totalPayments,
        lastPayment: lastPayment
      };
    });
  }

  async addPayment(studentId: string, amount: number) {
    console.log(this.keyService.randomKey());

    let newKey = await this.keyService.nextKey("/transactions");

    let newPayment = {
      studentId,
      details: "Payment Received - Thank you!",
      credit: amount,
      date: moment().format("YYYY-MM-DD"),
      type: LineType.Payment
    }

    return this.db
      .list("/transactions")
      .update(newKey, newPayment);
  }

}

const calculateBalance = (balance: number, currentLine: StatementLine) => {
  balance += currentLine.balance || 0;

  balance += currentLine.debit || 0;
  balance -= currentLine.credit || 0;

  currentLine.balance = balance;
    
  return balance;
}

const statementLineByDate = (a: StatementLine, b: StatementLine) => {
  if (a.date > b.date) return 1;
  if (a.date < b.date) return -1;
  return 0;
}

const lastPaymentDate = (statementLines: StatementLine[]) => {
  let lastLine = statementLines.filter(sl => sl.type === LineType.Payment).last();
  
  if (lastLine !== undefined) {
    return lastLine.date;
  }

  return null;
}
