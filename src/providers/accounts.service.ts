import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import { environment } from "environments/environment";

import { AccountName, AccountType } from "models/account";

@Injectable()
export class AccountsService {

  private url = `${environment.apiUrl}/accounts`;

  constructor(private http: HttpClient) { }

  getAccounts() {

  }

  getAccountNames(type?: AccountType) {
    let params = new HttpParams();

    if (type) {
      params = params.set("type", type);
    }

    return this.http.get<AccountName[]>(this.url + "/names", { params });
  }

}