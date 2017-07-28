import { Component, OnInit } from '@angular/core';

import { AlertService } from "providers/alert.service";

interface StatementLine {
  date: Date;
  details: string;
  debit?: number;
  credit?: number;
  balance?: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  statement: StatementLine[] = [
    {
      date: new Date("2017-01-01"),
      details: "Balance Brought Forward"
    },
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
    /*

26 Apr 2017	Class Fees Grade 3 (May)	 R 410.00 	
	Private Lessons - Half Hour (May)	 R 520.00 	
02 May 2017	Payment Received - Thank You!		 R 930.00 
25 May 2017	Class Fees Grade 3 (Jun)	 R 410.00 	
	Private Lessons - Half Hour (Jun)	 R 520.00 	
25 May 2017	Piano Fees 2017	 R 300.00 	


    */
  ];
  currentBalance: number;

  constructor(private alertService: AlertService) {
    
  }

  ngOnInit() {
    this.currentBalance = this.statement.reduce((balance: number, currentLine) => {
      balance += currentLine.debit || 0;
      balance -= currentLine.credit || 0;

      currentLine.balance = balance;
      
      return balance;
    }, 0);
  }

  onSuccess() {
    this.alertService.success("Hello World!");
  }

  onError() {
    this.alertService.error("Oh dear... something went wrong!");
  }

}
