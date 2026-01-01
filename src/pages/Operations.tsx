import {
  CalendarClock,
  ClipboardCheck,
  LayoutList,
  Target,
  Wallet,
  Workflow
} from "lucide-react";
import { StatsCard } from "@/components/common/StatsCard";
import { useEmployeesContext } from "@/context/EmployeeContext";
import { PayrollStatus, ReviewRating, ShiftAssignment } from "@/types/operations";

const payrollStatusStyles: Record<PayrollStatus, string> = {
  Draft: "bg-slate-500/20 text-slate-100 border border-slate-500/40",
  Processing: "bg-amber-500/15 text-amber-100 border border-amber-500/40",
  Approved: "bg-sky-500/15 text-sky-100 border border-sky-500/40",
  Paid: "bg-emerald-500/15 text-emerald-100 border border-emerald-500/40"
};

const ratingPills: Record<ReviewRating, string> = {
  Exceeds: "border-emerald-400/60 text-emerald-100",
  Strong: "border-sky-400/60 text-sky-100",
  Solid: "border-amber-400/60 text-amber-100",
  Developing: "border-rose-400/60 text-rose-100"
};

const shiftAccent = {
  Morning: "from-amber-300/20 via-rose-300/10",
  Midday: "from-sky-300/20 via-cyan-300/10",
  Evening: "from-violet-300/20 via-indigo-300/10",
  Night: "from-slate-300/20 via-slate-500/20"
};

const currency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    value
  );

const formatDate = (value: string, withTime = false) =>
  new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {})
  });

const isUpcomingShift = (shift: ShiftAssignment) => {
  const today = new Date().toISOString().split("T")[0];
  return shift.shiftDate >= today;
};

const Operations = () => {
  const {
    payrollCycles,
    shiftAssignments,
    performanceReviews,
    activityLog,
    employeeMap
  } = useEmployeesContext();

  const sortedPayroll = [...payrollCycles].sort((a, b) => a.payoutDate.localeCompare(b.payoutDate));
  const nextPayroll = sortedPayroll.find((cycle) => cycle.status !== "Paid") ?? sortedPayroll[0];
  const ytdNet = payrollCycles
    .filter((cycle) => new Date(cycle.periodEnd).getFullYear() === new Date().getFullYear())
    .reduce((sum, cycle) => sum + cycle.totalNet, 0);

  const futureShifts = shiftAssignments.filter(isUpcomingShift).sort((a, b) => a.shiftDate.localeCompare(b.shiftDate));
  const nextShifts = futureShifts.slice(0, 5);
  const activeReviews = [...performanceReviews].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  const payrollActivity = activityLog.find((log) => log.category === "System") ?? activityLog[0];

  return (
    <section className="space-y-10">
      <div className="grid gap-6 xl:grid-cols-5">
        <StatsCard
          label="Next Payroll"
          value={nextPayroll ? `${nextPayroll.label}` : "No cycles"}
          helper={nextPayroll ? `${currency(nextPayroll.totalNet)} net` : "Add a payroll cycle"}
          icon={<Wallet size={26} />}
        />
        <StatsCard
          label="YTD Net Pay"
          value={currency(ytdNet)}
          helper="All teams"
          icon={<Workflow size={26} />}
        />
        <StatsCard
          label="Scheduled Shifts"
          value={`${futureShifts.length}`}
          helper="Next 7 days"
          icon={<CalendarClock size={26} />}
          accent="secondary"
        />
        <StatsCard
          label="Performance Reviews"
          value={`${performanceReviews.length}`}
          helper="Last quarter"
          icon={<ClipboardCheck size={26} />}
        />
        <StatsCard
          label="Ops Alerts"
          value={payrollActivity ? payrollActivity.title : "Clear"}
          helper={payrollActivity ? formatDate(payrollActivity.timestamp, true) : "No alerts"}
          icon={<LayoutList size={26} />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel space-y-6 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-title text-xs text-slate-400">Payroll</p>
              <h2 className="font-display text-2xl">Cycle Timeline</h2>
            </div>
            {nextPayroll && (
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${payrollStatusStyles[nextPayroll.status]}`}>
                {nextPayroll.status}
              </span>
            )}
          </div>
          <ul className="space-y-4">
            {sortedPayroll.map((cycle) => (
              <li
                key={cycle.id}
                className="rounded-2xl border border-white/5 bg-white/5 px-4 py-4 transition hover:border-brand-400/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{cycle.label}</p>
                    <p className="text-lg font-semibold text-white">{currency(cycle.totalGross)} gross</p>
                  </div>
                  <span className={`text-xs rounded-full px-3 py-1 ${payrollStatusStyles[cycle.status]}`}>
                    {cycle.status}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-400">
                  <div>
                    <p>Cut-off</p>
                    <p className="font-semibold text-slate-200">{formatDate(cycle.cutOffDate)}</p>
                  </div>
                  <div>
                    <p>Payout</p>
                    <p className="font-semibold text-slate-200">{formatDate(cycle.payoutDate)}</p>
                  </div>
                  <div>
                    <p>Net</p>
                    <p className="font-semibold text-slate-200">{currency(cycle.totalNet)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel space-y-6 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-title text-xs text-slate-400">Scheduling</p>
              <h2 className="font-display text-2xl">Shift Coordination</h2>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
              {futureShifts.length} upcoming
            </span>
          </div>
          <ul className="space-y-4">
            {nextShifts.length ? (
              nextShifts.map((shift) => {
                const member = employeeMap[shift.employeeId];
                return (
                  <li
                    key={shift.id}
                    className={`rounded-2xl border border-white/10 bg-gradient-to-r px-4 py-4 ${shiftAccent[shift.shiftType]}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-200">{formatDate(shift.shiftDate)}</p>
                        <p className="text-lg font-semibold text-white">{member?.name ?? "Unassigned"}</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-100">{shift.shiftType} shift</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-100">
                      <span>{shift.location}</span>
                      <span>{shift.notes}</span>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="rounded-2xl border border-white/5 bg-white/5 px-4 py-4 text-sm text-slate-400">
                No upcoming shifts scheduled.
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="glass-panel space-y-6 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-title text-xs text-slate-400">Performance</p>
            <h2 className="font-display text-2xl">Review Pulse</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
            <Target size={14} />
            <span>{activeReviews.length} submissions</span>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {activeReviews.length ? (
            activeReviews.map((review) => {
              const member = employeeMap[review.employeeId];
              return (
                <div key={review.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{member?.department}</p>
                      <p className="text-lg font-semibold text-white">{member?.name}</p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${ratingPills[review.rating]}`}>
                      {review.rating}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{review.focus}</p>
                  <ul className="mt-3 space-y-1 text-xs text-slate-400">
                    {review.highlights.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">
                    <span>Reviewer · {review.reviewer}</span>
                    <span>Next {formatDate(review.nextCheckIn)}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="rounded-2xl border border-white/5 bg-white/5 px-4 py-4 text-sm text-slate-400">
              No performance reviews recorded.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Operations;
