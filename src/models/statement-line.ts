
import { TransactionType } from "models/line-type";

export interface StatementLine {
  date: Date;
  details: string;
  amount?: number;
  balance: number;
  type?: TransactionType;
}
