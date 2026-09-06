import type { RegistrationPhoto } from "src/features/registration";
import type { InterestTag } from "src/features/interests/types";
import type { Gender } from "src/constants/gender";

export type EditableProfileData = {
  bio: string;
  birthDate: string;
  gender: Gender;
  interests: InterestTag[];
  location: string;
  locationLatitude?: number | null;
  locationLongitude?: number | null;
  nickname: string;
  password: string;
  passwordConfirmation: string;
  photos: RegistrationPhoto[];
};
