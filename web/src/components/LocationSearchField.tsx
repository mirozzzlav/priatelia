import {
  FormHelperText,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { AutocompleteField } from "src/components/AutocompleteField";
import type { LocationOption } from "src/services/api";
import { apiClient } from "src/services/api";

type LocationSearchFieldProps = {
  error?: string;
  isInvalid: boolean;
  label: string;
  onChange: (nextLocation: {
    latitude: number | null;
    location: string;
    longitude: number | null;
  }) => void;
  placeholder: string;
  value: string;
};

const styles = {
  helper: {
    color: "app.text",
    fontSize: "xs",
    fontWeight: "bold",
  },
  attribution: {
    mt: "5px",
    color: "app.text",
    fontSize: "xs",
    opacity: 0.72,
  },
} as const;

export function LocationSearchField({
  error,
  isInvalid,
  label,
  onChange,
  placeholder,
  value,
}: LocationSearchFieldProps) {
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const latestQueryRef = useRef(value);

  useEffect(() => {
    latestQueryRef.current = value;

    if (value.trim().length < 3) {
      return;
    }

    let isActive = true;
    const timeoutId = window.setTimeout(() => {
      setIsSearching(true);
      setSearchError(null);
      apiClient
        .searchLocations(value.trim())
        .then((results) => {
          if (!isActive || latestQueryRef.current.trim() !== value.trim()) {
            return;
          }

          setOptions(results);
        })
        .catch((error: unknown) => {
          if (!isActive) {
            return;
          }

          setOptions([]);
          setSearchError(
            error instanceof Error ? error.message : "Vyhľadanie zlyhalo.",
          );
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
  }, [value]);

  const handleQueryChange = (nextValue: string) => {
    if (nextValue.trim().length < 3) {
      setOptions([]);
      setIsSearching(false);
      setSearchError(null);
    }

    onChange({
      latitude: null,
      location: nextValue,
      longitude: null,
    });
  };

  const selectOption = (option: LocationOption) => {
    setOptions([]);
    onChange({
      latitude: option.latitude,
      location: option.label,
      longitude: option.longitude,
    });
  };

  return (
    <AutocompleteField
      error={error}
      footer={
        <>
          {searchError && (
            <FormHelperText {...styles.helper}>{searchError}</FormHelperText>
          )}
          <Text
            as="a"
            href="https://www.openstreetmap.org/copyright"
            rel="noreferrer"
            target="_blank"
            {...styles.attribution}
          >
            Vyhľadávanie lokalít: © OpenStreetMap contributors
          </Text>
        </>
      }
      getOptionKey={(option) => option.id}
      isInvalid={isInvalid}
      isLoading={isSearching}
      label={label}
      onQueryChange={handleQueryChange}
      onSelect={selectOption}
      options={options}
      placeholder={placeholder}
      query={value}
      renderOption={(option) => option.label}
    />
  );
}
