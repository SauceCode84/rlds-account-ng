import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import { AccountsService } from "providers/accounts.service";
import { Account, AccountType, accountTypeDisplay, Transaction } from "../../models";
import { StatementService } from "providers/statement.service";

@Component({
  selector: "app-account-detail",
  templateUrl: "./account-detail.component.html",
  styleUrls: ["./account-detail.component.scss"]
})
export class AccountDetailComponent implements OnInit, OnDestroy {
  
  accountSub: Subscription;
  
  account: Account;
  subAccounts: Account[];
  transactions: Transaction[];
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private accountService: AccountsService,
    private statementService: StatementService) { }

  getAccountTypeDisplay(type: AccountType): string {
    return accountTypeDisplay[type];
  }

  ngOnInit() {
    this.route.paramMap
      .subscribe(params => {
        let id = params.get("id");
        let account$ = this.accountService.getAccount(id);
        let subAccounts$ = this.accountService.getSubAccounts(id);
        let transactions$ = this.statementService.txsByAccount(id, true);

        this.accountSub = account$.subscribe(account => this.account = account);

        subAccounts$.subscribe(subAccounts => this.subAccounts = subAccounts);
        transactions$.subscribe(transactions => this.transactions = transactions);
      });
  }

  ngOnDestroy() {
    if (this.accountSub) {
      this.accountSub.unsubscribe();
    }
  }
  
}
