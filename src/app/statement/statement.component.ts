import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import { Statement, StatementLine } from "models";
import { StatementService } from "providers/statement.service";

@Component({
  selector: "app-statement",
  templateUrl: "./statement.component.html",
  styleUrls: ["./statement.component.scss"]
})
export class StatementComponent implements OnInit, OnChanges, OnDestroy {
  
  @Input()
  public studentId: string;

  public statement: Statement;
  private statementSub: Subscription;

  constructor(private statementService: StatementService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.studentId.isFirstChange()) {
      this.loadStatement();
    }
  }

  ngOnInit() {
    this.loadStatement();
  }

  ngOnDestroy() {
    this.statementSub.unsubscribe();
  }

  isPayment(line: StatementLine) {
    if (line && line.type) {
      return line.type === "payment";
    }

    return false;
  }

  private loadStatement() {
    if (this.statementSub) {
      this.statementSub.unsubscribe();
    }
    
    this.statementSub = this.statementService
      .statementForStudent(this.studentId)
      .subscribe(statement => this.statement = statement);
  }

}
