
import { TransactionType } from "models";

export interface StatementLine {
  date: Date;
  details: string;
  amount?: number;
  balance: number;
  type?: TransactionType;
}
