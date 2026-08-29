export type RegistrationPhoto = {
  id: string;
  isPrimary: boolean;
  name: string;
  url: string;
};

export type RegistrationFormData = {
  bio: string;
  birthDate: string;
  location: string;
  nickname: string;
  password: string;
  passwordConfirmation: string;
  photos: RegistrationPhoto[];
};
