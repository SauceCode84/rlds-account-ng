import { Component, OnInit, OnDestroy } from "@angular/core";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { FeesModalComponent } from "../fees-modal/fees-modal.component";
import { FeesService } from "providers/fees.service";
import { Fee } from "models";
import { FeeType } from "models/fee";

import { Subscription } from "rxjs/Subscription";

const byFeeType = (feeType: FeeType) => (fee: Fee) => fee.type === feeType;

@Component({
  selector: "app-fees-list",
  templateUrl: "./fees-list.component.html",
  styleUrls: ["./fees-list.component.scss"]
})
export class FeesListComponent implements OnInit, OnDestroy {
  
  classFees: Fee[] = [];
  privateFees: Fee[] = [];
  preschoolFees: Fee[] = [];

  isLoading: boolean = false;

  feesListSub: Subscription;

  constructor(private feesService: FeesService, private modalService: NgbModal) { }

  ngOnInit() {
    this.isLoading = true;

    this.feesListSub = this.feesService.getFees().subscribe(fees => {
      this.classFees = fees.filter(byFeeType(FeeType.Class));
      this.privateFees = fees.filter(byFeeType(FeeType.Private));
      this.preschoolFees = fees.filter(byFeeType(FeeType.Preschool));
      
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.feesListSub.unsubscribe();
  }
  
  newFee() {
    let paymentModalRef = this.modalService.open(FeesModalComponent);
    paymentModalRef.componentInstance.isNew = true;
  }

  editFee(fee: Fee) {
    let paymentModalRef = this.modalService.open(FeesModalComponent);
    paymentModalRef.componentInstance.fee = fee;

    if ((fee as any).$key === "curro") {
      paymentModalRef.componentInstance.notInclude = ["monthly"];
    }
  }

}
