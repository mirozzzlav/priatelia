import { useEffect, useMemo, useState, type ReactNode } from "react";

import {
  ClientConfigContext,
  type ClientConfigContextValue,
} from "src/context/clientConfig";
import { CenteredStatusLayout } from "src/components/layouts";
import { InfoScreen } from "src/features/info";
import { LoadingPill } from "src/components/LoadingPill";
import { apiClient, type ClientConfig } from "src/services/api";

type ClientConfigProviderProps = {
  children: ReactNode;
};

export function ClientConfigProvider({ children }: ClientConfigProviderProps) {
  const [config, setConfig] = useState<ClientConfig | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  useEffect(() => {
    let isActive = true;

    apiClient
      .getClientConfig()
      .then((nextConfig) => {
        if (isActive) {
          setConfig(nextConfig);
        }
      })
      .catch(() => {
        if (isActive) {
          setConfigError(
            "Konfiguráciu aplikácie sa nepodarilo načítať. Skús obnoviť stránku.",
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingConfig(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const value = useMemo<ClientConfigContextValue | null>(
    () => (config ? { config } : null),
    [config],
  );

  if (isLoadingConfig) {
    return (
      <CenteredStatusLayout>
        <LoadingPill text="Načítavam aplikáciu." />
      </CenteredStatusLayout>
    );
  }

  if (configError || !config || !value) {
    return (
      <InfoScreen
        message={configError ?? "Konfigurácia aplikácie nie je dostupná."}
        title="Aplikácia sa nepodarila načítať"
        variant="error"
      />
    );
  }

  return (
    <ClientConfigContext.Provider value={value}>
      {children}
    </ClientConfigContext.Provider>
  );
}
