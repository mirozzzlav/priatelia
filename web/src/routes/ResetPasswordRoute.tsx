import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "src/context/auth";
import { ResetPasswordScreen } from "src/features/password-reset";
import type { PasswordResetConfirmFormData } from "src/features/password-reset";
import { apiClient } from "src/services/api";
import type { PasswordResetConfirmFieldErrors } from "src/services/api";

export function ResetPasswordRoute() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (
    data: PasswordResetConfirmFormData,
  ): Promise<PasswordResetConfirmFieldErrors | null> => {
    const response = await apiClient.resetPassword(token, data);

    if (response.status === "error") {
      return response.data.errors;
    }

    login(response.data);
    navigate("/discover");
    return null;
  };

  return (
    <ResetPasswordScreen
      onBackToLoginClick={() => navigate("/login")}
      onSubmit={handleSubmit}
    />
  );
}
