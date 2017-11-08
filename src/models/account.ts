
export enum AccountType {
  Asset = "asset",
  Liability = "liability",
  Equity = "equity",
  Income = "income",
  Expense = "expense"
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  subAccounts?: string[];
  debit?: number;
  credit?: number;
  balance?: number;
}

export interface AccountName {
  id: string;
  name: string;
}
