import { Box } from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";

import { TopBar } from "src/components/TopBar";
import { useAuth } from "src/context/auth";

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
        onLogout={handleLogout}
        onMessagesClick={() => navigate("/messages")}
        onProfileClick={() => navigate("/profile")}
      />
      <Outlet />
    </Box>
  );
}
