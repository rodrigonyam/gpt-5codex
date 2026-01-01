import { Fragment } from "react";
import { NavLink } from "react-router-dom";
import { UsersRound, LayoutGrid, ShieldCheck, X, CalendarCheck2 } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Pulse", to: "/", icon: LayoutGrid, roles: ["admin", "hr", "manager", "employee"] },
  { label: "People", to: "/employees", icon: UsersRound, roles: ["admin", "hr", "manager"] },
  { label: "Operations", to: "/operations", icon: CalendarCheck2, roles: ["admin", "hr", "manager"] },
  { label: "Departments", to: "/departments", icon: ShieldCheck, roles: ["admin", "hr"] }
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user } = useAuth();

  return (
    <Fragment>
      <div
        className={clsx("fixed inset-y-0 left-0 z-40 w-72 transition-transform duration-300", {
          "translate-x-0": isOpen,
          "-translate-x-full lg:translate-x-0": !isOpen
        })}
      >
        <div className="glass-panel h-full px-6 py-10 flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-slate-400">Astrion</p>
              <p className="font-display text-2xl tracking-tight">PeopleOS</p>
            </div>
            <button
              className="lg:hidden rounded-full border border-slate-700/70 p-2"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          </div>
          <nav className="flex flex-col gap-4">
            {navItems
              .filter((item) => (user ? item.roles.includes(user.role) : false))
              .map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      "group flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-medium transition",
                      isActive
                        ? "bg-gradient-to-r from-brand-500/30 to-brand-300/20 text-white"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )
                  }
                  onClick={onClose}
                >
                  <item.icon size={18} className="text-brand-300" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
          </nav>
          {user && (
            <div className="mt-auto space-y-2 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-xs text-slate-400">
              <p className="text-slate-200">Signed in as</p>
              <p className="text-base font-semibold text-white">{user.name}</p>
              <p className="uppercase tracking-[0.4em] text-[0.6rem] text-slate-400">{user.role}</p>
            </div>
          )}
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-slate-900/70 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}
    </Fragment>
  );
};
