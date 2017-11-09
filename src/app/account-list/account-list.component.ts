import { Component, OnInit } from "@angular/core";
import { AccountsService } from "providers";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import "../../helpers/groupBy";

import { Account, AccountType, accountTypeDisplay } from "models/account";
import { AccountModalComponent } from "app/account-modal/account-modal.component";

@Component({
  selector: "app-account-list",
  templateUrl: "./account-list.component.html",
  styleUrls: ["./account-list.component.scss"]
})
export class AccountListComponent implements OnInit {
  
  isLoading: boolean = false;

  accounts: Account[];
  accountTypes: AccountType[];
  
  constructor(private accountService: AccountsService, private modalService: NgbModal) { }

  getAccountTypeDisplay(type: AccountType): string {
    return accountTypeDisplay[type];
  }

  ngOnInit() {   
    this.isLoading = true;

    this.accountService
      .getAccounts()
      .subscribe(accounts => {
        this.accounts = accounts;
        
        let accountsByType = this.accounts.groupBy(account => account.type);
        this.accountTypes = Array.from(accountsByType.keys());
        
        this.isLoading = false;
      });
  }

  getAccountsByType(type: AccountType): Account[] {
    return this.accounts.filter(account => account.type === type);
  }

  newAccount() {
    let paymentModalRef = this.modalService.open(AccountModalComponent);
    paymentModalRef.componentInstance.isNew = true;
  }

  editAccount(account: Account) {
    let paymentModalRef = this.modalService.open(AccountModalComponent);
    paymentModalRef.componentInstance.account = account;
  }
  
}
