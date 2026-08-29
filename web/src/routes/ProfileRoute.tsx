import { useNavigate } from "react-router-dom";

import {
  type EditableProfileData,
  ProfileSettingsScreen,
} from "src/features/profile";
import { apiClient, type ProfileFieldErrors } from "src/services/api";

type ProfileRouteProps = {
  initialProfile: EditableProfileData;
  onSave: (data: EditableProfileData) => void;
};

export function ProfileRoute({ initialProfile, onSave }: ProfileRouteProps) {
  const navigate = useNavigate();

  const handleSave = async (
    data: EditableProfileData,
  ): Promise<ProfileFieldErrors | null> => {
    const response = await apiClient.updateProfile(data);

    if (response.status === "error") {
      return response.data.errors;
    }

    onSave(data);
    return null;
  };

  return (
    <ProfileSettingsScreen
      initialProfile={initialProfile}
      onBack={() => navigate("/discover")}
      onPasswordChangeClick={() => navigate("/profile/password")}
      onSave={handleSave}
    />
  );
}
