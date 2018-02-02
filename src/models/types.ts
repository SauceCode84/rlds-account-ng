
export type CustomFeeType = "custom";

export type InterestType = "interest";

export type FeeType = "class" | "registration" | "private" | "preschool" | "festival";

export type PaymentType = "payment";

export type TransactionType = FeeType | InterestType | CustomFeeType | PaymentType;
