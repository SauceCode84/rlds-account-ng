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
      .getAllStudents()
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
            .filter(student => (student.firstName + " " + student.lastName).toLowerCase().indexOf(value.toLowerCase()) > -1)
            .slice(0, 10);
        }

        return results;
      });
  }

  inputFormatter(student: Student): string {
    return student.firstName + " " + student.lastName;
  }

  selectItem(e: NgbTypeaheadSelectItemEvent) {
    console.log(e.item);
    this.studentSelected.emit(e.item._id);
    //this.router.navigate(["/student", e.item._id]);
  }

}
