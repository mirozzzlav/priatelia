import { Flex, FormControl, FormErrorMessage } from "@chakra-ui/react";

import personIcon from "assets/person.svg";
import {
  genderFilterOptions,
  genderOptions,
  type Gender,
} from "src/constants/gender";
import {
  FormToggleButton,
  RequiredFieldLabel,
} from "src/components/formElements";
import { ProfileMetaTag } from "src/components/ProfileMetaTag";

const styles = {
  group: {
    flexWrap: "wrap",
    gap: "8px",
  },
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
            <FormToggleButton
              key={option.value}
              aria-checked={isSelected}
              isSelected={isSelected}
              onClick={() => onChange(option.value)}
              role="radio"
            >
              {option.label}
            </FormToggleButton>
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
