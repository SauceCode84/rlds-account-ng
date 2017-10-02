
import { TransactionType } from "models";

export interface StatementLine {
  $key?: string;
  date: Date;
  details: string;
  amount?: number;
  balance: number;
  type?: TransactionType;
}
