import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "environments/environment";

interface ConfigResponse {
  cashAccountId: string;
}

@Injectable()
export class ConfigService {

  private url = `${environment.apiUrl}/config`;
  
  constructor(private http: HttpClient) { }

  private getConfig() {
    return this.http
    .get<ConfigResponse>(this.url)
    .toPromise();
  }

  get cashAccountId(): Promise<string> {
    return this.getConfig()
      .then(config => config.cashAccountId);
  }

}
