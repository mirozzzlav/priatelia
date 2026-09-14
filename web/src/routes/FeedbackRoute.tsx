import { useNavigate } from "react-router-dom";

import { FeedbackScreen, type FeedbackFormData } from "src/features/feedback";
import { apiClient, type FeedbackFieldErrors } from "src/services/api";

export function FeedbackRoute() {
  const navigate = useNavigate();

  const handleSave = async (
    data: FeedbackFormData,
  ): Promise<FeedbackFieldErrors | null> => {
    const response = await apiClient.submitFeedback(data);

    if (response.status === "error") {
      return response.data.errors;
    }

    return null;
  };

  return (
    <FeedbackScreen onBack={() => navigate("/discover")} onSave={handleSave} />
  );
}
