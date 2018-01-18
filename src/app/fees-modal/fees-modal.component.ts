import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from "@angular/forms";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";

import { Fee, FeeType } from "models";
import { AccountName, AccountType } from "models/account";
import { PaymentOption } from "models/student";
import { FeesService, AccountsService } from "providers";

const greaterThanZero = (input: FormControl) => {
  return Observable
    .of(parseInt(input.value) > 0)
    .map(result => {
      return !!result ? null : { greaterThanZero: true };
    });
}

type FeePaymentOptionType = { [K in FeeType]: PaymentOption[] };

const feePaymentOptions: FeePaymentOptionType = {
  "class": [PaymentOption.Monthly, PaymentOption.Termly, PaymentOption.Annually],
  "private": [PaymentOption.Single, PaymentOption.Monthly, PaymentOption.Termly],
  "preschool": [PaymentOption.Termly, PaymentOption.Annually],
  "registration": []
};

@Component({
  selector: "app-fees-modal",
  templateUrl: "./fees-modal.component.html",
  styleUrls: ["./fees-modal.component.scss"]
})
export class FeesModalComponent implements OnInit {

  isNew: boolean;
  isSaving: boolean;
  
  fee: Fee;
  feeForm: FormGroup;

  accounts: AccountName[];

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private feesService: FeesService,
    private accountsService: AccountsService) {
    
    this.accountsService
      .getAccountNames(AccountType.Income)
      .subscribe(accounts => this.accounts = accounts);
  }

  get name() {
    return this.feeForm.get("name") as FormControl;
  }

  get type() {
    return this.feeForm.get("type") as FormControl;
  }

  get accountId() {
    return this.feeForm.get("account") as FormControl;
  }

  get amountGroup() {
    return this.feeForm.get("amount") as FormGroup;
  }

  get single() {
    return this.amountGroup.get("single") as FormControl;
  }

  get monthly() {
    return this.amountGroup.get("monthly") as FormControl;
  }

  get termly() {
    return this.amountGroup.get("termly") as FormControl;
  }

  get annually() {
    return this.amountGroup.get("annually") as FormControl;
  }

  ngOnInit() {
    this.buildForm();
    this.feeForm.patchValue(this.fee);
  }

  private buildAmountGroup() {
    let feeAmountType = feePaymentOptions[this.fee.type as FeeType];
    let amountGroupDef = {};

    feeAmountType.forEach(paymentOption => {
      amountGroupDef[paymentOption] = [0, Validators.required, greaterThanZero];
    })

    return this.fb.group(amountGroupDef);
  }

  private buildForm() {
    let formGroupDef = {
      name: ["", Validators.required],
      type: "",
      accountId: ["", Validators.required],
      amount: this.buildAmountGroup()
    };

    this.feeForm = this.fb.group(formGroupDef);
  }

  showFeeControl(name: string): boolean {
    switch (name) {
      case "single":
        return this.isPrivateFee;

      case "monthly":
        return !this.isPreschoolFee;

      case "annually":
        return this.isClassFee || this.isPreschoolFee;
      
      default:
        return true;
    }
  }

  get isClassFee() {
    return this.fee.type === "class";
  }

  get isPrivateFee() {
    return this.fee.type === "private";
  }

  get isPreschoolFee() {
    return this.fee.type === "preschool";
  }

  async onSubmit() {
    try {
      this.isSaving = true;
      console.log(this.feeForm.value);

      if (this.isNew) {
        await this.feesService.insertFee(this.feeForm.value);
      } else {
        await this.feesService.updateFee(this.fee.id, this.feeForm.value);
      }

      this.isSaving = false;
      this.activeModal.close();
    } catch (err) {
      console.error(err);
    }
  }

  onDismiss() {
    this.activeModal.dismiss();
  }

}
