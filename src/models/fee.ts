import { FeeType, CustomFeeType } from "models/line-type";

export interface Fee {
  $key?: string;
  name: string;
  amount: number | FeeAmounts;
  type: FeeType | CustomFeeType;
  sortOrder?: number;
}

export interface FeeAmounts {
  [key: string]: number;
  single?: number;
  monthly?: number;
  termly?: number;
  annually?: number;
}

export const isFeeAmounts = (value): value is FeeAmounts => {
  return value.single || value.monthly || value.termly || value.annually;
}
