import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Box, FormControl, FormErrorMessage } from "@chakra-ui/react";

import { InterestSelectField } from "src/components/InterestSelectField";
import { PhotoGalleryField } from "src/components/PhotoGalleryField";
import {
  FormInput,
  FormLinkButton,
  FormPasswordInput,
  FormSubmitButton,
  FormTextarea,
  RequiredFieldLabel,
} from "src/components/formElements";
import { ScreenLayout } from "src/components/layouts";
import { FormStatusMessage } from "src/components/FormStatusMessage";
import type { InterestTag } from "src/features/interests/types";
import type {
  RegistrationFormData,
  RegistrationPhoto,
} from "src/features/registration/types";
import type { RegistrationFieldErrors } from "src/services/api";

type RegistrationScreenProps = {
  onLoginClick: () => void;
  onRegister: (
    data: RegistrationFormData,
  ) => Promise<RegistrationFieldErrors | null>;
};

const styles = {
  form: {
    display: "grid",
    gap: "18px",
  },
  submitButton: {
    mt: "4px",
  },
} as const;

const initialFormData: RegistrationFormData = {
  bio: "",
  birthDate: "",
  email: "",
  interests: [],
  location: "",
  nickname: "",
  password: "",
  passwordConfirmation: "",
  photos: [],
};

function createPhoto(file: File, shouldBePrimary: boolean): RegistrationPhoto {
  return {
    id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
    file,
    isPrimary: shouldBePrimary,
    name: file.name,
    url: URL.createObjectURL(file),
  };
}

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

  const updateField =
    (field: keyof Omit<RegistrationFormData, "interests" | "photos">) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setServerFieldErrors({});
      setSubmitError(null);
      setWasSubmitted(false);
      setFormData((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleBioChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setServerFieldErrors({});
    setSubmitError(null);
    setWasSubmitted(false);
    setFormData((current) => ({
      ...current,
      bio: event.target.value,
    }));
  };

  const handleInterestsChange = (interests: InterestTag[]) => {
    setServerFieldErrors({});
    setSubmitError(null);
    setWasSubmitted(false);
    setFormData((current) => ({
      ...current,
      interests,
    }));
  };

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    setServerFieldErrors({});
    setSubmitError(null);
    setWasSubmitted(false);
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

  const setPrimaryPhoto = (photoId: string) => {
    setServerFieldErrors({});
    setSubmitError(null);
    setWasSubmitted(false);
    setFormData((current) => ({
      ...current,
      photos: current.photos.map((photo) => ({
        ...photo,
        isPrimary: photo.id === photoId,
      })),
    }));
  };

  const removePhoto = (photoId: string) => {
    setServerFieldErrors({});
    setSubmitError(null);
    setWasSubmitted(false);
    setFormData((current) => {
      const removedPhoto = current.photos.find((photo) => photo.id === photoId);
      const remainingPhotos = current.photos.filter(
        (photo) => photo.id !== photoId,
      );
      const needsPrimary =
        removedPhoto?.isPrimary && remainingPhotos.length > 0;

      if (removedPhoto) {
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
    setServerFieldErrors({});
    setSubmitError(null);
    setWasSubmitted(true);

    if (isSubmitting) {
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

        <FormControl isInvalid={wasSubmitted && Boolean(fieldErrors.password)}>
          <RequiredFieldLabel>Heslo</RequiredFieldLabel>
          <FormPasswordInput
            value={formData.password}
            onChange={updateField("password")}
            placeholder="aspoň 8 znakov"
            autoComplete="new-password"
          />
          <FormErrorMessage color="app.error">
            {fieldErrors.password}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={wasSubmitted && Boolean(fieldErrors.passwordConfirmation)}
        >
          <RequiredFieldLabel>Zopakuj heslo</RequiredFieldLabel>
          <FormPasswordInput
            value={formData.passwordConfirmation}
            onChange={updateField("passwordConfirmation")}
            autoComplete="new-password"
          />
          <FormErrorMessage color="app.error">
            {fieldErrors.passwordConfirmation}
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

        <FormControl isInvalid={wasSubmitted && Boolean(fieldErrors.location)}>
          <RequiredFieldLabel>Poloha pre hľadanie priateľov</RequiredFieldLabel>
          <FormInput
            value={formData.location}
            onChange={updateField("location")}
            placeholder="napr. Bratislava, Staré Mesto"
            autoComplete="address-level2"
          />
          <FormErrorMessage color="app.error">
            {fieldErrors.location}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={wasSubmitted && Boolean(fieldErrors.bio)}>
          <RequiredFieldLabel>Krátke bio</RequiredFieldLabel>
          <FormTextarea
            value={formData.bio}
            onChange={handleBioChange}
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
