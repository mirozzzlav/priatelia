import { useCallback, useEffect, useState } from "react";

import type { DiscoverySettingsData } from "src/features/discovery-settings";
import { apiClient } from "src/services/api";

const initialDiscoverySettings: DiscoverySettingsData = {
  ageFrom: "18",
  ageTo: "35",
  location: "Bratislava, Slovensko",
  locationLatitude: 48.1486,
  locationLongitude: 17.1077,
  radiusKm: "50",
};

export function useDiscoverySettings(isAuthenticated: boolean) {
  const [discoverySettings, setDiscoverySettings] =
    useState<DiscoverySettingsData>(initialDiscoverySettings);

  useEffect(() => {
    let isActive = true;

    if (!isAuthenticated) {
      return undefined;
    }

    apiClient
      .getDiscoverySettings()
      .then((settings) => {
        if (isActive) {
          setDiscoverySettings(settings);
        }
      })
      .catch(() => {
        if (isActive) {
          setDiscoverySettings(initialDiscoverySettings);
        }
      });

    return () => {
      isActive = false;
    };
  }, [isAuthenticated]);

  const saveDiscoverySettings = useCallback((data: DiscoverySettingsData) => {
    setDiscoverySettings(data);
  }, []);

  const resetDiscoverySettings = useCallback(() => {
    setDiscoverySettings(initialDiscoverySettings);
  }, []);

  return {
    discoverySettings,
    resetDiscoverySettings,
    saveDiscoverySettings,
  };
}
