import { useCallback, useState } from "react";

import type {
  ActivePersonPreviewAction,
  PersonPreview,
} from "src/features/person-preview";
import {
  apiClient,
  type ChatMatch,
  type ProfileActionResult,
} from "src/services/api";

const noDiscoveryProfilesMessage =
  "V tejto chvíli sa nám nepodarilo nájsť žiadneho nového priateľa, skús upraviť podmienky hľadania.";

function getPersonPreviewErrorMessage(error: unknown) {
  if (
    error instanceof Error &&
    error.message === "No discovery profiles available"
  ) {
    return noDiscoveryProfilesMessage;
  }

  return "Nepodarilo sa načítať človeka na výber.";
}

export function usePersonPreview() {
  const [activeAction, setActiveAction] =
    useState<ActivePersonPreviewAction>(null);
  const [personPreview, setPersonPreview] = useState<PersonPreview | null>(
    null,
  );
  const [matchedProfileMatch, setMatchedProfileMatch] =
    useState<ChatMatch | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPersonPreview, setIsLoadingPersonPreview] = useState(false);
  const [isSubmittingPersonPreviewAction, setIsSubmittingPersonPreviewAction] =
    useState(false);

  const loadPersonPreview = useCallback(async () => {
    setIsLoadingPersonPreview(true);
    setError(null);

    try {
      const preview = await apiClient.getPersonPreview();
      setMatchedProfileMatch(null);
      setPersonPreview(preview);
    } catch (error) {
      setMatchedProfileMatch(null);
      setPersonPreview(null);
      setError(getPersonPreviewErrorMessage(error));
    } finally {
      setIsLoadingPersonPreview(false);
    }
  }, []);

  const clearActiveAction = () => {
    if (isSubmittingPersonPreviewAction) {
      return;
    }

    setActiveAction(null);
  };

  const resetDiscovery = () => {
    setActiveAction(null);
    setMatchedProfileMatch(null);
    setPersonPreview(null);
    setError(null);
  };

  const clearMatchedProfileMatch = () => {
    setMatchedProfileMatch(null);
  };

  const startPersonPreviewAction = (
    action: ActivePersonPreviewAction,
    onAfterSuccessfulAction?: (
      result: ProfileActionResult,
    ) => Promise<void> | void,
  ) => {
    if (!action || !personPreview || isSubmittingPersonPreviewAction) {
      return;
    }

    setActiveAction(action);
    setIsSubmittingPersonPreviewAction(true);

    void (async () => {
      try {
        const result = await apiClient.submitPersonPreviewAction(
          personPreview.id,
          action,
        );
        const actionResult = result.match
          ? {
              ...result,
              match: {
                ...result.match,
                isNew: true,
              },
            }
          : result;

        setMatchedProfileMatch(actionResult.match);
        await onAfterSuccessfulAction?.(actionResult);
        if (!actionResult.match) {
          await loadPersonPreview();
        }
      } catch {
        setError("Nepodarilo sa uložiť tvoju voľbu.");
      } finally {
        setActiveAction(null);
        setIsSubmittingPersonPreviewAction(false);
      }
    })();
  };

  return {
    activeAction,
    clearActiveAction,
    clearMatchedProfileMatch,
    error,
    isLoadingPersonPreview,
    isSubmittingPersonPreviewAction,
    loadPersonPreview,
    matchedProfileMatch,
    personPreview,
    resetDiscovery,
    startPersonPreviewAction,
  };
}
