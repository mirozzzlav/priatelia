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
  location: string;
  nickname: string;
  password: string;
  passwordConfirmation: string;
  photos: RegistrationPhoto[];
};
