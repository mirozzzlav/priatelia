import type { InterestTag } from "src/features/interests/types";

export type PersonPreview = {
  age: string;
  bio: string;
  id: string;
  meta: string[];
  name: string;
  photo: string;
  photos: string[];
  tags: InterestTag[];
};

export type PersonPreviewAction = "like" | "nope";

export type ActivePersonPreviewAction = PersonPreviewAction | null;

export type PersonPreviewActionHandlers = {
  onActionEnd: () => void;
  onActionStart: (action: PersonPreviewAction) => void;
};
