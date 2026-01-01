import { ShiftAssignment } from "@/types/operations";

export const seedSchedule: ShiftAssignment[] = [
  {
    id: "shift-001",
    employeeId: "EMP-2401",
    shiftDate: new Date().toISOString().split("T")[0],
    shiftType: "Morning",
    location: "HQ East",
    status: "Scheduled",
    notes: "Product roadmap sync"
  },
  {
    id: "shift-002",
    employeeId: "EMP-2403",
    shiftDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    shiftType: "Midday",
    location: "Remote",
    status: "Scheduled",
    notes: "New hire onboarding"
  },
  {
    id: "shift-003",
    employeeId: "EMP-2404",
    shiftDate: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
    shiftType: "Evening",
    location: "EMEA Hub",
    status: "Scheduled",
    notes: "Emerging markets review"
  },
  {
    id: "shift-004",
    employeeId: "EMP-2402",
    shiftDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    shiftType: "Morning",
    location: "Remote",
    status: "Completed",
    notes: "Platform migration retro"
  }
];
