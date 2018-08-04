import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { Subscription } from "rxjs";

import { FeesService, StatementService, StudentService } from "providers";
import { Student, Fee } from "models";
import { PaymentOptions } from "models/student";
import { FeeTypeOptions } from "models/fee-options";

import * as moment from "moment";

const customFee: Fee = {
  name: "Custom",
  amount: 0,
  type: "custom"
};

interface FeeViewModel {
  id: string;
  details: string;
  date: string;
  amount: number;
  type: string;
}

@Component({
  selector: "app-student-fee-modal",
  templateUrl: "./student-fee-modal.component.html",
  styleUrls: ["./student-fee-modal.component.scss"]
})
export class StudentFeeModalComponent implements OnInit, OnDestroy {
  
  @Input()
  public studentId: string;

  public student: Student;
  public studentSub: Subscription;

  public feeForm: FormGroup;

  public fees: Fee[];
  public currentFee: Fee;

  public viewModel: FeeViewModel;

  public isSaving: boolean = false;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private studentService: StudentService,
    private feesService: FeesService,
    private statementService: StatementService
  ) {
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

  get price() {
    return this.getFormControl("price");
  }

  get qty() {
    return this.getFormControl("qty");
  }

  get amount() {
    return this.getFormControl("amount");
  }

  displayFee(fee: Fee) {
    let value = fee.name;

    if (fee.paymentOption) {
      value += ` (${ PaymentOptions[fee.paymentOption].displayValue })`;
    }

    return value;
  }

  private getFee(id: string): Fee {
    let index = this.fees.findIndex(fee => fee.id === id);
    return this.fees[index];
  }

  private getFeeDetails(fee: Fee) {
    if (!fee) {
      return "";
    }

    let feeDetails = fee.name;

    if (fee.type === "class") {
      feeDetails = `Class Fees - ${ feeDetails }`;
    }

    if (fee.paymentOption) {
      feeDetails += ` (${ PaymentOptions[fee.paymentOption].displayValue })`;
    }

    return feeDetails;
  }

  get isNew() {
    return !this.viewModel;
  }

  private buildForm() {
    let formGroupDef = {
      details: ["", Validators.required],
      price: 0,
      qty: 1,
      amount: 0,
      date: moment().format("YYYY-MM-DD")
    };

    if (this.isNew) {
      formGroupDef["fee"] = [""];
    }

    this.feeForm = this.fb.group(formGroupDef);
  }

  private applyValue() {
    if (!this.isNew) {
      this.feeForm.patchValue(Object.assign({}, this.viewModel, { date: moment(this.viewModel.date).format("YYYY-MM-DD") }));
    }
  }

  ngOnInit() {
    this.studentSub = this.studentService
      .getById(this.studentId)
      .subscribe(student => this.student = student);

    this.buildForm();
    this.applyValue();

    if (this.isNew) {
      this.setupValueChangeListeners();
    }
  }

  private static calculateAmount(price: number, qty: number) {
    if (!price || !qty) {
      return null;
    }

    return price * qty;
  }

  private setupValueChangeListeners() {
    this.fee.valueChanges.subscribe(value => {
      let amount: number = null;

      this.currentFee = this.getFee(value);
      
      if (this.currentFee) {
        amount = this.currentFee.amount;
      }
      
      this.amount.setValue(amount);
      this.details.setValue(this.getFeeDetails(this.currentFee));
    });

    const updateAmount = (price: number, qty: number) => {
      let amount = StudentFeeModalComponent.calculateAmount(price, qty);

      this.amount.setValue(amount);
    }

    this.price.valueChanges.subscribe(price => updateAmount(price, this.qty.value));
    this.qty.valueChanges.subscribe(qty => updateAmount(this.price.value, qty));
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
      let feeViewModel = this.feeForm.value;
      console.log("fee:", feeViewModel);
      
      console.log("student:", this.student);
      console.log("currentFee:", this.currentFee);

      if (this.isNew) {
        await this.statementService.addStudentFee(this.student, this.currentFee, feeViewModel);
      }

      /*if (this.isNew) {
        await this.statementService.addFee(this.student.id, fee);
      } else {
        await this.statementService.updateFee(this.viewModel.id, fee);
      }*/

      this.activeModal.close();
    } catch (err) {
      this.isSaving = false;
      console.error(err);
    }
  }

}
