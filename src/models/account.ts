
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
  paymentOptions?: string[];

  deleteAllowed?: boolean;
}

export interface AccountName {
  id: string;
  name: string;
}

type AccountTypeDisplay = { [K in AccountType]: string };

export const accountTypeDisplay: AccountTypeDisplay = {
  asset: "Assets",
  equity: "Equity",
  expense: "Expenses",
  income: "Income",
  liability: "Liability"
}
