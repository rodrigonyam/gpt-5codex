import { AuthAccount } from "@/types/auth";

export const seedUsers: AuthAccount[] = [
  {
    id: "user-admin",
    name: "Aria Patel",
    email: "aria@astrion.io",
    password: "admin123",
    role: "admin",
    department: "People Operations",
    avatarGradient: "from-brand-500 to-fuchsia-500"
  },
  {
    id: "user-hr",
    name: "Nia Gomez",
    email: "nia@astrion.io",
    password: "peopleops",
    role: "hr",
    department: "HR Programs",
    avatarGradient: "from-rose-500 to-amber-400"
  },
  {
    id: "user-manager",
    name: "Marcus Lee",
    email: "marcus@astrion.io",
    password: "lead123",
    role: "manager",
    department: "Revenue Operations",
    avatarGradient: "from-sky-500 to-cyan-400"
  },
  {
    id: "user-employee",
    name: "Priya Shah",
    email: "priya@astrion.io",
    password: "teamwork",
    role: "employee",
    department: "Product Design",
    avatarGradient: "from-violet-500 to-indigo-400"
  }
];
