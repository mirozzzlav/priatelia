import { useEffect, useState } from "react";
import { Box, FormControl } from "@chakra-ui/react";

import { AutocompleteField } from "src/components/AutocompleteField";
import { InterestTagList } from "src/components/InterestTagList";
import type { InterestTag } from "src/features/interests/types";
import { apiClient } from "src/services/api";

const styles = {
  selectedTags: {
    mt: "10px",
  },
} as const;

type InterestSelectFieldProps = {
  error?: string;
  interests: InterestTag[];
  isInvalid: boolean;
  onChange: (interests: InterestTag[]) => void;
};

export function InterestSelectField({
  error,
  interests,
  isInvalid,
  onChange,
}: InterestSelectFieldProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [options, setOptions] = useState<InterestTag[]>([]);

  useEffect(() => {
    let isActive = true;
    const timeoutId = window.setTimeout(() => {
      setIsSearching(true);
      apiClient
        .searchInterests(query)
        .then((nextOptions) => {
          if (isActive) {
            setOptions(nextOptions);
          }
        })
        .catch(() => {
          if (isActive) {
            setOptions([]);
          }
        })
        .finally(() => {
          if (isActive) {
            setIsSearching(false);
          }
        });
    }, 0);

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  const availableOptions = options.filter((interest) => {
    return !interests.some(
      (selectedInterest) => selectedInterest.id === interest.id,
    );
  });

  const selectInterest = (interest: InterestTag) => {
    if (
      interests.some((selectedInterest) => selectedInterest.id === interest.id)
    ) {
      setQuery("");
      return;
    }

    onChange([...interests, interest]);
    setQuery("");
  };

  const removeInterest = (interestId: string) => {
    onChange(
      interests.filter(
        (selectedInterest) => selectedInterest.id !== interestId,
      ),
    );
  };

  return (
    <FormControl isInvalid={isInvalid}>
      <AutocompleteField
        error={error}
        getOptionKey={(interest) => interest.id}
        isInvalid={isInvalid}
        isLoading={isSearching}
        label="Záujmy"
        onQueryChange={setQuery}
        onSelect={selectInterest}
        options={availableOptions}
        placeholder="Vyhľadaj záujem"
        query={query}
        renderOption={(interest) => interest.name}
      />

      {interests.length > 0 && (
        <Box {...styles.selectedTags}>
          <InterestTagList tags={interests} onRemove={removeInterest} />
        </Box>
      )}
    </FormControl>
  );
}
