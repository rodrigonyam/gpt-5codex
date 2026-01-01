import { Employee } from "@/types/employee";

export const seedEmployees: Employee[] = [
  {
    id: "EMP-2401",
    name: "Neena Flores",
    department: "Product",
    email: "neena.flores@astrion.com",
    location: "Lisbon, PT",
    status: "Active",
    hiredAt: "2019-04-03",
    salary: 165000,
    projects: 6,
    roleId: "role-product-design-director"
  },
  {
    id: "EMP-2402",
    name: "Dmitri Volkov",
    department: "Engineering",
    email: "d.volkov@astrion.com",
    location: "Berlin, DE",
    status: "On Leave",
    hiredAt: "2021-10-12",
    salary: 148000,
    projects: 4,
    roleId: "role-eng-staff-fe"
  },
  {
    id: "EMP-2403",
    name: "Priya Shah",
    department: "People Ops",
    email: "priya.shah@astrion.com",
    location: "Toronto, CA",
    status: "Active",
    hiredAt: "2020-01-21",
    salary: 118000,
    projects: 2,
    roleId: "role-people-partner"
  },
  {
    id: "EMP-2404",
    name: "Omar Essam",
    department: "Growth",
    email: "o.essam@astrion.com",
    location: "Dubai, UAE",
    status: "Active",
    hiredAt: "2018-05-17",
    salary: 132000,
    projects: 5,
    roleId: "role-growth-strategist"
  },
  {
    id: "EMP-2405",
    name: "Ava Martinez",
    department: "Engineering",
    email: "ava.martinez@astrion.com",
    location: "Austin, US",
    status: "Inactive",
    hiredAt: "2017-11-05",
    salary: 175000,
    projects: 3,
    roleId: "role-eng-ml-lead"
  }
];
