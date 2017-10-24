import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
//import { FirebaseObjectObservable } from "angularfire2/database";

import { Student } from "models";
import { StatementService } from "providers/statement.service";

import * as moment from "moment";

const defaultValues = {
  amount: 0,
  date: moment().format("YYYY-MM-DD")
};

@Component({
  selector: "app-payment-modal",
  templateUrl: "./payment-modal.component.html",
  styleUrls: ["./payment-modal.component.scss"]
})
export class PaymentModalComponent implements OnInit {

  //@Input()
  //student$: FirebaseObjectObservable<Student>;
  student: Student;

  paymentForm: FormGroup;

  isSaving: boolean = false;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private statementService: StatementService
  ) {
    this.paymentForm = this.fb.group({
      amount: "",
      date: ""
    });

    this.paymentForm.setValue(defaultValues);
  }

  ngOnInit() {
    /*this.student$.subscribe(student => {
      this.student = student;
    });*/
  }

  async onSubmit() {
    if (this.paymentForm.invalid) {
      return;
    }
    
    let { amount, date } = this.paymentForm.value;
    this.isSaving = true;

    try {
      await this.statementService.addPayment((this.student as any).$key, amount, date);
      this.activeModal.close();
    } catch (err) {
      this.isSaving = false;
      console.log(err);
    }
  }

  onDismiss() {
    this.activeModal.dismiss();
  }

}
