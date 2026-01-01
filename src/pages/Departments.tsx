import { DepartmentSummaryGrid } from "@/components/departments/DepartmentSummaryGrid";
import { DepartmentForm } from "@/components/departments/DepartmentForm";
import { RoleForm } from "@/components/departments/RoleForm";
import { RoleAssignmentBoard } from "@/components/departments/RoleAssignmentBoard";
import { RoleDirectory } from "@/components/departments/RoleDirectory";

const Departments = () => (
  <section className="space-y-8">
    <div>
      <p className="section-title text-xs text-slate-400">People Infrastructure</p>
      <h2 className="font-display text-3xl">Departments & Roles</h2>
      <p className="text-sm text-slate-400">
        Spin up new departments, define access templates, and assign employees to permissioned roles.
      </p>
    </div>
    <DepartmentSummaryGrid />
    <div className="grid gap-6 lg:grid-cols-2">
      <DepartmentForm />
      <RoleForm />
    </div>
    <RoleAssignmentBoard />
    <RoleDirectory />
  </section>
);

export default Departments;
