import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Box, FormControl, FormErrorMessage } from "@chakra-ui/react";

import { GenderField } from "src/components/GenderField";
import { InterestSelectField } from "src/components/InterestSelectField";
import { PhotoGalleryField } from "src/components/PhotoGalleryField";
import {
  BackButton,
  FormActions,
  FormInput,
  FormLinkButton,
  FormSubmitButton,
  FormTextarea,
  OptionalFieldLabel,
  RequiredFieldLabel,
} from "src/components/formElements";
import { ScreenLayout } from "src/components/layouts";
import { FormStatusMessage } from "src/components/FormStatusMessage";
import { LocationSearchField } from "src/components/LocationSearchField";
import type { Gender } from "src/constants/gender";
import type { InterestTag } from "src/features/interests/types";
import type { EditableProfileData } from "src/features/profile/types";
import { usePhotoGalleryState } from "src/hooks/usePhotoGalleryState";
import type { ProfileFieldErrors } from "src/services/api";

type ProfileSettingsScreenProps = {
  initialProfile: EditableProfileData;
  onBack: () => void;
  onPasswordChangeClick: () => void;
  onSave: (data: EditableProfileData) => Promise<ProfileFieldErrors | null>;
};

const styles = {
  form: {
    display: "grid",
    gap: "22px",
  },
  passwordLink: {
    justifySelf: "start",
  },
} as const;

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

  const resetFeedback = () => {
    setFieldErrors({});
    setSubmitError(null);
    setWasSubmitted(false);
    setIsSuccess(false);
  };

  const { handlePhotoUpload, removePhoto, setPrimaryPhoto } =
    usePhotoGalleryState({
      onValidationError: (message) => {
        setFieldErrors({ photos: message });
        setWasSubmitted(true);
      },
      photoCount: formData.photos.length,
      resetFeedback,
      setFormData,
    });

  const updateField =
    (field: keyof Omit<EditableProfileData, "interests" | "photos">) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      resetFeedback();
      setFormData((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleInterestsChange = (interests: InterestTag[]) => {
    resetFeedback();
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
    resetFeedback();
    setFormData((current) => ({
      ...current,
      location: nextLocation.location,
      locationLatitude: nextLocation.latitude,
      locationLongitude: nextLocation.longitude,
    }));
  };

  const handleGenderChange = (gender: Gender) => {
    resetFeedback();
    setFormData((current) => ({
      ...current,
      gender,
    }));
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

        <GenderField
          error={fieldErrors.gender}
          isInvalid={wasSubmitted && Boolean(fieldErrors.gender)}
          label="Pohlavie"
          onChange={handleGenderChange}
          value={formData.gender}
        />

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

        <FormControl
          isInvalid={wasSubmitted && Boolean(fieldErrors.lookingFor)}
        >
          <OptionalFieldLabel>Čo hľadám</OptionalFieldLabel>
          <FormTextarea
            value={formData.lookingFor}
            onChange={updateField("lookingFor")}
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

        <FormLinkButton
          onClick={onPasswordChangeClick}
          {...styles.passwordLink}
        >
          Zmeniť heslo
        </FormLinkButton>

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
          <BackButton onClick={onBack} />
        </FormActions>
      </Box>
    </ScreenLayout>
  );
}
