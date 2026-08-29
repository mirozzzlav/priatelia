import { useNavigate } from "react-router-dom";

import {
  type DiscoverySettingsData,
  DiscoverySettingsScreen,
} from "src/features/discovery-settings";
import { apiClient, type DiscoverySettingsFieldErrors } from "src/services/api";

type CriteriaRouteProps = {
  initialSettings: DiscoverySettingsData;
  onSave: (data: DiscoverySettingsData) => void;
};

export function CriteriaRoute({ initialSettings, onSave }: CriteriaRouteProps) {
  const navigate = useNavigate();

  const handleSave = async (
    data: DiscoverySettingsData,
  ): Promise<DiscoverySettingsFieldErrors | null> => {
    const response = await apiClient.updateDiscoverySettings(data);

    if (response.status === "error") {
      return response.data.errors;
    }

    onSave(data);
    return null;
  };

  return (
    <DiscoverySettingsScreen
      initialSettings={initialSettings}
      onBack={() => navigate("/discover")}
      onSave={handleSave}
    />
  );
}
