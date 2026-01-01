import { Department } from "@/types/employee";

export const seedDepartments: Department[] = [
  {
    id: "dept-eng",
    name: "Engineering",
    description: "Builds and scales the Astrion platform with velocity and rigor."
  },
  {
    id: "dept-product",
    name: "Product",
    description: "Shapes the roadmap, design ops, and customer discovery loops."
  },
  {
    id: "dept-people",
    name: "People Ops",
    description: "Stewards culture, talent experience, and workforce programs."
  },
  {
    id: "dept-growth",
    name: "Growth",
    description: "Owns revenue activation and strategic GTM experiments."
  }
];
