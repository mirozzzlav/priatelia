import { useState, type ChangeEvent, type SubmitEvent } from "react";
import {
  Box,
  FormControl,
  FormErrorMessage,
  SimpleGrid,
} from "@chakra-ui/react";

import {
  FormActions,
  FormInput,
  FormSecondaryButton,
  FormSubmitButton,
  RequiredFieldLabel,
} from "src/components/formElements";
import { ScreenLayout } from "src/components/layouts";
import { FormStatusMessage } from "src/components/FormStatusMessage";
import type { DiscoverySettingsFieldErrors } from "src/services/api";

export type DiscoverySettingsData = {
  ageFrom: string;
  ageTo: string;
  location: string;
};

type DiscoverySettingsScreenProps = {
  initialSettings: DiscoverySettingsData;
  onBack: () => void;
  onSave: (
    data: DiscoverySettingsData,
  ) => Promise<DiscoverySettingsFieldErrors | null>;
};

const styles = {
  form: {
    display: "grid",
    gap: "18px",
  },
  ageGrid: {
    columns: 2,
    gap: "10px",
  },
} as const;

export function DiscoverySettingsScreen({
  initialSettings,
  onBack,
  onSave,
}: DiscoverySettingsScreenProps) {
  const [formData, setFormData] =
    useState<DiscoverySettingsData>(initialSettings);
  const [fieldErrors, setFieldErrors] = useState<DiscoverySettingsFieldErrors>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const updateField =
    (field: keyof DiscoverySettingsData) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFieldErrors({});
      setSubmitError(null);
      setWasSubmitted(false);
      setIsSuccess(false);
      setFormData((current) => ({
        ...current,
        [field]: event.target.value,
      }));
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

    setIsSubmitting(true);

    try {
      const nextFieldErrors = await onSave(formData);

      if (nextFieldErrors) {
        setFieldErrors(nextFieldErrors);
        setSubmitError("Skontroluj si vstupné údaje.");
        return;
      }

      setWasSubmitted(false);
      setIsSuccess(true);
    } catch {
      setSubmitError("Kritériá sa nepodarilo uložiť. Skús to znova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenLayout
      title="Kritériá výberu"
      intro="Nastav, podľa čoho ti budeme ponúkať ľudí na zoznámenie."
    >
      <Box as="form" noValidate onSubmit={handleSubmit} {...styles.form}>
        <FormControl isInvalid={wasSubmitted && Boolean(fieldErrors.location)}>
          <RequiredFieldLabel>Lokalita</RequiredFieldLabel>
          <FormInput
            value={formData.location}
            onChange={updateField("location")}
            placeholder="napr. Bratislava a okolie"
            autoComplete="address-level2"
          />
          <FormErrorMessage color="app.error">
            {fieldErrors.location}
          </FormErrorMessage>
        </FormControl>

        <SimpleGrid {...styles.ageGrid}>
          <FormControl isInvalid={wasSubmitted && Boolean(fieldErrors.ageFrom)}>
            <RequiredFieldLabel>Vek od</RequiredFieldLabel>
            <FormInput
              type="number"
              min={18}
              value={formData.ageFrom}
              onChange={updateField("ageFrom")}
            />
            <FormErrorMessage color="app.error">
              {fieldErrors.ageFrom}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={wasSubmitted && Boolean(fieldErrors.ageTo)}>
            <RequiredFieldLabel>Vek do</RequiredFieldLabel>
            <FormInput
              type="number"
              min={18}
              value={formData.ageTo}
              onChange={updateField("ageTo")}
            />
            <FormErrorMessage color="app.error">
              {fieldErrors.ageTo}
            </FormErrorMessage>
          </FormControl>
        </SimpleGrid>

        {submitError && (
          <FormStatusMessage variant="error">{submitError}</FormStatusMessage>
        )}

        {isSuccess && (
          <FormStatusMessage variant="success">
            Kritériá sú uložené.
          </FormStatusMessage>
        )}

        <FormActions>
          <FormSubmitButton
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
            loadingText="Ukladám kritériá"
          >
            Uložiť kritériá
          </FormSubmitButton>
          <FormSecondaryButton onClick={onBack}>Späť</FormSecondaryButton>
        </FormActions>
      </Box>
    </ScreenLayout>
  );
}
