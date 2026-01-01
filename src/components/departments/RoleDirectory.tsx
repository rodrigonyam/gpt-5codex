import { useMemo } from "react";
import { useEmployeesContext } from "@/context/EmployeeContext";

export const RoleDirectory = () => {
  const { roles, departments } = useEmployeesContext();

  const rolesByDepartment = useMemo(() => {
    return departments.map((department) => ({
      department,
      roles: roles.filter((role) => role.department === department.name)
    }));
  }, [departments, roles]);

  return (
    <div className="glass-panel px-6 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="section-title text-xs text-slate-400">Role catalog</p>
          <h3 className="font-display text-xl">Permission templates</h3>
        </div>
        <span className="text-xs text-slate-500">{roles.length} total roles</span>
      </div>
      <div className="space-y-4">
        {rolesByDepartment.map(({ department, roles: groupedRoles }) => (
          <div key={department.id} className="rounded-2xl border border-white/5 bg-white/5 px-4 py-4">
            <p className="text-sm font-semibold text-white">{department.name}</p>
            {groupedRoles.length === 0 ? (
              <p className="text-xs text-slate-500">No role templates yet.</p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm">
                {groupedRoles.map((role) => (
                  <li key={role.id} className="flex items-center justify-between text-slate-200">
                    <span>{role.title}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        role.permission === "Admin"
                          ? "bg-emerald-500/20 text-emerald-200"
                          : "bg-sky-500/20 text-sky-200"
                      }`}
                    >
                      {role.permission}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
