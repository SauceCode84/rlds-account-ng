import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

//import { FirebaseObjectObservable } from "angularfire2/database";

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import "rxjs/add/operator/switchMap";

import { StudentService } from "providers/student.service";
import { PaymentModalComponent } from "app/payment-modal/payment-modal.component";
import { Student, Statement, Contact } from "models";
import { Grade, PaymentOption, PaymentOptions, getPaymentOptionDisplayValue, getPaymentOptionValue, getDisplayValueArray } from "models/student";
import { StudentFeeModalComponent } from "app/student-fee-modal/student-fee-modal.component";

@Component({
  selector: "app-student-detail",
  templateUrl: "./student-detail.component.html",
  styleUrls: ["./student-detail.component.scss"]
})
export class StudentDetailComponent implements OnInit, OnDestroy {
  
  public isNew: boolean;
  public isSaving: boolean = false;
  
  public dateOfBirth;
  
  //public studentId: string;
  public student: Student;
  public contacts: Contact[] = [];

  private studentSub: Subscription;
  
  public studentForm: FormGroup;

  public grades = Object.keys(Grade)
    .filter(grade => typeof Grade[grade] === "number")
    .map(grade => Grade[grade]);

  public paymentOptions;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private studentService: StudentService,
    private modalService: NgbModal,
    private fb: FormBuilder) {

    this.studentForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      grade: "",
      dob: "",
      paymentOption: ""
    });

    this.paymentOptions = getDisplayValueArray(PaymentOptions);
  }

  private createContactGroup() {
    return this.fb.group({
      name: "",
      email: ""
    });
  }

  get firstName() {
    return this.studentForm.get("firstName") as FormControl;
  }

  get lastName() {
    return this.studentForm.get("lastName") as FormControl;
  }

  /*get dob() {
    return this.studentForm.get("dob") as FormControl;
  }*/
  
  ngOnInit() {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        let student$: Observable<Student>;
        let id = params.get("id");
        this.isNew = id === null;
        
        if (this.isNew) {
          student$ = Observable.of({} as Student);
        } else {
          student$ = this.studentService.getById(id);

          this.studentService
            .getContacts(id)
            .subscribe(contacts => this.contacts = contacts);
        }

        this.studentSub = student$.subscribe(student => {
          this.student = student;
          this.studentForm.patchValue(student);

          let title = "New Student - Students";
          
          if (!this.isNew) {
            title = student.firstName + " " + student.lastName + " - Students";
          }

          this.title.setTitle(title);
        });
      });
  }

  ngOnDestroy() {
    this.studentSub.unsubscribe();
  }

  async saveChanges() {
    if (this.studentForm.invalid) {
      return;
    }

    if (this.isNew) {
      //await this.student$.set({ account: { balance: 0 } });
    }

    this.isSaving = true;
    this.isNew = false;

    let data = this.studentForm.value;
    console.log(data);
    //await this.studentService.updateStudent(this.student$, data);

    this.isSaving = false;
  }

  onFeesClick() {
    let feeModalRef = this.modalService.open(StudentFeeModalComponent);
    feeModalRef.componentInstance.studentId = this.student.id;
  }

  onPaymentClick() {
    let paymentModalRef = this.modalService.open(PaymentModalComponent);
    paymentModalRef.componentInstance.studentId = this.student.id;
  }

  onSubmit() {
    console.log("Saving...", this.studentForm.value);
  }

}
