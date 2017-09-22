
export interface Fee {
  name: string;
  single?: number;
  monthly: number;
  termly: number;
  annually?: number;
  type: FeeType;
}

export enum FeeType {
  Class = "class",
  Private = "private",
}
