import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { AuthContext } from "src/context/auth";
import type { UserSession } from "src/services/api";
import {
  clearStoredSession,
  getStoredSession,
  sessionExpiredEvent,
  storeSession,
} from "src/services/api/sessionStorage";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<UserSession | null>(getStoredSession);

  const login = useCallback((nextSession: UserSession) => {
    storeSession(nextSession);
    setSession(nextSession);
  }, []);

  const logout = useCallback(() => {
    clearStoredSession();
    setSession(null);
  }, []);

  useEffect(() => {
    window.addEventListener(sessionExpiredEvent, logout);

    return () => {
      window.removeEventListener(sessionExpiredEvent, logout);
    };
  }, [logout]);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(session),
      login,
      logout,
      session,
    }),
    [login, logout, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
