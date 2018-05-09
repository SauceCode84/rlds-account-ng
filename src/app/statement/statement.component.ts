import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { Observable, Subscription } from "rxjs";

import { Statement, StatementLine, Student } from "models";
import { StatementService } from "providers/statement.service";
import { StudentFeeModalComponent } from "app/student-fee-modal/student-fee-modal.component";
import { PaymentModalComponent } from "app/payment-modal/payment-modal.component";

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

  constructor(
    private statementService: StatementService,
    private modalService: NgbModal) { }

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
    if (!this.studentId) {
      return;
    }

    if (this.statementSub) {
      this.statementSub.unsubscribe();
    }

    this.statementSub = this.statementService
      .statementForStudent(this.studentId)
      .subscribe(statement => this.statement = statement);
  }

  onLineClick(line: StatementLine) {
    console.log(line);

    if (!line.type) {
      return;
    }

    if (line.type === "payment") {
      let paymentModalRef = this.modalService.open(PaymentModalComponent);
      paymentModalRef.componentInstance.studentId = this.studentId;
      paymentModalRef.componentInstance.viewModel = line;
    } else {
      let feeModalRef = this.modalService.open(StudentFeeModalComponent);
      feeModalRef.componentInstance.studentId = this.studentId;
      feeModalRef.componentInstance.viewModel = line;
    }
  }

}
