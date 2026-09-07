import { Box, IconButton, Text } from "@chakra-ui/react";

import { FormInput } from "src/components/formElements";
import type { DiscoverySettingsData } from "src/features/discovery-settings";
import { CheckMarkIcon } from "src/features/discovery/components/CheckMarkIcon";
import { discoveryFilterStyles as styles } from "src/features/discovery/components/discoveryFilterStyles";
import type { InlineFilterField } from "src/features/discovery/types";

type InlineNumericFilterEditorProps = {
  draftSettings: DiscoverySettingsData;
  field: Exclude<InlineFilterField, "location" | "gender">;
  isSaving: boolean;
  onChange: (field: keyof DiscoverySettingsData, value: string) => void;
  onConfirm: () => void;
};

function getDigitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function InlineNumericFilterEditor({
  draftSettings,
  field,
  isSaving,
  onChange,
  onConfirm,
}: InlineNumericFilterEditorProps) {
  if (field === "age") {
    return (
      <Box {...styles.filterEditorWrap}>
        <Box {...styles.filterAgeEditorGrid}>
          <Text as="span" {...styles.filterEditorLabel}>
            Vek
          </Text>
          <FormInput
            autoFocus
            aria-label="Vek od"
            inputMode="numeric"
            isDisabled={isSaving}
            onChange={(event) =>
              onChange("ageFrom", getDigitsOnly(event.target.value))
            }
            pattern="[0-9]*"
            type="text"
            value={draftSettings.ageFrom}
            {...styles.inlineInput}
          />
          <FormInput
            aria-label="Vek do"
            inputMode="numeric"
            isDisabled={isSaving}
            onChange={(event) =>
              onChange("ageTo", getDigitsOnly(event.target.value))
            }
            pattern="[0-9]*"
            type="text"
            value={draftSettings.ageTo}
            {...styles.inlineInput}
          />
          <IconButton
            aria-label="Potvrdiť vek"
            icon={<CheckMarkIcon />}
            isDisabled={isSaving}
            onClick={onConfirm}
            {...styles.confirmButton}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box {...styles.filterEditorWrap}>
      <Box {...styles.filterEditorGrid}>
        <Text as="span" {...styles.filterEditorLabel}>
          Radius
        </Text>
        <FormInput
          autoFocus
          aria-label="Radius"
          inputMode="numeric"
          isDisabled={isSaving}
          onChange={(event) =>
            onChange("radiusKm", getDigitsOnly(event.target.value))
          }
          pattern="[0-9]*"
          type="text"
          value={draftSettings.radiusKm}
          {...styles.inlineInput}
        />
        <IconButton
          aria-label="Potvrdiť radius"
          icon={<CheckMarkIcon />}
          isDisabled={isSaving}
          onClick={onConfirm}
          {...styles.confirmButton}
        />
      </Box>
    </Box>
  );
}
