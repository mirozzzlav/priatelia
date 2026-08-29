import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Box, FormControl, Text } from "@chakra-ui/react";

import {
  FormInput,
  FormLinkButton,
  FormSubmitButton,
  RequiredFieldLabel,
} from "src/components/formElements";
import { ScreenLayout } from "src/components/layouts";
import { FormStatusMessage } from "src/components/FormStatusMessage";
import type { LoginFormData } from "src/features/login/types";

type LoginScreenProps = {
  onLogin: (data: LoginFormData) => Promise<boolean>;
  onRegisterClick: () => void;
};

const styles = {
  form: {
    display: "grid",
    gap: "18px",
  },
  submitButton: {
    mt: "4px",
  },
  registerText: {
    mt: "18px",
    color: "app.text",
    fontSize: "sm",
  },
} as const;

const initialFormData: LoginFormData = {
  nickname: "",
  password: "",
};

export function LoginScreen({ onLogin, onRegisterClick }: LoginScreenProps) {
  const [formData, setFormData] = useState<LoginFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateField =
    (field: keyof LoginFormData) => (event: ChangeEvent<HTMLInputElement>) => {
      setSubmitError(null);
      setFormData((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const isSuccess = await onLogin(formData);

      if (!isSuccess) {
        setSubmitError("Nesprávna kombinácia mena a hesla.");
      }
    } catch {
      setSubmitError("Nesprávna kombinácia mena a hesla.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenLayout
      title="Prihlásenie"
      intro="Prihlás sa cez nickname a heslo, potom môžeš vyberať ľudí, s ktorými chceš komunikovať."
      pt="12px"
    >
      <Box as="form" noValidate onSubmit={handleSubmit} {...styles.form}>
        <FormControl>
          <RequiredFieldLabel>Nickname</RequiredFieldLabel>
          <FormInput
            value={formData.nickname}
            onChange={updateField("nickname")}
            placeholder="napr. nina27"
            autoComplete="nickname"
          />
        </FormControl>

        <FormControl>
          <RequiredFieldLabel>Heslo</RequiredFieldLabel>
          <FormInput
            type="password"
            value={formData.password}
            onChange={updateField("password")}
            autoComplete="current-password"
          />
        </FormControl>

        {submitError && (
          <FormStatusMessage variant="error">{submitError}</FormStatusMessage>
        )}

        <FormSubmitButton
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          loadingText="Prihlasujem"
          {...styles.submitButton}
        >
          Prihlásiť sa
        </FormSubmitButton>
      </Box>

      <Text {...styles.registerText}>
        Nemáš účet?{" "}
        <FormLinkButton onClick={onRegisterClick}>Registruj sa</FormLinkButton>
      </Text>
    </ScreenLayout>
  );
}
