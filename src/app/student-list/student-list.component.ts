import { Component, OnInit } from "@angular/core";

import { StudentService } from "providers/student.service";
import { Student } from "models";
import { Observable } from "rxjs/Observable";
import { GradeDisplay } from "models/student";

@Component({
  selector: "app-student-list",
  templateUrl: "./student-list.component.html",
  styleUrls: ["./student-list.component.scss"]
})
export class StudentListComponent implements OnInit {

  private students: Student[];

  totalCount: number;
  page: number;
  pageSize: number = 10;

  constructor(private studentService: StudentService) { }

  private populateStudents() {
    this.studentService
      .getAllStudents(this.page, this.pageSize)
      .subscribe(result => {
        this.totalCount = result.totalCount;
        this.students = result.results;
      });
  }

  ngOnInit() {
    this.page = 1;
    this.populateStudents();
  }

  onPageChange(page: number) {
    this.populateStudents();
  }

}
