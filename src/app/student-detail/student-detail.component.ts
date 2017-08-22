import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import "rxjs/add/operator/switchMap";

import { StudentService } from "providers/student.service";
import { Student } from "models";

@Component({
  selector: "app-student-detail",
  templateUrl: "./student-detail.component.html",
  styleUrls: ["./student-detail.component.scss"]
})
export class StudentDetailComponent implements OnInit {

  //private student: Student;
  private studentForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private studentService: StudentService,
    private fb: FormBuilder) {

    this.studentForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: "",
      grade: ""
    });
  }

  get firstName() {
    return this.studentForm.get("firstName");
  }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.studentService.getById(params.get("id")))
      .subscribe(student => {
        this.title.setTitle(student.firstName + " " + student.lastName + " - Students");

        this.studentForm.setValue({
          firstName: student.firstName,
          lastName: student.lastName,
          grade: student.grade
        });
      
        this.studentForm.valueChanges.subscribe(data => {
          console.log("Form changes:", data);
        });
      });
  }

  onSubmit() {
    console.log("Saving...", this.studentForm.value);
  }

}
