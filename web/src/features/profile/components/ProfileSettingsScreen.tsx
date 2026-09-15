import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Box, FormControl } from "@chakra-ui/react";

import { ProfileFormFields } from "src/components/ProfileFormFields";
import {
  FormActions,
  FormInput,
  FormLinkButton,
  FormSubmitButton,
  OptionalFieldLabel,
} from "src/components/formElements";
import { FormStatusMessage } from "src/components/FormStatusMessage";
import { PageHeader } from "src/components/PageHeader";
import { useClientConfig } from "src/context/clientConfig";
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
  root: {
    minH: "calc(100vh - 64px)",
    px: { base: "12px", sm: "16px" },
    pb: "34px",
  },
  header: {
    position: "sticky",
    top: "64px",
    zIndex: 40,
  },
  form: {
    display: "grid",
    gap: "22px",
    pt: { base: "22px", sm: "28px" },
  },
  passwordLink: {
    justifySelf: "end",
  },
} as const;

export function ProfileSettingsScreen({
  initialProfile,
  onBack,
  onPasswordChangeClick,
  onSave,
}: ProfileSettingsScreenProps) {
  const { config } = useClientConfig();
  const profileValidation = config.validation.profile;
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
      maxProfilePhotoCount: config.validation.photos.maxProfilePhotoCount,
      onValidationError: (message) => {
        setFieldErrors({ photos: message });
        setWasSubmitted(true);
      },
      photoCount: formData.photos.length,
      resetFeedback,
      setFormData,
    });

  const updateField =
    (
      field: keyof Omit<EditableProfileData, "email" | "interests" | "photos">,
    ) =>
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
    <Box {...styles.root}>
      <PageHeader
        intro="Uprav fotky, základné údaje a krátke bio, ktoré uvidia ostatní."
        onBack={onBack}
        title="Profil"
        {...styles.header}
      />

      <Box as="form" noValidate onSubmit={handleSubmit} {...styles.form}>
        <ProfileFormFields
          afterNickname={
            <FormControl>
              <OptionalFieldLabel>Email</OptionalFieldLabel>
              <FormInput
                value={formData.email}
                isReadOnly
                placeholder="email pri účte"
                autoComplete="email"
                _readOnly={{
                  cursor: "not-allowed",
                  opacity: 0.78,
                }}
              />
            </FormControl>
          }
          fieldErrors={fieldErrors}
          formData={formData}
          onFieldChange={updateField}
          onGenderChange={handleGenderChange}
          onInterestsChange={handleInterestsChange}
          onLocationChange={handleLocationChange}
          onPhotoUpload={handlePhotoUpload}
          onRemovePhoto={removePhoto}
          onSetPrimaryPhoto={setPrimaryPhoto}
          profileValidation={profileValidation}
          wasSubmitted={wasSubmitted}
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
        </FormActions>
      </Box>
    </Box>
  );
}
