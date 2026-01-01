import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Employees from "@/pages/Employees";
import Departments from "@/pages/Departments";
import Operations from "@/pages/Operations";
import EmployeeProfile from "@/pages/EmployeeProfile";
import EmployeeEditor from "@/pages/EmployeeEditor";
import Login from "@/pages/Login";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedLayout } from "@/components/auth/ProtectedLayout";
import { RoleGate } from "@/components/auth/RoleGate";

const App = () => (
  <AuthProvider>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/employees"
          element={
            <RoleGate allow={["admin", "hr", "manager"]}>
              <Employees />
            </RoleGate>
          }
        />
        <Route
          path="/employees/new"
          element={
            <RoleGate allow={["admin", "hr", "manager"]}>
              <EmployeeEditor />
            </RoleGate>
          }
        />
        <Route
          path="/employees/:employeeId"
          element={
            <RoleGate allow={["admin", "hr", "manager"]}>
              <EmployeeProfile />
            </RoleGate>
          }
        />
        <Route
          path="/employees/:employeeId/edit"
          element={
            <RoleGate allow={["admin", "hr"]}>
              <EmployeeEditor />
            </RoleGate>
          }
        />
        <Route
          path="/departments"
          element={
            <RoleGate allow={["admin", "hr"]}>
              <Departments />
            </RoleGate>
          }
        />
        <Route
          path="/operations"
          element={
            <RoleGate allow={["admin", "hr", "manager"]}>
              <Operations />
            </RoleGate>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AuthProvider>
);

export default App;
