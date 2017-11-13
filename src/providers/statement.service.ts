import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";

import "rxjs/add/operator/take";
import "rxjs/add/operator/toPromise";

import * as moment from "moment";

import { Statement, StatementLine, Transaction } from "models";

import "helpers/sum";
import "helpers/last";
import { environment } from "environments/environment";

type TxResult = { id: string };

@Injectable()
export class StatementService {

  private url = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) { }

  public txsByAccount(accountId: string, includeSubAccounts: boolean = false): Observable<Transaction[]> {
    let params: HttpParams = new HttpParams()
      .set("accountId", accountId);

    if (includeSubAccounts) {
      params = params.set("includeSubAccounts", "true");
    }

    return this.http.get<Transaction[]>(this.url, { params });
  }

  public statementForStudent(studentId: string, fromDate?: Date) {
    return this.txsByAccount(studentId)
      .map(txs => {
        let lines = createStatementLines(txs);
        
        return <Statement>{
          lines: lines,
          currentBalance: lines.reduce(calculateBalance, 0),
          lastPayment: lastPaymentDate(lines)
        };
    });
  }

  async addPayment(accountId: string, { amount, date }: { amount?: number, date?: string }) {
    let newPayment = {
      accountId,
      details: "Payment Received - Thank you!",
      credit: amount,
      date: moment(date).utc(true).toDate(),
      type: "payment"
    };

    console.log(newPayment);

    return this.http.post<TxResult>(this.url, newPayment).toPromise();
  }

  async updatePayment(id: string, { amount, date }: { amount?: number, date?: string }) {
    let updatedPayment = {
      credit: amount,
      date: moment(date).utc(true).toDate()
    };

    await this.http.put(this.url + "/" + id, updatedPayment, { responseType: "text" }).toPromise();
  }

  async addFee(accountId: string, fee: { details: string, amount: number, date: string, type: string }) {
    let { details, date, type, amount } = fee;
    let newFee = Object.assign({ accountId }, { details, date: moment(date).utc(true).toDate(), type }, { debit: amount });

    console.log(newFee);

    return this.http.post<TxResult>(this.url, newFee).toPromise();
  }

  async updateFee(id: string, fee: { details: string, amount: number, date: string, type: string }) {
    let { details, date, type, amount } = fee;
    let updatedFee = Object.assign({ details, date: moment(date).utc(true).toDate(), type }, { debit: amount });

    await this.http.put(this.url + "/" + id, updatedFee, { responseType: "text" }).toPromise();
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
    id: tx.id,
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
