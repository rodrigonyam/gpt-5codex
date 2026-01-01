import { useEmployeesContext } from "@/context/EmployeeContext";

export const DepartmentSummaryGrid = () => {
  const { departmentSummaries, permissionStats } = useEmployeesContext();

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {departmentSummaries.map((department) => (
        <article key={department.id} className="glass-panel space-y-3 px-5 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{department.name}</p>
            <p className="text-sm text-slate-400">{department.description}</p>
          </div>
          <p className="font-display text-3xl">{department.headcount}</p>
          <div className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-slate-400">
            <span className="text-emerald-300">{department.admins} admin</span>
            <span className="text-sky-300">{department.staff} staff</span>
          </div>
        </article>
      ))}
      <article className="glass-panel space-y-3 px-5 py-5">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Access blend</p>
        <div className="flex items-baseline gap-3">
          <p className="font-display text-4xl">{permissionStats.admins}</p>
          <span className="text-xs text-slate-400">admins</span>
        </div>
        <div className="flex items-baseline gap-3">
          <p className="font-display text-2xl">{permissionStats.staff}</p>
          <span className="text-xs text-slate-400">staff</span>
        </div>
        <p className="text-xs text-slate-500">Admins inherit elevated approvals across attendance + org settings.</p>
      </article>
    </div>
  );
};
