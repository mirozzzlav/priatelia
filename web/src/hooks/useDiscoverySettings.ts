import { useState } from "react";

import type { DiscoverySettingsData } from "src/features/discovery-settings";

const initialDiscoverySettings: DiscoverySettingsData = {
  ageFrom: "18",
  ageTo: "35",
  location: "Bratislava",
  locationLatitude: null,
  locationLongitude: null,
  radiusKm: "50",
};

export function useDiscoverySettings() {
  const [discoverySettings, setDiscoverySettings] =
    useState<DiscoverySettingsData>(initialDiscoverySettings);

  return {
    discoverySettings,
    saveDiscoverySettings: setDiscoverySettings,
  };
}
