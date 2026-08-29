import { useMemo, useState, type ReactNode } from "react";

import { AuthContext } from "src/context/auth";
import type { UserSession } from "src/services/api";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<UserSession | null>(null);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(session),
      login: setSession,
      logout: () => setSession(null),
      session,
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
