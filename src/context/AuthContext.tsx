import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { AuthUser, UserRole } from "@/types/auth";
import { seedUsers } from "@/data/seedUsers";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticating: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "peopleos:auth-user";

interface AuthProviderProps {
  children: ReactNode;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const login = useCallback(async (rawEmail: string, password: string) => {
    const email = rawEmail.trim().toLowerCase();
    setIsAuthenticating(true);
    await sleep(500);

    const account = seedUsers.find((userAccount) => userAccount.email === email);
    if (!account || account.password !== password) {
      setIsAuthenticating(false);
      throw new Error("Invalid email or password");
    }

    const { password: _password, ...publicProfile } = account;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(publicProfile));
    setUser(publicProfile);
    setIsAuthenticating(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (roles: UserRole | UserRole[]) => {
      if (!user) return false;
      const roleList = Array.isArray(roles) ? roles : [roles];
      return roleList.includes(user.role);
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticating,
      login,
      logout,
      hasRole
    }),
    [user, isAuthenticating, login, logout, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
