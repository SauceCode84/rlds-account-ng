import { Component, OnInit } from '@angular/core';

import { AlertMessage, AlertService } from "providers/alert.service";

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  
  message: AlertMessage;

  constructor(private alertService: AlertService) {
  }

  ngOnInit() {
    this.alertService
      .getMessage()
      .subscribe((message) => {
        console.log(message);
        this.message = message;
      });
  }

}
