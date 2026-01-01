import { Link } from "react-router-dom";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useEmployeesContext } from "@/context/EmployeeContext";

export const EmployeeCards = () => {
  const { filteredEmployees, roleMap } = useEmployeesContext();

  if (filteredEmployees.length === 0) {
    return (
      <div className="glass-panel px-6 py-10 text-center text-slate-400" role="status" aria-live="polite">
        No employees match the current filters.
      </div>
    );
  }

  return (
    <div
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      role="list"
      aria-label="Employees card layout"
    >
      {filteredEmployees.map((employee) => {
        const role = employee.roleId ? roleMap[employee.roleId] : undefined;
        return (
          <article
            key={employee.id}
            className="glass-panel flex flex-col justify-between space-y-4 px-5 py-5"
            role="listitem"
            aria-labelledby={`card-${employee.id}`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 id={`card-${employee.id}`} className="text-xl font-semibold text-white">
                    {employee.name}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {employee.department} · {role?.title ?? "Role pending"}
                  </p>
                </div>
                <StatusBadge status={employee.status} />
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Hired {new Date(employee.hiredAt).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <p className="flex items-center gap-2">
                <Mail size={14} aria-hidden="true" />
                <span className="truncate">{employee.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={14} aria-hidden="true" />
                <span>{employee.location}</span>
              </p>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>{employee.projects} active projects</span>
              <span>${employee.salary.toLocaleString()}</span>
            </div>
            <Link
              to={`/employees/${employee.id}`}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label={`View ${employee.name} profile`}
            >
              View profile
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </article>
        );
      })}
    </div>
  );
};
