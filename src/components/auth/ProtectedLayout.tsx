import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { EmployeeProvider } from "@/context/EmployeeContext";
import { useAuth } from "@/context/AuthContext";

export const ProtectedLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <EmployeeProvider>
      <AppShell>
        <Outlet />
      </AppShell>
    </EmployeeProvider>
  );
};
