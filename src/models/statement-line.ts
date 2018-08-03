
import { TransactionType } from "models";

export interface StatementLine {
  id?: string;
  date: Date;
  details: string;
  amount?: number;
  balance?: number;
  type?: TransactionType;
}
