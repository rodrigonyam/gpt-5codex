import { AttendanceEvent } from "@/types/attendance";

export const seedAttendance: AttendanceEvent[] = [
  {
    id: "att-1",
    employeeId: "EMP-2402",
    type: "CLOCK_IN",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    note: "Berlin hub"
  },
  {
    id: "att-2",
    employeeId: "EMP-2401",
    type: "CLOCK_IN",
    timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    note: "Lisbon studio"
  },
  {
    id: "att-3",
    employeeId: "EMP-2401",
    type: "CLOCK_OUT",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    note: "Workshop prep"
  },
  {
    id: "att-4",
    employeeId: "EMP-2403",
    type: "CLOCK_IN",
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString()
  }
];
