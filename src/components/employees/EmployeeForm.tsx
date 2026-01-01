import { FormEvent, useMemo, useState } from "react";
import { useEmployeesContext } from "@/context/EmployeeContext";
import { EmployeeStatus } from "@/types/employee";

export const EmployeeForm = () => {
  const { addEmployee, departments, roles } = useEmployeesContext();
  const defaultDepartment = departments[0]?.name ?? "Engineering";
  const defaultRole = roles.find((role) => role.department === defaultDepartment)?.id ?? "";
  const [form, setForm] = useState({
    name: "",
    department: defaultDepartment,
    email: "",
    location: "Remote",
    status: "Active" as EmployeeStatus,
    salary: 120000,
    projects: 1,
    roleId: defaultRole
  });

  const availableRoles = useMemo(
    () => roles.filter((role) => role.department === form.department),
    [roles, form.department]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name) {
      return;
    }
    addEmployee({
      ...form,
      roleId: form.roleId || undefined,
      hiredAt: new Date().toISOString().split("T")[0]
    });
    const fallbackDepartment = departments[0]?.name ?? defaultDepartment;
    const fallbackRole = roles.find((role) => role.department === fallbackDepartment)?.id ?? "";
    setForm({
      name: "",
      department: fallbackDepartment,
      email: "",
      location: "Remote",
      status: "Active" as EmployeeStatus,
      salary: 120000,
      projects: 1,
      roleId: fallbackRole
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel space-y-4 px-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="section-title text-xs text-slate-400">New Hire</p>
          <p className="font-display text-2xl">Add Employee</p>
        </div>
        <span className="text-xs text-slate-500">Approx. 45s</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { label: "Name", name: "name", type: "text", required: true },
          { label: "Email", name: "email", type: "email", required: true },
          { label: "Location", name: "location", type: "text", required: false }
        ].map((field) => {
          const inputId = `quick-add-${field.name}`;
          return (
            <label key={field.name} htmlFor={inputId} className="space-y-2 text-sm">
              <span className="text-slate-200">
                {field.label}
                {field.required && <span aria-hidden="true"> *</span>}
              </span>
              <input
                id={inputId}
                required={field.required}
                type={field.type}
                value={(form as Record<string, string | number>)[field.name] as string}
                onChange={(event) => setForm((prev) => ({ ...prev, [field.name]: event.target.value }))}
                className="w-full rounded-2xl border border-white/15 bg-slate-900/40 px-4 py-3 text-white placeholder:text-slate-500 focus:border-brand-300 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                aria-required={field.required}
              />
            </label>
          );
        })}
        <label className="space-y-2 text-sm">
          <span className="text-slate-200">Department</span>
          <select
            value={form.department}
            onChange={(event) => {
              const nextDepartment = event.target.value;
              const nextRole = roles.find((role) => role.department === nextDepartment)?.id ?? "";
              setForm((prev) => ({ ...prev, department: nextDepartment, roleId: nextRole }));
            }}
            className="w-full rounded-2xl border border-white/15 bg-slate-900/40 px-4 py-3 text-white focus:border-brand-300 focus:ring-2 focus:ring-brand-400 focus:outline-none"
          >
            {departments.map((department) => (
              <option key={department.id} value={department.name} className="text-slate-900">
                {department.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-slate-200">Status</span>
          <select
            value={form.status}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, status: event.target.value as EmployeeStatus }))
            }
            className="w-full rounded-2xl border border-white/15 bg-slate-900/40 px-4 py-3 text-white focus:border-brand-300 focus:ring-2 focus:ring-brand-400 focus:outline-none"
          >
            {["Active", "On Leave", "Inactive"].map((status) => (
              <option key={status} value={status} className="text-slate-900">
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-slate-200">Annual Salary (USD)</span>
          <input
            type="number"
            value={form.salary}
            onChange={(event) => setForm((prev) => ({ ...prev, salary: Number(event.target.value) }))}
            className="w-full rounded-2xl border border-white/15 bg-slate-900/40 px-4 py-3 text-white focus:border-brand-300 focus:ring-2 focus:ring-brand-400 focus:outline-none"
            min={50000}
            max={400000}
            step={1000}
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-slate-200">Active Projects</span>
          <input
            type="number"
            value={form.projects}
            onChange={(event) => setForm((prev) => ({ ...prev, projects: Number(event.target.value) }))}
            className="w-full rounded-2xl border border-white/15 bg-slate-900/40 px-4 py-3 text-white focus:border-brand-300 focus:ring-2 focus:ring-brand-400 focus:outline-none"
            min={0}
            max={12}
          />
        </label>
        <label className="space-y-2 text-sm md:col-span-2">
          <span className="text-slate-200">Role & Permission</span>
          <div className="flex flex-col gap-3 md:flex-row">
            <select
              value={form.roleId ?? ""}
              onChange={(event) => setForm((prev) => ({ ...prev, roleId: event.target.value }))}
              className="w-full rounded-2xl border border-white/15 bg-slate-900/40 px-4 py-3 text-white focus:border-brand-300 focus:ring-2 focus:ring-brand-400 focus:outline-none"
            >
              <option value="" className="text-slate-900">
                Assign later
              </option>
              {availableRoles.map((role) => (
                <option key={role.id} value={role.id} className="text-slate-900">
                  {role.title} · {role.permission}
                </option>
              ))}
            </select>
            {availableRoles.length === 0 && (
              <span className="text-xs text-amber-300">No role templates for this department yet.</span>
            )}
          </div>
        </label>
      </div>
      <button
        type="submit"
        className="w-full rounded-2xl bg-gradient-to-r from-brand-500 to-purple-500 px-6 py-4 text-base font-semibold uppercase tracking-[0.2em] text-white shadow-card transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Save Employee
      </button>
    </form>
  );
};
