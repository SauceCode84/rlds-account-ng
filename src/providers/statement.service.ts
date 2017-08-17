import { Injectable } from "@angular/core";

import { Statement, StatementLine, LineType } from "models";
import "helpers/sum";

@Injectable()
export class StatementService {

  private statementLines: StatementLine[] = [
    {
      date: new Date("2017-01-03"),
      details: "Payment Received - Thank you!",
      credit: 930.00
    },
    {
      date: new Date("2017-01-10"),
      details: "Payment Received - Thank you!",
      credit: 250.00
    },
    {
      date: new Date("2017-01-14"),
      details: "Registration Fees - 2017",
      debit: 250.00
    },
    {
      date: new Date("2017-01-14"),
      details: "Class Fees Grade 3 (Jan)",
      debit: 410.00
    },
    {
      date: new Date("2017-01-14"),
      details: "Private Lessons - Half Hour (Jan)",
      debit: 520.00
    },
    {
      date: new Date("2017-01-24"),
      details: "Body Conditioning Equipment",
      debit: 320.00
    },
    {
      date: new Date("2017-01-26"),
      details: "Class Fees Grade 3 (Feb)",
      debit: 410.00
    },
    {
      date: new Date("2017-01-26"),
      details: "Private Lessons - Half Hour (Feb)",
      debit: 520.00
    },
    {
      date: new Date("2017-02-02"),
      details: "Payment Received - Thank You!",
      credit: 320.00
    },
    {
      date: new Date("2017-02-02"),
      details: "Payment Received - Thank You!",
      credit: 930.00
    },
    {
      date: new Date("2017-02-27"),
      details: "Class Fees Grade 3 (Mar)",
      debit: 410.00
    },
    {
      date: new Date("2017-02-27"),
      details: "Private Lessons - Half Hour (Mar)",
      debit: 520.00
    },
    {
      date: new Date("2017-03-02"),
      details: "Payment Received - Thank You!",
      credit: 930.00
    },
    {
      date: new Date("2017-03-22"),
      details: "Exam Fees - Grade 3 2017",
      debit: 626.00
    },
    {
      date: new Date("2017-03-23"),
      details: "Payment Received - Thank You!",
      credit: 626.00
    },
    {
      date: new Date("2017-03-27"),
      details: "Class Fees Grade 3 (Apr)",
      debit: 410.00
    },
    {
      date: new Date("2017-03-27"),
      details: "Private Lessons - Half Hour (Apr)",
      debit: 520.00
    },
    {
      date: new Date("2017-04-03"),
      details: "Payment Received - Thank You!",
      credit: 930.00
    },
    {
      date: new Date("2017-04-26"),
      details: "Class Fees Grade 3 (May)",
      debit: 410.00
    },
    {
      date: new Date("2017-04-26"),
      details: "Private Lessons - Half Hour (May)",
      debit: 520.00
    },
    {
      date: new Date("2017-05-02"),
      details: "Payment Received - Thank You!",
      credit: 930.00
    },
    {
      date: new Date("2017-05-25"),
      details: "Class Fees Grade 3 (Jun)",
      debit: 410.00
    },
    {
      date: new Date("2017-05-25"),
      details: "Private Lessons - Half Hour (Jun)",
      debit: 520.00
    },
    {
      date: new Date("2017-05-25"),
      details: "Piano Fees 2017",
      debit: 300.00
    }
  ];

  constructor() { }

  getStatement(fromDate?: Date): Statement {
    fromDate = fromDate || new Date(new Date().getFullYear(), 0, 1);
    
    let totalInvoiced: number = this.statementLines.sum(line => line.debit);
    let totalPayments: number = this.statementLines.sum(line => line.credit);

    let lines = this.statementLines.filter(line => line.date <= fromDate);

    let balance = lines.reduce(this.calcBalance, 0);
    
    this.statementLines.splice(0, lines.length);

    let balanceLine = {
      date: fromDate,
      details: "Balance Brought Forward",
      balance: balance
    };

    this.statementLines.unshift(balanceLine);
    
    let currentBalance = this.statementLines.reduce(this.calcBalance, 0);

    return {
      lines: this.statementLines,
      currentBalance: currentBalance,
      totalInvoiced: totalInvoiced,
      totalPayments: totalPayments
    };
  }

  private calcBalance(balance: number, currentLine: StatementLine) {
    balance += currentLine.balance || 0;

    balance += currentLine.debit || 0;
    balance -= currentLine.credit || 0;

    currentLine.balance = balance;
      
    return balance;
  }

}
