import {
  Box,
  Button,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { FormInput } from "src/components/formElements";
import { discoveryFilterStyles as styles } from "src/features/discovery/components/discoveryFilterStyles";
import { apiClient, type LocationOption } from "src/services/api";

type InlineLocationFilterEditorProps = {
  isSaving: boolean;
  onQueryChange: (location: string) => void;
  onSelect: (option: LocationOption) => void;
  query: string;
};

export function InlineLocationFilterEditor({
  isSaving,
  onQueryChange,
  onSelect,
  query,
}: InlineLocationFilterEditorProps) {
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const latestQueryRef = useRef(query);
  const canSearch = query.trim().length >= 3;
  const visibleOptions = canSearch ? options : [];

  useEffect(() => {
    latestQueryRef.current = query;

    if (!canSearch) {
      return;
    }

    let isActive = true;
    const timeoutId = window.setTimeout(() => {
      setIsSearching(true);
      apiClient
        .searchLocations(query.trim())
        .then((results) => {
          if (!isActive || latestQueryRef.current.trim() !== query.trim()) {
            return;
          }

          setOptions(results);
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
    }, 450);

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, [canSearch, query]);

  return (
    <Box {...styles.filterEditorWrap}>
      <Box {...styles.filterEditorGrid}>
        <Text as="span" {...styles.filterEditorLabel}>
          Mesto
        </Text>
        <InputGroup>
          <FormInput
            autoFocus
            aria-autocomplete="list"
            autoComplete="off"
            isDisabled={isSaving}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Mesto"
            role="combobox"
            value={query}
            {...styles.inlineInput}
          />
          {((canSearch && isSearching) || isSaving) && (
            <InputRightElement {...styles.inlineLoaderWrap}>
              <Spinner {...styles.inlineLoader} />
            </InputRightElement>
          )}
        </InputGroup>
      </Box>

      {visibleOptions.length > 0 && !isSaving && (
        <Box role="listbox" {...styles.locationOptions}>
          {visibleOptions.map((option) => (
            <Button
              key={option.id}
              onMouseDown={(event) => {
                event.preventDefault();
                onSelect(option);
              }}
              role="option"
              type="button"
              variant="ghost"
              {...styles.locationOption}
            >
              {option.label}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
}
