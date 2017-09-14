import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/map";

import { AlertService } from "providers/alert.service";
import { AuthService } from "providers/auth.service";
import { NotificationService } from "providers/notification.service";

import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  notification: BehaviorSubject<any>;

  show: boolean = false;
  
  currentBalance: number;

  constructor(
    private alertService: AlertService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.notificationService.getPermission();
    this.notificationService.receiveNotifications();
    this.notification = this.notificationService.currentNotification;
  }

  async anonSignin() {
    await this.authService.anonymousLogin();
  }

  get currentUser() {
    return this.authService.currentDisplayName;
  }

  onStudentSelected(studentId: string) {
    this.router.navigate(["student", studentId]);
  }

  onSuccess() {
    this.alertService.success("Hello World!");
  }

  onError() {
    this.alertService.error("Oh dear... something went wrong!");
  }

}
