import type { InterestTag } from "src/features/interests/types";

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
  interests: InterestTag[];
  location: string;
  nickname: string;
  password: string;
  passwordConfirmation: string;
  photos: RegistrationPhoto[];
};
