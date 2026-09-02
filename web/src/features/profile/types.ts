import type { RegistrationPhoto } from "src/features/registration";
import type { InterestTag } from "src/features/interests/types";

export type EditableProfileData = {
  bio: string;
  birthDate: string;
  interests: InterestTag[];
  location: string;
  locationLatitude?: number | null;
  locationLongitude?: number | null;
  nickname: string;
  password: string;
  passwordConfirmation: string;
  photos: RegistrationPhoto[];
};
