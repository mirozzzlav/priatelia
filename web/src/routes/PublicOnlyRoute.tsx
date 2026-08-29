import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "src/context/auth";

type PublicOnlyRouteProps = {
  children: ReactNode;
};

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    return <Navigate to="/discover" replace />;
  }

  return children;
}
