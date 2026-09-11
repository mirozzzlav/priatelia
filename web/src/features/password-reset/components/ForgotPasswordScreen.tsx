import {
  Box,
  FormControl,
  FormErrorMessage,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, type ChangeEvent, type SubmitEvent } from "react";

import { FormStatusMessage } from "src/components/FormStatusMessage";
import {
  FormInput,
  FormLinkButton,
  FormSubmitButton,
  RequiredFieldLabel,
} from "src/components/formElements";
import { ScreenLayout } from "src/components/layouts";
import type { PasswordResetRequestFormData } from "src/features/password-reset/types";
import type { PasswordResetRequestFieldErrors } from "src/services/api";

type ForgotPasswordScreenProps = {
  onBackToLoginClick: () => void;
  onSubmit: (
    data: PasswordResetRequestFormData,
  ) => Promise<PasswordResetRequestFieldErrors | null>;
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

export function ForgotPasswordScreen({
  onBackToLoginClick,
  onSubmit,
}: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] =
    useState<PasswordResetRequestFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen: isSubmitted, onOpen: showSubmitted } = useDisclosure();

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFieldErrors({});
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const errors = await onSubmit({ email });

      if (errors) {
        setFieldErrors(errors);
        return;
      }

      showSubmitted();
    } catch {
      setFieldErrors({
        email: "Žiadosť sa nepodarilo odoslať. Skús to prosím znova.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenLayout
      title="Obnova hesla"
      intro="Zadaj email, ktorý máš pri účte. Ak ho nájdeme, pošleme ti odkaz na nastavenie nového hesla."
      pt="12px"
    >
      <Box as="form" noValidate onSubmit={handleSubmit} {...styles.form}>
        <FormControl isInvalid={Boolean(fieldErrors.email)}>
          <RequiredFieldLabel>Email</RequiredFieldLabel>
          <FormInput
            value={email}
            onChange={handleEmailChange}
            placeholder="tvoj@email.sk"
            autoComplete="email"
            type="email"
          />
          <FormErrorMessage color="app.error">
            {fieldErrors.email}
          </FormErrorMessage>
        </FormControl>

        {isSubmitted && (
          <FormStatusMessage variant="success">
            Ak email patrí k aktívnemu účtu, poslali sme naň odkaz na obnovu
            hesla.
          </FormStatusMessage>
        )}

        <FormSubmitButton
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          loadingText="Odosielam"
          {...styles.submitButton}
        >
          Poslať odkaz
        </FormSubmitButton>
      </Box>

      <Text {...styles.footerText}>
        Spomenul/a si si na heslo?{" "}
        <FormLinkButton onClick={onBackToLoginClick}>
          Prihlás sa
        </FormLinkButton>
      </Text>
    </ScreenLayout>
  );
}
