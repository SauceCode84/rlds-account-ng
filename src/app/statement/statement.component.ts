import { Component, Input, OnInit } from "@angular/core";

import { Observable } from "rxjs/Observable";

import { Statement } from "models";
import { StatementService } from "providers/statement.service";

@Component({
  selector: "app-statement",
  templateUrl: "./statement.component.html",
  styleUrls: ["./statement.component.scss"]
})
export class StatementComponent implements OnInit {

  @Input()
  public studentId: string;

  @Input()
  public statement: Observable<Statement>;

  constructor(private statementService: StatementService) { }

  ngOnInit() {
    console.log(this.studentId);
    //let result = this.statementService.linesByStudentId(this.studentId);

    /*result.subscribe(lines => {
      console.log(lines);
    });*/

    this.statement = this.statementService.statementForStudent(this.studentId);

    this.statement.subscribe(console.log);

    //console.log("StatementComponent.ngOnInit()", this.statement);
    /*this.statement = this.statement.map(statement => {
      console.log(statement);
      return this.statementService.buildStatement(statement.lines)
    });*/
  }

  async addPayment() {
    await this.statementService.addPayment(this.studentId, 200);
  }

  /*get lastPayment() {
    //| date:'dd MMM yyyy'
    return this.statement.map((statement: any) => statement.lastPayment);
  }*/

}
