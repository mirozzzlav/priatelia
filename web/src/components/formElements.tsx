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
  border: "1px solid",
  borderColor: "app.text",
  borderRadius: "10px",
  bg: "app.white",
  color: "app.text",
  _focusVisible: {
    borderColor: "app.base",
    boxShadow: "0 0 0 2px rgba(59, 90, 157, 0.28)",
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
      boxShadow: "0 0 0 2px rgba(59, 90, 157, 0.28)",
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
  minH: "88px",
  resize: "vertical",
} as const;

const primaryButtonStyles = {
  h: "52px",
  borderRadius: "14px",
  bg: "app.base",
  color: "app.white",
  fontWeight: "black",
  _hover: { bg: "app.baseDark" },
  _active: { bg: "app.baseDark" },
  _disabled: {
    bg: "app.bgAux",
    border: "1px solid",
    borderColor: "app.text",
    color: "app.text",
    cursor: "not-allowed",
    opacity: 1,
    _hover: { bg: "app.bgAux" },
  },
} as const;

const secondaryButtonStyles = {
  h: "48px",
  border: "1px solid",
  borderColor: "app.base",
  borderRadius: "14px",
  color: "app.base",
  fontWeight: "black",
  _hover: { bg: "app.bgAux" },
} as const;

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

type RequiredFieldLabelProps = {
  children: ReactNode;
};

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

export function FormSubmitButton(props: ButtonProps) {
  return <PrimaryButton type="submit" {...props} />;
}

export function FormSecondaryButton(props: ButtonProps) {
  return <SecondaryButton {...props} />;
}

export function FormLinkButton(props: ButtonProps) {
  return (
    <Button type="button" variant="link" {...linkButtonStyles} {...props} />
  );
}

export function FormActions(props: BoxProps) {
  return <Box {...formActionsStyles} {...props} />;
}
