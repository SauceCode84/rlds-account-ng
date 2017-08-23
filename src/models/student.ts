
export interface Student {
  firstName: string;
  lastName: string;
  grade: number;
  emails: string[];
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
