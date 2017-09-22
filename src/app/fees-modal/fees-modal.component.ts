import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from "@angular/forms";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";

import { FeesService } from "providers/fees.service";
import { Fee } from "models";
import { FeeType } from "models/fee";

const greaterThanZero = (input: FormControl) => {
  return Observable
    .of(parseInt(input.value) > 0)
    .map(result => {
      return !!result ? null : { greaterThanZero: true };
    });
}

@Component({
  selector: "app-fees-modal",
  templateUrl: "./fees-modal.component.html",
  styleUrls: ["./fees-modal.component.scss"]
})
export class FeesModalComponent implements OnInit {

  isSaving: boolean;
  isNew: boolean;
  fee: Fee;

  feeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private feesService: FeesService) { }

  get name() {
    return this.feeForm.get("name") as FormControl;
  }

  get single() {
    return this.feeForm.get("single") as FormControl;
  }

  get monthly() {
    return this.feeForm.get("monthly") as FormControl;
  }

  get termly() {
    return this.feeForm.get("termly") as FormControl;
  }

  get annually() {
    return this.feeForm.get("annually") as FormControl;
  }

  ngOnInit() {
    this.buildForm();
    this.feeForm.patchValue(this.fee);
  }

  private buildForm() {
    this.feeForm = this.fb.group({
      name: ["", Validators.required],
      monthly: [0, Validators.required, greaterThanZero],
      termly: [0, Validators.required, greaterThanZero]
    });

    if (this.isClassFee) {
      this.feeForm.addControl("annually", this.fb.control(0, Validators.required, greaterThanZero));
    }

    if (this.isPrivateFee) {
      this.feeForm.addControl("single", this.fb.control(0, Validators.required, greaterThanZero));
    }
  }

  get isClassFee() {
    return this.fee.type === FeeType.Class;
  }

  get isPrivateFee() {
    return this.fee.type === FeeType.Private;
  }

  async onSubmit() {
    try {
      this.isSaving = true;
      await this.feesService.upsertFee((<any>this.fee).$key, this.feeForm.value);
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
