import { Box, Flex, IconButton } from "@chakra-ui/react";

import personIcon from "assets/person.svg";
import { ProfileMetaTag } from "src/components/ProfileMetaTag";
import type { Gender } from "src/constants/gender";
import { CheckMarkIcon } from "src/features/discovery/components/CheckMarkIcon";
import { discoveryFilterStyles as styles } from "src/features/discovery/components/discoveryFilterStyles";

type InlineGenderFilterEditorProps = {
  genderPreferences: Gender[];
  isSaving: boolean;
  onChange: (genderPreferences: Gender[]) => void;
  onConfirm: () => void;
};

export function InlineGenderFilterEditor({
  genderPreferences,
  isSaving,
  onChange,
  onConfirm,
}: InlineGenderFilterEditorProps) {
  const selectedValues = genderPreferences;

  const options: Array<{ label: string; value: Gender }> = [
    { label: "Muži", value: "male" },
    { label: "Ženy", value: "female" },
    { label: "Neuvedené", value: "unspecified" },
  ];
  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value),
  );
  const availableOptions = options.filter(
    (option) => !selectedValues.includes(option.value),
  );

  const toggleValue = (value: Gender) => {
    const nextValues = selectedValues.includes(value)
      ? selectedValues.filter((selectedValue) => selectedValue !== value)
      : [...selectedValues, value];

    onChange(nextValues);
  };

  return (
    <Box {...styles.filterEditorWrap}>
      <Box {...styles.filterGenderEditor}>
        <Flex {...styles.inlineGenderOptions}>
          {selectedOptions.map((option) => (
            <ProfileMetaTag
              key={option.value}
              icon={personIcon}
              isSelected
              isDisabled={isSaving}
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
              isDisabled={isSaving}
              onClick={() => toggleValue(option.value)}
              size="sm"
              type="default"
            >
              {option.label}
            </ProfileMetaTag>
          ))}
        </Flex>
        <IconButton
          aria-label="Potvrdiť pohlavie"
          icon={<CheckMarkIcon />}
          isDisabled={isSaving}
          onClick={onConfirm}
          {...styles.confirmButton}
        />
      </Box>
    </Box>
  );
}
