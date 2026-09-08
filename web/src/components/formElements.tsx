import {
  Box,
  Button,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Textarea,
  type BoxProps,
  type ButtonProps,
  type InputProps,
  type TextareaProps,
} from "@chakra-ui/react";
import { useState, type ReactNode } from "react";

const fieldLabelStyles = {
  color: "app.text",
  fontSize: "sm",
  fontWeight: "extrabold",
} as const;

const fieldInputStyles = {
  h: "48px",
  px: "14px",
  border: "1px solid",
  borderColor: "rgba(53, 87, 45, 0.18)",
  borderRadius: "999px",
  bg: "rgba(53, 87, 45, 0.06)",
  boxShadow: "none",
  color: "app.text",
  transition: "background 140ms ease, border-color 140ms ease",
  _hover: {
    borderColor: "rgba(53, 87, 45, 0.18)",
    bg: "rgba(53, 87, 45, 0.06)",
  },
  _focusVisible: {
    borderColor: "rgba(53, 87, 45, 0.18)",
    bg: "rgba(53, 87, 45, 0.06)",
    boxShadow: "none",
  },
  _invalid: {
    borderColor: "app.error",
    boxShadow: "none",
  },
} as const;

const passwordInputStyles = {
  input: {
    pr: "48px",
  },
  toggleWrap: {
    h: "48px",
    w: "46px",
  },
  toggle: {
    display: "grid",
    placeItems: "center",
    boxSize: "34px",
    minW: "34px",
    borderRadius: "999px",
    color: "app.text",
    opacity: 0.72,
    _hover: {
      bg: "app.bgAux",
      opacity: 1,
    },
    _active: {
      bg: "app.bgAux",
    },
    _focusVisible: {
      boxShadow: "0 0 0 2px rgba(79, 131, 68, 0.28)",
    },
  },
  eye: {
    position: "relative",
    w: "19px",
    h: "12px",
    border: "2px solid",
    borderColor: "currentColor",
    borderRadius: "70% 70% 60% 60%",
    transform: "rotate(-2deg)",
    _before: {
      position: "absolute",
      top: "50%",
      left: "50%",
      boxSize: "6px",
      borderRadius: "999px",
      bg: "currentColor",
      content: '""',
      transform: "translate(-50%, -50%)",
    },
  },
  eyeHidden: {
    _after: {
      position: "absolute",
      top: "50%",
      left: "-3px",
      w: "25px",
      h: "2px",
      borderRadius: "999px",
      bg: "currentColor",
      content: '""',
      transform: "translateY(-50%) rotate(-38deg)",
    },
  },
} as const;

const fieldTextareaStyles = {
  ...fieldInputStyles,
  minH: "140px",
  py: "12px",
  borderRadius: "18px",
  resize: "none",
} as const;

const primaryButtonStyles = {
  h: "52px",
  px: "18px",
  border: "1px solid",
  borderColor: "transparent",
  borderRadius: "999px",
  bg: "app.base",
  color: "app.white",
  fontWeight: "black",
  _hover: { bg: "app.baseDark", borderColor: "transparent" },
  _active: { bg: "app.baseDark", borderColor: "transparent" },
  _disabled: {
    bg: "transparent",
    borderColor: "app.base",
    color: "app.base",
    cursor: "not-allowed",
    opacity: 1,
    _hover: { bg: "transparent", borderColor: "app.base" },
  },
} as const;

const secondaryButtonStyles = {
  h: "48px",
  border: "1px solid",
  borderColor: "app.base",
  px: "18px",
  borderRadius: "999px",
  color: "app.base",
  fontWeight: "black",
  _hover: { bg: "rgba(79, 131, 68, 0.1)" },
} as const;

type FormToggleButtonSize = "sm" | "md";
type FormToggleButtonColorVariant = "green" | "orange";

const toggleButtonColorStyles = {
  green: {
    activeBg: "app.base",
    activeBorder: "app.base",
    activeHoverBg: "app.baseDark",
    activeHoverBorder: "app.baseDark",
    inactiveHoverBg: "app.bgAux",
  },
  orange: {
    activeBg: "app.info",
    activeBorder: "app.info",
    activeHoverBg: "#aa5813",
    activeHoverBorder: "#aa5813",
    inactiveHoverBg: "app.bgAux",
  },
} as const;

const toggleButtonStyles = (
  isSelected: boolean,
  size: FormToggleButtonSize,
  colorVariant: FormToggleButtonColorVariant,
) => {
  const colors = toggleButtonColorStyles[colorVariant];

  return {
    alignItems: "center",
    display: "inline-flex",
    gap: size === "sm" ? "4px" : "6px",
    justifyContent: "center",
    h: size === "sm" ? "32px" : "38px",
    px: size === "sm" ? "10px" : "13px",
    border: "1px solid",
    borderColor: isSelected
      ? colors.activeBorder
      : "rgba(53, 87, 45, 0.18)",
    borderRadius: "999px",
    bg: isSelected ? colors.activeBg : "rgba(53, 87, 45, 0.06)",
    color: isSelected ? "app.white" : "app.text",
    fontSize: size === "sm" ? "11px" : "sm",
    fontWeight: size === "sm" ? "extrabold" : "bold",
    _hover: {
      bg: isSelected ? colors.activeHoverBg : colors.inactiveHoverBg,
      borderColor: isSelected
        ? colors.activeHoverBorder
        : "rgba(53, 87, 45, 0.24)",
    },
    _active: {
      bg: isSelected ? colors.activeHoverBg : colors.inactiveHoverBg,
    },
    _disabled: {
      cursor: "not-allowed",
      opacity: 1,
    },
  } as const;
};

