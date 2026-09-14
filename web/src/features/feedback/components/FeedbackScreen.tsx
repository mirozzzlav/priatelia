import { useState, type ChangeEvent, type SubmitEvent } from "react";
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  Icon,
} from "@chakra-ui/react";

import { CountBadge } from "src/components/CountBadge";
import {
  CompactPrimaryToggleButton,
  FormActions,
  FormSubmitButton,
  FormTextarea,
  OptionalFieldLabel,
  RequiredFieldLabel,
} from "src/components/formElements";
import { FormStatusMessage } from "src/components/FormStatusMessage";
import { PageHeader } from "src/components/PageHeader";
import { SurfacePill } from "src/components/SurfacePill";
import type { FeedbackFormData } from "src/features/feedback/types";
import type { FeedbackFieldErrors } from "src/services/api";

type FeedbackScreenProps = {
  onBack: () => void;
  onSave: (data: FeedbackFormData) => Promise<FeedbackFieldErrors | null>;
};

const initialFormData: FeedbackFormData = {
  improvementSuggestion: "",
  overallRating: null,
  principleClear: "",
  unclearReason: "",
};

const styles = {
  root: {
    minH: "calc(100vh - 64px)",
    px: { base: "12px", sm: "16px" },
    pb: "34px",
  },
  header: {
    position: "sticky",
    top: "64px",
    zIndex: 40,
  },
  form: {
    display: "grid",
    gap: "22px",
    pt: { base: "22px", sm: "28px" },
  },
  starGroup: {
    gap: "8px",
  },
  ratingPill: {
    gap: "8px",
  },
  starButton: {
    alignItems: "center",
    display: "inline-flex",
    justifyContent: "center",
    boxSize: "48px",
    minW: "48px",
    border: "0",
    borderRadius: "999px",
    bg: "transparent",
    transition: "background 140ms ease, border-color 140ms ease",
  },
  answerGroup: {
    flexWrap: "wrap",
    gap: "8px",
  },
  subsection: {
    mt: "12px",
  },
  ratingCounter: {
    minW: "41px",
    h: "29px",
    px: "10px",
    bg: "rgba(197, 106, 24, 0.12)",
    color: "app.info",
    fontSize: "14px",
  },
} as const;

