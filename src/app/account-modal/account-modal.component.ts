import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { Account, AccountType, accountTypeDisplay } from "../../models";
import { AccountsService } from "providers";

@Component({
  selector: "app-account-modal",
  templateUrl: "./account-modal.component.html",
  styleUrls: ["./account-modal.component.scss"]
})
export class AccountModalComponent implements OnInit {

  isNew: boolean = false;
  isSaving: boolean = false;

  account: Account;
  accountTypes: string[];

  accountForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private accountService: AccountsService) {

    this.accountTypes = Object.keys(AccountType).map(k => AccountType[k as any]);
  }

  get name() {
    return this.accountForm.get("name") as FormControl;
  }

  get type() {
    return this.accountForm.get("type") as FormControl;
  }

  ngOnInit() {
    this.buildForm();
    this.accountForm.patchValue(this.account || {});
  }

  private buildForm() {
    this.accountForm = this.fb.group({
      name: ["", Validators.required],
      type: ""
    });

    if (this.isNew) {
      this.type.setValidators(Validators.required);
    }
  }

  getAccountTypeDisplay(type: AccountType): string {
    return accountTypeDisplay[type];
  }
  
  async onSubmit() {
    try {
      this.isSaving = true;
      
      if (this.isNew) {
        await this.accountService.insertAccount(this.accountForm.value);
      } else {
        await this.accountService.updateAccount(this.account.id, this.accountForm.value);
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
