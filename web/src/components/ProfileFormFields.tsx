import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import type { ChangeEventHandler, ReactNode } from "react";

import { GenderField } from "src/components/GenderField";
import { InterestSelectField } from "src/components/InterestSelectField";
import { LocationSearchField } from "src/components/LocationSearchField";
import { PhotoGalleryField } from "src/components/PhotoGalleryField";
import {
  FormInput,
  FormTextarea,
  OptionalFieldLabel,
  RequiredFieldLabel,
} from "src/components/formElements";
import type { Gender } from "src/constants/gender";
import type { InterestTag } from "src/features/interests/types";
import type { RegistrationPhoto } from "src/features/registration";
import type { ClientConfig } from "src/services/api";

export type ProfileFormFieldsData = {
  bio: string;
  birthDate: string;
  gender: Gender;
  interests: InterestTag[];
  lookingFor: string;
  location: string;
  locationLatitude?: number | null;
  locationLongitude?: number | null;
  nickname: string;
  photos: RegistrationPhoto[];
};

type ProfileFormFieldErrors = Partial<
  Record<keyof ProfileFormFieldsData, string>
>;

type ProfileTextField = "bio" | "birthDate" | "lookingFor" | "nickname";

type ProfileLocationValue = {
  latitude: number | null;
  location: string;
  longitude: number | null;
};

type ProfileFormFieldsProps = {
  afterNickname?: ReactNode;
  fieldErrors: ProfileFormFieldErrors;
  formData: ProfileFormFieldsData;
  onFieldChange: (
    field: ProfileTextField,
  ) => ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onGenderChange: (gender: Gender) => void;
  onInterestsChange: (interests: InterestTag[]) => void;
  onLocationChange: (nextLocation: ProfileLocationValue) => void;
  onPhotoUpload: ChangeEventHandler<HTMLInputElement>;
  onRemovePhoto: (photoId: string) => void;
  onSetPrimaryPhoto: (photoId: string) => void;
  profileValidation: ClientConfig["validation"]["profile"];
  wasSubmitted: boolean;
};

export function ProfileFormFields({
  afterNickname,
  fieldErrors,
  formData,
  onFieldChange,
  onGenderChange,
  onInterestsChange,
  onLocationChange,
  onPhotoUpload,
  onRemovePhoto,
  onSetPrimaryPhoto,
  profileValidation,
  wasSubmitted,
}: ProfileFormFieldsProps) {
  return (
    <>
      <FormControl isInvalid={wasSubmitted && Boolean(fieldErrors.nickname)}>
        <RequiredFieldLabel>Nickname</RequiredFieldLabel>
        <FormInput
          maxLength={profileValidation.nicknameMaxLength}
          value={formData.nickname}
          onChange={onFieldChange("nickname")}
          placeholder="napr. nina27"
          autoComplete="nickname"
        />
        <FormErrorMessage color="app.error">
          {fieldErrors.nickname}
        </FormErrorMessage>
      </FormControl>

      {afterNickname}

      <FormControl isInvalid={wasSubmitted && Boolean(fieldErrors.birthDate)}>
        <RequiredFieldLabel>Dátum narodenia</RequiredFieldLabel>
        <FormInput
          type="date"
          value={formData.birthDate}
          onChange={onFieldChange("birthDate")}
        />
        <FormErrorMessage color="app.error">
          {fieldErrors.birthDate}
        </FormErrorMessage>
      </FormControl>

      <GenderField
        error={fieldErrors.gender}
        isInvalid={wasSubmitted && Boolean(fieldErrors.gender)}
        label="Pohlavie"
        onChange={onGenderChange}
        value={formData.gender}
      />

      <FormControl isInvalid={wasSubmitted && Boolean(fieldErrors.location)}>
        <LocationSearchField
          error={fieldErrors.location}
          isInvalid={wasSubmitted && Boolean(fieldErrors.location)}
          label="Tvoja lokalita"
          onChange={onLocationChange}
          value={formData.location}
          placeholder="napr. Bratislava"
        />
      </FormControl>

      <FormControl isInvalid={wasSubmitted && Boolean(fieldErrors.bio)}>
        <RequiredFieldLabel>Krátke bio</RequiredFieldLabel>
        <FormTextarea
          characterLimit={profileValidation.bioMaxLength}
          value={formData.bio}
          onChange={onFieldChange("bio")}
          placeholder="Čo rád/rada robíš a akých priateľov hľadáš?"
        />
        <FormErrorMessage color="app.error">{fieldErrors.bio}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={wasSubmitted && Boolean(fieldErrors.lookingFor)}>
        <OptionalFieldLabel>Čo hľadám</OptionalFieldLabel>
        <FormTextarea
          characterLimit={profileValidation.lookingForMaxLength}
          value={formData.lookingFor}
          onChange={onFieldChange("lookingFor")}
          placeholder="Aký typ priateľstva, aktivít alebo ľudí by ti sadol?"
        />
        <FormErrorMessage color="app.error">
          {fieldErrors.lookingFor}
        </FormErrorMessage>
      </FormControl>

      <InterestSelectField
        error={fieldErrors.interests}
        interests={formData.interests}
        isInvalid={wasSubmitted && Boolean(fieldErrors.interests)}
        onChange={onInterestsChange}
      />

      <PhotoGalleryField
        error={fieldErrors.photos}
        isInvalid={wasSubmitted && Boolean(fieldErrors.photos)}
        photos={formData.photos}
        onPhotoUpload={onPhotoUpload}
        onRemovePhoto={onRemovePhoto}
        onSetPrimaryPhoto={onSetPrimaryPhoto}
      />
    </>
  );
}
