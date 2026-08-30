import type { RegistrationPhoto } from "src/features/registration";

export type EditableProfileData = {
  bio: string;
  birthDate: string;
  location: string;
  nickname: string;
  password: string;
  passwordConfirmation: string;
  photos: RegistrationPhoto[];
};
