import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import { Observable } from "rxjs";

import { Student, Contact } from "models";
import { environment } from "environments/environment";

interface IPagedResults<TModel> {
  totalCount: number;
  totalPages: number;
  page: number;
  results: TModel[];
};

@Injectable()
export class StudentService {

  private url = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) { }

  public getAllStudents(includeInactive?: boolean): Observable<Student[]>;
  public getAllStudents(includeInactive: boolean, page: number, pageSize: number): Observable<IPagedResults<Student>>;
  
  public getAllStudents(includeInactive: boolean = false, page?: number, pageSize?: number) {
    let params: { [param: string]: string | string[] } = {};

    if (includeInactive) {
      params.includeInactive = includeInactive.toString();
    }

    if (page || pageSize) {
      if (page) {
        params.page = page.toString();
      }
      
      if (pageSize) {
        params.pageSize = pageSize.toString();
      }

      return this.http.get<IPagedResults<Student>>(this.url, { params });
    }

    return this.http.get<Student[]>(this.url);
  }

  public getStudentNames() {
    return this.http.get<Student[]>(this.url + "/names");
  }

  public getById(id: string): Observable<Student> {
    return this.http.get<Student>(this.url + "/" + id);
  }

  public getContacts(id: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.url + "/" + id + "/contacts");
  }

  public async createStudent(newStudent: Student) {
    return await this.http.post<Student>(this.url, newStudent).toPromise();
  }

  public async updateStudent(id: string, updatedStudent: Partial<Student>) {
    await this.http.put(this.url + "/" + id, updatedStudent, { responseType: "text" }).toPromise();
  }

}