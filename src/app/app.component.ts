import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";

import { Observable, BehaviorSubject } from "rxjs";

import { AlertService } from "providers/alert.service";
import { AuthService } from "providers/auth.service";
import { NotificationService } from "providers/notification.service";

import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";

import { Chart } from "chart.js";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
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

    Chart.defaults.global.defaultFontFamily = "PT Sans";
    Chart.defaults.global.defaultFontColor = "#212529";
  }

  async anonSignin() {
    await this.authService.anonymousLogin();
  }

  logout() {
    this.authService.logout();
  }

  get currentUser() {
    return this.authService.currentDisplayName;
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated;
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
