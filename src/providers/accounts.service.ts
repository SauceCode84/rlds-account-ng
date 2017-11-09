import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import { Observable } from "rxjs/Observable";

import { environment } from "environments/environment";

import { Account, AccountName, AccountType } from "models/account";

@Injectable()
export class AccountsService {

  private url = `${environment.apiUrl}/accounts`;

  constructor(private http: HttpClient) { }

  getAccounts(type?: AccountType): Observable<Account[]> {
    let params = new HttpParams();
    
    if (type) {
      params = params.set("type", type);
    }

    return this.http.get<Account[]>(this.url, { params });
  }

  getAccountNames(type?: AccountType): Observable<AccountName[]> {
    let params = new HttpParams();

    if (type) {
      params = params.set("type", type);
    }

    return this.http.get<AccountName[]>(this.url + "/names", { params });
  }

  async insertAccount({ name, type }: { name: string, type: AccountType }) {
    await this.http.post(this.url, { name, type }, { responseType: "text" }).toPromise();
  }

  async updateAccount(id: string, { name }: { name: string }) {
    await this.http.put(this.url + "/" + id, { name }, { responseType: "text" }).toPromise();
  }

}