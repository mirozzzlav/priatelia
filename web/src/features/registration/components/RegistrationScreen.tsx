import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Box, FormControl, FormErrorMessage } from "@chakra-ui/react";

import { GenderField } from "src/components/GenderField";
import { InterestSelectField } from "src/components/InterestSelectField";
import { PasswordConfirmationFields } from "src/components/PasswordConfirmationFields";
import { PhotoGalleryField } from "src/components/PhotoGalleryField";
import {
  FormInput,
  FormLinkButton,
  FormSubmitButton,
  FormTextarea,
  OptionalFieldLabel,
  RequiredFieldLabel,
} from "src/components/formElements";
import { ScreenLayout } from "src/components/layouts";
import { FormStatusMessage } from "src/components/FormStatusMessage";
import type { InterestTag } from "src/features/interests/types";
import type { Gender } from "src/constants/gender";
import { LocationSearchField } from "src/components/LocationSearchField";
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

        <FormControl isInvalid={wasSubmitted && Boolean(fieldErrors.email)}>
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
          isPasswordInvalid={wasSubmitted && Boolean(fieldErrors.password)}
          onPasswordChange={updateField("password")}
          onPasswordConfirmationChange={updateField("passwordConfirmation")}
          password={formData.password}
          passwordConfirmation={formData.passwordConfirmation}
          passwordConfirmationError={fieldErrors.passwordConfirmation}
          passwordConfirmationLabel="Zopakuj heslo"
          passwordError={fieldErrors.password}
          passwordLabel="Heslo"
          passwordPlaceholder="aspoň 8 znakov"
          wasSubmitted={wasSubmitted}
        />

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
