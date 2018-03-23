import { Component, OnInit, OnDestroy } from "@angular/core";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { FeesModalComponent } from "../fees-modal/fees-modal.component";
import { FeesService } from "providers/fees.service";
import { Fee, FeeType } from "models";

import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { PaymentOption, PaymentOptions } from "models/student";

const byFeeType = (feeType: FeeType) => (fee: Fee) => fee.type === feeType;

@Component({
  selector: "app-fees-list",
  templateUrl: "./fees-list.component.html",
  styleUrls: ["./fees-list.component.scss"]
})
export class FeesListComponent implements OnInit, OnDestroy {
  
  fees$: Observable<Fee[]>;

  classFees: Fee[] = [];
  privateFees: Fee[] = [];
  preschoolFees: Fee[] = [];

  isLoading: boolean = false;

  feesListSub: Subscription;

  constructor(private feesService: FeesService, private modalService: NgbModal) { }

  private loadFees() {
    this.isLoading = true;

    this.fees$ = this.feesService.getFees({ includeAccountName: true, includeGradeName: true });
    
    this.feesListSub = this.fees$
      .subscribe(fees => {
        this.classFees = fees.filter(byFeeType("class"));
        this.privateFees = fees.filter(byFeeType("private"));
        this.preschoolFees = fees.filter(byFeeType("preschool"));
        
        this.isLoading = false;
      });
  }

  formatPaymentOption(paymentOption: PaymentOption) {
    switch (paymentOption) {
      case PaymentOption.Single:
        return "Single";

      case PaymentOption.Monthly:
        return "Monthly";

      case PaymentOption.Termly:
        return "Termly";

      case PaymentOption.Annually:
        return "Annually";
    }
  }

  private reloadFees() {
    this.feesListSub.unsubscribe();
    this.loadFees();
  }

  ngOnInit() {
    this.loadFees();
  }

  ngOnDestroy() {
    this.feesListSub.unsubscribe();
  }
  
  async newFee(type: FeeType) {
    await this.showFeeModal({ type }, true);

    /*let paymentModalRef = this.modalService.open(FeesModalComponent);
    
    paymentModalRef.componentInstance.isNew = true;
    paymentModalRef.componentInstance.fee = ;*/
  }

  async editFee(fee: Fee) {
    await this.showFeeModal(fee);

    /*let paymentModalRef = this.modalService.open(FeesModalComponent);
    paymentModalRef.componentInstance.fee = fee;

    paymentModalRef.result
      .then(result => {
        console.log(result);
        this.reloadFees();
      },
      reason => {
        console.log(reason);
        this.reloadFees();
      });*/
  }

  private async showFeeModal(fee: Partial<Fee>, isNew?: boolean) {
    let paymentModalRef = this.modalService.open(FeesModalComponent);
    
    paymentModalRef.componentInstance.fee = fee;
    paymentModalRef.componentInstance.isNew = isNew;

    try {
      let result = await paymentModalRef.result;
      console.log(result);
    } catch (reason) {
      console.error(reason);
    } finally {
      this.reloadFees();
    }
  }

}
