
import { LineType } from "models";

export interface Transaction {
  date: Date;
  details: string;
  type?: LineType;
  debit?: number;
  credit?: number;
  balance?: number;
}
