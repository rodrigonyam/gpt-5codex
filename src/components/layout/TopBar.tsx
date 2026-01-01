import { Menu, Bell, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface TopBarProps {
  onMenuClick: () => void;
}

export const TopBar = ({ onMenuClick }: TopBarProps) => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-3">
        <button
          className="rounded-full border border-white/20 p-2 text-white lg:hidden"
          onClick={onMenuClick}
          aria-label="Toggle navigation"
        >
          <Menu size={18} />
        </button>
        <div>
          <p className="section-title text-[0.65rem] text-slate-400">Employee Management</p>
          <h1 className="font-display text-2xl tracking-tight">Operational Pulse</h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          className="rounded-full border border-white/20 p-2 text-white transition hover:border-brand-400 hover:text-brand-200"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>
        {user && (
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{user.department}</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${user.avatarGradient}`} />
            <button
              className="rounded-full border border-white/20 p-2 text-white transition hover:border-rose-400 hover:text-rose-200"
              onClick={logout}
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
