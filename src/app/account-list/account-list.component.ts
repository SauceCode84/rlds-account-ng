import { Component, OnInit } from "@angular/core";
import { AccountsService } from "providers";

import "../../helpers/groupBy";

import { Account, AccountType, accountTypeDisplay } from "models/account";

@Component({
  selector: "app-account-list",
  templateUrl: "./account-list.component.html",
  styleUrls: ["./account-list.component.scss"]
})
export class AccountListComponent implements OnInit {
  
  isLoading: boolean = false;

  accounts: Account[];
  accountTypes: AccountType[];
  
  constructor(private accountService: AccountsService) { }

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
    console.log("newAccount");
  }
  
}
