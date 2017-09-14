
import { StatementLine } from "models";

export interface Statement {
  totalInvoiced: number;
  totalPayments: number;
  currentBalance: number;
  lastPayment: Date;
  lines: StatementLine[];
}
