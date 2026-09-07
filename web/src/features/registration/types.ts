import type { InterestTag } from "src/features/interests/types";
import type { Gender } from "src/constants/gender";

export type RegistrationPhoto = {
  file?: File;
  id: string;
  isPrimary: boolean;
  name: string;
  url: string;
};

export type RegistrationFormData = {
  bio: string;
  birthDate: string;
  email: string;
  gender: Gender;
  interests: InterestTag[];
  lookingFor: string;
  location: string;
  locationLatitude?: number | null;
  locationLongitude?: number | null;
  nickname: string;
  password: string;
  passwordConfirmation: string;
  photos: RegistrationPhoto[];
};
