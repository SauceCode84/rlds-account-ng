import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import "rxjs/add/operator/toPromise";

import { Student } from "models";

@Injectable()
export class StudentService {

  private baseUrl: string = "http://localhost:3000";

  constructor(private http: HttpClient) { }

  public getAllStudents() {
    return this.http.get<Student[]>(`${this.baseUrl}/student`).toPromise();
  }

}