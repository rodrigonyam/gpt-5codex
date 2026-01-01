import { ReactNode } from "react";

interface StatsCardProps {
  label: string;
  value: string;
  helper?: string;
  icon: ReactNode;
  accent?: "primary" | "secondary";
}

export const StatsCard = ({ label, value, helper, icon, accent = "primary" }: StatsCardProps) => (
  <div
    className={`glass-panel flex flex-col gap-6 px-6 py-6 transition hover:translate-y-[-2px] ${
      accent === "primary" ? "bg-gradient-to-br from-brand-500/15 to-slate-900/60" : ""
    }`}
  >
    <div className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-slate-400">
      <span>{label}</span>
      <span className="text-xs text-slate-500">Now</span>
    </div>
    <div className="flex items-end justify-between">
      <div>
        <p className="font-display text-4xl tracking-tight">{value}</p>
        {helper && <p className="text-sm text-slate-400">{helper}</p>}
      </div>
      <div className="rounded-2xl bg-white/10 p-3 text-brand-200">{icon}</div>
    </div>
  </div>
);
