
import { TransactionType } from "models/types";

export interface Transaction {
  $key?: string;
  date: Date;
  details: string;
  type?: TransactionType;
  debit?: number;
  credit?: number;
  balance?: number;
}
