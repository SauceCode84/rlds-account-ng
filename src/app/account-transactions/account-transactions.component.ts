import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Observable } from "rxjs";

import { Account, AccountType, accountTypeDisplay, Transaction } from "../../models";
import { AccountsService, StatementService } from "providers";

@Component({
  selector: "app-account-transactions",
  templateUrl: "./account-transactions.component.html",
  styleUrls: ["./account-transactions.component.scss"]
})
export class AccountTransactionsComponent implements OnInit {

  account: Account;
  txs: Transaction[];

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountsService,
    private transactionService: StatementService) { }

  getAccountTypeDisplay(type: AccountType): string {
    return accountTypeDisplay[type];
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        let id = params.get("id");
        let account$ = this.accountService.getAccount(id);

        account$.subscribe(account => {
          this.account = account;
          let txs$ = this.transactionService.txsByAccount(account.id, true);

          txs$.subscribe(txs => this.txs = txs);
        });
      });
  }
  
}
