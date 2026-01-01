import { PerformanceReview } from "@/types/operations";

export const seedPerformance: PerformanceReview[] = [
  {
    id: "rev-001",
    employeeId: "EMP-2401",
    reviewer: "Marcus Lee",
    focus: "Product strategy leadership",
    rating: "Exceeds",
    submittedAt: "2025-06-05T14:15:00Z",
    nextCheckIn: "2025-09-05",
    highlights: ["Shipped multi-quarter roadmap", "Raised design maturity score from 72 → 86"]
  },
  {
    id: "rev-002",
    employeeId: "EMP-2403",
    reviewer: "Nia Gomez",
    focus: "Employee experience programs",
    rating: "Strong",
    submittedAt: "2025-05-22T11:00:00Z",
    nextCheckIn: "2025-08-22",
    highlights: ["Onboarded 18 hires", "Launched PTO analytics dashboard"]
  },
  {
    id: "rev-003",
    employeeId: "EMP-2404",
    reviewer: "Aria Patel",
    focus: "Regional revenue acceleration",
    rating: "Solid",
    submittedAt: "2025-04-30T16:30:00Z",
    nextCheckIn: "2025-07-30",
    highlights: ["Closed LATAM marketplace partnership", "Improved forecast accuracy by 12%"]
  }
];
