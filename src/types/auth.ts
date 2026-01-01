export type UserRole = "admin" | "hr" | "manager" | "employee";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarGradient: string;
}

export interface AuthAccount extends AuthUser {
  password: string;
}
