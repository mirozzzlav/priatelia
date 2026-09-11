import { Box, Text } from "@chakra-ui/react";
import { useState, type ChangeEvent, type SubmitEvent } from "react";

import { FormStatusMessage } from "src/components/FormStatusMessage";
import {
  FormLinkButton,
  FormSubmitButton,
} from "src/components/formElements";
import { ScreenLayout } from "src/components/layouts";
import { PasswordConfirmationFields } from "src/components/PasswordConfirmationFields";
import type { PasswordResetConfirmFormData } from "src/features/password-reset/types";
import type { PasswordResetConfirmFieldErrors } from "src/services/api";
import { getPasswordConfirmationError } from "src/utils/passwordValidation";

type ResetPasswordScreenProps = {
  nickname: string;
  onBackToLoginClick: () => void;
  onSubmit: (
    data: PasswordResetConfirmFormData,
  ) => Promise<PasswordResetConfirmFieldErrors | null>;
};

const styles = {
  form: {
    display: "grid",
    gap: "22px",
  },
  submitButton: {
    mt: "4px",
  },
  footerText: {
    mt: "18px",
    color: "app.text",
    fontSize: "sm",
  },
} as const;

export function ResetPasswordScreen({
  nickname,
  onBackToLoginClick,
  onSubmit,
}: ResetPasswordScreenProps) {
  const [formData, setFormData] = useState<PasswordResetConfirmFormData>({
    password: "",
    passwordConfirmation: "",
  });
  const [fieldErrors, setFieldErrors] =
    useState<PasswordResetConfirmFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const updateField =
    (field: keyof PasswordResetConfirmFormData) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFieldErrors({});
      setFormData((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWasSubmitted(true);
    setFieldErrors({});

    if (isSubmitting) {
      return;
    }

    const passwordConfirmationError = getPasswordConfirmationError(
      formData.password,
      formData.passwordConfirmation,
    );

    if (passwordConfirmationError) {
      setFieldErrors({ passwordConfirmation: passwordConfirmationError });
      return;
    }

    setIsSubmitting(true);

    try {
      const errors = await onSubmit(formData);

      if (errors) {
        setFieldErrors(errors);
      }
    } catch {
      setFieldErrors({
        token: "Heslo sa nepodarilo nastaviť. Skús odkaz otvoriť znova.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenLayout
      title="Nové heslo"
      intro={
        <>
          Ahoj <Box as="strong">{nickname}</Box>. Nastav si nové heslo. Po
          uložení ťa automaticky prihlásime.
        </>
      }
      pt="12px"
    >
      <Box as="form" noValidate onSubmit={handleSubmit} {...styles.form}>
        {fieldErrors.token && (
          <FormStatusMessage variant="error">
            {fieldErrors.token}
          </FormStatusMessage>
        )}

        <PasswordConfirmationFields
          isPasswordInvalid={wasSubmitted && Boolean(fieldErrors.password)}
          onPasswordChange={updateField("password")}
          onPasswordConfirmationChange={updateField("passwordConfirmation")}
          password={formData.password}
          passwordConfirmation={formData.passwordConfirmation}
          passwordConfirmationError={fieldErrors.passwordConfirmation}
          passwordConfirmationLabel="Zopakuj nové heslo"
          passwordError={fieldErrors.password}
          passwordLabel="Nové heslo"
          passwordPlaceholder="aspoň 8 znakov"
          wasSubmitted={wasSubmitted}
        />

        <FormSubmitButton
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          loadingText="Ukladám"
          {...styles.submitButton}
        >
          Nastaviť heslo
        </FormSubmitButton>
      </Box>

      {fieldErrors.token && (
        <Text {...styles.footerText}>
          <FormLinkButton onClick={onBackToLoginClick}>
            Späť na prihlásenie
          </FormLinkButton>
        </Text>
      )}
    </ScreenLayout>
  );
}
