import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { CenteredStatusLayout } from "src/components/layouts";
import { LoadingPill } from "src/components/LoadingPill";
import { useAuth } from "src/context/auth";
import { InfoScreen } from "src/features/info";
import { ResetPasswordScreen } from "src/features/password-reset";
import type { PasswordResetConfirmFormData } from "src/features/password-reset";
import { apiClient } from "src/services/api";
import type { PasswordResetConfirmFieldErrors } from "src/services/api";

export function ResetPasswordRoute() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [nickname, setNickname] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(true);

  useEffect(() => {
    let isActive = true;

    apiClient
      .getPasswordResetDetail(token)
      .then((response) => {
        if (!isActive) {
          return;
        }

        if (response.status === "error") {
          setTokenError(
            response.data.errors.token ?? "Link na obnovu hesla nie je platný.",
          );
          return;
        }

        setNickname(response.data.nickname);
      })
      .catch(() => {
        if (isActive) {
          setTokenError("Link na obnovu hesla sa nepodarilo overiť.");
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingDetail(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [token]);

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

  if (isLoadingDetail) {
    return (
      <CenteredStatusLayout minH="calc(100vh - 64px)">
        <LoadingPill text="Overujem link na obnovu hesla." />
      </CenteredStatusLayout>
    );
  }

  if (tokenError || !nickname) {
    return (
      <InfoScreen
        actionLabel="Späť na prihlásenie"
        message={tokenError ?? "Link na obnovu hesla nie je platný."}
        onActionClick={() => navigate("/login")}
        title="Obnova hesla zlyhala"
        variant="error"
      />
    );
  }

  return (
    <ResetPasswordScreen
      nickname={nickname}
      onBackToLoginClick={() => navigate("/login")}
      onSubmit={handleSubmit}
    />
  );
}
