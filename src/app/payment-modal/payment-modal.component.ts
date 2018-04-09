import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
//import { FirebaseObjectObservable } from "angularfire2/database";

import { Student } from "models";
import { StudentService, StatementService } from "providers";

import * as moment from "moment";

interface PaymentViewModel {
  id: string;
  details: string;
  date: string;
  amount: number;
  type: string;
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

  viewModel: PaymentViewModel;

  paymentForm: FormGroup;

  isSaving: boolean = false;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private studentService: StudentService,
    private statementService: StatementService
  ) { }

  ngOnInit() {
    this.studentService
      .getById(this.studentId)
      .subscribe(student => this.student = student);
    
    this.buildForm();
    this.applyValue();
  }

  private getFormControl = (name: string) => this.paymentForm.get(name) as FormControl;

  get amount() {
    return this.getFormControl("amount");
  }

  get isNew(): boolean {
    return !this.viewModel;
  }

  private buildForm() {
    this.paymentForm = this.fb.group({
      amount: 0,
      date: moment().format("YYYY-MM-DD")
    });
  }

  private applyValue() {
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
    
    let { amount, date } = this.paymentForm.value;
    this.isSaving = true;

    try {
      if (this.isNew) {
        await this.statementService.addPayment(this.student, { amount, date });
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
