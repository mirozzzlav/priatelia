import type { ReactNode } from "react";

import { FormStatusMessage } from "src/components/FormStatusMessage";

type FormSubmitStatusProps = {
  error?: ReactNode | null;
  success?: ReactNode | null;
};

export function FormSubmitStatus({ error, success }: FormSubmitStatusProps) {
  return (
    <>
      {error && <FormStatusMessage variant="error">{error}</FormStatusMessage>}
      {success && (
        <FormStatusMessage variant="success">{success}</FormStatusMessage>
      )}
    </>
  );
}
