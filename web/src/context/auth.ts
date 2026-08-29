import { createContext, useContext } from "react";

import type { UserSession } from "src/services/api";

export type AuthContextValue = {
  isAuthenticated: boolean;
  login: (session: UserSession) => void;
  logout: () => void;
  session: UserSession | null;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return auth;
}
