
export interface Student {
  firstName: string;
  lastName: string;
  grade: number;
  emails: string[];
  paymentOption: PaymentOption;
}

export enum Grade {
  PrePrimary,
  Primary,
  Grade1,
  Grade2,
  Grade3,
  Grade4,
  Grade5,
  Intermediate,
  Advanced1
}

export enum PaymentOption {
  Monthly = "monthly",
  Termly = "termly",
  Annually = "annually"
}

type DisplayValuePair<T> = {
  value: T;
  displayValue: string;
}

interface DisplayKeyValuePair<T> {
  [key: string]: DisplayValuePair<T>
}

export const PaymentOptions = {
  monthly: {
    value: "monthly",
    displayValue: "Monthly"
  },
  termly: {
    value: "termly",
    displayValue: "Termly"
  },
  annually: {
    value: "annually",
    displayValue: "Annually"
  }
};

type PaymentOptionsKeys = keyof typeof PaymentOptions;

export const getValue = <KV extends DisplayKeyValuePair<T>, T>(obj: KV) => <K extends keyof KV>(key: K): T => {
  return obj[key].value;
}

export const getDisplayValue = <KV extends DisplayKeyValuePair<T>, T>(obj: KV) => <K extends keyof KV>(key: K): string => {
  return obj[key].displayValue;
}

const getValues = <T>(obj: DisplayKeyValuePair<T>) => {
  return Object.keys(obj).map(key => obj[key].value);
}

const getDisplayValues = <T>(obj: DisplayKeyValuePair<T>) => {
  return Object.keys(obj).map(key => obj[key].displayValue);
}

const mapDisplayValuePair = <T>(obj: DisplayKeyValuePair<T>) => (key: string) => {
  return {
    value: obj[key].value,
    displayValue: obj[key].displayValue
  } 
}

export const getDisplayValueArray = <T>(obj: DisplayKeyValuePair<T>) => Object.keys(obj).map(mapDisplayValuePair(obj));

export const getPaymentOptionValue = getValue(PaymentOptions);
export const getPaymentOptionDisplayValue = getDisplayValue(PaymentOptions);

export const GradeDisplay = [
  "Pre-primary",
  "Primary",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Intermediate",
  "Advanced 1"
];
