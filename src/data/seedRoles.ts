import { DepartmentRole } from "@/types/employee";

export const seedRoles: DepartmentRole[] = [
  {
    id: "role-eng-staff-fe",
    title: "Staff Frontend Engineer",
    department: "Engineering",
    permission: "Staff"
  },
  {
    id: "role-eng-ml-lead",
    title: "Machine Learning Lead",
    department: "Engineering",
    permission: "Admin"
  },
  {
    id: "role-product-design-director",
    title: "Design Director",
    department: "Product",
    permission: "Admin"
  },
  {
    id: "role-people-partner",
    title: "People Partner",
    department: "People Ops",
    permission: "Staff"
  },
  {
    id: "role-growth-strategist",
    title: "Revenue Strategist",
    department: "Growth",
    permission: "Staff"
  }
];
