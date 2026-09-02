import {
  Box,
  Button,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Spinner,
  type BoxProps,
  type InputProps,
} from "@chakra-ui/react";
import {
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { FormInput, RequiredFieldLabel } from "src/components/formElements";

const styles = {
  root: {
    position: "relative",
  },
  options: {
    position: "absolute",
    top: "calc(100% + 6px)",
    left: 0,
    right: 0,
    zIndex: 10,
    maxH: "196px",
    overflowY: "auto",
    border: "1px solid",
    borderColor: "app.text",
    borderRadius: "10px",
    bg: "app.white",
    boxShadow: "0 14px 32px rgba(49, 36, 18, 0.16)",
    p: "6px",
  },
  option: {
    h: "auto",
    minH: "38px",
    w: "100%",
    justifyContent: "flex-start",
    px: "10px",
    py: "8px",
    borderRadius: "8px",
    color: "app.text",
    fontSize: "sm",
    fontWeight: "bold",
    textAlign: "left",
    whiteSpace: "normal",
    _hover: { bg: "app.bgAux", color: "app.text" },
    _focusVisible: {
      bg: "app.bgAux",
      boxShadow: "0 0 0 2px rgba(59, 90, 157, 0.22)",
      color: "app.text",
    },
  },
  input: {
    pr: "44px",
  },
  loaderWrap: {
    h: "48px",
    w: "42px",
  },
  loader: {
    color: "app.base",
    opacity: 0.72,
    speed: "0.7s",
    thickness: "2px",
    size: "sm",
  },
} as const;

type AutocompleteFieldProps<TOption> = {
  error?: string;
  footer?: ReactNode;
  getOptionKey: (option: TOption) => string;
  inputProps?: Omit<
    InputProps,
    "onBlur" | "onChange" | "onFocus" | "onKeyDown" | "value"
  >;
  isInvalid: boolean;
  isLoading: boolean;
  label: string;
  onQueryChange: (query: string) => void;
  onSelect: (option: TOption) => void;
  options: TOption[];
  placeholder: string;
  query: string;
  renderOption: (option: TOption) => ReactNode;
  rootProps?: BoxProps;
};

export function AutocompleteField<TOption>({
  error,
  footer,
  getOptionKey,
  inputProps,
  isInvalid,
  isLoading,
  label,
  onQueryChange,
  onSelect,
  options,
  placeholder,
  query,
  renderOption,
  rootProps,
}: AutocompleteFieldProps<TOption>) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onQueryChange(event.target.value);
    setIsOpen(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (event.key === "Enter" && options[0]) {
      event.preventDefault();
      onSelect(options[0]);
      setIsOpen(false);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!rootRef.current?.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
  };

  const selectOption = (option: TOption) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <Box ref={rootRef} onBlur={handleBlur} {...styles.root} {...rootProps}>
      <RequiredFieldLabel>{label}</RequiredFieldLabel>
      <InputGroup>
        <FormInput
          aria-autocomplete="list"
          aria-expanded={isOpen}
          autoComplete="off"
          isInvalid={isInvalid}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(options.length > 0)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          role="combobox"
          value={query}
          {...styles.input}
          {...inputProps}
        />
        {isLoading && (
          <InputRightElement {...styles.loaderWrap}>
            <Spinner {...styles.loader} />
          </InputRightElement>
        )}
      </InputGroup>

      {isOpen && options.length > 0 && (
        <Box role="listbox" {...styles.options}>
          {options.map((option) => (
            <Button
              key={getOptionKey(option)}
              onMouseDown={(event) => {
                event.preventDefault();
                selectOption(option);
              }}
              role="option"
              type="button"
              variant="ghost"
              {...styles.option}
            >
              {renderOption(option)}
            </Button>
          ))}
        </Box>
      )}

      {footer}
      <FormErrorMessage color="app.error">{error}</FormErrorMessage>
    </Box>
  );
}
