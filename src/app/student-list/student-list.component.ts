import { Component, OnInit } from "@angular/core";

import { StudentService } from "providers/student.service";
import { Student } from "models";

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

  private async populateStudents() {
    let allStudents = await this.studentService.getAllStudents();
    this.rowCount = allStudents.length;
    this.students = allStudents.splice((this.page - 1) * 10, 10);
  }

  async ngOnInit() {
    this.page = 1;
    this.populateStudents();
  }

  onPageChange(page: number) {
    this.populateStudents();
  }

}
