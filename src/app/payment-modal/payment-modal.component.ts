import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
//import { FirebaseObjectObservable } from "angularfire2/database";

import { Student, AccountType, AccountName } from "models";
import { AccountsService, ConfigService, StudentService, StatementService } from "providers";

import * as moment from "moment";

interface PaymentViewModel {
  id: string;
  date: string;
  amount: number;
  accountId: string;
}

@Component({
  selector: "app-payment-modal",
  templateUrl: "./payment-modal.component.html",
  styleUrls: ["./payment-modal.component.scss"]
})
export class PaymentModalComponent implements OnInit {

  //@Input()
  //student$: FirebaseObjectObservable<Student>;
  studentId: string;
  student: Student;
  accounts: AccountName[];

  viewModel: PaymentViewModel;

  paymentForm: FormGroup;

  isSaving: boolean = false;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private config: ConfigService,
    private studentService: StudentService,
    private accountsService: AccountsService,
    private statementService: StatementService
  ) { }

  async ngOnInit() {
    this.buildForm();
    
    await this.getData();
    await this.applyValue();
  }

  private getFormControl = (name: string) => this.paymentForm.get(name) as FormControl;

  get amount() {
    return this.getFormControl("amount");
  }

  get date() {
    return this.getFormControl("date");
  }

  get accountId() {
    return this.getFormControl("accountId");
  }

  get isNew(): boolean {
    return !this.viewModel;
  }

  private async getData() {
    this.student = await this.studentService
      .getById(this.studentId)
      .toPromise();

    this.accounts = await this.accountsService
      .getAccountNames({ type: AccountType.Asset, subType: "cash" })
      .toPromise();
  }

  private buildForm() {
    this.paymentForm = this.fb.group({
      amount: 0,
      date: moment().format("YYYY-MM-DD"),
      accountId: null
    });
  }

  private async applyValue() {
    if (this.student.account.balance > 0) {
      this.amount.setValue(this.student.account.balance);
    }

    this.accountId.setValue(await this.config.cashAccountId);

    if (!this.isNew) {
      let patchedValue = {
        amount: Math.abs(this.viewModel.amount),
        date: moment(this.viewModel.date).format("YYYY-MM-DD")
      };
      
      this.paymentForm.patchValue(patchedValue, { emitEvent: true, onlySelf: false });
    }
  }

  async onSubmit() {
    if (this.paymentForm.invalid) {
      return;
    }
    
    let { amount, date, accountId } = this.paymentForm.value;
    this.isSaving = true;

    try {
      if (this.isNew) {
        await this.statementService.addPayment(this.student, { amount, date, cashAccountId: accountId });
      } else {
        await this.statementService.updatePayment(this.viewModel.id, { amount, date });
      }
      
      this.activeModal.close();
    } catch (err) {
      console.log(err);
    } finally {
      this.isSaving = false;
    }
  }

  onDismiss() {
    this.activeModal.dismiss();
  }

}
