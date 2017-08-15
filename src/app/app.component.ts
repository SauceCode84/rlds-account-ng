import { Component, OnInit } from '@angular/core';

import { AlertService } from "providers/alert.service";

enum LineType {
  ClassFees,
  ExamFees,
  Payment
}

interface StatementLine {
  date: Date;
  details: string;
  type?: LineType;
  debit?: number;
  credit?: number;
  balance?: number;
}

const sum = <T>(array: T[], selectorFn: (item: T) => number, initalValue: number = 0): number => {
  return array.reduce((total: number, current: T) => {
    let value = selectorFn(current);
    
    if (value) {
      total += value;
    }

    return total;
  }, initalValue);
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  statement: StatementLine[] = [
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

  totalInvoiced: number = 0.0;
  totalPayments: number = 0.0;
  currentBalance: number;

  constructor(private alertService: AlertService) {
  }

  ngOnInit() {
    this.totalInvoiced = sum(this.statement, line => line.debit);
    this.totalPayments = sum(this.statement, line => line.credit);

    let fromDate = new Date("2017-04-18");
    
    let lines = this.statement.filter(line => line.date <= fromDate);
    let balance = lines.reduce(this.calcBalance, 0);

    this.statement.splice(0, lines.length);

    let balanceLine = {
      date: fromDate,
      details: "Balance Brought Forward",
      balance: balance
    };

    this.statement.unshift(balanceLine);
    
    this.currentBalance = this.statement.reduce(this.calcBalance, 0);
  }

  private debitsOnly(line: StatementLine): boolean {
    return line.debit !== undefined && line.debit !== null;
  }

  private creditsOnly(line: StatementLine): boolean {
    return line.credit !== undefined && line.credit !== null;
  }

  private calcBalance(balance: number, currentLine: StatementLine) {
    balance += currentLine.balance || 0;

    balance += currentLine.debit || 0;
    balance -= currentLine.credit || 0;

    currentLine.balance = balance;
      
    return balance;
  }

  onSuccess() {
    this.alertService.success("Hello World!");
  }

  onError() {
    this.alertService.error("Oh dear... something went wrong!");
  }

}
