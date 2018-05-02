import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

import { NgbModal, NgbTabset, NgbTabChangeEvent } from "@ng-bootstrap/ng-bootstrap";

//import { FirebaseObjectObservable } from "angularfire2/database";

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import "rxjs/add/operator/switchMap";

import { StudentService, GradesService } from "providers";
import { PaymentModalComponent } from "app/payment-modal/payment-modal.component";
import { Student, Statement, Contact } from "models";
import { Grade, PaymentOption, PaymentOptions, getPaymentOptionDisplayValue, getPaymentOptionValue, getDisplayValueArray } from "models/student";
import { StudentFeeModalComponent } from "app/student-fee-modal/student-fee-modal.component";

import "../../helpers/first";

@Component({
  selector: "app-student-detail",
  templateUrl: "./student-detail.component.html",
  styleUrls: ["./student-detail.component.scss"]
})
export class StudentDetailComponent implements AfterViewInit, OnInit, OnDestroy {
  
  public isNew: boolean;
  public isSaving: boolean = false;
  
  public dateOfBirth;
  
  //public studentId: string;
  public student: Student;
  public contacts: Contact[] = [];

  private studentSub: Subscription;
  
  public studentForm: FormGroup;

  public grades = [];/*Object.keys(Grade)
    .filter(grade => typeof Grade[grade] === "number")
    .map(grade => Grade[grade]);*/

  public paymentOptions;

  @ViewChild(NgbTabset)
  private mainTabSet: NgbTabset;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private studentService: StudentService,
    private gradesService: GradesService,
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

    this.gradesService
      .getGrades()
      .subscribe(grades => this.grades = grades);
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
      .subscribe(params => {
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
          console.log(student);
          this.student = student;
          this.studentForm.patchValue(student);
          
          let grade = this.grades.first(grade => grade.id === student.grade.id);
          this.studentForm.controls["grade"].setValue(grade, { onlySelf: true });
          
          let title = "New Student - Students";
          
          if (!this.isNew) {
            title = student.firstName + " " + student.lastName + " - Students";
          }

          this.title.setTitle(title);
        });
      });
    
    this.mainTabSet.tabChange
      .subscribe((e: NgbTabChangeEvent) => {
        this.router.navigate([], { fragment: e.nextId });
      });
  }

  ngAfterViewInit() {
    this.route.fragment.subscribe(fragment => {
      if (!fragment) {
        return;
      }

      if (this.mainTabSet.activeId === fragment) {
        return;
      }

      let tab = this.mainTabSet.tabs.find(tab => tab.id === fragment);
      
      if (tab) {
        this.mainTabSet.select(tab.id);
      }
    });
  }

  ngOnDestroy() {
    this.studentSub.unsubscribe();
  }

  async saveChanges() {
    if (this.studentForm.invalid) {
      return;
    }

    try {
      this.isSaving = true;
      let studentData = this.studentForm.value;
      
      if (this.isNew) {
        this.student = await this.studentService.createStudent(studentData);
        this.router.navigate(["student", this.student.id]);
        this.isNew = false;
      } else {
        await this.studentService.updateStudent(this.student.id, studentData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.isSaving = false;
    }
  }

  onFeesClick() {
    let feeModalRef = this.modalService.open(StudentFeeModalComponent);
    feeModalRef.componentInstance.studentId = this.student.id;
  }

  onPaymentClick() {
    let paymentModalRef = this.modalService.open(PaymentModalComponent);
    paymentModalRef.componentInstance.studentId = this.student.id;
  }

  toggleActive() {
    this.student.active = !this.student.active;
  }

  onSubmit() {
    console.log("Saving...", this.studentForm.value);
  }

}
