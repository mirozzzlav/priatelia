import { useCallback, useState } from "react";

import type {
  ActivePersonPreviewAction,
  PersonPreview,
} from "src/features/person-preview";
import { apiClient } from "src/services/api";

export function usePersonPreview() {
  const [activeAction, setActiveAction] =
    useState<ActivePersonPreviewAction>(null);
  const [personPreview, setPersonPreview] = useState<PersonPreview | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPersonPreview, setIsLoadingPersonPreview] = useState(false);
  const [isSubmittingPersonPreviewAction, setIsSubmittingPersonPreviewAction] =
    useState(false);

  const loadPersonPreview = useCallback(async () => {
    setIsLoadingPersonPreview(true);
    setError(null);

    try {
      const preview = await apiClient.getPersonPreview();
      setPersonPreview(preview);
    } catch {
      setPersonPreview(null);
      setError("Nepodarilo sa načítať človeka na výber.");
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
    setPersonPreview(null);
    setError(null);
  };

  const startPersonPreviewAction = (action: ActivePersonPreviewAction) => {
    if (!action || !personPreview || isSubmittingPersonPreviewAction) {
      return;
    }

    setActiveAction(action);
    setIsSubmittingPersonPreviewAction(true);

    void (async () => {
      try {
        await apiClient.submitPersonPreviewAction(personPreview.id, action);
        await loadPersonPreview();
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
    error,
    isLoadingPersonPreview,
    isSubmittingPersonPreviewAction,
    loadPersonPreview,
    personPreview,
    resetDiscovery,
    startPersonPreviewAction,
  };
}
