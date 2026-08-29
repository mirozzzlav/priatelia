import { useState } from "react";

import type { LoginFormData } from "src/features/login";
import type { EditableProfileData } from "src/features/profile";
import type { RegistrationFormData } from "src/features/registration";

const initialProfileData: EditableProfileData = {
  bio: "",
  birthDate: "",
  location: "",
  nickname: "",
  password: "",
  passwordConfirmation: "",
  photos: [],
};

export function useProfileState() {
  const [profileData, setProfileData] =
    useState<EditableProfileData>(initialProfileData);

  const syncLoginProfile = (data: LoginFormData) => {
    setProfileData((current) => ({
      ...current,
      nickname: data.nickname.trim(),
      password: "",
      passwordConfirmation: "",
    }));
  };

  const syncRegisteredProfile = (data: RegistrationFormData) => {
    setProfileData({
      ...data,
      nickname: data.nickname.trim(),
      password: "",
      passwordConfirmation: "",
    });
  };

  const saveProfile = (data: EditableProfileData) => {
    setProfileData({
      ...data,
      nickname: data.nickname.trim(),
      password: "",
      passwordConfirmation: "",
    });
  };

  const savePassword = () => {
    setProfileData((current) => ({
      ...current,
      password: "",
      passwordConfirmation: "",
    }));
  };

  return {
    profileData,
    savePassword,
    saveProfile,
    syncLoginProfile,
    syncRegisteredProfile,
  };
}
