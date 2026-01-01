import { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, Rows3, Plus } from "lucide-react";
import { EmployeeFilters } from "@/components/employees/EmployeeFilters";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { EmployeeCards } from "@/components/employees/EmployeeCards";

const Employees = () => {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  return (
    <section className="space-y-6" aria-labelledby="employees-heading">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="section-title text-xs text-slate-400">People Directory</p>
        <h2 id="employees-heading" className="font-display text-3xl">
          Employees
        </h2>
        <p className="text-sm text-slate-400" id="employees-description">
          Filter talent across teams, status, and work location. Changes sync instantly.
        </p>
      </div>
      <div className="flex flex-wrap gap-3" aria-label="Employee actions">
        <Link
          to="/employees/new"
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-brand-400/60 bg-brand-500/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-500/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Add a new employee"
        >
          <Plus size={16} aria-hidden="true" />
          Add Employee
        </Link>
        <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 p-1" role="group" aria-label="Toggle employee layout">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`inline-flex min-w-[48px] items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              viewMode === "table" ? "bg-slate-900/70 text-white" : "text-slate-400"
            }`}
            aria-pressed={viewMode === "table"}
          >
            <Rows3 size={16} aria-hidden="true" />
            Table
          </button>
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={`inline-flex min-w-[48px] items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              viewMode === "cards" ? "bg-slate-900/70 text-white" : "text-slate-400"
            }`}
            aria-pressed={viewMode === "cards"}
          >
            <LayoutGrid size={16} aria-hidden="true" />
            Cards
          </button>
        </div>
      </div>
    </div>
    <EmployeeFilters ariaDescribedBy="employees-description" />
    {viewMode === "table" ? <EmployeeTable /> : <EmployeeCards />}
  </section>
  );
};

export default Employees;
