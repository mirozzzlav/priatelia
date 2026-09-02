import { useState, type SubmitEvent } from "react";
import { Box, FormControl, FormErrorMessage } from "@chakra-ui/react";

import { PasswordConfirmationFields } from "src/components/PasswordConfirmationFields";
import {
  FormActions,
  FormPasswordInput,
  FormSecondaryButton,
  FormSubmitButton,
  RequiredFieldLabel,
} from "src/components/formElements";
import { ScreenLayout } from "src/components/layouts";
import { FormStatusMessage } from "src/components/FormStatusMessage";
import type { PasswordFieldErrors, PasswordFormData } from "src/services/api";
import { getPasswordConfirmationError } from "src/utils/passwordValidation";

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
  const passwordConfirmationError = getPasswordConfirmationError(
    password,
    passwordConfirmation,
  );

  const resetFeedback = () => {
    setFieldErrors({});
    setSubmitError(null);
    setWasSubmitted(false);
    setIsSuccess(false);
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

    if (passwordConfirmationError) {
      setFieldErrors({
        passwordConfirmation: passwordConfirmationError,
      });
      setSubmitError("Skontroluj si vstupné údaje.");
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
          <FormPasswordInput
            value={currentPassword}
            onChange={(event) => {
              resetFeedback();
              setCurrentPassword(event.target.value);
            }}
            autoComplete="current-password"
          />
          <FormErrorMessage color="app.error">
            {fieldErrors.currentPassword}
          </FormErrorMessage>
        </FormControl>

        <PasswordConfirmationFields
          isPasswordInvalid={wasSubmitted && Boolean(fieldErrors.password)}
          onPasswordChange={(event) => {
            resetFeedback();
            setPassword(event.target.value);
          }}
          onPasswordConfirmationChange={(event) => {
            resetFeedback();
            setPasswordConfirmation(event.target.value);
          }}
          password={password}
          passwordConfirmation={passwordConfirmation}
          passwordConfirmationError={fieldErrors.passwordConfirmation}
          passwordConfirmationLabel="Zopakuj nové heslo"
          passwordError={fieldErrors.password}
          passwordLabel="Nové heslo"
          passwordPlaceholder="aspoň 8 znakov"
          wasSubmitted={wasSubmitted}
        />

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
