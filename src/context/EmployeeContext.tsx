import { createContext, ReactNode, useContext, useMemo, useReducer } from "react";
import { seedEmployees } from "@/data/seedEmployees";
import { seedDepartments } from "@/data/seedDepartments";
import { seedRoles } from "@/data/seedRoles";
import { seedAttendance } from "@/data/seedAttendance";
import { seedActivityLogs } from "@/data/seedActivityLogs";
import { seedLeaveRequests } from "@/data/seedLeaveRequests";
import { seedPayroll } from "@/data/seedPayroll";
import { seedSchedule } from "@/data/seedSchedule";
import { seedPerformance } from "@/data/seedPerformance";
import {
  AttendanceEvent,
  ActivityLog,
  ClockEventType,
  LeaveRequest,
  LeaveStatus
} from "@/types/attendance";
import { Department, DepartmentRole, Employee, EmployeeFilters } from "@/types/employee";
import { PayrollCycle, PerformanceReview, ShiftAssignment } from "@/types/operations";

interface EmployeeState {
  employees: Employee[];
  filters: EmployeeFilters;
  departments: Department[];
  roles: DepartmentRole[];
  attendance: AttendanceEvent[];
  activity: ActivityLog[];
  leaveRequests: LeaveRequest[];
  payroll: PayrollCycle[];
  schedule: ShiftAssignment[];
  performance: PerformanceReview[];
}

interface DepartmentSummary {
  id: string;
  name: string;
  description: string;
  headcount: number;
  admins: number;
  staff: number;
}

interface PermissionStats {
  admins: number;
  staff: number;
}

interface AttendanceStatusSnapshot {
  [employeeId: string]: {
    status: "IN" | "OUT";
    lastEvent?: AttendanceEvent;
  };
}

interface EmployeeStats {
  total: number;
  active: number;
  onLeave: number;
  avgSalary: number;
}

interface EmployeeContextValue {
  employees: Employee[];
  filteredEmployees: Employee[];
  filters: EmployeeFilters;
  stats: EmployeeStats;
  departments: Department[];
  roles: DepartmentRole[];
  roleMap: Record<string, DepartmentRole>;
  employeeMap: Record<string, Employee>;
  departmentSummaries: DepartmentSummary[];
  permissionStats: PermissionStats;
  attendanceEvents: AttendanceEvent[];
  attendanceSnapshot: AttendanceStatusSnapshot;
  activityLog: ActivityLog[];
  leaveRequests: LeaveRequest[];
  payrollCycles: PayrollCycle[];
  shiftAssignments: ShiftAssignment[];
  performanceReviews: PerformanceReview[];
  addEmployee: (payload: Omit<Employee, "id">) => void;
  updateEmployee: (payload: Employee) => void;
  removeEmployee: (id: string) => void;
  setFilters: (payload: Partial<EmployeeFilters>) => void;
  addDepartment: (payload: Omit<Department, "id">) => void;
  addRole: (payload: Omit<DepartmentRole, "id">) => void;
  assignRoleToEmployee: (payload: { employeeId: string; roleId?: string }) => void;
  clockEvent: (payload: { employeeId: string; type: ClockEventType; note?: string }) => void;
  submitLeaveRequest: (payload: { employeeId: string; startDate: string; endDate: string; reason: string }) => void;
  updateLeaveRequestStatus: (payload: { requestId: string; status: LeaveStatus }) => void;
}

type EmployeeAction =
  | { type: "ADD"; payload: Omit<Employee, "id"> }
  | { type: "UPDATE"; payload: Employee }
  | { type: "REMOVE"; payload: { id: string } }
  | { type: "FILTER"; payload: Partial<EmployeeFilters> }
  | { type: "ADD_DEPARTMENT"; payload: Omit<Department, "id"> }
  | { type: "ADD_ROLE"; payload: Omit<DepartmentRole, "id"> }
  | { type: "ASSIGN_ROLE"; payload: { employeeId: string; roleId?: string } }
  | { type: "CLOCK_EVENT"; payload: AttendanceEvent }
  | { type: "ADD_ACTIVITY"; payload: ActivityLog }
  | { type: "ADD_LEAVE_REQUEST"; payload: LeaveRequest }
  | { type: "UPDATE_LEAVE_STATUS"; payload: { requestId: string; status: LeaveStatus } };

const initialState: EmployeeState = {
  employees: seedEmployees,
  filters: {
    search: "",
    status: "All",
    department: "All"
  },
  departments: seedDepartments,
  roles: seedRoles,
  attendance: seedAttendance,
  activity: seedActivityLogs,
  leaveRequests: seedLeaveRequests,
  payroll: seedPayroll,
  schedule: seedSchedule,
  performance: seedPerformance
};

const EmployeeContext = createContext<EmployeeContextValue | undefined>(undefined);