export function FeedbackScreen({ onBack, onSave }: FeedbackScreenProps) {
  const [formData, setFormData] = useState<FeedbackFormData>(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<FeedbackFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const displayedRating = hoveredRating ?? formData.overallRating ?? 0;

  const resetFeedback = () => {
    setFieldErrors({});
    setSubmitError(null);
    setWasSubmitted(false);
    setIsSuccess(false);
  };

  const updateTextField =
    (field: "improvementSuggestion" | "unclearReason") =>
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      resetFeedback();
      setFormData((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const updateRating = (overallRating: number) => {
    resetFeedback();
    setFormData((current) => ({
      ...current,
      overallRating,
    }));
  };

  const updatePrincipleClear = (principleClear: "yes" | "no") => {
    resetFeedback();
    setFormData((current) => ({
      ...current,
      principleClear,
      unclearReason: principleClear === "yes" ? "" : current.unclearReason,
    }));
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldErrors({});
    setSubmitError(null);
    setWasSubmitted(true);
    setIsSuccess(false);

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const nextFieldErrors = await onSave(formData);

      if (nextFieldErrors) {
        setFieldErrors(nextFieldErrors);
        setSubmitError("Skontroluj si vstupné údaje.");
        return;
      }

      setFormData(initialFormData);
      setWasSubmitted(false);
      setIsSuccess(true);
    } catch {
      setSubmitError("Feedback sa nepodarilo odoslať. Skús to znova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box {...styles.root}>
      <PageHeader
        intro="Pomôž nám pochopiť, čo funguje a čo máme zlepšiť."
        onBack={onBack}
        title="Feedback"
        {...styles.header}
      />

      <Box as="form" noValidate onSubmit={handleSubmit} {...styles.form}>
        <FormControl
          isInvalid={wasSubmitted && Boolean(fieldErrors.overallRating)}
        >
          <RequiredFieldLabel>
            Ako celkovo hodnotíš aplikáciu?
          </RequiredFieldLabel>
          <SurfacePill {...styles.ratingPill}>
            <Flex
              aria-label="Celkové hodnotenie aplikácie"
              onMouseLeave={() => setHoveredRating(null)}
              role="radiogroup"
              {...styles.starGroup}
            >
              {[1, 2, 3, 4, 5].map((rating) => {
                const isSelected = formData.overallRating === rating;
                const isFilled =
                  formData.overallRating !== null &&
                  rating <= formData.overallRating;
                const isHoverFilled =
                  hoveredRating !== null && rating <= hoveredRating;

                return (
                  <Box
                    as="button"
                    key={rating}
                    aria-checked={isSelected}
                    aria-label={`${rating} z 5`}
                    onClick={() => updateRating(rating)}
                    onMouseEnter={() => setHoveredRating(rating)}
                    role="radio"
                    type="button"
                    {...styles.starButton}
                    color={
                      isFilled
                        ? "app.info"
                        : isHoverFilled
                          ? "rgba(197, 106, 24, 0.58)"
                          : "app.borderColor"
                    }
                    _hover={{
                      bg: "transparent",
                      color: isFilled ? "app.info" : undefined,
                    }}
                    _active={{
                      bg: "transparent",
                    }}
                  >
                    <StarIcon />
                  </Box>
                );
              })}
            </Flex>
            <CountBadge {...styles.ratingCounter}>
              {displayedRating}/5
            </CountBadge>
          </SurfacePill>
          <FormErrorMessage color="app.error">
            {fieldErrors.overallRating}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={
            wasSubmitted &&
            Boolean(fieldErrors.principleClear || fieldErrors.unclearReason)
          }
        >
          <RequiredFieldLabel>
            Bol princíp aplikácie hneď zrozumiteľný?
          </RequiredFieldLabel>
          <Flex role="radiogroup" {...styles.answerGroup}>
            <CompactPrimaryToggleButton
              aria-checked={formData.principleClear === "yes"}
              isSelected={formData.principleClear === "yes"}
              onClick={() => updatePrincipleClear("yes")}
              role="radio"
            >
              Áno
            </CompactPrimaryToggleButton>
            <CompactPrimaryToggleButton
              aria-checked={formData.principleClear === "no"}
              isSelected={formData.principleClear === "no"}
              onClick={() => updatePrincipleClear("no")}
              role="radio"
            >
              Nie
            </CompactPrimaryToggleButton>
          </Flex>
          <FormErrorMessage color="app.error">
            {fieldErrors.principleClear}
          </FormErrorMessage>

          {formData.principleClear === "no" && (
            <Box {...styles.subsection}>
              <RequiredFieldLabel>
                Čo ti nebolo jasné, čo ti chýbalo alebo prekážalo?
              </RequiredFieldLabel>
              <FormTextarea
                value={formData.unclearReason}
                onChange={updateTextField("unclearReason")}
                placeholder="Napíš nám, kde sa to zaseklo."
              />
              <FormErrorMessage color="app.error">
                {fieldErrors.unclearReason}
              </FormErrorMessage>
            </Box>
          )}
        </FormControl>

        <FormControl
          isInvalid={wasSubmitted && Boolean(fieldErrors.improvementSuggestion)}
        >
          <OptionalFieldLabel>
            Je ešte niečo, čo by si nám chcel/a povedať alebo čo by si na
            aplikácii zmenil/a?
          </OptionalFieldLabel>
          <FormTextarea
            value={formData.improvementSuggestion}
            onChange={updateTextField("improvementSuggestion")}
            placeholder="Nápady, pripomienky alebo čokoľvek, čo nám pomôže."
          />
          <FormErrorMessage color="app.error">
            {fieldErrors.improvementSuggestion}
          </FormErrorMessage>
        </FormControl>

        {submitError && (
          <FormStatusMessage variant="error">{submitError}</FormStatusMessage>
        )}

        {isSuccess && (
          <FormStatusMessage variant="success">
            Ďakujeme, feedback je odoslaný.
          </FormStatusMessage>
        )}

        <FormActions>
          <FormSubmitButton
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
            loadingText="Odosielam feedback"
          >
            Odoslať feedback
          </FormSubmitButton>
        </FormActions>
      </Box>
    </Box>
  );
}

function StarIcon() {
  return (
    <Icon
      aria-hidden="true"
      boxSize="23px"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="m12 2.8 2.76 5.6 6.18.9-4.47 4.36 1.06 6.16L12 16.9l-5.53 2.92 1.06-6.16L3.06 9.3l6.18-.9L12 2.8Z" />
    </Icon>
  );
}
