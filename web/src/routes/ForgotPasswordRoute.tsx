import { useNavigate } from "react-router-dom";

import { ForgotPasswordScreen } from "src/features/password-reset";
import type { PasswordResetRequestFormData } from "src/features/password-reset";
import { apiClient } from "src/services/api";
import type { PasswordResetRequestFieldErrors } from "src/services/api";

export function ForgotPasswordRoute() {
  const navigate = useNavigate();

  const handleSubmit = async (
    data: PasswordResetRequestFormData,
  ): Promise<PasswordResetRequestFieldErrors | null> => {
    const response = await apiClient.requestPasswordReset(data);

    if (response.status === "error") {
      return response.data.errors;
    }

    return null;
  };

  return (
    <ForgotPasswordScreen
      onBackToLoginClick={() => navigate("/login")}
      onSubmit={handleSubmit}
    />
  );
}
