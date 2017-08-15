
import { LineType } from "models";

export interface StatementLine {
  date: Date;
  details: string;
  type?: LineType;
  debit?: number;
  credit?: number;
  balance?: number;
}
