import { useId } from "react";
import { useEmployeesContext } from "@/context/EmployeeContext";

interface EmployeeFiltersProps {
  ariaDescribedBy?: string;
}

export const EmployeeFilters = ({ ariaDescribedBy }: EmployeeFiltersProps) => {
  const { filters, setFilters, departments } = useEmployeesContext();
  const departmentOptions = ["All", ...departments.map((department) => department.name)];
  const searchId = useId();
  const statusId = useId();
  const departmentId = useId();

  return (
    <form
      className="glass-panel grid gap-4 px-4 py-4 md:grid-cols-3"
      aria-describedby={ariaDescribedBy}
      role="search"
    >
      <label htmlFor={searchId} className="text-sm text-slate-300">
        <span className="sr-only">Search employees</span>
        <input
          id={searchId}
          type="search"
          placeholder="Search by name or role"
          value={filters.search}
          onChange={(event) => setFilters({ search: event.target.value })}
          className="mt-1 w-full rounded-2xl border border-white/15 bg-slate-900/50 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-brand-300 focus:ring-2 focus:ring-brand-400 focus:outline-none"
          enterKeyHint="search"
          aria-controls="employee-table"
        />
      </label>
      <label htmlFor={statusId} className="text-sm text-slate-300">
        <span className="sr-only">Filter by status</span>
        <select
          id={statusId}
          value={filters.status}
          onChange={(event) => setFilters({ status: event.target.value as typeof filters.status })}
          className="mt-1 w-full rounded-2xl border border-white/15 bg-slate-900/50 px-4 py-3 text-base text-white focus:border-brand-300 focus:ring-2 focus:ring-brand-400 focus:outline-none"
          aria-controls="employee-table"
        >
          {["All", "Active", "On Leave", "Inactive"].map((status) => (
            <option key={status} value={status} className="text-slate-900">
              {status}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor={departmentId} className="text-sm text-slate-300">
        <span className="sr-only">Filter by department</span>
        <select
          id={departmentId}
          value={filters.department}
          onChange={(event) => setFilters({ department: event.target.value })}
          className="mt-1 w-full rounded-2xl border border-white/15 bg-slate-900/50 px-4 py-3 text-base text-white focus:border-brand-300 focus:ring-2 focus:ring-brand-400 focus:outline-none"
          aria-controls="employee-table"
        >
          {departmentOptions.map((department) => (
            <option key={department} value={department} className="text-slate-900">
              {department}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
};
