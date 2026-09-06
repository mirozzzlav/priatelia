import { Button, Flex, FormControl, FormErrorMessage } from "@chakra-ui/react";

import personIcon from "assets/person.svg";
import {
  genderFilterOptions,
  genderOptions,
  type Gender,
} from "src/constants/gender";
import { RequiredFieldLabel } from "src/components/formElements";
import { ProfileMetaTag } from "src/components/ProfileMetaTag";

const styles = {
  group: {
    flexWrap: "wrap",
    gap: "8px",
  },
  option: (isSelected: boolean) =>
    ({
      h: "38px",
      px: "13px",
      border: "1px solid",
      borderColor: isSelected ? "app.base" : "rgba(38, 57, 111, 0.18)",
      borderRadius: "999px",
      bg: isSelected ? "app.base" : "rgba(38, 57, 111, 0.06)",
      color: isSelected ? "app.white" : "app.text",
      fontSize: "sm",
      fontWeight: "bold",
      _hover: {
        bg: isSelected ? "app.baseDark" : "app.bgAux",
        borderColor: isSelected ? "app.baseDark" : "rgba(38, 57, 111, 0.24)",
      },
      _active: {
        bg: isSelected ? "app.baseDark" : "app.bgAux",
      },
    }) as const,
  selectedTags: {
    flexWrap: "wrap",
    gap: "7px",
  },
} as const;

type GenderFieldProps = {
  error?: string;
  isInvalid: boolean;
  label: string;
  onChange: (value: Gender) => void;
  value: Gender;
};

export function GenderField({
  error,
  isInvalid,
  label,
  onChange,
  value,
}: GenderFieldProps) {
  return (
    <FormControl isInvalid={isInvalid}>
      <RequiredFieldLabel>{label}</RequiredFieldLabel>
      <Flex role="radiogroup" {...styles.group}>
        {genderOptions.map((option) => {
          const isSelected = option.value === value;

          return (
            <Button
              key={option.value}
              aria-checked={isSelected}
              onClick={() => onChange(option.value)}
              role="radio"
              type="button"
              variant="unstyled"
              {...styles.option(isSelected)}
            >
              {option.label}
            </Button>
          );
        })}
      </Flex>
      <FormErrorMessage color="app.error">{error}</FormErrorMessage>
    </FormControl>
  );
}

type GenderPreferenceFieldProps = {
  error?: string;
  isInvalid: boolean;
  label: string;
  onChange: (value: Gender[]) => void;
  value: Gender[];
};

export function GenderPreferenceField({
  error,
  isInvalid,
  label,
  onChange,
  value,
}: GenderPreferenceFieldProps) {
  const selectedValues = value;
  const selectedOptions = genderFilterOptions.filter((option) =>
    selectedValues.includes(option.value),
  );
  const availableOptions = genderFilterOptions.filter(
    (option) => !selectedValues.includes(option.value),
  );

  const toggleValue = (nextValue: Gender) => {
    const nextValues = selectedValues.includes(nextValue)
      ? selectedValues.filter((currentValue) => currentValue !== nextValue)
      : [...selectedValues, nextValue];

    onChange(nextValues);
  };

  return (
    <FormControl isInvalid={isInvalid}>
      <RequiredFieldLabel>{label}</RequiredFieldLabel>
      <Flex role="group" {...styles.selectedTags}>
        {selectedOptions.map((option) => (
          <ProfileMetaTag
            key={option.value}
            icon={personIcon}
            isSelected
            onClick={() => toggleValue(option.value)}
            size="sm"
            type="default"
          >
            {option.label}
          </ProfileMetaTag>
        ))}
        {availableOptions.map((option) => (
          <ProfileMetaTag
            key={option.value}
            icon={personIcon}
            onClick={() => toggleValue(option.value)}
            size="sm"
            type="default"
          >
            {option.label}
          </ProfileMetaTag>
        ))}
      </Flex>
      <FormErrorMessage color="app.error">{error}</FormErrorMessage>
    </FormControl>
  );
}
