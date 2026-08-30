import { useMemo, useState, type ReactNode } from "react";

import { AuthContext } from "src/context/auth";
import type { UserSession } from "src/services/api";
import {
  clearStoredSession,
  getStoredSession,
  storeSession,
} from "src/services/api/sessionStorage";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<UserSession | null>(getStoredSession);

  const login = (nextSession: UserSession) => {
    storeSession(nextSession);
    setSession(nextSession);
  };

  const logout = () => {
    clearStoredSession();
    setSession(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(session),
      login,
      logout,
      session,
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
