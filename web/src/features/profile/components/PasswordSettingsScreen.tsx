import { useState, type SubmitEvent } from "react";
import { Box, FormControl, FormErrorMessage } from "@chakra-ui/react";

import {
  FormActions,
  FormInput,
  FormSecondaryButton,
  FormSubmitButton,
  RequiredFieldLabel,
} from "src/components/formElements";
import { ScreenLayout } from "src/components/layouts";
import { FormStatusMessage } from "src/components/FormStatusMessage";
import type { PasswordFieldErrors, PasswordFormData } from "src/services/api";

type PasswordSettingsScreenProps = {
  onBack: () => void;
  onSave: (data: PasswordFormData) => Promise<PasswordFieldErrors | null>;
};

const styles = {
  form: {
    display: "grid",
    gap: "18px",
  },
} as const;

export function PasswordSettingsScreen({
  onBack,
  onSave,
}: PasswordSettingsScreenProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [fieldErrors, setFieldErrors] = useState<PasswordFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [wasSubmitted, setWasSubmitted] = useState(false);

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
      const nextFieldErrors = await onSave({
        currentPassword,
        password,
        passwordConfirmation,
      });

      if (nextFieldErrors) {
        setFieldErrors(nextFieldErrors);
        setSubmitError("Skontroluj si vstupné údaje.");
        return;
      }

      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
      setWasSubmitted(false);
      setIsSuccess(true);
    } catch {
      setSubmitError("Heslo sa nepodarilo zmeniť. Skús to znova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenLayout
      title="Zmena hesla"
      intro="Zadaj aktuálne heslo a nové heslo, ktorým sa budeš prihlasovať."
    >
      <Box as="form" noValidate onSubmit={handleSubmit} {...styles.form}>
        <FormControl
          isInvalid={wasSubmitted && Boolean(fieldErrors.currentPassword)}
        >
          <RequiredFieldLabel>Aktuálne heslo</RequiredFieldLabel>
          <FormInput
            type="password"
            value={currentPassword}
            onChange={(event) => {
              setFieldErrors({});
              setSubmitError(null);
              setWasSubmitted(false);
              setIsSuccess(false);
              setCurrentPassword(event.target.value);
            }}
            autoComplete="current-password"
          />
          <FormErrorMessage color="app.error">
            {fieldErrors.currentPassword}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={wasSubmitted && Boolean(fieldErrors.password)}>
          <RequiredFieldLabel>Nové heslo</RequiredFieldLabel>
          <FormInput
            type="password"
            value={password}
            onChange={(event) => {
              setFieldErrors({});
              setSubmitError(null);
              setWasSubmitted(false);
              setIsSuccess(false);
              setPassword(event.target.value);
            }}
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
          <RequiredFieldLabel>Zopakuj nové heslo</RequiredFieldLabel>
          <FormInput
            type="password"
            value={passwordConfirmation}
            onChange={(event) => {
              setFieldErrors({});
              setSubmitError(null);
              setWasSubmitted(false);
              setIsSuccess(false);
              setPasswordConfirmation(event.target.value);
            }}
            autoComplete="new-password"
          />
          <FormErrorMessage color="app.error">
            {fieldErrors.passwordConfirmation}
          </FormErrorMessage>
        </FormControl>

        {submitError && (
          <FormStatusMessage variant="error">{submitError}</FormStatusMessage>
        )}

        {isSuccess && (
          <FormStatusMessage variant="success">
            Heslo je zmenené.
          </FormStatusMessage>
        )}

        <FormActions>
          <FormSubmitButton
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
            loadingText="Ukladám heslo"
          >
            Uložiť heslo
          </FormSubmitButton>
          <FormSecondaryButton onClick={onBack}>
            Späť na profil
          </FormSecondaryButton>
        </FormActions>
      </Box>
    </ScreenLayout>
  );
}
