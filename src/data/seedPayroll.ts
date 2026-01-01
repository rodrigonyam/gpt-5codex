import { PayrollCycle } from "@/types/operations";

export const seedPayroll: PayrollCycle[] = [
  {
    id: "pay-2025-06",
    label: "Jun 16 — Jun 30",
    periodStart: "2025-06-16",
    periodEnd: "2025-06-30",
    cutOffDate: "2025-06-27",
    payoutDate: "2025-07-03",
    status: "Processing",
    totalGross: 482000,
    totalNet: 361500
  },
  {
    id: "pay-2025-07a",
    label: "Jul 01 — Jul 15",
    periodStart: "2025-07-01",
    periodEnd: "2025-07-15",
    cutOffDate: "2025-07-12",
    payoutDate: "2025-07-19",
    status: "Draft",
    totalGross: 489200,
    totalNet: 367900
  },
  {
    id: "pay-2025-05",
    label: "Jun 01 — Jun 15",
    periodStart: "2025-06-01",
    periodEnd: "2025-06-15",
    cutOffDate: "2025-06-12",
    payoutDate: "2025-06-18",
    status: "Paid",
    totalGross: 475800,
    totalNet: 356100
  }
];
