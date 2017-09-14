import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

import { Observable } from "rxjs/Observable";

import { Statement } from "models";
import { StatementService } from "providers/statement.service";

@Component({
  selector: "app-statement",
  templateUrl: "./statement.component.html",
  styleUrls: ["./statement.component.scss"]
})
export class StatementComponent implements OnChanges, OnInit {
  
  @Input()
  public studentId: string;

  public statement$: Observable<Statement>;
  public statement: Statement;

  constructor(private statementService: StatementService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.studentId.isFirstChange()) {
      this.loadStatement();
    }
  }

  ngOnInit() {
    this.loadStatement();
  }

  private loadStatement() {
    this.statement$ = this.statementService.statementForStudent(this.studentId);
    this.statement$.subscribe(statement => this.statement = statement);
  }

  async addPayment() {
    await this.statementService.addPayment(this.studentId, 200);
  }

}
