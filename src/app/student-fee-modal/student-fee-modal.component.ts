import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { FirebaseObjectObservable } from "angularfire2/database";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { Subscription } from "rxjs/Subscription";

import { Student, Fee } from "models";
import { FeesService, StatementService } from "providers";
import { getDisplayValueArray, Grade, getDisplayValuesForKeys, PaymentOptions, getSortedDisplayValuesForKeys } from "models/student";
import { FeeTypeOptions } from "models/fee-options";
import { isFeeAmounts } from "models/fee";

import * as moment from "moment";

const customFee: Fee = {
  $key: "$custom",
  name: "Custom",
  amount: 0,
  type: "custom",
  sortOrder: -1
};

@Component({
  selector: "app-student-fee-modal",
  templateUrl: "./student-fee-modal.component.html",
  styleUrls: ["./student-fee-modal.component.scss"]
})
export class StudentFeeModalComponent implements OnInit, OnDestroy {
  
  @Input()
  public student$: FirebaseObjectObservable<Student>;
  public student: Student;
  public studentSub: Subscription;

  public feeForm: FormGroup;
  public paymentOptions;
  public fees: Fee[];
  public currentFee: Fee;

  public isSaving: boolean = false;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private feesService: FeesService,
    private statementService: StatementService
  ) {
    this.feeForm = this.fb.group({
      details: ["", Validators.required],
      fee: "",
      paymentOption: "",
      amount: 0,
      date: moment().format("YYYY-MM-DD")
    });

    this.feesService
      .getFees()
      .subscribe(fees => {
        this.fees = fees.filter(fee => fee.type !== "preschool");
        this.fees.unshift(customFee);
      });
  }

  private getFormControl = (name: string) => this.feeForm.get(name) as FormControl;

  get details() {
    return this.getFormControl("details");
  }

  get fee() {
    return this.getFormControl("fee");
  }

  get paymentOption() {
    return this.getFormControl("paymentOption");
  }

  get amount() {
    return this.getFormControl("amount");
  }

  private getFee(key: string) {
    let index = this.fees.findIndex(fee => fee.$key === key);
    return this.fees[index];
  }

  private getFeeDetails(fee: Fee) {
    switch (fee.type) {
      case "custom":
        return "";

      case "class":
        return "Class Fees - " + fee.name;
        
      default:
        return fee.name;
    }
  }

  ngOnInit() {
    this.studentSub = this.student$
      .subscribe(student => this.student = student);

    this.fee.valueChanges.subscribe(value => {
      this.currentFee = this.getFee(value);

      this.paymentOption.enable();

      if (isFeeAmounts(this.currentFee.amount)) {
        let keys = Object.keys(this.currentFee.amount);
        this.paymentOptions = getSortedDisplayValuesForKeys(PaymentOptions, keys);
        
        this.paymentOption.setValue(this.student.paymentOption);
      } else {
        this.paymentOptions = [];
        
        this.paymentOption.setValue("");
        this.paymentOption.disable();
      }

      this.details.setValue(this.getFeeDetails(this.currentFee));
    });

    this.paymentOption.valueChanges.subscribe(value => {
      let amount: number = null;

      if (this.currentFee) {
        if (isFeeAmounts(this.currentFee.amount)) {
          amount = this.currentFee.amount[value];
        } else {
          amount = this.currentFee.amount;
        }
      }

      this.amount.setValue(amount);
    });
  }

  ngOnDestroy() {
    this.studentSub.unsubscribe();
  }

  onDismiss() {
    this.activeModal.dismiss();
  }

  async onSubmit() {
    if (this.feeForm.invalid) {
      return;
    }

    this.isSaving = true;

    try {
      let { type } = this.currentFee;
      let fee = Object.assign({ type }, this.feeForm.value);

      await this.statementService.addFee((this.student as any).$key, fee);
      this.activeModal.close();
    } catch (err) {
      this.isSaving = false;
      console.error(err);
    }
  }

}
