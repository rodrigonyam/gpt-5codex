export type PayrollStatus = "Draft" | "Processing" | "Approved" | "Paid";

export interface PayrollCycle {
  id: string;
  label: string;
  periodStart: string;
  periodEnd: string;
  cutOffDate: string;
  payoutDate: string;
  status: PayrollStatus;
  totalGross: number;
  totalNet: number;
}

export type ShiftType = "Morning" | "Midday" | "Evening" | "Night";
export type ShiftStatus = "Scheduled" | "In Progress" | "Completed" | "Missed";

export interface ShiftAssignment {
  id: string;
  employeeId: string;
  shiftDate: string;
  shiftType: ShiftType;
  location: string;
  status: ShiftStatus;
  notes?: string;
}

export type ReviewRating = "Exceeds" | "Strong" | "Solid" | "Developing";

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewer: string;
  focus: string;
  rating: ReviewRating;
  submittedAt: string;
  nextCheckIn: string;
  highlights: string[];
}
