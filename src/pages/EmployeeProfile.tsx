import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Mail, MapPin, Pencil, ShieldCheck, Users } from "lucide-react";
import { useMemo } from "react";
import { useEmployeesContext } from "@/context/EmployeeContext";
import { StatusBadge } from "@/components/common/StatusBadge";

const EmployeeProfile = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const {
    employeeMap,
    roleMap,
    attendanceSnapshot,
    activityLog,
    shiftAssignments,
    performanceReviews
  } = useEmployeesContext();

  const employee = employeeId ? employeeMap[employeeId] : undefined;

  const latestActivity = useMemo(() => {
    if (!employee) return [];
    return activityLog
      .filter((log) => log.detail.includes(employee.name) || log.title.includes(employee.name))
      .slice(0, 4);
  }, [activityLog, employee]);

  const upcomingShift = useMemo(() => {
    if (!employee) return undefined;
    return shiftAssignments
      .filter((shift) => shift.employeeId === employee.id && shift.shiftDate >= new Date().toISOString().split("T")[0])
      .sort((a, b) => a.shiftDate.localeCompare(b.shiftDate))[0];
  }, [shiftAssignments, employee]);

  const review = useMemo(() => {
    if (!employee) return undefined;
    return performanceReviews.find((entry) => entry.employeeId === employee.id);
  }, [performanceReviews, employee]);

  if (!employee) {
    return (
      <section className="space-y-6" aria-live="polite">
        <div className="glass-panel space-y-4 px-6 py-6">
          <p className="text-lg font-semibold text-white">Employee not found</p>
          <p className="text-sm text-slate-400">The requested profile does not exist or was removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-white/20 px-4 py-3 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Go back
          </button>
        </div>
      </section>
    );
  }

  const role = employee.roleId ? roleMap[employee.roleId] : undefined;
  const attendance = attendanceSnapshot[employee.id];

  return (
    <section className="space-y-8" aria-labelledby="profile-heading">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            to="/employees"
            className="inline-flex items-center gap-2 text-sm text-slate-400 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ArrowLeft size={14} aria-hidden="true" /> Back to directory
          </Link>
          <h1 id="profile-heading" className="mt-2 font-display text-4xl text-white">
            {employee.name}
          </h1>
          <p className="text-sm text-slate-400">
            {employee.department} · {role?.title ?? "Role pending"}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <StatusBadge status={employee.status} />
          <Link
            to={`/employees/${employee.id}/edit`}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:border-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Pencil size={16} aria-hidden="true" />
            Edit employee
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel space-y-6 px-6 py-6" aria-labelledby="profile-overview">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-500/20 p-3 text-brand-200">
              <ShieldCheck size={20} aria-hidden="true" />
            </div>
            <div>
              <p className="section-title text-xs text-slate-400">Overview</p>
              <h2 id="profile-overview" className="font-display text-2xl">
                Profile summary
              </h2>
            </div>
          </div>
          <dl className="grid gap-4 md:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Department</dt>
              <dd className="text-lg font-semibold text-white">{employee.department}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Role</dt>
              <dd className="text-lg font-semibold text-white">{role?.title ?? "Unassigned"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Base salary</dt>
              <dd className="text-lg font-semibold text-white">
                ${employee.salary.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Projects</dt>
              <dd className="text-lg font-semibold text-white">{employee.projects}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-4 text-sm text-slate-300" aria-label="Contact information">
            <span className="inline-flex items-center gap-2"><Mail size={14} aria-hidden="true" /> {employee.email}</span>
            <span className="inline-flex items-center gap-2"><MapPin size={14} aria-hidden="true" /> {employee.location}</span>
          </div>
        </div>

        <div className="glass-panel space-y-6 px-6 py-6" aria-labelledby="profile-presence">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-500/20 p-3 text-sky-200">
              <Clock size={20} aria-hidden="true" />
            </div>
            <div>
              <p className="section-title text-xs text-slate-400">Presence</p>
              <h2 id="profile-presence" className="font-display text-2xl">
                Attendance & schedule
              </h2>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Last status</p>
            <p className="text-lg font-semibold text-white">
              {attendance?.status === "IN" ? "Clocked in" : "Clocked out"}
            </p>
            {attendance?.lastEvent && (
              <p className="text-sm text-slate-400">
                {new Date(attendance.lastEvent.timestamp).toLocaleString()} · {attendance.lastEvent.note ?? "No note"}
              </p>
            )}
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Next shift</p>
            {upcomingShift ? (
              <div>
                <p className="text-lg font-semibold text-white">{upcomingShift.shiftType} · {upcomingShift.location}</p>
                <p className="text-sm text-slate-400">{new Date(upcomingShift.shiftDate).toLocaleDateString()}</p>
                <p className="text-xs text-slate-500">{upcomingShift.notes}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-400">No upcoming shifts scheduled.</p>
            )}
          </div>
          {review && (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Last review</p>
              <p className="text-lg font-semibold text-white">{review.rating}</p>
              <p className="text-sm text-slate-400">{review.focus}</p>
              <p className="text-xs text-slate-500">
                Next check-in {new Date(review.nextCheckIn).toLocaleDateString()} with {review.reviewer}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="glass-panel space-y-4 px-6 py-6" aria-labelledby="profile-activity">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-200">
            <Users size={20} aria-hidden="true" />
          </div>
          <div>
            <p className="section-title text-xs text-slate-400">Activity</p>
            <h2 id="profile-activity" className="font-display text-2xl">
              Recent updates
            </h2>
          </div>
        </div>
        <ul className="space-y-4 text-sm" aria-live="polite">
          {latestActivity.length ? (
            latestActivity.map((log) => (
              <li key={log.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <p className="font-medium text-white">{log.title}</p>
                <p className="text-slate-300">{log.detail}</p>
                <p className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</p>
              </li>
            ))
          ) : (
            <li className="rounded-2xl border border-dashed border-white/10 px-4 py-4 text-slate-400">
              No activity recorded for this employee.
            </li>
          )}
        </ul>
      </div>
    </section>
  );
};

export default EmployeeProfile;
