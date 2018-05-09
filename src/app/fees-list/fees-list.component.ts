import { Component, OnInit, OnDestroy } from "@angular/core";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { FeesModalComponent } from "../fees-modal/fees-modal.component";
import { FeesService } from "providers/fees.service";
import { Fee, FeeType } from "models";

import { BehaviorSubject, Observable, Subscription } from "rxjs";

import { PaymentOption, PaymentOptions } from "models/student";

const byFeeType = (feeType: FeeType) => (fee: Fee) => fee.type === feeType;

@Component({
  selector: "app-fees-list",
  templateUrl: "./fees-list.component.html",
  styleUrls: ["./fees-list.component.scss"]
})
export class FeesListComponent implements OnInit, OnDestroy {
  
  fees: Fee[];
  feesListSub: Subscription;
  
  isLoading: boolean = false;

  constructor(private feesService: FeesService, private modalService: NgbModal) { }

  private loadFees() {
    let fees$ = this.feesService.getFees({ includeAccountName: true, includeGradeName: true });

    this.isLoading = true;

    this.feesListSub = fees$
      .subscribe(fees => {
        this.fees = fees;        
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
  }

  async editFee(fee: Fee) {
    await this.showFeeModal(fee);
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

const loadingService = <T>(serviceCall: () => Observable<T>) => {
  let isLoading$ = new BehaviorSubject(false);
  
  isLoading$.next(true);

  let result$ = serviceCall();

  result$.subscribe({ complete: () => isLoading$.next(false) });
  
  return { data: result$, isLoading: isLoading$.asObservable() };
}
