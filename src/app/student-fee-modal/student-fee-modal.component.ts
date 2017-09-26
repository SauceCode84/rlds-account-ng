import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { FirebaseObjectObservable } from "angularfire2/database";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { Subscription } from "rxjs/Subscription";

import { Student } from "models";
import { StatementService } from "providers";
import { getDisplayValueArray } from "models/student";
import { FeeTypeOptions } from "models/fee-options";

@Component({
  selector: "app-student-fee-modal",
  templateUrl: "./student-fee-modal.component.html",
  styleUrls: ["./student-fee-modal.component.scss"]
})
export class StudentFeeModalComponent implements OnInit {

  @Input()
  public student$: FirebaseObjectObservable<Student>;
  public student: Student;
  public studentSub: Subscription;

  public feeForm: FormGroup;
  public feeTypeOptions;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private statementService: StatementService
  ) {
    this.feeForm = this.fb.group({
      details: ["", Validators.required],
      feeType: ""
    });

    this.feeTypeOptions = getDisplayValueArray(FeeTypeOptions);
  }

  get details() {
    return this.feeForm.get("details") as FormControl;
  }

  get feeType() {
    return this.feeForm.get("feeType") as FormControl;
  }

  ngOnInit() {
    this.studentSub = this.student$
      .subscribe(student => this.student = student);
  }

  onDismiss() {
    this.activeModal.dismiss();
  }

}
