import { useNavigate } from "react-router-dom";

import { RegistrationScreen } from "src/features/registration";
import type { RegistrationFormData } from "src/features/registration";
import { apiClient, type RegistrationFieldErrors } from "src/services/api";

type RegistrationRouteProps = {
  onRegisteredProfileSync: (data: RegistrationFormData) => void;
};

export function RegistrationRoute({
  onRegisteredProfileSync,
}: RegistrationRouteProps) {
  const navigate = useNavigate();

  const handleRegister = async (
    data: RegistrationFormData,
  ): Promise<RegistrationFieldErrors | null> => {
    const response = await apiClient.register(data);

    if (response.status === "error") {
      return response.data.errors;
    }

    onRegisteredProfileSync(data);
    navigate("/activation-sent");
    return null;
  };

  return (
    <RegistrationScreen
      onLoginClick={() => navigate("/login")}
      onRegister={handleRegister}
    />
  );
}
