import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticating, user } = useAuth();
  const [email, setEmail] = useState("aria@astrion.io");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: string })?.from ?? "/";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to login");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-16">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-slate-900/70 p-10 shadow-2xl backdrop-blur-xl">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-slate-400">Astrion</p>
          <h1 id="login-heading" className="font-display text-3xl text-white">
            PeopleOS Access
          </h1>
          <p className="text-sm text-slate-400">Sign in with your workspace credentials</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit} aria-labelledby="login-heading">
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs uppercase tracking-[0.4em] text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/20 bg-slate-900/60 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-brand-200 focus:ring-2 focus:ring-brand-400"
              placeholder="you@astrion.io"
              autoComplete="email"
              inputMode="email"
              required
              aria-required="true"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-xs uppercase tracking-[0.4em] text-slate-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/20 bg-slate-900/60 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-brand-200 focus:ring-2 focus:ring-brand-400"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              aria-required="true"
            />
          </div>
          {error && (
            <p
              role="alert"
              aria-live="assertive"
              className="rounded-2xl border border-rose-500/60 bg-rose-500/15 px-4 py-3 text-sm text-rose-100"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isAuthenticating}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-300 px-4 py-4 text-base font-semibold text-white shadow-lg transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
            aria-busy={isAuthenticating}
          >
            <LogIn size={18} />
            {isAuthenticating ? "Authenticating..." : "Sign in"}
          </button>
          <p className="text-center text-xs text-slate-400" id="login-help-text">
            Admin: aria@astrion.io / admin123 · Manager: marcus@astrion.io / lead123
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
