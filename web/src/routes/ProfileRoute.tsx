import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CenteredStatusLayout } from "src/components/layouts";
import { LoadingPill } from "src/components/LoadingPill";
import { InfoScreen } from "src/features/info";
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
  const [profile, setProfile] = useState<EditableProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let isActive = true;

    apiClient
      .getProfile()
      .then((loadedProfile) => {
        if (!isActive) {
          return;
        }

        setProfile(loadedProfile);
        onSave(loadedProfile);
      })
      .catch(() => {
        if (isActive) {
          setLoadError(true);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingProfile(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [onSave]);

  const handleSave = async (
    data: EditableProfileData,
  ): Promise<ProfileFieldErrors | null> => {
    const response = await apiClient.updateProfile(data);

    if (response.status === "error") {
      return response.data.errors;
    }

    onSave(data);
    setProfile(data);
    return null;
  };

  if (isLoadingProfile && !profile) {
    return (
      <CenteredStatusLayout minH="calc(100vh - 64px)">
        <LoadingPill text="Načítavam profil." />
      </CenteredStatusLayout>
    );
  }

  if (loadError && !profile) {
    return (
      <InfoScreen
        message="Profil sa nepodarilo načítať. Skús to znova neskôr."
        title="Profil nie je dostupný"
        variant="error"
      />
    );
  }

  return (
    <ProfileSettingsScreen
      initialProfile={profile ?? initialProfile}
      onBack={() => navigate("/discover")}
      onPasswordChangeClick={() => navigate("/profile/password")}
      onSave={handleSave}
    />
  );
}
