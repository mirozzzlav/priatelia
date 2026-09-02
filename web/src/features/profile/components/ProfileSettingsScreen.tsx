import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Box, FormControl, FormErrorMessage } from "@chakra-ui/react";

import { InterestSelectField } from "src/components/InterestSelectField";
import { PhotoGalleryField } from "src/components/PhotoGalleryField";
import {
  FormActions,
  FormInput,
  FormSecondaryButton,
  FormSubmitButton,
  FormTextarea,
  RequiredFieldLabel,
} from "src/components/formElements";
import { ScreenLayout } from "src/components/layouts";
import { FormStatusMessage } from "src/components/FormStatusMessage";
import { LocationSearchField } from "src/components/LocationSearchField";
import type { InterestTag } from "src/features/interests/types";
import type { EditableProfileData } from "src/features/profile/types";
import type { RegistrationPhoto } from "src/features/registration";
import type { ProfileFieldErrors } from "src/services/api";
import { createId } from "src/utils/createId";

type ProfileSettingsScreenProps = {
  initialProfile: EditableProfileData;
  onBack: () => void;
  onPasswordChangeClick: () => void;
  onSave: (data: EditableProfileData) => Promise<ProfileFieldErrors | null>;
};

const styles = {
  form: {
    display: "grid",
    gap: "18px",
  },
} as const;

function createPhoto(file: File, shouldBePrimary: boolean): RegistrationPhoto {
  return {
    id: `${file.name}-${file.lastModified}-${createId("photo")}`,
    file,
    isPrimary: shouldBePrimary,
    name: file.name,
    url: URL.createObjectURL(file),
  };
}

