import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "src/context/auth";

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
