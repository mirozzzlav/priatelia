import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Box, FormControl, FormErrorMessage } from "@chakra-ui/react";

import { PasswordConfirmationFields } from "src/components/PasswordConfirmationFields";
import { ProfileFormFields } from "src/components/ProfileFormFields";
import {
  FormInput,
  FormLinkButton,
  FormSubmitButton,
  RequiredFieldLabel,
} from "src/components/formElements";
import { ScreenLayout } from "src/components/layouts";
import { FormStatusMessage } from "src/components/FormStatusMessage";
import { useClientConfig } from "src/context/clientConfig";
import type { InterestTag } from "src/features/interests/types";
import type { Gender } from "src/constants/gender";
import type { RegistrationFormData } from "src/features/registration/types";
import { usePhotoGalleryState } from "src/hooks/usePhotoGalleryState";
import type { RegistrationFieldErrors } from "src/services/api";
import { getPasswordConfirmationError } from "src/utils/passwordValidation";

type RegistrationScreenProps = {
  onLoginClick: () => void;
  onRegister: (
    data: RegistrationFormData,
  ) => Promise<RegistrationFieldErrors | null>;
};

const styles = {
  form: {
    display: "grid",
    gap: "22px",
  },
  submitButton: {
    mt: "4px",
  },
} as const;

const initialFormData: RegistrationFormData = {
  bio: "",
  birthDate: "",
  email: "",
  gender: "unspecified",
  interests: [],
  lookingFor: "",
  location: "",
  locationLatitude: null,
  locationLongitude: null,
  nickname: "",
  password: "",
  passwordConfirmation: "",
  photos: [],
};

export function RegistrationScreen({
  onLoginClick,
  onRegister,
}: RegistrationScreenProps) {
  const { config } = useClientConfig();
  const profileValidation = config.validation.profile;
  const [formData, setFormData] =
    useState<RegistrationFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverFieldErrors, setServerFieldErrors] =
    useState<RegistrationFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const fieldErrors = serverFieldErrors;
  const passwordConfirmationError = getPasswordConfirmationError(
    formData.password,
    formData.passwordConfirmation,
  );

  const resetFeedback = () => {
    setServerFieldErrors({});
    setSubmitError(null);
    setWasSubmitted(false);
  };

  const { handlePhotoUpload, removePhoto, setPrimaryPhoto } =
    usePhotoGalleryState({
      maxProfilePhotoCount: config.validation.photos.maxProfilePhotoCount,
      onValidationError: (message) => {
        setServerFieldErrors({ photos: message });
        setWasSubmitted(true);
      },
      photoCount: formData.photos.length,
      resetFeedback,
      setFormData,
    });

  const updateField =
    (field: keyof Omit<RegistrationFormData, "interests" | "photos">) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      resetFeedback();
      setFormData((current) => ({
        ...current,
        [field]: event.target.value,
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

  const handleInterestsChange = (interests: InterestTag[]) => {
    resetFeedback();
    setFormData((current) => ({
      ...current,
      interests,
    }));
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerFieldErrors({});
    setSubmitError(null);
    setWasSubmitted(true);

    if (isSubmitting) {
      return;
    }

    if (passwordConfirmationError) {
      setServerFieldErrors({
        passwordConfirmation: passwordConfirmationError,
      });
      setSubmitError("Skontroluj si vstupné údaje.");
      return;
    }

    setIsSubmitting(true);

    try {
      const nextFieldErrors = await onRegister(formData);

      if (nextFieldErrors) {
        setServerFieldErrors(nextFieldErrors);
        setSubmitError("Skontroluj si vstupné údaje.");
      }
    } catch {
      setSubmitError(
        "Registrácia sa nepodarila. Skontroluj údaje a skús to znova.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenLayout
      title="Registrácia"
      intro="Vytvor si účet, nastav svoju galériu a vyber hlavnú profilovú fotku."
    >
      <Box as="form" noValidate onSubmit={handleSubmit} {...styles.form}>
        <ProfileFormFields
          afterNickname={
            <>
              <FormControl
                isInvalid={wasSubmitted && Boolean(fieldErrors.email)}
              >
                <RequiredFieldLabel>Email</RequiredFieldLabel>
                <FormInput
                  type="email"
                  value={formData.email}
                  onChange={updateField("email")}
                  placeholder="napr. nina@example.com"
                  autoComplete="email"
                />
                <FormErrorMessage color="app.error">
                  {fieldErrors.email}
                </FormErrorMessage>
              </FormControl>

              <PasswordConfirmationFields
                isPasswordInvalid={
                  wasSubmitted && Boolean(fieldErrors.password)
                }
                onPasswordChange={updateField("password")}
                onPasswordConfirmationChange={updateField(
                  "passwordConfirmation",
                )}
                password={formData.password}
                passwordConfirmation={formData.passwordConfirmation}
                passwordConfirmationError={fieldErrors.passwordConfirmation}
                passwordConfirmationLabel="Zopakuj heslo"
                passwordError={fieldErrors.password}
                passwordLabel="Heslo"
                passwordPlaceholder="aspoň 8 znakov"
                wasSubmitted={wasSubmitted}
              />
            </>
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

        {submitError && (
          <FormStatusMessage variant="error">{submitError}</FormStatusMessage>
        )}

        <FormSubmitButton
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          loadingText="Vytváram profil"
          {...styles.submitButton}
        >
          Vytvoriť profil
        </FormSubmitButton>

        <FormLinkButton h="40px" onClick={onLoginClick}>
          Už mám účet, chcem sa prihlásiť
        </FormLinkButton>
      </Box>
    </ScreenLayout>
  );
}
