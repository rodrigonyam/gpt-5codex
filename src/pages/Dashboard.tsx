import { useMemo, useId } from "react";
import {
  TrendingUp,
  Users,
  BriefcaseBusiness,
  Building2,
  Activity as ActivityIcon,
  Shield,
  PieChart,
  LineChart
} from "lucide-react";
import { StatsCard } from "@/components/common/StatsCard";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { useEmployeesContext } from "@/context/EmployeeContext";

const severityStyles = {
  info: "border-emerald-500/20 bg-emerald-500/5 text-emerald-100",
  warning: "border-amber-500/20 bg-amber-500/5 text-amber-100",
  critical: "border-rose-500/20 bg-rose-500/5 text-rose-100"
};

const categoryAccent = {
  Attendance: "text-emerald-200",
  Leave: "text-amber-200",
  System: "text-sky-200"
};

const statusPalette = {
  Active: "#34d399",
  "On Leave": "#fbbf24",
  Inactive: "#94a3b8"
};

const Dashboard = () => {
  const {
    employees,
    stats,
    departmentSummaries,
    activityLog,
    permissionStats,
    attendanceEvents
  } = useEmployeesContext();

  const sparklineGradientId = `sparkline-${useId().replace(/:/g, "")}`;

  const engagementRate = stats.total ? Math.round((stats.active / stats.total) * 100) : 0;
  const topDepartments = useMemo(
    () => [...departmentSummaries].sort((a, b) => b.headcount - a.headcount).slice(0, 5),
    [departmentSummaries]
  );
  const latestActivity = activityLog.slice(0, 6);

  const statusDistribution = useMemo(() => {
    const counts = employees.reduce(
      (acc, employee) => {
        acc[employee.status] = (acc[employee.status] ?? 0) + 1;
        return acc;
      },
      { Active: 0, "On Leave": 0, Inactive: 0 } as Record<string, number>
    );
    return [
      { label: "Active", value: counts.Active, color: statusPalette.Active },
      { label: "On Leave", value: counts["On Leave"], color: statusPalette["On Leave"] },
      { label: "Inactive", value: counts.Inactive, color: statusPalette.Inactive }
    ];
  }, [employees]);

  const statusTotal = statusDistribution.reduce((sum, entry) => sum + entry.value, 0) || 1;
  const donutRadius = 48;
  const donutCircumference = 2 * Math.PI * donutRadius;

  const weeklyPresence = useMemo(() => {
    const dateTotals = attendanceEvents.reduce((acc, event) => {
      const dateKey = new Date(event.timestamp).toISOString().split("T")[0];
      acc.set(dateKey, (acc.get(dateKey) ?? 0) + 1);
      return acc;
    }, new Map<string, number>());

    if (dateTotals.size === 0) {
      return Array.from({ length: 7 }).map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - index));
        return {
          date: date.toISOString().split("T")[0],
          label: date.toLocaleDateString(undefined, { weekday: "short" }),
          value: 0
        };
      });
    }

    const sortedDates = Array.from(dateTotals.keys()).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    let windowDates = sortedDates.slice(-7);
    while (windowDates.length < 7) {
      const previous = new Date(windowDates[0]);
      previous.setDate(previous.getDate() - 1);
      windowDates = [previous.toISOString().split("T")[0], ...windowDates];
    }

    return windowDates.map((date) => ({
      date,
      label: new Date(date).toLocaleDateString(undefined, { weekday: "short" }),
      value: dateTotals.get(date) ?? 0
    }));
  }, [attendanceEvents]);

  const maxPresence = Math.max(...weeklyPresence.map((entry) => entry.value), 1);
  const sparklineCoordinates = weeklyPresence.map((entry, index) => {
    const relativeX = weeklyPresence.length > 1 ? index / (weeklyPresence.length - 1) : 0.5;
    return {
      ...entry,
      x: relativeX * 100,
      y: 90 - (entry.value / maxPresence) * 70
    };
  });

  const sparklinePointString = sparklineCoordinates.length
    ? sparklineCoordinates.length > 1
      ? sparklineCoordinates.map((point) => `${point.x},${point.y}`).join(" ")
      : `0,${sparklineCoordinates[0].y} 100,${sparklineCoordinates[0].y}`
    : "0,90 100,90";

  const totalPresence = weeklyPresence.reduce((sum, entry) => sum + entry.value, 0);
  const averagePresence = weeklyPresence.length
    ? Math.round(totalPresence / weeklyPresence.length)
    : 0;
  const latestPresence = weeklyPresence.at(-1)?.value ?? 0;

  const formatTimestamp = (timestamp: string) =>
    new Date(timestamp).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

  return (
    <section className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Headcount"
          value={`${stats.total}`}
          helper={`${stats.active} active / ${stats.onLeave} on leave`}
          icon={<Users size={28} />}
        />
        <StatsCard
          label="Departments"
          value={`${departmentSummaries.length}`}
          helper="Active org units"
          icon={<Building2 size={28} />}
          accent="secondary"
        />
        <StatsCard
          label="Avg. Compensation"
          value={`$${stats.avgSalary.toLocaleString()}`}
          helper="Across all roles"
          icon={<BriefcaseBusiness size={28} />}
        />
        <StatsCard
          label="Engagement"
          value={`${engagementRate}%`}
          helper="Share of active team"
          icon={<TrendingUp size={28} />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="glass-panel space-y-6 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-title text-xs text-slate-400">Health</p>
              <h2 className="font-display text-2xl">Team Status</h2>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-200">
              <PieChart size={16} aria-hidden="true" />
            </div>
          </div>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="mx-auto flex items-center justify-center">
              <svg
                viewBox="0 0 140 140"
                className="h-40 w-40"
                role="img"
                aria-label="Employee status distribution"
              >
                <circle
                  cx="70"
                  cy="70"
                  r={donutRadius}
                  stroke="rgba(148,163,184,0.25)"
                  strokeWidth="12"
                  fill="transparent"
                />
                {(() => {
                  let offset = 0;
                  return statusDistribution.map((segment) => {
                    if (!segment.value) {
                      return null;
                    }
                    const segmentLength = (segment.value / statusTotal) * donutCircumference;
                    const circle = (
                      <circle
                        key={segment.label}
                        cx="70"
                        cy="70"
                        r={donutRadius}
                        fill="transparent"
                        stroke={segment.color}
                        strokeWidth="12"
                        strokeDasharray={`${segmentLength} ${donutCircumference}`}
                        strokeDashoffset={-offset}
                        strokeLinecap="round"
                        transform="rotate(-90 70 70)"
                      />
                    );
                    offset += segmentLength;
                    return circle;
                  });
                })()}
                <text x="50%" y="52%" textAnchor="middle" className="font-display text-3xl fill-white">
                  {statusTotal}
                </text>
                <text x="50%" y="63%" textAnchor="middle" className="text-xs fill-slate-400">
                  People tracked
                </text>
              </svg>
            </div>
            <ul className="flex-1 space-y-3 text-sm">
              {statusDistribution.map((segment) => {
                const share = statusTotal ? Math.round((segment.value / statusTotal) * 100) : 0;
                return (
                  <li key={segment.label} className="rounded-2xl border border-white/10 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: segment.color }}
                          aria-hidden="true"
                        />
                        <p className="text-slate-200">{segment.label}</p>
                      </div>
                      <span className="text-sm font-semibold text-white">{segment.value}</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/10" aria-hidden="true">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-400 via-brand-300 to-brand-200"
                        style={{ width: `${Math.max(share, 4)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{share}% of workforce</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="glass-panel space-y-6 px-6 py-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-title text-xs text-slate-400">Presence</p>
              <h2 className="font-display text-2xl">7-Day Check-in Trend</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
              <LineChart size={14} aria-hidden="true" />
              <span>{totalPresence} events</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="relative h-48 w-full">
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full"
                role="img"
                aria-label="Line chart representing weekly attendance"
              >
                <defs>
                  <linearGradient id={sparklineGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="none"
                  stroke={`url(#${sparklineGradientId})`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  points={sparklinePointString}
                />
                {sparklineCoordinates.map((point) => (
                  <circle
                    key={point.date}
                    cx={point.x}
                    cy={point.y}
                    r={1.8}
                    fill="#38bdf8"
                    stroke="#0f172a"
                    strokeWidth={0.4}
                  />
                ))}
              </svg>
            </div>
            <div className="grid gap-3 rounded-2xl border border-white/5 bg-slate-900/40 px-4 py-3 text-center sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Avg / Day</p>
                <p className="mt-1 text-2xl font-semibold text-white">{averagePresence}</p>
                <p className="text-xs text-slate-500">Clock-ins</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Latest</p>
                <p className="mt-1 text-2xl font-semibold text-white">{latestPresence}</p>
                <p className="text-xs text-slate-500">Most recent day</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">7-Day Total</p>
                <p className="mt-1 text-2xl font-semibold text-white">{totalPresence}</p>
                <p className="text-xs text-slate-500">Presence pulses</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              {weeklyPresence.map((entry) => (
                <span key={entry.date}>{entry.label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="glass-panel space-y-6 px-6 py-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-title text-xs text-slate-400">Org Distribution</p>
              <h2 className="font-display text-2xl">Department Breakdown</h2>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">
              {departmentSummaries.length} teams
            </span>
          </div>
          <ul className="space-y-4">
            {topDepartments.length ? (
              topDepartments.map((dept) => {
                const share = stats.total ? Math.round((dept.headcount / stats.total) * 100) : 0;
                return (
                  <li
                    key={dept.id}
                    className="rounded-2xl border border-white/5 bg-white/5 px-4 py-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{dept.name}</p>
                        <p className="text-lg font-semibold text-white">{dept.headcount} people</p>
                      </div>
                      <span className="text-sm font-semibold text-slate-300">{share}%</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-400 via-brand-300 to-brand-200"
                        style={{ width: `${Math.max(share, 4)}%` }}
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                      <span>{dept.admins} leads</span>
                      <span>{dept.staff} individual contributors</span>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="rounded-2xl border border-white/5 bg-white/5 px-4 py-4 text-sm text-slate-400">
                No departments available yet.
              </li>
            )}
          </ul>
        </div>

        <div className="glass-panel space-y-6 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-title text-xs text-slate-400">Flow</p>
              <h2 className="font-display text-2xl">Recent Activity</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
              <ActivityIcon size={14} />
              <span>{latestActivity.length} updates</span>
            </div>
          </div>
          <ul className="space-y-4 text-sm">
            {latestActivity.length ? (
              latestActivity.map((log) => {
                const accentClass =
                  categoryAccent[log.category as keyof typeof categoryAccent] ?? "text-slate-200";
                return (
                  <li
                    key={log.id}
                    className={`rounded-2xl border px-4 py-4 ${severityStyles[log.severity]}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white">{log.title}</p>
                      <span className={`text-xs uppercase tracking-[0.3em] ${accentClass}`}>
                        {log.category}
                      </span>
                    </div>
                    <p className="mt-1 text-slate-200">{log.detail}</p>
                    <p className="mt-2 text-xs text-slate-400">{formatTimestamp(log.timestamp)}</p>
                  </li>
                );
              })
            ) : (
              <li className="rounded-2xl border border-white/5 bg-white/5 px-4 py-4 text-sm text-slate-400">
                No activity logged yet.
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <EmployeeForm />
        <div className="glass-panel space-y-6 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-500/20 p-3 text-brand-200">
              <Shield size={20} />
            </div>
            <div>
              <p className="section-title text-xs text-slate-400">Coverage</p>
              <h2 className="font-display text-xl">People Ops Control</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Admins</p>
              <p className="mt-2 text-3xl font-semibold text-white">{permissionStats.admins}</p>
              <p className="text-xs text-slate-500">Role owners</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Staff</p>
              <p className="mt-2 text-3xl font-semibold text-white">{permissionStats.staff}</p>
              <p className="text-xs text-slate-500">IC permissions</p>
            </div>
          </div>
          <p className="text-sm text-slate-400">
            Use the panel on the left to onboard new employees. Coverage metrics help ensure sensitive workflows always have an accountable owner.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
