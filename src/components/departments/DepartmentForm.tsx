import { FormEvent, useState } from "react";
import { useEmployeesContext } from "@/context/EmployeeContext";

export const DepartmentForm = () => {
  const { addDepartment } = useEmployeesContext();
  const [form, setForm] = useState({ name: "", description: "" });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim()) {
      return;
    }
    addDepartment({
      name: form.name.trim(),
      description: form.description.trim() || "New strategic pod"
    });
    setForm({ name: "", description: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel space-y-4 px-6 py-6">
      <div>
        <p className="section-title text-xs text-slate-400">Departments</p>
        <h3 className="font-display text-2xl">Create a pod</h3>
      </div>
      <label className="space-y-2 text-sm">
        <span className="text-slate-400">Department name</span>
        <input
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="e.g. Platform Ops"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-brand-400 focus:outline-none"
        />
      </label>
      <label className="space-y-2 text-sm">
        <span className="text-slate-400">Purpose</span>
        <textarea
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          rows={4}
          placeholder="Describe mission, charter, or OKRs"
          className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-brand-400 focus:outline-none"
        />
      </label>
      <button
        type="submit"
        className="w-full rounded-2xl bg-gradient-to-r from-brand-500 to-blue-500 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white"
      >
        Save department
      </button>
    </form>
  );
};
