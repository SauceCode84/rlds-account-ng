import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import { Observable } from "rxjs/Observable";

import { Student } from "models";

interface IPagedResults<TModel> {
  totalCount: number;
  totalPages: number;
  page: number;
  results: TModel[];
};

@Injectable()
export class StudentService {

  private baseUrl: string = "http://localhost:3000";

  constructor(private http: HttpClient) { }

  public getAllStudents(): Observable<Student[]>;
  public getAllStudents(page: number, pageSize: number): Observable<IPagedResults<Student>>;
  
  public getAllStudents(page?: number, pageSize?: number) {
    const url = `${this.baseUrl}/student`;

    if (page !== undefined && pageSize !== undefined) {
      let params: HttpParams = new HttpParams()
        .set("page", page.toString())
        .set("pageSize", pageSize.toString());
      
      return this.http.get<IPagedResults<Student>>(url, { params: params });
    }

    return this.http.get<Student[]>(url);
  }

}