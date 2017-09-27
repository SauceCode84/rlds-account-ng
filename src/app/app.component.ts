import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
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

import { Chart, ChartDataSets } from "chart.js";
import { SummaryService } from "providers/summary.service";

const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  
  notification: BehaviorSubject<any>;

  show: boolean = false;
  
  currentBalance: number;

  @ViewChild("myChart")
  myChart: ElementRef;

  constructor(
    private alertService: AlertService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private summaryService: SummaryService,
    private router: Router) { }

  ngOnInit() {
    this.notificationService.getPermission();
    this.notificationService.receiveNotifications();
    this.notification = this.notificationService.currentNotification;

    this.summaryService.getSummaryData().subscribe(summary => {
      classFeeDataSet.data = months.map(month => summary.class[2017][month]);
      privateFeeDataSet.data = months.map(month => summary.private[2017][month]);
      
      paymentsDataSet.data = months.map(month => summary.payment[2017][month]);

      chart.update();
    });

    Chart.defaults.global.defaultFontFamily = "PT Sans";
    Chart.defaults.global.defaultFontColor = "#212529";

    let canvas = this.myChart.nativeElement;

    let classFeeDataSet: ChartDataSets = {
      label: "Class Fees",
      backgroundColor: "#673AB7",
      data: []
    };

    let privateFeeDataSet: ChartDataSets = {
      label: "Private Fees",
      backgroundColor: "#E91E63",
      data: []
    };

    let paymentsDataSet: ChartDataSets = {
      label: "Payments",
      borderColor: "#4CAF50",
      fill: false,
      data: [],
      type: "line"
    };

    /*
    {
      label: "# of Votes",
      data: data,
      backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)"
      ],
      borderColor: [
          "rgba(255,99,132,1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)"
      ],
      borderWidth: 1
    }
    */

    let chart = new Chart(canvas, {
      type: "bar",      
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [paymentsDataSet, classFeeDataSet, privateFeeDataSet]
      },
      options: {
        responsive: true,
        legend: { display: false },
        scales: {
          xAxes: [ { stacked: true } ],
          yAxes: [ { stacked: true } ]
        }
      }
    });
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
