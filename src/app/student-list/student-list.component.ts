import { Component, OnInit, OnDestroy } from "@angular/core";
import { Title } from "@angular/platform-browser";

import { Observable, Subscription } from "rxjs";

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
  studentsSub: Subscription;

  isLoading: boolean;

  includeInactive: boolean = false;
  totalCount: number;
  page: number;
  pageSize: number = 10;

  constructor(
    private title: Title,
    private studentService: StudentService) { }

  ngOnInit() {
    this.title.setTitle("Students");

    this.page = 1;
    this.isLoading = true;

    this.populateStudents();
  }

  onIncludeInactiveChanged(includeInactive: boolean) {
    this.includeInactive = includeInactive;
    this.populateStudents();
  }

  private populateStudents() {
    this.studentsSub = this.studentService
      .getAllStudents(this.includeInactive, this.page, this.pageSize)
      .subscribe(pageResults => {
        this.isLoading = false;

        this.students = pageResults.results;

        this.page = pageResults.page;
        this.totalCount = pageResults.totalCount;
      });
  }

  ngOnDestroy() {
    this.studentsSub.unsubscribe();
  }

  onPageChange(page: number) {
    this.populateStudents();
  }

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
