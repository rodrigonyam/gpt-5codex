import { ActivityLog } from "@/types/attendance";

export const seedActivityLogs: ActivityLog[] = [
  {
    id: "log-1",
    title: "Neena clocked out for design review",
    detail: "Wrapped Lisbon studio sync",
    category: "Attendance",
    severity: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    id: "log-2",
    title: "Priya clocked in",
    detail: "People Ops coverage online",
    category: "Attendance",
    severity: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString()
  },
  {
    id: "log-3",
    title: "Omar submitted leave request",
    detail: "Dubai market visit (3 days)",
    category: "Leave",
    severity: "warning",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
  }
];
