import { createContext, useContext } from "react";

import type { ClientConfig } from "src/services/api";

export type ClientConfigContextValue = {
  config: ClientConfig;
};

export const ClientConfigContext =
  createContext<ClientConfigContextValue | null>(null);

export function useClientConfig() {
  const clientConfig = useContext(ClientConfigContext);

  if (!clientConfig) {
    throw new Error("useClientConfig must be used inside ClientConfigProvider");
  }

  return clientConfig;
}
