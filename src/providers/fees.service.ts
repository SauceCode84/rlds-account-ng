import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import "rxjs/add/operator/toPromise";

import { environment } from "environments/environment";

import { Fee } from "models";

@Injectable()
export class FeesService {

  private url = `${environment.apiUrl}/fees`;

  constructor(private http: HttpClient) { }

  public getFees() {
    return this.http.get<Fee[]>(this.url);
  }

  public getFeeById(id: string) {
    return this.http.get<Fee>(this.url + "/" + id);
  }

  public async updateFee(id: string, fee: Partial<Fee>) {
    await this.http.put(this.url + "/" + id, fee, { responseType: "text" }).toPromise();
  }

}
