import { FormEvent, useState } from "react";
import { useEmployeesContext } from "@/context/EmployeeContext";
import { PermissionLevel } from "@/types/employee";

export const RoleForm = () => {
  const { addRole, departments } = useEmployeesContext();
  const defaultDepartment = departments[0]?.name ?? "Engineering";
  const [form, setForm] = useState({
    title: "",
    department: defaultDepartment,
    permission: "Staff" as PermissionLevel
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim()) {
      return;
    }
    addRole({
      title: form.title.trim(),
      department: form.department,
      permission: form.permission
    });
    setForm({ title: "", department: defaultDepartment, permission: form.permission });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel space-y-4 px-6 py-6">
      <div>
        <p className="section-title text-xs text-slate-400">Roles</p>
        <h3 className="font-display text-2xl">Permission template</h3>
      </div>
      <label className="space-y-2 text-sm">
        <span className="text-slate-400">Role title</span>
        <input
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          placeholder="e.g. Systems Architect"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-brand-400 focus:outline-none"
        />
      </label>
      <label className="space-y-2 text-sm">
        <span className="text-slate-400">Department</span>
        <select
          value={form.department}
          onChange={(event) => setForm((prev) => ({ ...prev, department: event.target.value }))}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-brand-400 focus:outline-none"
        >
          {departments.map((department) => (
            <option key={department.id} value={department.name} className="text-slate-900">
              {department.name}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-2 text-sm">
        <span className="text-slate-400">Permission level</span>
        <div className="flex gap-3">
          {(["Admin", "Staff"] as PermissionLevel[]).map((permission) => (
            <button
              key={permission}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, permission }))}
              className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                form.permission === permission
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-100"
                  : "border-white/10 bg-white/5 text-white"
              }`}
            >
              {permission}
            </button>
          ))}
        </div>
      </label>
      <button
        type="submit"
        className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-rose-500 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white"
      >
        Save role
      </button>
    </form>
  );
};
