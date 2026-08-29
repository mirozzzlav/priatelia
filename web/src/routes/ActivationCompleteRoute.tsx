import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "src/context/auth";
import { InfoScreen } from "src/features/info";
import { apiClient } from "src/services/api";

export function ActivationCompleteRoute() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isActivating, setIsActivating] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const activateAccount = async () => {
      try {
        const session = await apiClient.activateAccount(
          searchParams.get("token"),
        );

        if (isMounted) {
          login(session);
        }
      } catch {
        if (isMounted) {
          setError("Aktiváciu účtu sa nepodarilo dokončiť.");
        }
      } finally {
        if (isMounted) {
          setIsActivating(false);
        }
      }
    };

    void activateAccount();

    return () => {
      isMounted = false;
    };
  }, [login, searchParams]);

  if (isActivating) {
    return (
      <InfoScreen
        variant="info"
        title="Aktivujem účet"
        message="Dokončujeme aktiváciu účtu a pripravujeme tvoje prihlásenie."
      />
    );
  }

  if (error) {
    return (
      <InfoScreen variant="error" title="Aktivácia zlyhala" message={error} />
    );
  }

  return (
    <InfoScreen
      variant="success"
      title="Účet bol aktivovaný"
      message="Tvoj účet je aktívny a môžeš začať objavovať nových ľudí."
      actionLabel="Začni objavovať"
      onActionClick={() => navigate("/discover")}
    />
  );
}
