import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "environments/environment";

export interface Grade {
  id: string;
  name: string;
  sortOrder: number;
}

@Injectable()
export class GradesService {

  constructor(private http: HttpClient) { }

  public getGrades() {
    return this.http.get<Grade[]>(environment.apiUrl + "/grades");
  }

}
