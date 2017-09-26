import { getValue, getDisplayValue } from "models/student";

export const FeeTypeOptions = {
  classFees: {
    value: "classFees",
    displayValue: "Class Fees"
  },
  examFees: {
    value: "examFees",
    displayValue: "Exam Fees"
  },
  payment: {
    value: "registration",
    displayValue: "Registration"
  }
};

export const getFeeTypeOptionValue = getValue(FeeTypeOptions);
export const getFeeTypeOptionDisplayValue = getDisplayValue(FeeTypeOptions);
