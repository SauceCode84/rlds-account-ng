import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/map";

import { AlertService } from "providers/alert.service";
import { StatementService } from "providers/statement.service";
import { StudentService } from "providers/student.service";

import { Statement, StatementLine, Student } from "models";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  show: boolean = false;

  students: Student[];

  searchStudent = (text: Observable<string>) => 
    text
      .debounceTime(200)
      .distinctUntilChanged()
      .map(value => {
        let results = [];
        
        if (value.length >= 2) {
          results = this.students
            .filter(student => (student.firstName + " " + student.lastName).toLowerCase().indexOf(value.toLowerCase()) > -1)
            .slice(0, 10);
        }

        return results;
      });
  
  inputFormatter = (student: Student) => student.firstName + " " + student.lastName;

  selected: string;

  selectItem(e: NgbTypeaheadSelectItemEvent) {
    console.log(e.item);
    this.router.navigate(["/student", e.item._id]);
  }

  student = {
    name: "Andrea Hummerstone"
  };


  statement: Statement;

  currentBalance: number;

  constructor(
    private studentService: StudentService,
    private statementService: StatementService,
    private alertService: AlertService,
    private router: Router,
    private title: Title) {
    this.title.setTitle(this.student.name + " - Statement");
  }

  async ngOnInit() {
    let fromDate = new Date("2017-04-18");
    this.statement = this.statementService.getStatement(fromDate);

    this.studentService
      .getAllStudents()
      .subscribe(students => this.students = students);
  }

  onSuccess() {
    this.alertService.success("Hello World!");
  }

  onError() {
    this.alertService.error("Oh dear... something went wrong!");
  }

}
