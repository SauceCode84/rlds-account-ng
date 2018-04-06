import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import "rxjs/add/operator/toPromise";

import { environment } from "environments/environment";

import { Fee } from "models";

type GetFeesOptions = { includeAccountName?: boolean, includeGradeName?: boolean };

@Injectable()
export class FeesService {

  private url = `${environment.apiUrl}/fees`;

  constructor(private http: HttpClient) { }

  public getFees({ includeAccountName = false, includeGradeName = false }: GetFeesOptions = {}) {
    let params = new HttpParams();

    if (includeAccountName) {
      params = params.set("includeAccountName", "true");
    }

    if (includeGradeName) {
      params = params.set("includeGradeName", "true");
    }

    return this.http.get<Fee[]>(this.url, { params });
  }

  public getFeeById(id: string) {
    return this.http.get<Fee>(this.url + "/" + id);
  }

  public async insertFee(fee: Partial<Fee>) {
    let id = await this.http.post(this.url, fee, { responseType: "text" }).toPromise();

    return id;
  }

  public async updateFee(id: string, fee: Partial<Fee>) {
    await this.http.put(this.url + "/" + id, fee, { responseType: "text" }).toPromise();
  }

}
