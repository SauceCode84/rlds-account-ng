import { Injectable } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";

import { Subject, Observable } from "rxjs";

export interface AlertMessage {
  type: string;
  text: string;
}

@Injectable()
export class AlertService {

  private alertSubject = new Subject<AlertMessage>();
  private keepAfterNavigationChange = false;

  constructor(private router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false;
        } else {
          // clear alert
          this.alertSubject.next();
        }
      }
    });
  }

  success(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.alertSubject.next({ type: "success", text: message });
  }

  error(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.alertSubject.next({ type: "error", text: message });
  }

  getMessage(): Observable<AlertMessage> {
    return this.alertSubject.asObservable();
  }

}
