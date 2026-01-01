import { LeaveRequest } from "@/types/attendance";

export const seedLeaveRequests: LeaveRequest[] = [
  {
    id: "leave-1",
    employeeId: "EMP-2404",
    startDate: "2025-01-08",
    endDate: "2025-01-10",
    reason: "Client roadshow in Doha",
    status: "Pending",
    requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
  },
  {
    id: "leave-2",
    employeeId: "EMP-2402",
    startDate: "2025-02-02",
    endDate: "2025-02-05",
    reason: "Mid-winter recharge",
    status: "Approved",
    requestedAt: "2024-12-20T10:00:00.000Z"
  }
];
