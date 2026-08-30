import { useNavigate } from "react-router-dom";

import { useAuth } from "src/context/auth";
import { LoginScreen } from "src/features/login";
import type { LoginFormData } from "src/features/login";
import { apiClient } from "src/services/api";

type LoginRouteProps = {
  onLoginProfileSync: (data: LoginFormData) => void;
  onPersonPreviewLoad: () => Promise<void>;
};

export function LoginRoute({
  onLoginProfileSync,
  onPersonPreviewLoad,
}: LoginRouteProps) {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data: LoginFormData): Promise<boolean> => {
    const response = await apiClient.login(data);

    if (response.status === "error") {
      return false;
    }

    auth.login(response.data);
    onLoginProfileSync(data);
    await onPersonPreviewLoad();
    navigate("/discover");
    return true;
  };

  return (
    <LoginScreen
      onLogin={handleLogin}
      onRegisterClick={() => navigate("/register")}
    />
  );
}
