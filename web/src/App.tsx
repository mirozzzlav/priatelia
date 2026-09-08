import { AuthProvider } from "src/context/AuthProvider";
import { ChatMatchesProvider } from "src/context/ChatMatchesProvider";
import { AppRoutes } from "src/routes/AppRoutes";

export default function App() {
  return (
    <AuthProvider>
      <ChatMatchesProvider>
        <AppRoutes />
      </ChatMatchesProvider>
    </AuthProvider>
  );
}
