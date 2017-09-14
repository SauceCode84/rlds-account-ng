import { Component, OnInit, OnDestroy } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import { StudentService } from "providers/student.service";
import { Student } from "models";
import { GradeDisplay } from "models/student";

@Component({
  selector: "app-student-list",
  templateUrl: "./student-list.component.html",
  styleUrls: ["./student-list.component.scss"]
})
export class StudentListComponent implements OnInit, OnDestroy {
  
  students: Student[];
  subscription: Subscription;

  isLoading: boolean;

  totalCount: number;
  page: number;
  pageSize: number = 10;

  constructor(private studentService: StudentService) { }

  ngOnInit() {
    this.page = 1;
    this.isLoading = true;

    this.subscription = this.studentService.getStudents()
      .subscribe(students => {
        this.isLoading = false;

        this.students = students.sort(studentCompare);
        this.totalCount = this.students.length;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /*onPageChange(page: number) {
    this.populateStudents();
  }*/

}

export const compare = <T>(a: T, b: T): number => {
  if (a > b) return +1;
  if (a < b) return -1;
  return 0;
};

export const compareCaseInsensitive = (a: string, b: string): number => {
  return compare(a.toLowerCase(), b.toLowerCase());
};

const studentCompare = (a: Student, b: Student) => {
  return compare(a.grade, b.grade)
    || compareCaseInsensitive(a.lastName, b.lastName)
    || compareCaseInsensitive(a.firstName, b.firstName);
}
