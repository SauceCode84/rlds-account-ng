
import { TransactionType } from "models/line-type";

export interface Transaction {
  date: Date;
  details: string;
  type?: TransactionType;
  debit?: number;
  credit?: number;
  balance?: number;
}
