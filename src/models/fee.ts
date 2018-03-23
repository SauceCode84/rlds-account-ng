
import { CustomFeeType, FeeType, InterestType } from "models";

export interface Fee {
  id?: string;
  name: string;
  amount: number;
  type: FeeType | InterestType | CustomFeeType;
  grade?: string;
  paymentOption?: string;
  accountId?: string;
  accountName?: string;
}

/*export interface FeeAmounts {
  [key: string]: number;
  single?: number;
  monthly?: number;
  termly?: number;
  annually?: number;
}*/

/*export const isFeeAmounts = (value): value is FeeAmounts => {
  return value.single || value.monthly || value.termly || value.annually;
}*/
