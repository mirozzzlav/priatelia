import {
  useEffect,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { Box, Button, FormControl, FormErrorMessage } from "@chakra-ui/react";

import { FormInput, RequiredFieldLabel } from "src/components/formElements";
import { InterestTagList } from "src/components/InterestTagList";
import type { InterestTag } from "src/features/interests/types";
import { apiClient } from "src/services/api";

const styles = {
  root: {
    position: "relative",
  },
  options: {
    position: "absolute",
    top: "calc(100% + 6px)",
    left: 0,
    right: 0,
    zIndex: 4,
    maxH: "196px",
    overflowY: "auto",
    border: "1px solid",
    borderColor: "app.text",
    borderRadius: "10px",
    bg: "app.white",
    boxShadow: "0 14px 28px rgba(38, 57, 111, 0.18)",
    p: "6px",
  },
  option: {
    justifyContent: "flex-start",
    w: "100%",
    h: "38px",
    borderRadius: "8px",
    color: "app.text",
    fontSize: "sm",
    fontWeight: "bold",
    _hover: { bg: "app.bgAux", color: "app.textAlt" },
    _focusVisible: {
      bg: "app.bgAux",
      boxShadow: "0 0 0 2px rgba(59, 90, 157, 0.22)",
      color: "app.textAlt",
    },
  },
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
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<InterestTag[]>([]);

  useEffect(() => {
    let isActive = true;

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
      });

    return () => {
      isActive = false;
    };
  }, [query]);

  const availableOptions = options.filter((interest) => {
    return !interests.some(
      (selectedInterest) => selectedInterest.id === interest.id,
    );
  });

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsOpen(true);
  };

  const selectInterest = (interest: InterestTag) => {
    if (
      interests.some((selectedInterest) => selectedInterest.id === interest.id)
    ) {
      setQuery("");
      setIsOpen(false);
      return;
    }

    onChange([...interests, interest]);
    setQuery("");
    setIsOpen(false);
  };

  const handleQueryKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (event.key === "Enter" && availableOptions[0]) {
      event.preventDefault();
      selectInterest(availableOptions[0]);
    }
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
      <RequiredFieldLabel>Záujmy</RequiredFieldLabel>
      <Box {...styles.root}>
        <FormInput
          value={query}
          onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
          onChange={handleQueryChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleQueryKeyDown}
          placeholder="Vyhľadaj záujem"
        />

        {isOpen && availableOptions.length > 0 && (
          <Box role="listbox" {...styles.options}>
            {availableOptions.map((interest) => (
              <Button
                key={interest.id}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectInterest(interest)}
                role="option"
                type="button"
                variant="ghost"
                {...styles.option}
              >
                {interest.name}
              </Button>
            ))}
          </Box>
        )}
      </Box>

      {interests.length > 0 && (
        <Box {...styles.selectedTags}>
          <InterestTagList tags={interests} onRemove={removeInterest} />
        </Box>
      )}

      <FormErrorMessage color="app.error">{error}</FormErrorMessage>
    </FormControl>
  );
}
