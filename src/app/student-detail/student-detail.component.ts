import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { FirebaseObjectObservable } from "angularfire2/database";

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/switchMap";

import { StudentService } from "providers/student.service";
import { PaymentModalComponent } from "app/payment-modal/payment-modal.component";
import { Student, Statement } from "models";
import { Grade, PaymentOption, PaymentOptions, getPaymentOptionDisplayValue, getPaymentOptionValue, getDisplayValueArray } from "models/student";

@Component({
  selector: "app-student-detail",
  templateUrl: "./student-detail.component.html",
  styleUrls: ["./student-detail.component.scss"]
})
export class StudentDetailComponent implements OnInit {
  
  private isNew: boolean;
  public isSaving: boolean = false;
  
  public dateOfBirth;
  
  public student: FirebaseObjectObservable<Student>;
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
      lastName: "",
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

  /*get dob() {
    return this.studentForm.get("dob") as FormControl;
  }*/
  
  ngOnInit() {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        let id = params.get("id");
        this.isNew = id === null;
        
        if (this.isNew) {
          this.student = this.studentService.addStudent(<Student>{});
        } else {
          this.student = this.studentService.getStudentById(id);
        }

        this.student.subscribe(student => {
          //console.log(student);
          
          let title = "New Student - Students";

          if (!this.isNew) {
            title = student.firstName + " " + student.lastName + " - Students";
            this.studentForm.patchValue(student);
          }

          this.title.setTitle(title);
        });
      });
  }

  async saveChanges() {
    if (this.studentForm.invalid) {
      return;
    }

    this.isSaving = true;

    let data = this.studentForm.value;
    await this.studentService.updateStudent(this.student, data);

    this.isSaving = false;
  }

  onPaymentClick() {
    let paymentModalRef = this.modalService.open(PaymentModalComponent);
    paymentModalRef.componentInstance.student$ = this.student;
  }

  onSubmit() {
    console.log("Saving...", this.studentForm.value);
  }

}
