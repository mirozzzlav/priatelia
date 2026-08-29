import { useNavigate } from "react-router-dom";

import { PasswordSettingsScreen } from "src/features/profile";
import {
  apiClient,
  type PasswordFieldErrors,
  type PasswordFormData,
} from "src/services/api";

type PasswordRouteProps = {
  onSave: () => void;
};

export function PasswordRoute({ onSave }: PasswordRouteProps) {
  const navigate = useNavigate();

  const handleSave = async (
    data: PasswordFormData,
  ): Promise<PasswordFieldErrors | null> => {
    const response = await apiClient.updatePassword(data);

    if (response.status === "error") {
      return response.data.errors;
    }

    onSave();
    return null;
  };

  return (
    <PasswordSettingsScreen
      onBack={() => navigate("/profile")}
      onSave={handleSave}
    />
  );
}
