import { Injectable } from "@angular/core";

import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";

import "rxjs/add/operator/take";
import "rxjs/add/operator/toPromise";

import * as moment from "moment";

import { Statement, StatementLine, Transaction } from "models";
import { AngularFireKeyService } from "providers/angular-fire-key.service";

import "helpers/sum";
import "helpers/last";

@Injectable()
export class StatementService {

  constructor(private db: AngularFireDatabase, private keyService: AngularFireKeyService) { }

  public txsByStudentId(studentId: string): FirebaseListObservable<Transaction[]> {
    return this.db.list("/transactions", {
      query: {
        orderByChild: "studentId",
        equalTo: studentId
      }
    });
  }

  public statementForStudent(studentId: string, fromDate?: Date) {
    return this.txsByStudentId(studentId)
      .map((txs: Transaction[]) => {
        let lines = createStatementLines(txs);
        
        return <Statement>{
          lines: lines,
          currentBalance: lines.reduce(calculateBalance, 0),
          lastPayment: lastPaymentDate(lines)
        };
    });
  }

  async addPayment(studentId: string, amount: number, date: string) {
    let newKey = await this.keyService.nextKey("/transactions");

    let newPayment = {
      studentId,
      details: "Payment Received - Thank you!",
      credit: amount,
      date: date,
      type: "payment"
    };

    await this.db.object(`/transactions/${newKey}`).set(newPayment);
  }

  async addFee(studentId: string, fee: { details: string, amount: number, date: string, type: string }) {
    let newKey = await this.keyService.nextKey("/transactions");
    let { details, date, type, amount } = fee;

    let newFee = Object.assign({ studentId }, { details, date, type }, { debit: amount });

    await this.db.object(`/transactions/${newKey}`).set(newFee);
  }

  async updateFee(txId: string, fee: { details: string, amount: number, date: string, type: string }) {
    let { details, date, type, amount } = fee;
    let updatedFee = Object.assign({ details, date, type }, { debit: amount });

    await this.db.object(`/transactions/${txId}`).update(updatedFee);
  }

}

const createStatementLines = (txs: Transaction[], fromDate?: Date): StatementLine[] => {
  let statementLines: StatementLine[] = [].concat(txs.map(txToStatementLine)).sort(byLineDate);
  
  fromDate = fromDate || new Date(new Date().getFullYear(), 0, 1);
  
  let lines = statementLines.filter(line => line.date <= fromDate);
  let balance = lines.reduce(calculateBalance, 0);

  statementLines.splice(0, lines.length);

  let balanceLine: StatementLine = {
    date: fromDate,
    details: "Balance Brought Forward",
    balance: balance
  };

  statementLines.unshift(balanceLine);

  return statementLines;
}

const amountFromTx = (tx: Transaction): number => {
  if (tx.debit) {
    return tx.debit;
  }
  
  if (tx.credit) {
    return -tx.credit;
  }

  return 0;
}

const txToStatementLine = (tx: Transaction): StatementLine => {
  return {
    $key: tx.$key,
    date: new Date(tx.date),
    details: tx.details,
    type: tx.type,
    amount: amountFromTx(tx),
    balance: 0
  };
}

const calculateBalance = (balance: number, line: StatementLine) => {
  balance += line.amount || 0;
  line.balance = balance;
    
  return balance;
}

const byLineDate = (a: StatementLine, b: StatementLine) => {
  if (a.date > b.date) return 1;
  if (a.date < b.date) return -1;
  return 0;
}

const byLineDateDesc = (a: StatementLine, b: StatementLine) => {
  return byLineDate(a, b) * -1;
}

const lastPaymentDate = (lines: StatementLine[]) => {
  let lastLine = lines.filter(line => line.type === "payment").last();
  
  if (lastLine !== undefined) {
    return lastLine.date;
  }

  return null;
}
