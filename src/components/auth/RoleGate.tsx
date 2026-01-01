import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserRole } from "@/types/auth";
import { useAuth } from "@/context/AuthContext";

interface RoleGateProps {
  allow: UserRole[];
  children: ReactNode;
}

export const RoleGate = ({ allow, children }: RoleGateProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!allow.includes(user.role)) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};