const toggleButtonIconStyles = (size: FormToggleButtonSize) =>
  ({
    display: "inline-flex",
    flexShrink: 0,
    boxSize: size === "sm" ? "11px" : "14px",
  }) as const;

const linkButtonStyles = {
  h: "auto",
  p: 0,
  color: "app.base",
  fontWeight: "black",
  textDecoration: "underline",
  _hover: { color: "app.baseDark" },
} as const;

const formActionsStyles = {
  display: "grid",
  gap: "10px",
} as const;

const backIconStyles = {
  display: "block",
  boxSize: "8px",
  borderLeft: "2px solid",
  borderBottom: "2px solid",
  borderColor: "currentColor",
  transform: "rotate(45deg)",
} as const;

const sendIconStyles = {
  boxSize: "22px",
  transform: "translateY(1px)",
} as const;

type RequiredFieldLabelProps = {
  children: ReactNode;
};

export function BackIcon() {
  return <Box aria-hidden="true" {...backIconStyles} />;
}

export function SendIcon() {
  return (
    <Box aria-hidden="true" as="svg" viewBox="0 0 24 24" {...sendIconStyles}>
      <path
        d="M4 5 21 12 4 19l4.2-7L4 5Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
      <path
        d="M8.3 12H15"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </Box>
  );
}

export function RequiredFieldLabel({ children }: RequiredFieldLabelProps) {
  return (
    <FormLabel {...fieldLabelStyles}>
      {children}{" "}
      <Text as="span" color="app.error">
        *
      </Text>
    </FormLabel>
  );
}

export function OptionalFieldLabel({ children }: RequiredFieldLabelProps) {
  return <FormLabel {...fieldLabelStyles}>{children}</FormLabel>;
}

export function FormInput(props: InputProps) {
  return (
    <Input errorBorderColor="app.error" {...fieldInputStyles} {...props} />
  );
}

export function FormPasswordInput(props: Omit<InputProps, "type">) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <InputGroup>
      <Input
        errorBorderColor="app.error"
        type={isVisible ? "text" : "password"}
        {...fieldInputStyles}
        {...passwordInputStyles.input}
        {...props}
      />
      <InputRightElement {...passwordInputStyles.toggleWrap}>
        <IconButton
          aria-label={isVisible ? "Skryť heslo" : "Zobraziť heslo"}
          icon={
            <Box
              aria-hidden="true"
              {...passwordInputStyles.eye}
              {...(isVisible ? passwordInputStyles.eyeHidden : {})}
            />
          }
          onClick={() => setIsVisible((current) => !current)}
          type="button"
          variant="unstyled"
          {...passwordInputStyles.toggle}
        />
      </InputRightElement>
    </InputGroup>
  );
}

export function FormTextarea(props: TextareaProps) {
  return (
    <Textarea
      errorBorderColor="app.error"
      {...fieldTextareaStyles}
      {...props}
    />
  );
}

export function PrimaryButton(props: ButtonProps) {
  return <Button type="button" {...primaryButtonStyles} {...props} />;
}

export function SecondaryButton(props: ButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      {...secondaryButtonStyles}
      {...props}
    />
  );
}

type FormToggleButtonProps = ButtonProps & {
  colorVariant?: FormToggleButtonColorVariant;
  icon?: ReactNode;
  isSelected: boolean;
  size?: FormToggleButtonSize;
};

export function FormToggleButton({
  children,
  colorVariant = "green",
  icon,
  isSelected,
  size = "md",
  ...props
}: FormToggleButtonProps) {
  return (
    <Button
      type="button"
      variant="unstyled"
      {...toggleButtonStyles(isSelected, size, colorVariant)}
      {...props}
    >
      {icon && <Box {...toggleButtonIconStyles(size)}>{icon}</Box>}
      {children}
    </Button>
  );
}

export function BackButton({ children = "Späť", ...props }: ButtonProps) {
  return (
    <SecondaryButton leftIcon={<BackIcon />} {...props}>
      {children}
    </SecondaryButton>
  );
}

export function FormSubmitButton(props: ButtonProps) {
  return <PrimaryButton type="submit" {...props} />;
}

export function FormLinkButton(props: ButtonProps) {
  return (
    <Button type="button" variant="link" {...linkButtonStyles} {...props} />
  );
}

export function FormActions(props: BoxProps) {
  return <Box {...formActionsStyles} {...props} />;
}
