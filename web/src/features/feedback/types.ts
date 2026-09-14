export type FeedbackFormData = {
  overallRating: number | null;
  principleClear: "yes" | "no" | "";
  unclearReason: string;
  improvementSuggestion: string;
};
