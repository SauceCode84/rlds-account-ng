import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from "@angular/forms";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";

import "../../helpers/first";

import { Fee, FeeType } from "models";
import { Account, AccountName, AccountType } from "models/account";
import { PaymentOption, PaymentOptions, PaymentOptionViewModel } from "models/student";
import { AccountsService, FeesService, GradesService } from "providers";
import { Grade } from "../../providers/grades.service";

const greaterThanZero = (input: FormControl) => {
  return Observable
    .of(parseInt(input.value) > 0)
    .map(result => {
      return !!result ? null : { greaterThanZero: true };
    });
}

const validateOption = (hasPaymentOptions: FormControl, errorKey: string) => (input: FormControl) => {
  if (!hasPaymentOptions.value) {
    return null;
  }

  const error = { [errorKey]: true };

  return !!input.value ? null : error;
}

type FeeTypeOptions = {
  [K in FeeType]: {
    paymentOptions?: PaymentOption[];
    hasGrades?: boolean;
  }
};

const feeTypeOptions: FeeTypeOptions = {
  "class": {
    paymentOptions: [PaymentOption.Monthly, PaymentOption.Termly, PaymentOption.Annually],
    hasGrades: true
  },
  "private": {
    paymentOptions: [PaymentOption.Single, PaymentOption.Monthly, PaymentOption.Termly]
  },
  "preschool": {
    paymentOptions: [PaymentOption.Termly, PaymentOption.Annually]
  },
  "registration": {},
  "festival": {}
};

const hasPaymentOptions = (paymentOptions: PaymentOption[]) => !!paymentOptions && !!paymentOptions.length;

interface FeeTypeViewModel {
  id: FeeType | "custom",
  name: string
};

@Component({
  selector: "app-fees-modal",
  templateUrl: "./fees-modal.component.html",
  styleUrls: ["./fees-modal.component.scss"]
})
export class FeesModalComponent implements OnInit {

  isNew: boolean;
  isSaving: boolean;
  
  feeTypes: FeeTypeViewModel[] = [
    { id: "class", name: "Class Fee" },
    { id: "private", name: "Private Lesson Fee" },
    { id: "registration", name: "Registration Fee" },
    { id: "custom", name: "Custom" }
  ];

  fee: Fee;
  feeForm: FormGroup;
  
  accounts$: Observable<Account[]>;
  grades$: Observable<Grade[]>;
  paymentOptions: PaymentOptionViewModel[];

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private feesService: FeesService,
    private accountsService: AccountsService,
    private gradesService: GradesService) {

    this.accounts$ = this.accountsService.getAccounts(AccountType.Income);
    this.grades$ = this.gradesService.getGrades();
  }

  get name() {
    return this.feeForm.get("name") as FormControl;
  }

  get amount() {
    return this.feeForm.get("amount") as FormControl;
  }

  get accountId() {
    return this.feeForm.get("accountId") as FormControl;
  }

  get type() {
    return this.feeForm.get("type") as FormControl;
  }

  get hasGrades() {
    return this.feeForm.get("hasGrades") as FormControl;
  }

  get grade() {
    return this.feeForm.get("grade") as FormControl;
  }

  get hasPaymentOptions() {
    return this.feeForm.get("hasPaymentOptions") as FormControl;
  }

  get paymentOption() {
    return this.feeForm.get("paymentOption") as FormControl;
  }

  ngOnInit() {
    this.buildForm();

    console.log("patch value", this.fee);
    this.feeForm.patchValue(this.fee);

    this.type.valueChanges.subscribe((value: FeeType) => {
      let { paymentOptions, hasGrades } = feeTypeOptions[value];
      
      console.log("paymentOptions", paymentOptions);
      console.log("hasGrades", hasGrades);

      let hasPaymentOptions = !!paymentOptions && !!paymentOptions.length;
      
      if (hasPaymentOptions) {
        this.paymentOptions = paymentOptions.map(paymentOption => PaymentOptions[paymentOption]);
      }
      
      this.hasPaymentOptions.setValue(hasPaymentOptions);
      this.hasGrades.setValue(!!hasGrades);

      this.grade.setValue(null);
      this.paymentOption.setValue(null);
    });

    /*this.accountId.valueChanges.subscribe(value => {
      let account = this.accounts.first(account => account.id === value);

      if (account) {
        this.hasPaymentOptions = !!account.paymentOptions;
      }

      if (this.hasPaymentOptions) {
        this.paymentOptions = account.paymentOptions.map(paymentOption => PaymentOptions[paymentOption]);
      }
    });*/
  }

  /*private buildAmountGroup() {
    let feeAmountType = feePaymentOptions[this.fee.type as FeeType];
    let amountGroupDef = {};

    feeAmountType.forEach(paymentOption => {
      amountGroupDef[paymentOption] = [0, Validators.required, greaterThanZero];
    })

    return this.fb.group(amountGroupDef);
  }*/

  private buildForm() {
    let formGroupDef = {
      name: ["", Validators.required],
      accountId: ["", Validators.required],
      type: null,
      hasGrades: false,
      grade: null,
      hasPaymentOptions: false,
      paymentOption: "",
      amount: [0, Validators.required, greaterThanZero] //this.buildAmountGroup()
    };

    this.feeForm = this.fb.group(formGroupDef);

    /*const feePaymentOptions$ = this.feeType.valueChanges
      .map((value: FeeType) => feePaymentOptions[value]);

    this.paymentOptions$ = feePaymentOptions$
      .map(paymentOptions => paymentOptions.map(paymentOption => PaymentOptions[paymentOption]));

    this.paymentOptions$.subscribe(console.log);

    const hasPaymentOptions$ = feePaymentOptions$.map(hasPaymentOptions);

    hasPaymentOptions$
      .subscribe(hasPaymentOptions => this.hasPaymentOptions = hasPaymentOptions);*/

    this.grade.setValidators(validateOption(this.hasGrades, "validGrade"));

    this.paymentOption.statusChanges.subscribe(status => console.log(status));
    this.paymentOption.setValidators(validateOption(this.hasPaymentOptions, "validPaymentOption"));
  }

  async onSubmit() {
    try {
      this.isSaving = true;
      let feeFormValue = JSON.parse(JSON.stringify(this.feeForm.value));;

      delete feeFormValue.hasGrades;
      delete feeFormValue.hasPaymentOptions;
      
      removeNulls(feeFormValue);

      console.log(feeFormValue);

      if (this.isNew) {
        await this.feesService.insertFee(feeFormValue);
      }/* else {
        await this.feesService.updateFee(this.fee.id, this.feeForm.value);
      }*/

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

const removeNulls = (obj) => {
  let isArray = obj instanceof Array;

  for (let key in obj) {
    if (obj[key] === null) {
      isArray ? obj.splice(key, 1) : delete obj[key];
    } else if (typeof obj[key] === "object") {
      removeNulls(obj[key]);
    }
  }
}
