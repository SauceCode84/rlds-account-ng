import { Component, OnInit } from "@angular/core";

import { StudentService } from "providers/student.service";
import { Student } from "models";
import { Observable } from "rxjs/Observable";

@Component({
  selector: "app-student-list",
  templateUrl: "./student-list.component.html",
  styleUrls: ["./student-list.component.scss"]
})
export class StudentListComponent implements OnInit {

  private students: Student[];

  rowCount: number;
  page: number;

  constructor(private studentService: StudentService) { }

  private populateStudents() {
    this.studentService
      .getAllStudents()
      .subscribe(students => {
        this.rowCount = students.length;
        this.students = students.splice((this.page - 1) * 10, 10);
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