export function ProfileSettingsScreen({
  initialProfile,
  onBack,
  onPasswordChangeClick,
  onSave,
}: ProfileSettingsScreenProps) {
  const [formData, setFormData] = useState<EditableProfileData>(initialProfile);
  const [fieldErrors, setFieldErrors] = useState<ProfileFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const updateField =
    (field: keyof Omit<EditableProfileData, "interests" | "photos">) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFieldErrors({});
      setSubmitError(null);
      setWasSubmitted(false);
      setIsSuccess(false);
      setFormData((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    setFieldErrors({});
    setSubmitError(null);
    setWasSubmitted(false);
    setIsSuccess(false);
    setFormData((current) => {
      const newPhotos = files.map((file, index) =>
        createPhoto(file, current.photos.length === 0 && index === 0),
      );

      return {
        ...current,
        photos: [...current.photos, ...newPhotos],
      };
    });

    event.target.value = "";
  };

  const handleInterestsChange = (interests: InterestTag[]) => {
    setFieldErrors({});
    setSubmitError(null);
    setWasSubmitted(false);
    setIsSuccess(false);
    setFormData((current) => ({
      ...current,
      interests,
    }));
  };

  const handleLocationChange = (nextLocation: {
    latitude: number | null;
    location: string;
    longitude: number | null;
  }) => {
    setFieldErrors({});
    setSubmitError(null);
    setWasSubmitted(false);
    setIsSuccess(false);
    setFormData((current) => ({
      ...current,
      location: nextLocation.location,
      locationLatitude: nextLocation.latitude,
      locationLongitude: nextLocation.longitude,
    }));
  };

  const setPrimaryPhoto = (photoId: string) => {
    setFieldErrors({});
    setSubmitError(null);
    setWasSubmitted(false);
    setIsSuccess(false);
    setFormData((current) => ({
      ...current,
      photos: current.photos.map((photo) => ({
        ...photo,
        isPrimary: photo.id === photoId,
      })),
    }));
  };

  const removePhoto = (photoId: string) => {
    setFieldErrors({});
    setSubmitError(null);
    setWasSubmitted(false);
    setIsSuccess(false);
    setFormData((current) => {
      const removedPhoto = current.photos.find((photo) => photo.id === photoId);
      const remainingPhotos = current.photos.filter(
        (photo) => photo.id !== photoId,
      );
      const needsPrimary =
        removedPhoto?.isPrimary && remainingPhotos.length > 0;

      if (removedPhoto?.url.startsWith("blob:")) {
        URL.revokeObjectURL(removedPhoto.url);
      }

      return {
        ...current,
        photos: remainingPhotos.map((photo, index) => ({
          ...photo,
          isPrimary: needsPrimary ? index === 0 : photo.isPrimary,
        })),
      };
    });
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldErrors({});
    setSubmitError(null);
    setWasSubmitted(true);
    setIsSuccess(false);

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const nextFieldErrors = await onSave(formData);

      if (nextFieldErrors) {
        setFieldErrors(nextFieldErrors);
        setSubmitError("Skontroluj si vstupné údaje.");
        return;
      }

      setWasSubmitted(false);
      setIsSuccess(true);
    } catch {
      setSubmitError("Profil sa nepodarilo uložiť. Skús to znova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenLayout
      title="Profil"
      intro="Uprav fotky, základné údaje a krátke bio, ktoré uvidia ostatní."
    >
      <Box as="form" noValidate onSubmit={handleSubmit} {...styles.form}>
        <FormControl isInvalid={wasSubmitted && Boolean(fieldErrors.nickname)}>
          <RequiredFieldLabel>Nickname</RequiredFieldLabel>
          <FormInput
            value={formData.nickname}
            onChange={updateField("nickname")}
            placeholder="napr. nina27"
            autoComplete="nickname"
          />
          <FormErrorMessage color="app.error">
            {fieldErrors.nickname}
          </FormErrorMessage>
        </FormControl>

        <FormSecondaryButton
          borderRadius="12px"
          onClick={onPasswordChangeClick}
        >
          Zmeniť heslo
        </FormSecondaryButton>

        <FormControl isInvalid={wasSubmitted && Boolean(fieldErrors.birthDate)}>
          <RequiredFieldLabel>Dátum narodenia</RequiredFieldLabel>
          <FormInput
            type="date"
            value={formData.birthDate}
            onChange={updateField("birthDate")}
          />
          <FormErrorMessage color="app.error">
            {fieldErrors.birthDate}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={wasSubmitted && Boolean(fieldErrors.location)}>
          <LocationSearchField
            error={fieldErrors.location}
            isInvalid={wasSubmitted && Boolean(fieldErrors.location)}
            label="Tvoja lokalita"
            onChange={handleLocationChange}
            value={formData.location}
            placeholder="napr. Bratislava"
          />
        </FormControl>

        <FormControl isInvalid={wasSubmitted && Boolean(fieldErrors.bio)}>
          <RequiredFieldLabel>Krátke bio</RequiredFieldLabel>
          <FormTextarea
            value={formData.bio}
            onChange={updateField("bio")}
            placeholder="Čo rád/rada robíš a akých priateľov hľadáš?"
          />
          <FormErrorMessage color="app.error">
            {fieldErrors.bio}
          </FormErrorMessage>
        </FormControl>

        <InterestSelectField
          error={fieldErrors.interests}
          interests={formData.interests}
          isInvalid={wasSubmitted && Boolean(fieldErrors.interests)}
          onChange={handleInterestsChange}
        />

        <PhotoGalleryField
          error={fieldErrors.photos}
          isInvalid={wasSubmitted && Boolean(fieldErrors.photos)}
          photos={formData.photos}
          onPhotoUpload={handlePhotoUpload}
          onRemovePhoto={removePhoto}
          onSetPrimaryPhoto={setPrimaryPhoto}
        />

        {submitError && (
          <FormStatusMessage variant="error">{submitError}</FormStatusMessage>
        )}

        {isSuccess && (
          <FormStatusMessage variant="success">
            Profil je uložený.
          </FormStatusMessage>
        )}

        <FormActions>
          <FormSubmitButton
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
            loadingText="Ukladám profil"
          >
            Uložiť profil
          </FormSubmitButton>
          <FormSecondaryButton onClick={onBack}>Späť</FormSecondaryButton>
        </FormActions>
      </Box>
    </ScreenLayout>
  );
}
