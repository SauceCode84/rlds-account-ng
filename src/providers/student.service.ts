import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from "angularfire2/database";

import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/empty";

import { Student } from "models";

interface IPagedResults<TModel> {
  totalCount: number;
  totalPages: number;
  page: number;
  results: TModel[];
};

const baseUrl: string = "http://localhost:3000";

@Injectable()
export class StudentService {

  private url = `${baseUrl}/student`;

  constructor(private http: HttpClient, private db: AngularFireDatabase) { }

  public getAllStudents(): Observable<Student[]>;
  public getAllStudents(page: number, pageSize: number): Observable<IPagedResults<Student>>;
  
  public getAllStudents(page?: number, pageSize?: number) {
    if (page !== undefined && pageSize !== undefined) {
      let params = new HttpParams()
        .set("page", page.toString())
        .set("pageSize", pageSize.toString());
      
      return this.http.get<IPagedResults<Student>>(this.url, { params: params });
    }

    return this.http.get<Student[]>(this.url);
  }

  public getStudentNames() {
    return this.http.get<Student[]>(this.url + "/names");
  }

  public getById(id: string): Observable<Student> {
    return this.http.get<Student>(this.url + "/" + id);
  }

  public getStudents(): FirebaseListObservable<Student[]> {
    return this.db.list("/students");
  }

  public getStudentById(key: string): FirebaseObjectObservable<Student> {
    return this.db.object("/students/" + key);
  }

  public addStudent(student: Student): FirebaseObjectObservable<Student> {
    let key = this.getStudents().push(student).key;
    
    return this.getStudentById(key);
  }

  public updateStudent(student: FirebaseObjectObservable<Student>, data: any) {
    return student.update(data);
  }

}