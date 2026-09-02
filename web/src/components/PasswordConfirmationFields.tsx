import {
  FormControl,
  FormErrorMessage,
  type InputProps,
} from "@chakra-ui/react";
import type { ChangeEventHandler } from "react";

import {
  FormPasswordInput,
  RequiredFieldLabel,
} from "src/components/formElements";
import { getPasswordConfirmationError } from "src/utils/passwordValidation";

type PasswordConfirmationFieldsProps = {
  isPasswordInvalid: boolean;
  onPasswordChange: ChangeEventHandler<HTMLInputElement>;
  onPasswordConfirmationChange: ChangeEventHandler<HTMLInputElement>;
  password: string;
  passwordAutoComplete?: InputProps["autoComplete"];
  passwordConfirmation: string;
  passwordConfirmationAutoComplete?: InputProps["autoComplete"];
  passwordConfirmationError?: string;
  passwordConfirmationLabel: string;
  passwordError?: string;
  passwordLabel: string;
  passwordPlaceholder?: string;
  wasSubmitted: boolean;
};

export function PasswordConfirmationFields({
  isPasswordInvalid,
  onPasswordChange,
  onPasswordConfirmationChange,
  password,
  passwordAutoComplete = "new-password",
  passwordConfirmation,
  passwordConfirmationAutoComplete = "new-password",
  passwordConfirmationError,
  passwordConfirmationLabel,
  passwordError,
  passwordLabel,
  passwordPlaceholder,
  wasSubmitted,
}: PasswordConfirmationFieldsProps) {
  const mismatchError = getPasswordConfirmationError(
    password,
    passwordConfirmation,
  );

  return (
    <>
      <FormControl isInvalid={isPasswordInvalid}>
        <RequiredFieldLabel>{passwordLabel}</RequiredFieldLabel>
        <FormPasswordInput
          value={password}
          onChange={onPasswordChange}
          placeholder={passwordPlaceholder}
          autoComplete={passwordAutoComplete}
        />
        <FormErrorMessage color="app.error">{passwordError}</FormErrorMessage>
      </FormControl>

      <FormControl
        isInvalid={Boolean(mismatchError) || (
          wasSubmitted && Boolean(passwordConfirmationError)
        )}
      >
        <RequiredFieldLabel>{passwordConfirmationLabel}</RequiredFieldLabel>
        <FormPasswordInput
          value={passwordConfirmation}
          onChange={onPasswordConfirmationChange}
          autoComplete={passwordConfirmationAutoComplete}
        />
        <FormErrorMessage color="app.error">
          {mismatchError || passwordConfirmationError}
        </FormErrorMessage>
      </FormControl>
    </>
  );
}
