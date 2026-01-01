import { useEmployeesContext } from "@/context/EmployeeContext";

export const RoleAssignmentBoard = () => {
  const { employees, roles, roleMap, assignRoleToEmployee } = useEmployeesContext();

  return (
    <div className="glass-panel overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <p className="section-title text-xs text-slate-400">Assignments</p>
          <h3 className="font-display text-2xl">Access control board</h3>
        </div>
        <span className="text-xs text-slate-500">{employees.length} employees</span>
      </div>
      <table className="w-full border-collapse text-sm">
        <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.3em] text-slate-400">
          <tr>
            <th className="px-6 py-3">Employee</th>
            <th className="px-6 py-3">Department</th>
            <th className="px-6 py-3">Role template</th>
            <th className="px-6 py-3">Permission</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => {
            const assignedRole = employee.roleId ? roleMap[employee.roleId] : undefined;
            return (
              <tr key={employee.id} className="border-t border-white/5 last:border-b-0">
                <td className="px-6 py-4">
                  <p className="font-semibold">{employee.name}</p>
                  <p className="text-xs text-slate-500">{employee.email}</p>
                </td>
                <td className="px-6 py-4 text-slate-200">{employee.department}</td>
                <td className="px-6 py-4">
                  <select
                    value={employee.roleId ?? ""}
                    onChange={(event) =>
                      assignRoleToEmployee({
                        employeeId: employee.id,
                        roleId: event.target.value || undefined
                      })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-brand-400 focus:outline-none"
                  >
                    <option value="">Unassigned</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id} className="text-slate-900">
                        {role.title} · {role.department}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  {assignedRole ? (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        assignedRole.permission === "Admin"
                          ? "bg-emerald-500/20 text-emerald-200"
                          : "bg-sky-500/20 text-sky-200"
                      }`}
                    >
                      {assignedRole.permission}
                    </span>
                  ) : (
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Pending</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {employees.length === 0 && (
        <p className="px-6 py-10 text-center text-sm text-slate-500">No employees yet.</p>
      )}
    </div>
  );
};
