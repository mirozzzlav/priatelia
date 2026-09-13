import { Box } from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";

import { TopBar } from "src/components/TopBar";
import { useAuth } from "src/context/auth";
import { ClientConfigProvider } from "src/context/ClientConfigProvider";

type AppLayoutProps = {
  onLogout: () => void;
};

const styles = {
  app: {
    w: "min(100%, 460px)",
    minH: "100vh",
    mx: "auto",
    bg: "app.white",
  },
} as const;

export function AppLayout({ onLogout }: AppLayoutProps) {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    onLogout();
    navigate("/login");
  };

  return (
    <Box {...styles.app}>
      <TopBar
        isAuthenticated={auth.isAuthenticated}
        onConnectionsClick={() => navigate("/connections")}
        onLogout={handleLogout}
        onDiscoverClick={() => navigate("/discover")}
        onMessagesClick={() => navigate("/messages")}
        onProfileClick={() => navigate("/profile")}
      />
      <ClientConfigProvider>
        <Outlet />
      </ClientConfigProvider>
    </Box>
  );
}
