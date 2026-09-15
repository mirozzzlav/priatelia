import type { ButtonProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { FormActions, FormSubmitButton } from "src/components/formElements";

type FormSubmitActionsProps = Omit<
  ButtonProps,
  "children" | "isDisabled" | "isLoading" | "loadingText" | "type"
> & {
  children: ReactNode;
  isSubmitting: boolean;
  loadingText: string;
  secondaryAction?: ReactNode;
};

export function FormSubmitActions({
  children,
  isSubmitting,
  loadingText,
  secondaryAction,
  ...submitButtonProps
}: FormSubmitActionsProps) {
  return (
    <FormActions>
      <FormSubmitButton
        isDisabled={isSubmitting}
        isLoading={isSubmitting}
        loadingText={loadingText}
        {...submitButtonProps}
      >
        {children}
      </FormSubmitButton>
      {secondaryAction}
    </FormActions>
  );
}
