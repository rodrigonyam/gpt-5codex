export type ClockEventType = "CLOCK_IN" | "CLOCK_OUT";

export interface AttendanceEvent {
  id: string;
  employeeId: string;
  type: ClockEventType;
  timestamp: string;
  note?: string;
}

export type ActivityCategory = "Attendance" | "Leave" | "System";
export type ActivitySeverity = "info" | "warning" | "critical";

export interface ActivityLog {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  category: ActivityCategory;
  severity: ActivitySeverity;
}

export type LeaveStatus = "Pending" | "Approved" | "Declined";

export interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  reason: string;
  requestedAt: string;
}
