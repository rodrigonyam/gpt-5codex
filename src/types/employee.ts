export type EmployeeStatus = "Active" | "On Leave" | "Inactive";
export type PermissionLevel = "Admin" | "Staff";

export interface Department {
  id: string;
  name: string;
  description: string;
}

export interface DepartmentRole {
  id: string;
  title: string;
  department: string;
  permission: PermissionLevel;
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  email: string;
  location: string;
  status: EmployeeStatus;
  hiredAt: string;
  salary: number;
  projects: number;
  roleId?: string;
  avatar?: string;
}

export interface EmployeeFilters {
  search: string;
  status: EmployeeStatus | "All";
  department: string | "All";
}
