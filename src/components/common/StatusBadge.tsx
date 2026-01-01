import clsx from "clsx";
import { EmployeeStatus } from "@/types/employee";

interface StatusBadgeProps {
  status: EmployeeStatus;
}

const statusClasses: Record<EmployeeStatus, string> = {
  Active: "bg-emerald-500/10 text-emerald-200 border border-emerald-500/40",
  "On Leave": "bg-amber-500/10 text-amber-200 border border-amber-500/40",
  Inactive: "bg-rose-500/10 text-rose-200 border border-rose-500/40"
};

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={clsx("rounded-full px-3 py-1 text-xs font-semibold", statusClasses[status])}>
    {status}
  </span>
);
