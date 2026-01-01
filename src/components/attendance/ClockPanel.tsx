import { useMemo, useState } from "react";
import { Clock3, Power, CheckCircle2 } from "lucide-react";
import { useEmployeesContext } from "@/context/EmployeeContext";

export const ClockPanel = () => {
  const { employees, attendanceEvents, attendanceSnapshot, clockEvent } = useEmployeesContext();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(employees[0]?.id ?? "");
  const [note, setNote] = useState("");

  const eventsForEmployee = useMemo(() => {
    return attendanceEvents.filter((event) => event.employeeId === selectedEmployeeId).slice(0, 5);
  }, [attendanceEvents, selectedEmployeeId]);

  const currentStatus = attendanceSnapshot[selectedEmployeeId]?.status ?? "OUT";
  const isClockedIn = currentStatus === "IN";

  const handleClock = (type: "CLOCK_IN" | "CLOCK_OUT") => {
    if (!selectedEmployeeId) {
      return;
    }
    clockEvent({ employeeId: selectedEmployeeId, type, note });
    setNote("");
  };

  return (
    <div className="glass-panel space-y-4 px-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="section-title text-xs text-slate-400">Attendance</p>
          <h3 className="font-display text-2xl">Clock-in control</h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isClockedIn ? "bg-emerald-500/20 text-emerald-200" : "bg-rose-500/20 text-rose-200"
          }`}
        >
          {isClockedIn ? "Clocked In" : "Clocked Out"}
        </span>
      </div>
      <label className="space-y-2 text-sm">
        <span className="text-slate-400">Select team member</span>
        <select
          value={selectedEmployeeId}
          onChange={(event) => setSelectedEmployeeId(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-brand-400 focus:outline-none"
        >
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id} className="text-slate-900">
              {employee.name} · {employee.department}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-2 text-sm">
        <span className="text-slate-400">Note</span>
        <input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Optional context (location, intention, etc.)"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-brand-400 focus:outline-none"
        />
      </label>
      <div className="flex flex-col gap-3 md:flex-row">
        <button
          type="button"
          onClick={() => handleClock("CLOCK_IN")}
          className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white disabled:opacity-40"
          disabled={isClockedIn}
        >
          <div className="flex items-center justify-center gap-2">
            <Clock3 size={16} />
            <span>Clock In</span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => handleClock("CLOCK_OUT")}
          className="flex-1 rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white disabled:opacity-40"
          disabled={!isClockedIn}
        >
          <div className="flex items-center justify-center gap-2">
            <Power size={16} />
            <span>Clock Out</span>
          </div>
        </button>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Recent events</p>
        {eventsForEmployee.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No attendance records yet.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {eventsForEmployee.map((event) => (
              <li key={event.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="font-semibold">
                    {event.type === "CLOCK_IN" ? "Clocked in" : "Clocked out"}
                  </p>
                  {event.note && <p className="text-xs text-slate-500">{event.note}</p>}
                </div>
                <div className="text-right text-xs text-slate-400">
                  <p>{new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                  <p>{new Date(event.timestamp).toLocaleDateString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {attendanceSnapshot[selectedEmployeeId]?.lastEvent && (() => {
        const lastEvent = attendanceSnapshot[selectedEmployeeId]!.lastEvent!;
        return (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-100">
            <CheckCircle2 size={16} />
            <span>
              Last event at {new Date(lastEvent.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        );
      })()}
    </div>
  );
};
