import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";

import { AlertService } from "providers/alert.service";
import { StatementService } from "providers/statement.service";

import { Statement, StatementLine } from "models";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  show: boolean = false;

  student = {
    name: "Andrea Hummerstone"
  };

  statement: Statement;

  currentBalance: number;

  constructor(
    private statementService: StatementService,
    private alertService: AlertService,
    private title: Title) {
    this.title.setTitle(this.student.name + " - Statement");
  }

  ngOnInit() {
    let fromDate = new Date("2017-04-18");
    this.statement = this.statementService.getStatement(fromDate);
  }

  onSuccess() {
    this.alertService.success("Hello World!");
  }

  onError() {
    this.alertService.error("Oh dear... something went wrong!");
  }

}