const employeeReducer = (state: EmployeeState, action: EmployeeAction): EmployeeState => {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        employees: [
          {
            id: crypto.randomUUID?.() ?? `emp-${Date.now()}`,
            ...action.payload
          },
          ...state.employees
        ]
      };
    case "UPDATE":
      return {
        ...state,
        employees: state.employees.map((employee) =>
          employee.id === action.payload.id ? action.payload : employee
        )
      };
    case "REMOVE":
      return {
        ...state,
        employees: state.employees.filter((employee) => employee.id !== action.payload.id)
      };
    case "FILTER":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    case "ADD_DEPARTMENT":
      return {
        ...state,
        departments: [
          {
            id: crypto.randomUUID?.() ?? `dept-${Date.now()}`,
            ...action.payload
          },
          ...state.departments
        ]
      };
    case "ADD_ROLE":
      return {
        ...state,
        roles: [
          {
            id: crypto.randomUUID?.() ?? `role-${Date.now()}`,
            ...action.payload
          },
          ...state.roles
        ]
      };
    case "ASSIGN_ROLE":
      return {
        ...state,
        employees: state.employees.map((employee) =>
          employee.id === action.payload.employeeId
            ? { ...employee, roleId: action.payload.roleId }
            : employee
        )
      };
    case "CLOCK_EVENT":
      return {
        ...state,
        attendance: [action.payload, ...state.attendance]
      };
    case "ADD_ACTIVITY":
      return {
        ...state,
        activity: [action.payload, ...state.activity]
      };
    case "ADD_LEAVE_REQUEST":
      return {
        ...state,
        leaveRequests: [action.payload, ...state.leaveRequests]
      };
    case "UPDATE_LEAVE_STATUS":
      return {
        ...state,
        leaveRequests: state.leaveRequests.map((request) =>
          request.id === action.payload.requestId
            ? { ...request, status: action.payload.status }
            : request
        )
      };
    default:
      return state;
  }
};

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(employeeReducer, initialState);

  const roleMap = useMemo<Record<string, DepartmentRole>>(() => {
    return state.roles.reduce((acc, role) => {
      acc[role.id] = role;
      return acc;
    }, {} as Record<string, DepartmentRole>);
  }, [state.roles]);

  const employeeMap = useMemo<Record<string, Employee>>(() => {
    return state.employees.reduce((acc, employee) => {
      acc[employee.id] = employee;
      return acc;
    }, {} as Record<string, Employee>);
  }, [state.employees]);

  const attendanceSnapshot = useMemo<AttendanceStatusSnapshot>(() => {
    const snapshot: AttendanceStatusSnapshot = {};
    for (const event of state.attendance) {
      if (!snapshot[event.employeeId]) {
        snapshot[event.employeeId] = {
          status: event.type === "CLOCK_IN" ? "IN" : "OUT",
          lastEvent: event
        };
      }
    }
    return snapshot;
  }, [state.attendance]);

  const filteredEmployees = useMemo(() => {
    const { department, status, search } = state.filters;
    return state.employees.filter((employee) => {
      const role = employee.roleId ? roleMap[employee.roleId] : undefined;
      const matchesDepartment = department === "All" || employee.department === department;
      const matchesStatus = status === "All" || employee.status === status;
      const matchesSearch =
        search.trim().length === 0 ||
        employee.name.toLowerCase().includes(search.toLowerCase()) ||
        (role?.title.toLowerCase().includes(search.toLowerCase()) ?? false);
      return matchesDepartment && matchesStatus && matchesSearch;
    });
  }, [state.employees, state.filters, roleMap]);

  const stats = useMemo<EmployeeStats>(() => {
    const active = state.employees.filter((employee) => employee.status === "Active").length;
    const onLeave = state.employees.filter((employee) => employee.status === "On Leave").length;
    const totalSalary = state.employees.reduce((sum, employee) => sum + employee.salary, 0);
    return {
      total: state.employees.length,
      active,
      onLeave,
      avgSalary: state.employees.length ? Math.round(totalSalary / state.employees.length) : 0
    };
  }, [state.employees]);

  const departmentSummaries = useMemo<DepartmentSummary[]>(() => {
    return state.departments.map((dept) => {
      const members = state.employees.filter((employee) => employee.department === dept.name);
      const admins = members.filter((member) => {
        const role = member.roleId ? roleMap[member.roleId] : undefined;
        return role?.permission === "Admin";
      }).length;
      const staff = Math.max(members.length - admins, 0);
      return {
        id: dept.id,
        name: dept.name,
        description: dept.description,
        headcount: members.length,
        admins,
        staff
      };
    });
  }, [state.departments, state.employees, roleMap]);

  const permissionStats = useMemo<PermissionStats>(() => {
    return state.employees.reduce(
      (acc, employee) => {
        const role = employee.roleId ? roleMap[employee.roleId] : undefined;
        if (role?.permission === "Admin") {
          acc.admins += 1;
        } else {
          acc.staff += 1;
        }
        return acc;
      },
      { admins: 0, staff: 0 }
    );
  }, [state.employees, roleMap]);

  const addEmployee = (payload: Omit<Employee, "id">) => dispatch({ type: "ADD", payload });
  const updateEmployee = (payload: Employee) => dispatch({ type: "UPDATE", payload });
  const removeEmployee = (id: string) => dispatch({ type: "REMOVE", payload: { id } });
  const setFilters = (payload: Partial<EmployeeFilters>) => dispatch({ type: "FILTER", payload });
  const addDepartment = (payload: Omit<Department, "id">) =>
    dispatch({ type: "ADD_DEPARTMENT", payload });
  const addRole = (payload: Omit<DepartmentRole, "id">) => dispatch({ type: "ADD_ROLE", payload });
  const assignRoleToEmployee = (payload: { employeeId: string; roleId?: string }) =>
    dispatch({ type: "ASSIGN_ROLE", payload });
  const clockEvent = (payload: { employeeId: string; type: ClockEventType; note?: string }) => {
    const timestamp = new Date().toISOString();
    const event: AttendanceEvent = {
      id: crypto.randomUUID?.() ?? `att-${Date.now()}`,
      employeeId: payload.employeeId,
      type: payload.type,
      note: payload.note?.trim() || undefined,
      timestamp
    };
    dispatch({ type: "CLOCK_EVENT", payload: event });

    const employeeName = employeeMap[payload.employeeId]?.name ?? "Team member";
    const verb = payload.type === "CLOCK_IN" ? "clocked in" : "clocked out";
    const activity: ActivityLog = {
      id: crypto.randomUUID?.() ?? `log-${Date.now()}`,
      title: `${employeeName} ${verb}`,
      detail: payload.note?.trim() || `${employeeName} updated presence`,
      category: "Attendance",
      severity: "info",
      timestamp
    };
    dispatch({ type: "ADD_ACTIVITY", payload: activity });
  };

  const submitLeaveRequest = (payload: {
    employeeId: string;
    startDate: string;
    endDate: string;
    reason: string;
  }) => {
    const timestamp = new Date().toISOString();
    const request: LeaveRequest = {
      id: crypto.randomUUID?.() ?? `leave-${Date.now()}`,
      employeeId: payload.employeeId,
      startDate: payload.startDate,
      endDate: payload.endDate,
      reason: payload.reason,
      status: "Pending",
      requestedAt: timestamp
    };
    dispatch({ type: "ADD_LEAVE_REQUEST", payload: request });

    const employeeName = employeeMap[payload.employeeId]?.name ?? "Team member";
    dispatch({
      type: "ADD_ACTIVITY",
      payload: {
        id: crypto.randomUUID?.() ?? `log-${Date.now() + 1}`,
        title: `${employeeName} submitted leave`,
        detail: `${payload.startDate} → ${payload.endDate}`,
        category: "Leave",
        severity: "warning",
        timestamp
      }
    });
  };

  const updateLeaveRequestStatus = (payload: { requestId: string; status: LeaveStatus }) => {
    dispatch({ type: "UPDATE_LEAVE_STATUS", payload });
    const request = state.leaveRequests.find((item) => item.id === payload.requestId);
    if (!request) {
      return;
    }
    const employeeName = employeeMap[request.employeeId]?.name ?? "Team member";
    dispatch({
      type: "ADD_ACTIVITY",
      payload: {
        id: crypto.randomUUID?.() ?? `log-${Date.now() + 2}`,
        title: `Leave request ${payload.status.toLowerCase()}`,
        detail: `${employeeName} · ${request.startDate} → ${request.endDate}`,
        category: "Leave",
        severity: payload.status === "Approved" ? "info" : "critical",
        timestamp: new Date().toISOString()
      }
    });
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees: state.employees,
        filteredEmployees,
        filters: state.filters,
        stats,
        departments: state.departments,
        roles: state.roles,
        roleMap,
        employeeMap,
        departmentSummaries,
        permissionStats,
        attendanceEvents: state.attendance,
        attendanceSnapshot,
        activityLog: state.activity,
        leaveRequests: state.leaveRequests,
        payrollCycles: state.payroll,
        shiftAssignments: state.schedule,
        performanceReviews: state.performance,
        addEmployee,
        updateEmployee,
        removeEmployee,
        setFilters,
        addDepartment,
        addRole,
        assignRoleToEmployee,
        clockEvent,
        submitLeaveRequest,
        updateLeaveRequestStatus
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployeesContext = () => {
  const ctx = useContext(EmployeeContext);
  if (!ctx) {
    throw new Error("useEmployeesContext must be used inside EmployeeProvider");
  }
  return ctx;
};
