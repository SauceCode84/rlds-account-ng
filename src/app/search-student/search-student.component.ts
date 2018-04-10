import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";

import { StudentService } from "providers/student.service";
import { Student } from "models";

@Component({
  selector: "search-student",
  templateUrl: "./search-student.component.html",
  styleUrls: ["./search-student.component.scss"]
})
export class SearchStudentComponent implements OnInit {

  students: Student[] = [];
  selected: string;

  @Output()
  studentSelected: EventEmitter<string> = new EventEmitter<string>();
  
  constructor(private studentService: StudentService) { }

  ngOnInit() {
    this.studentService
      .getStudentNames()
      .subscribe(students => this.students = students);
  }

  searchStudent = (text: Observable<string>) => {
    return text
      .debounceTime(200)
      .distinctUntilChanged()
      .map(value => {
        let results: Student[] = [];
        
        if (value.length >= 2) {
          results = this.students
            .filter(this.filterByStudentName(value))
            .slice(0, 10);
        }

        return results;
      });
  }

  private filterByStudentName(search: string) {
    return (student: Student) => {
      return this.toFullName(student).toLowerCase().indexOf(search.toLowerCase()) > -1;
    }
  }

  toFullName(student: Student): string {
    return student.firstName + " " + student.lastName;
  }

  selectItem(e: NgbTypeaheadSelectItemEvent) {
    this.studentSelected.emit((e.item as Student).id);
  }

}
