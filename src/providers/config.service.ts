import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "environments/environment";

interface ConfigResponse {
  cashAccountId: string;
}

@Injectable()
export class ConfigService {

  private url = `${environment.apiUrl}/config`;
  private _cashAccountId: string;

  constructor(private http: HttpClient) {
    this.http
      .get<ConfigResponse>(this.url)
      .subscribe(config => {
        this._cashAccountId = config.cashAccountId;
      });
  }

  get cashAccountId() {
    return this._cashAccountId;
  }

}
