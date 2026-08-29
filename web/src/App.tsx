import { AuthProvider } from "src/context/AuthProvider";
import { AppRoutes } from "src/routes/AppRoutes";

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
