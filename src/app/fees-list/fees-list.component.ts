import { Component, OnInit } from "@angular/core";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { FeesModalComponent } from "../fees-modal/fees-modal.component";
import { FeesService } from "providers/fees.service";
import { Fee } from "models";

@Component({
  selector: "app-fees-list",
  templateUrl: "./fees-list.component.html",
  styleUrls: ["./fees-list.component.scss"]
})
export class FeesListComponent implements OnInit {

  fees: Fee[] = [];
  isLoading: boolean = false;

  constructor(private feesService: FeesService, private modalService: NgbModal) { }

  ngOnInit() {
    this.isLoading = true;

    this.feesService.getFees()
      .subscribe(fees => {
        this.fees = fees;
        this.isLoading = false;
      });
  }

  newFee() {
    let paymentModalRef = this.modalService.open(FeesModalComponent);
    paymentModalRef.componentInstance.isNew = true;
  }

  editFee(fee: Fee) {
    let paymentModalRef = this.modalService.open(FeesModalComponent);
    paymentModalRef.componentInstance.fee = fee;
  }

}
